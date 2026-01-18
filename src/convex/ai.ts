"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

export const check = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "OPENAI_API_KEY is not set in the environment variables." };
    }
    try {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Say 'OpenAI is working' if you can hear me." }],
        model: "gpt-3.5-turbo",
      });
      return { success: true, message: completion.choices[0].message.content };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
});
