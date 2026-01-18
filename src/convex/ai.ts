"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { vly } from "../lib/vly-integrations";

export const check = action({
  args: {},
  handler: async (ctx) => {
    // Try Vly first
    if (process.env.VLY_INTEGRATION_KEY) {
      try {
        const result = await vly.ai.completion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Say 'Vly AI is working' if you can hear me." }],
        });
        if (result.success && result.data) {
          return { success: true, message: result.data.choices[0]?.message?.content };
        }
      } catch (e) {
        console.error("Vly check failed:", e);
      }
    }

    // Fallback to OpenAI Key
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      console.error("OpenAI API Key missing. Available env vars:", Object.keys(process.env));
      return { success: false, error: "OPENAI_API_KEY is not set. Please add it in the Integrations tab or Settings > Environment Variables." };
    }
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Say 'OpenAI is working' if you can hear me." }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `OpenAI API error: ${response.status} - ${errorText}` };
      }

      const data = await response.json();
      return { success: true, message: data.choices[0].message.content };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
});

export const analyzeImage = action({
  args: { imageBase64: v.string() },
  handler: async (ctx, args): Promise<{
    success: boolean;
    error?: string;
    searchQuery?: string;
    matches?: any[];
  }> => {
    console.log("Starting AI analysis...");
    let content: string | null = null;

    // 1. Try Vly Integration
    if (process.env.VLY_INTEGRATION_KEY) {
      try {
        console.log("Attempting analysis with Vly...");
        const result = await vly.ai.completion({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this product image. Identify the main product, brand, color, and type. Return a JSON object with a 'searchQuery' field containing a concise search string (3-5 words) to find similar products (e.g. 'Black Fossil Chronograph Watch')." },
                {
                  type: "image_url",
                  image_url: {
                    url: args.imageBase64,
                  },
                },
              ] as any, // Cast to any to bypass potential type restrictions if Vly types are strict
            },
          ],
        });

        if (result.success && result.data) {
          content = result.data.choices[0]?.message?.content;
          console.log("Vly Analysis success");
        } else {
          console.warn("Vly Analysis failed:", result.error);
        }
      } catch (e) {
        console.error("Vly Analysis Error:", e);
      }
    }

    // 2. Fallback to Direct OpenAI Fetch if Vly failed or key missing
    if (!content) {
      const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
      if (!apiKey) {
        console.error("OpenAI API Key missing during analysis.");
        // If Vly key was also missing, this is a hard failure
        if (!process.env.VLY_INTEGRATION_KEY) {
           return { success: false, error: "No AI API keys found. Please add OPENAI_API_KEY in Integrations." };
        }
        // If Vly failed but existed, we might have already logged it, but return generic error
        return { success: false, error: "AI Analysis failed. Please check service status." };
      }
      
      try {
        console.log("Attempting analysis with direct OpenAI fetch...");
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Analyze this product image. Identify the main product, brand, color, and type. Return a JSON object with a 'searchQuery' field containing a concise search string (3-5 words) to find similar products (e.g. 'Black Fossil Chronograph Watch')." },
                  {
                    type: "image_url",
                    image_url: {
                      url: args.imageBase64,
                    },
                  },
                ],
              },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("OpenAI API Error:", errorText);
          if (response.status === 401) {
             return { success: false, error: "Invalid OpenAI API Key. Please check your integration settings." };
          }
          return { success: false, error: `OpenAI API error: ${response.status}` };
        }

        const data = await response.json();
        content = data.choices[0].message.content;
      } catch (e: any) {
        console.error("Direct OpenAI Analysis Error:", e);
        return { success: false, error: e.message || "Unknown error during analysis" };
      }
    }

    // Process the content (from either source)
    if (!content) return { success: false, error: "No analysis returned" };
    
    try {
      console.log("AI Response:", content);
      const result = JSON.parse(content);
      const searchQuery = result.searchQuery;

      // Search for products using the generated query
      const matches = await ctx.runQuery(api.products.searchProducts, { searchTerm: searchQuery });

      return { success: true, searchQuery, matches: matches.slice(0, 3) }; // Return top 3 matches
    } catch (e: any) {
      console.error("Result parsing error:", e);
      return { success: false, error: "Failed to parse AI response" };
    }
  },
});