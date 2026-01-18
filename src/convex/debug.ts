import { query } from "./_generated/server";

export const listEnvVars = query({
  args: {},
  handler: async (ctx) => {
    // Return list of keys in process.env to debug missing keys
    // We mask values for security, just want to see what keys exist
    const keys = Object.keys(process.env);
    const vlyKeys = keys.filter(k => k.toLowerCase().includes('vly'));
    const openAiKeys = keys.filter(k => k.toLowerCase().includes('openai'));
    const googleKeys = keys.filter(k => k.toLowerCase().includes('google') || k.toLowerCase().includes('gemini'));
    
    return {
      allKeys: keys,
      vlyKeys,
      openAiKeys,
      googleKeys,
      hasVlyIntegrationKey: !!process.env.VLY_INTEGRATION_KEY,
      hasOpenAiKey: !!process.env.OPENAI_API_KEY || !!process.env.OPENAI_KEY,
      hasGoogleKey: !!process.env.GOOGLE_API_KEY || !!process.env.GEMINI_API_KEY
    };
  },
});