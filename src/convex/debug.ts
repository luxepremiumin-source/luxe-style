import { query } from "./_generated/server";

export const listEnvVars = query({
  args: {},
  handler: async (ctx) => {
    // Return list of keys in process.env to debug missing keys
    // We mask values for security, just want to see what keys exist
    const keys = Object.keys(process.env);
    const vlyKeys = keys.filter(k => k.toLowerCase().includes('vly'));
    const openAiKeys = keys.filter(k => k.toLowerCase().includes('openai'));
    
    return {
      allKeys: keys,
      vlyKeys,
      openAiKeys,
      hasVlyIntegrationKey: !!process.env.VLY_INTEGRATION_KEY,
      hasOpenAiKey: !!process.env.OPENAI_API_KEY || !!process.env.OPENAI_KEY
    };
  },
});
