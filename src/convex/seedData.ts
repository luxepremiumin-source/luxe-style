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
    type P = {
      name: string;
      description: string;
      price: number;
      originalPrice?: number;
      category: string;
      images: Array<string>;
      videos?: Array<string>;
      colors?: Array<string>;
      brand?: string;
      featured: boolean;
      inStock: boolean;
    };

    const items: Array<P> = [
      // Goggles
      {
        name: "Tomford premium",
        description: "Tomford premium eyewear with elegant acetate frame.",
        price: 999,
        originalPrice: 2250,
        category: "goggles",
        images: [
          "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1516822003754-cca485356ecb?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Tom Ford",
        featured: true,
        inStock: true,
      },
      {
        name: "Aviator Pro Goggles",
        description: "Premium aviator-style goggles with UV protection and anti-glare coating.",
        price: 2999,
        originalPrice: 4999,
        category: "goggles",
        images: [
          "https://images.unsplash.com/photo-1514846160150-2cfbfb2d2f66?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Ray-Ban",
        featured: true,
        inStock: true,
      },
      {
        name: "Sport Edition Goggles",
        description: "High-performance sports goggles with impact-resistant lenses.",
        price: 3499,
        originalPrice: 5499,
        category: "goggles",
        images: [
          "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Oakley",
        featured: true,
        inStock: true,
      },
      {
        name: "Classic Round Goggles",
        description: "Timeless round-frame goggles with modern tech and superior comfort.",
        price: 2499,
        originalPrice: 3999,
        category: "goggles",
        images: [
          "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Ray-Ban",
        featured: false,
        inStock: true,
      },

      // Watches
      {
        name: "Guess watch",
        description: "Stylish Guess watch with a premium steel bracelet and minimalist dial.",
        price: 2249,
        originalPrice: 4999,
        category: "watches",
        images: [
          "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Guess",
        featured: true,
        inStock: true,
      },
      {
        name: "Classic Chronograph",
        description: "Elegant chronograph with precision movement and leather strap.",
        price: 5999,
        originalPrice: 8999,
        category: "watches",
        images: [
          "https://images.unsplash.com/photo-1517249361621-f11084eb8bd0?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Fossil",
        featured: true,
        inStock: true,
      },
      {
        name: "Digital Smart Watch",
        description: "Modern smartwatch with fitness tracking and notifications.",
        price: 4499,
        originalPrice: 6999,
        category: "watches",
        images: [
          "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Amazfit",
        featured: false,
        inStock: true,
      },
      {
        name: "Luxury Dress Watch",
        description: "Sophisticated dress watch with minimalist design.",
        price: 7999,
        originalPrice: 12999,
        category: "watches",
        images: [
          "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Tissot",
        featured: true,
        inStock: true,
      },
      {
        name: "Casio Edifice",
        description: "Sporty chronograph with stainless steel case.",
        price: 6999,
        originalPrice: 9999,
        category: "watches",
        images: [
          "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Casio",
        featured: false,
        inStock: true,
      },

      // Belts
      {
        name: "Coach belt",
        description: "Coach belt with premium finish.",
        price: 849,
        originalPrice: 2000,
        category: "belts",
        images: [
          "https://images.unsplash.com/photo-1518544881480-67e1d6b1e64e?w=800&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1585386959984-a41552231681?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Coach",
        featured: true,
        inStock: true,
      },
      {
        name: "Executive Leather Belt",
        description: "Premium genuine leather belt with polished buckle.",
        price: 1999,
        originalPrice: 2999,
        category: "belts",
        images: [
          "https://images.unsplash.com/photo-1520975964732-35ce1b6b140b?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Hidesign",
        featured: true,
        inStock: true,
      },
      {
        name: "Casual Canvas Belt",
        description: "Durable canvas belt ideal for casual wear.",
        price: 1299,
        originalPrice: 1999,
        category: "belts",
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Woodland",
        featured: false,
        inStock: true,
      },
      {
        name: "Designer Chain Belt",
        description: "Stylish chain belt with unique design elements.",
        price: 2499,
        originalPrice: 3999,
        category: "belts",
        images: [
          "https://images.unsplash.com/photo-1518544881480-67e1d6b1e64e?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Gucci",
        featured: false,
        inStock: true,
      },

      // Gift box
      {
        name: "Rose Gift Box",
        description: "Elegant rose-themed gift box perfect for special occasions.",
        price: 1499,
        originalPrice: 2499,
        category: "gift box",
        images: [
          "https://images.unsplash.com/photo-1513791051634-e8952db8bed3?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Luxe",
        featured: true,
        inStock: true,
      },
      {
        name: "Deluxe Gift Box",
        description: "Premium curated gift box with multiple accessories.",
        price: 1999,
        originalPrice: 3299,
        category: "gift box",
        images: [
          "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Luxe",
        featured: true,
        inStock: true,
      },
      {
        name: "Classic Gift Box",
        description: "Timeless gift box with elegant packaging.",
        price: 1299,
        originalPrice: 1999,
        category: "gift box",
        images: [
          "https://images.unsplash.com/photo-1489648022183-2f6a1a7a8b19?w=800&q=80&auto=format&fit=crop",
        ],
        brand: "Luxe",
        featured: false,
        inStock: true,
      },
    ];

    let inserted = 0;
    let updated = 0;

    for (const p of items) {
      const inCategory = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", p.category))
        .collect();

      const match = inCategory.find(
        (x) => x.name.toLowerCase() === p.name.toLowerCase()
      );

      if (match) {
        await ctx.db.patch(match._id, {
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          category: p.category,
          images: p.images,
          videos: p.videos,
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