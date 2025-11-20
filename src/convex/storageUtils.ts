import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all storage files and check which ones are orphaned (not used by any product)
export const listAllStorageFiles = query({
  args: {},
  handler: async (ctx) => {
    // Get all files from storage system table
    const allFiles = await ctx.db.system.query("_storage").collect();
    
    // Get all products to check which images are still in use
    const allProducts = await ctx.db.query("products").collect();
    
    // Collect all image URLs currently in use
    const usedImageUrls = new Set<string>();
    for (const product of allProducts) {
      if (product.images) {
        product.images.forEach(url => usedImageUrls.add(url));
      }
      if (product.videos) {
        product.videos.forEach(url => usedImageUrls.add(url));
      }
    }
    
    // Categorize files
    const filesWithStatus = await Promise.all(
      allFiles.map(async (file) => {
        const url = await ctx.storage.getUrl(file._id);
        const isUsed = url ? usedImageUrls.has(url) : false;
        
        return {
          storageId: file._id,
          url: url,
          contentType: file.contentType,
          size: file.size,
          uploadedAt: file._creationTime,
          isUsed: isUsed,
          status: isUsed ? "active" : "orphaned"
        };
      })
    );
    
    const orphanedFiles = filesWithStatus.filter(f => !f.isUsed);
    const activeFiles = filesWithStatus.filter(f => f.isUsed);
    
    return {
      total: filesWithStatus.length,
      active: activeFiles.length,
      orphaned: orphanedFiles.length,
      orphanedFiles: orphanedFiles.sort((a, b) => b.uploadedAt - a.uploadedAt),
      activeFiles: activeFiles.sort((a, b) => b.uploadedAt - a.uploadedAt),
    };
  },
});

// Get URL for a specific storage ID
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});
