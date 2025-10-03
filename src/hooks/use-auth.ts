import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";

import { useEffect, useState } from "react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const { signIn, signOut } = useAuthActions();

  const [isLoading, setIsLoading] = useState(true);

  // This effect updates the loading state once auth is loaded and user data is available
  // It ensures we only show content when both authentication state and user data are ready
  useEffect(() => {
    if (!isAuthLoading && user !== undefined) {
      setIsLoading(false);
    }
  }, [isAuthLoading, user]);

  // Add: expose user id globally for immediate availability after sign-in
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__luxeUserId = user?._id ?? null;
    }
  }, [user?._id]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}