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

    // Try Google Gemini (Free option)
    const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (googleKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Say 'Gemini is working' if you can hear me." }] }]
          }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          return { success: false, error: `Gemini API error: ${response.status} - ${errorText}` };
        }
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return { success: true, message: text || "Gemini is working" };
      } catch (e: any) {
        console.error("Gemini check failed:", e);
      }
    }

    // Fallback to OpenAI Key
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      console.error("API Keys missing. Available env vars:", Object.keys(process.env));
      return { 
        success: false, 
        error: "No AI API keys found. Please add OPENAI_API_KEY or GOOGLE_API_KEY in the Integrations tab." 
      };
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
    missingKey?: boolean;
  }> => {
    console.log("Starting AI analysis...");
    let content: string | null = null;
    let vlyError: string | null = null;

    // 1. Try Vly Integration
    // We check if the key exists OR if we are in a production environment where it might be injected differently
    // But primarily we rely on the env var.
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
              ] as any,
            },
          ],
        });

        if (result.success && result.data) {
          content = result.data.choices[0]?.message?.content;
          console.log("Vly Analysis success");
        } else {
          console.warn("Vly Analysis failed:", result.error);
          vlyError = result.error || "Unknown Vly error";
        }
      } catch (e: any) {
        console.error("Vly Analysis Error:", e);
        vlyError = e.message || "Vly exception";
      }
    }

    // 2. Try Google Gemini (Free Tier)
    if (!content) {
      const googleKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY)?.trim();
      if (googleKey) {
        try {
          console.log("Attempting analysis with Google Gemini...");
          
          // Extract base64 data and mime type
          const matches = args.imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          const mimeType = matches ? matches[1] : "image/jpeg";
          const base64Data = matches ? matches[2] : args.imageBase64;

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: "Analyze this product image. Identify the main product, brand, color, and type. Return a JSON object with a 'searchQuery' field containing a concise search string (3-5 words) to find similar products (e.g. 'Black Fossil Chronograph Watch')." },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data
                    }
                  }
                ]
              }],
              generationConfig: {
                response_mime_type: "application/json"
              }
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            // Continue to OpenAI fallback if Gemini fails
          } else {
            const data = await response.json();
            content = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) console.log("Gemini Analysis success");
          }
        } catch (e) {
          console.error("Gemini Analysis Error:", e);
        }
      }
    }

    // 3. Fallback to Direct OpenAI Fetch
    if (!content) {
      const apiKey = (process.env.OPENAI_API_KEY || process.env.OPENAI_KEY)?.trim();
      
      if (!apiKey) {
        console.error("All AI API Keys missing during analysis.");
        // Return a specific flag for missing keys so the UI can show a helpful message
        const errorMsg = vlyError 
          ? `Built-in AI failed (${vlyError}) and no fallback keys (OpenAI/Gemini) found.` 
          : "Missing API Key. Please add OPENAI_API_KEY or GOOGLE_API_KEY in the Integrations tab.";
          
        return { 
          success: false, 
          error: errorMsg,
          missingKey: true 
        };
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
             return { success: false, error: "Invalid OpenAI API Key. Please check your integration settings.", missingKey: true };
          }
          // Pass through the error text so the frontend can detect "insufficient_quota"
          return { success: false, error: `OpenAI API error: ${response.status} - ${errorText}` };
        }

        const data = await response.json();
        content = data.choices[0].message.content;
      } catch (e: any) {
        console.error("Direct OpenAI Analysis Error:", e);
        return { success: false, error: e.message || "Unknown error during analysis" };
      }
    }

    // Process the content
    if (!content) return { success: false, error: "No analysis returned" };
    
    try {
      console.log("AI Response:", content);
      // Handle markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        content = jsonMatch[1];
      }
      
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