import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const categoryValidator = v.union(
  v.literal("goggles"),
  v.literal("watches"),
  v.literal("belts"),
);

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categorySlideshows").collect();
  },
});

export const saveSettings = mutation({
  args: {
    category: categoryValidator,
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.images.length < 2 || args.images.length > 3) {
      throw new Error("Choose exactly 2 or 3 images.");
    }

    if (args.images.some((image) => !image.startsWith("/recovered-product-images/"))) {
      throw new Error("Only existing local product images are allowed.");
    }

    if (new Set(args.images).size !== args.images.length) {
      throw new Error("Choose different images.");
    }

    const existing = await ctx.db
      .query("categorySlideshows")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { images: args.images });
    } else {
      await ctx.db.insert("categorySlideshows", args);
    }
  },
});
