"use node";

import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Import products from dev to production
 * This action should be run with production deployment
 */
export const importProductsToProduction = action({
  args: {
    products: v.array(v.object({
      name: v.string(),
      description: v.string(),
      price: v.number(),
      originalPrice: v.optional(v.number()),
      category: v.string(),
      images: v.array(v.string()),
      videos: v.optional(v.array(v.string())),
      colors: v.optional(v.array(v.string())),
      brand: v.optional(v.string()),
      featured: v.boolean(),
      inStock: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    let imported = 0;
    
    for (const product of args.products) {
      await ctx.runMutation(api.products.createProduct, product);
      imported++;
    }
    
    return { imported, message: `Imported ${imported} products to production` };
  },
});