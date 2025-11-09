import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if products already exist
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return { message: "Products already seeded" };
    }

    const products = [
      // Goggles
      {
        name: "Aviator Pro Goggles",
        description: "Premium aviator-style goggles with UV protection and anti-glare coating. Perfect for outdoor activities and fashion statements.",
        price: 2999,
        originalPrice: 4999,
        category: "goggles",
        images: ["/api/placeholder/400/400"],
        featured: true,
        inStock: true,
      },
      {
        name: "Sport Edition Goggles",
        description: "High-performance sports goggles with impact-resistant lenses and comfortable fit for active lifestyles.",
        price: 3499,
        originalPrice: 5499,
        category: "goggles",
        images: ["/api/placeholder/400/400"],
        featured: true,
        inStock: true,
      },
      {
        name: "Classic Round Goggles",
        description: "Timeless round-frame goggles that blend vintage charm with modern technology and superior comfort.",
        price: 2499,
        originalPrice: 3999,
        category: "goggles",
        images: ["/api/placeholder/400/400"],
        featured: false,
        inStock: true,
      },

      // Watches
      {
        name: "Classic Chronograph",
        description: "Elegant chronograph watch with precision movement, stainless steel case, and leather strap for the sophisticated gentleman.",
        price: 5999,
        originalPrice: 8999,
        category: "watches",
        images: ["/api/placeholder/400/400"],
        featured: true,
        inStock: true,
      },
      {
        name: "Digital Smart Watch",
        description: "Modern smartwatch with fitness tracking, notifications, and sleek design for the tech-savvy individual.",
        price: 4499,
        originalPrice: 6999,
        category: "watches",
        images: ["/api/placeholder/400/400"],
        featured: false,
        inStock: true,
      },
      {
        name: "Luxury Dress Watch",
        description: "Sophisticated dress watch with minimalist design, premium materials, and Swiss-inspired movement.",
        price: 7999,
        originalPrice: 12999,
        category: "watches",
        images: ["/api/placeholder/400/400"],
        featured: true,
        inStock: true,
      },

      // Belts
      {
        name: "Executive Leather Belt",
        description: "Premium genuine leather belt with polished buckle, perfect for business attire and formal occasions.",
        price: 1999,
        originalPrice: 2999,
        category: "belts",
        images: ["/api/placeholder/400/400"],
        featured: true,
        inStock: true,
      },
      {
        name: "Casual Canvas Belt",
        description: "Durable canvas belt with metal buckle, ideal for casual wear and outdoor activities.",
        price: 1299,
        originalPrice: 1999,
        category: "belts",
        images: ["/api/placeholder/400/400"],
        featured: false,
        inStock: true,
      },
      {
        name: "Designer Chain Belt",
        description: "Stylish chain belt with unique design elements, perfect for adding edge to any outfit.",
        price: 2499,
        originalPrice: 3999,
        category: "belts",
        images: ["/api/placeholder/400/400"],
        featured: false,
        inStock: true,
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }

    return { message: `Successfully seeded ${products.length} products` };
  },
});

export const addCoachBelt = mutation({
  args: {},
  handler: async (ctx) => {
    // Avoid duplicates by name+category
    const existing = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "belts"))
      .collect();

    // Update: match the new requested name
    const already = existing.find(
      (p) => p.name.toLowerCase() === "coach belt"
    );
    if (already) {
      return { message: "Coach belt already exists", id: already._id };
    }

    // Insert with user-provided images and pricing
    const id = await ctx.db.insert("products", {
      name: "Coach belt",
      description:
        "Coach belt with premium finish. Available in two colorways (see images).",
      price: 849, // discounted price
      originalPrice: 2000,
      category: "belts",
      images: [
        "https://harmless-tapir-303.convex.cloud/api/storage/50b4ee66-b27c-42a1-861f-302e2cff61a2",
        "https://harmless-tapir-303.convex.cloud/api/storage/4355bc65-5844-43f6-af98-54aa3b51d6b8",
      ],
      featured: true,
      inStock: true,
    });

    return { message: "Inserted Coach belt", id };
  },
});

