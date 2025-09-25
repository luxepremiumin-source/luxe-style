import { mutation } from "./_generated/server";

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

    const already = existing.find(
      (p) => p.name.toLowerCase() === "coach premium belt"
    );
    if (already) {
      return { message: "Coach premium belt already exists", id: already._id };
    }

    const id = await ctx.db.insert("products", {
      name: "Coach premium belt",
      description:
        "Coach premium belt available in Black and Grey. Premium finish with elegant hardware.",
      price: 899, // discounted price
      originalPrice: 1699,
      category: "belts",
      images: [
        "https://harmless-tapir-303.convex.cloud/api/storage/5588437d-4ac9-493d-a17e-ae4fa4a86af8",
        "https://harmless-tapir-303.convex.cloud/api/storage/d48c4a6e-a9f3-4aff-98d5-df3a78ebcda1",
      ],
      featured: true,
      inStock: true,
    });

    return { message: "Inserted Coach premium belt", id };
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