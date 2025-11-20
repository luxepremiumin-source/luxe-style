import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateByName = mutation({
  args: {
    name: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    const product = products.find(
      (p) => p.name.toLowerCase() === args.name.toLowerCase()
    );

    if (!product) {
      throw new Error(`Product "${args.name}" not found`);
    }

    await ctx.db.patch(product._id, {
      images: args.images,
    });

    return {
      success: true,
      productId: product._id,
      name: product.name,
      updatedImages: args.images,
    };
  },
});

export const listAllProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.map((p) => ({
      _id: p._id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      currentImages: p.images,
    }));
  },
});
