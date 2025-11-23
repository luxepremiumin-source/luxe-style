import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getHeroSections = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("heroSections").collect();
  },
});

export const getHeroSectionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const section = await ctx.db
      .query("heroSections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    return section ?? null;
  },
});

export const addHeroImage = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("heroSections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!existing) {
      await ctx.db.insert("heroSections", {
        slug: args.slug,
        title: args.title,
        images: [args.imageUrl],
      });
      return;
    }

    if (existing.images.includes(args.imageUrl)) {
      return;
    }

    const title = args.title.trim() !== "" ? args.title : existing.title;

    await ctx.db.patch(existing._id, {
      title,
      images: [...existing.images, args.imageUrl],
    });
  },
});

export const removeHeroImage = mutation({
  args: {
    slug: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("heroSections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!existing) {
      throw new Error(`Hero section "${args.slug}" not found.`);
    }

    const filtered = existing.images.filter((url) => url !== args.imageUrl);

    if (filtered.length === existing.images.length) {
      return;
    }

    await ctx.db.patch(existing._id, { images: filtered });
  },
});

export const replaceHeroImage = mutation({
  args: {
    slug: v.string(),
    oldImageUrl: v.string(),
    newImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("heroSections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!existing) {
      throw new Error(`Hero section "${args.slug}" not found.`);
    }

    const index = existing.images.indexOf(args.oldImageUrl);
    if (index === -1) {
      throw new Error("Image to replace not found.");
    }

    const newImages = [...existing.images];
    newImages[index] = args.newImageUrl;

    await ctx.db.patch(existing._id, { images: newImages });
  },
});