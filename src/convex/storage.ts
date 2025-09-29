import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    const url = await ctx.storage.generateUploadUrl();
    return url;
  },
});

export const resolvePublicUrl = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Public URL not available yet for the uploaded file");
    }
    return url;
  },
});