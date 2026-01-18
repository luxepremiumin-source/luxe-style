import { VlyIntegrations } from "@vly-ai/integrations";

export const vly = new VlyIntegrations({
  // Provide a dummy token during build/dev if env var is missing to prevent constructor error
  deploymentToken: process.env.VLY_INTEGRATION_KEY || "dummy_token_for_build",
});