/**
 * Add "Guess watch" under watches with two images.
 * MRP: 4999, Discounted price: 2249
 */
export const addGuessWatch = mutation({
  args: {},
  handler: async (ctx) => {
    // Avoid duplicates by checking existing watches for same name
    const existing = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "watches"))
      .collect();

    const already = existing.find(
      (p) => p.name.toLowerCase() === "guess watch"
    );
    if (already) {
      return { message: "Guess watch already exists", id: already._id };
    }

    const id = await ctx.db.insert("products", {
      name: "Guess watch",
      description:
        "Stylish Guess watch with a premium steel bracelet and minimalist dial.",
      price: 2249,
      originalPrice: 4999,
      category: "watches",
      images: [
        "https://harmless-tapir-303.convex.cloud/api/storage/27df4fcc-81c4-4045-854f-89b4b0fb4ef6",
        "https://harmless-tapir-303.convex.cloud/api/storage/23d6c9e9-0300-4eef-801b-154bbabbc228",
      ],
      featured: true,
      inStock: true,
    });

    return { message: "Inserted Guess watch", id };
  },
});

export const addTomfordGoggles = mutation({
  args: {},
  handler: async (ctx) => {
    // Avoid duplicates by checking existing goggles for same name
    const existing = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "goggles"))
      .collect();

    const already = existing.find(
      (p) => p.name.toLowerCase() === "tomford premium"
    );
    if (already) {
      return { message: "Tomford premium already exists", id: already._id };
    }

    const id = await ctx.db.insert("products", {
      name: "Tomford premium",
      description:
        "Tomford premium eyewear with elegant acetate frame. Includes case and accessories.",
      price: 999,
      originalPrice: 2250,
      category: "goggles",
      images: [
        "https://harmless-tapir-303.convex.cloud/api/storage/06af60a0-4842-4cdf-92a6-e9b8f4a02b0f",
        "https://harmless-tapir-303.convex.cloud/api/storage/047d93a6-0a3f-491e-ac18-0c233580ab8c",
      ],
      featured: true,
      inStock: true,
    });

    return { message: "Inserted Tomford premium", id };
  },
});

