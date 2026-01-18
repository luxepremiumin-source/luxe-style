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
    const googleKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY)?.trim();
    if (googleKey) {
      try {
        // Try gemini-1.5-flash first, then fallback to gemini-pro
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
        let response;
        let usedModel;

        for (const model of models) {
          usedModel = model;
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Say 'Gemini is working' if you can hear me." }] }]
            }),
          });
          if (response.status !== 404) break; // If not 404, stop trying (either success or other error)
        }

        if (response && !response.ok) {
          const errorText = await response.text();
          return { success: false, error: `Gemini API error (${usedModel}): ${response.status} - ${errorText}` };
        }
        
        if (response) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          return { success: true, message: text || `Gemini is working (${usedModel})` };
        }
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