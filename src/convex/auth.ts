// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { emailOtp } from "./auth/emailOtp";
/* Google provider temporarily disabled due to missing module */

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    emailOtp,
    // Google provider temporarily disabled while we resolve the import path/package version
    Anonymous,
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // If user already exists, update their email if needed
      if (args.existingUserId) {
        const existingUser = await ctx.db.get(args.existingUserId);
        // Update email if it's from email provider and different
        if (args.profile.email && existingUser?.email !== args.profile.email) {
          await ctx.db.patch(args.existingUserId, {
            email: args.profile.email,
          });
        }
        return args.existingUserId;
      }
      
      // Create new user with email stored
      return await ctx.db.insert("users", {
        email: args.profile.email,
        emailVerificationTime: args.profile.emailVerificationTime,
        name: args.profile.name,
        image: args.profile.image,
      });
    },
  },
});