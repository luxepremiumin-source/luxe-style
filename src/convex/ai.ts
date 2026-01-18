"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const check = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "OPENAI_API_KEY is not set in the environment variables." };
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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "OPENAI_API_KEY is not set" };
    }
    
    try {
      console.log("Starting AI analysis...");
      
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
        return { success: false, error: `OpenAI API error: ${response.status}` };
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      console.log("AI Response:", content);
      
      if (!content) return { success: false, error: "No analysis returned" };
      
      const result = JSON.parse(content);
      const searchQuery = result.searchQuery;

      // Search for products using the generated query
      const matches = await ctx.runQuery(api.products.searchProducts, { searchTerm: searchQuery });

      return { success: true, searchQuery, matches: matches.slice(0, 3) }; // Return top 3 matches
    } catch (e: any) {
      console.error("AI Analysis Error:", e);
      return { success: false, error: e.message || "Unknown error during analysis" };
    }
  },
});