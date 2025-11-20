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
    
    // Group orphaned files by time proximity (within 5 minutes = likely same product)
    const groupedOrphaned = groupFilesByTime(orphanedFiles, 5 * 60 * 1000);
    
    return {
      total: filesWithStatus.length,
      active: activeFiles.length,
      orphaned: orphanedFiles.length,
      orphanedFiles: orphanedFiles.sort((a, b) => b.uploadedAt - a.uploadedAt),
      activeFiles: activeFiles.sort((a, b) => b.uploadedAt - a.uploadedAt),
      groupedOrphaned: groupedOrphaned,
    };
  },
});

// Helper function to group files by upload time proximity
function groupFilesByTime(files: any[], timeWindowMs: number) {
  if (files.length === 0) return [];
  
  // Sort by upload time
  const sorted = [...files].sort((a, b) => a.uploadedAt - b.uploadedAt);
  
  const groups: any[][] = [];
  let currentGroup: any[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const timeDiff = sorted[i].uploadedAt - sorted[i - 1].uploadedAt;
    
    if (timeDiff <= timeWindowMs) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
    }
  }
  
  // Add the last group
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  // Sort groups by most recent first
  return groups.reverse();
}

// Get URL for a specific storage ID
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});