export const seedAllProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const toSlug = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const items: Array<{
      name: string;
      description: string;
      price: number;
      originalPrice?: number;
      category: "goggles" | "watches" | "belts" | "gift box";
      brand?: string;
      images: string[];
      colors?: string[];
      featured: boolean;
      inStock: boolean;
    }> = [];

    const add = (p: Omit<(typeof items)[number], "images"> & { images?: string[] }) => {
      const slug = toSlug(`${p.category}-${p.name}`);
      const image = p.images?.[0] ?? `https://picsum.photos/seed/${slug}/600/600`;
      const image2 = `https://picsum.photos/seed/${slug}-2/600/600`;
      items.push({
        ...p,
        images: [image, image2],
      });
    };

    // Goggles (8+)
    [
      { name: "Tomford Premium", brand: "Tomford", price: 3499, featured: true },
      { name: "Rayban Classic", brand: "Rayban", price: 2999, featured: true },
      { name: "Oakley Sport", brand: "Oakley", price: 2799, featured: false },
      { name: "Gucci Vintage", brand: "Gucci", price: 3999, featured: false },
      { name: "Prada Square", brand: "Prada", price: 3699, featured: false },
      { name: "Versace Bold", brand: "Versace", price: 4299, featured: false },
      { name: "Dior Minimal", brand: "Dior", price: 3899, featured: false },
      { name: "Armani Pilot", brand: "Armani", price: 3199, featured: false },
    ].forEach(({ name, brand, price, featured }) =>
      add({
        name,
        description: `${name} premium sunglasses with UV protection`,
        price,
        originalPrice: Math.round(price * 1.25),
        category: "goggles",
        brand,
        colors: ["black", "gold", "silver"],
        featured,
        inStock: true,
      })
    );

    // Watches (8+)
    [
      { name: "Guess Watch", brand: "Guess", price: 4999, featured: true },
      { name: "Fossil Chrono", brand: "Fossil", price: 5499, featured: true },
      { name: "Casio Edifice", brand: "Casio", price: 3799, featured: false },
      { name: "Seiko 5", brand: "Seiko", price: 5699, featured: false },
      { name: "Citizen Eco", brand: "Citizen", price: 5899, featured: false },
      { name: "Tissot PRX", brand: "Tissot", price: 7499, featured: false },
      { name: "Timex Expedition", brand: "Timex", price: 2999, featured: false },
      { name: "Michael Kors", brand: "MichaelKors", price: 6299, featured: false },
    ].forEach(({ name, brand, price, featured }) =>
      add({
        name,
        description: `${name} luxury timepiece`,
        price,
        originalPrice: Math.round(price * 1.2),
        category: "watches",
        brand,
        colors: ["black", "brown", "blue"],
        featured,
        inStock: true,
      })
    );

    // Belts (8+)
    [
      { name: "Coach Belt", brand: "Coach", price: 3199, featured: true },
      { name: "Gucci Leather Belt", brand: "Gucci", price: 5299, featured: true },
      { name: "Hermes H Belt", brand: "Hermes", price: 8999, featured: false },
      { name: "Louis Vuitton Damier Belt", brand: "LouisVuitton", price: 8299, featured: false },
      { name: "Calvin Klein Formal Belt", brand: "CalvinKlein", price: 2799, featured: false },
      { name: "Tommy Hilfiger Casual Belt", brand: "TommyHilfiger", price: 2599, featured: false },
      { name: "Armani Exchange Belt", brand: "Armani", price: 3499, featured: false },
      { name: "Hugo Boss Reversible Belt", brand: "HugoBoss", price: 3899, featured: false },
    ].forEach(({ name, brand, price, featured }) =>
      add({
        name,
        description: `${name} premium leather belt`,
        price,
        originalPrice: Math.round(price * 1.15),
        category: "belts",
        brand,
        colors: ["black", "brown"],
        featured,
        inStock: true,
      })
    );

    // Gift Box (8+)
    [
      { name: "Luxury Gift Box Small", price: 999, featured: true },
      { name: "Luxury Gift Box Medium", price: 1499, featured: true },
      { name: "Luxury Gift Box Large", price: 1999, featured: false },
      { name: "Couple Watch Gift Box", price: 4499, featured: false },
      { name: "Sunglasses Gift Box", price: 2999, featured: false },
      { name: "Premium Wallet Gift Box", price: 2199, featured: false },
      { name: "Belt Gift Combo", price: 3599, featured: false },
      { name: "Ultimate Accessory Hamper", price: 6999, featured: false },
    ].forEach(({ name, price, featured }) =>
      add({
        name,
        description: `${name} curated for special occasions`,
        price,
        originalPrice: Math.round(price * 1.2),
        category: "gift box",
        brand: "Luxe",
        colors: ["black", "gold"],
        featured,
        inStock: true,
      })
    );

    // Upsert by (category + name)
    let inserted = 0;
    let updated = 0;

    for (const p of items) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", p.category))
        .collect();

      const match = existing.find((e) => e.name.toLowerCase() === p.name.toLowerCase());
      if (match) {
        await ctx.db.patch(match._id, {
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          images: p.images,
          colors: p.colors,
          brand: p.brand,
          featured: p.featured,
          inStock: p.inStock,
        });
        updated++;
      } else {
        await ctx.db.insert("products", p);
        inserted++;
      }
    }

    return { inserted, updated, total: items.length };
  },
});