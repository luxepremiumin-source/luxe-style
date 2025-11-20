import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addToCart = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.optional(v.number()),
    color: v.optional(v.string()),
    packaging: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const qty = args.quantity ?? 1;

    // Find existing cart item with matching product, color, AND packaging
    const allUserCartItems = await ctx.db
      .query("cart")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId),
      )
      .collect();

    // Filter to find exact match including color and packaging
    const existing = allUserCartItems.find(
      (item) =>
        (item.color ?? null) === (args.color ?? null) &&
        (item.packaging ?? null) === (args.packaging ?? null)
    );

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: (existing.quantity ?? 0) + qty,
      });
      return existing._id;
    }

    return await ctx.db.insert("cart", {
      userId: args.userId,
      productId: args.productId,
      quantity: qty,
      color: args.color,
      packaging: args.packaging,
    });
  },
});

export const getCartCount = query({
  args: { userId: v.optional(v.union(v.id("users"), v.null())) },
  handler: async (ctx, args) => {
    if (!args.userId || args.userId === null) return 0;
    const items = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .collect();
    return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  },
});

export const getCartItems = query({
  args: { userId: v.optional(v.union(v.id("users"), v.null())) },
  handler: async (ctx, args) => {
    if (!args.userId || args.userId === null) return [];
    const items = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .collect();

    const result = [];
    for (const item of items) {
      const product = await ctx.db.get(item.productId);
      if (!product) continue;
      result.push({
        _id: item._id,
        quantity: item.quantity ?? 1,
        productId: item.productId,
        color: item.color,
        packaging: item.packaging,
        product,
      });
    }
    return result;
  },
});

export const setCartItemQuantity = mutation({
  args: {
    userId: v.id("users"),
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.cartItemId);

    if (!existing) {
      return null;
    }

    // If quantity <= 0, delete the cart item
    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
      return null;
    }

    // Update the quantity
    await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    return args.cartItemId;
  },
});