import { useAuth } from "@/context/useAuth";

/**
 * Resolves where the primary "Get Started" call-to-action should point,
 * based on whether the visitor is already authenticated.
 */
export function useGetStarted() {
  const { isAuthenticated } = useAuth();
  return {
    isAuthenticated,
    to: isAuthenticated ? "/dashboard" : "/signup",
    label: isAuthenticated ? "Go to Dashboard" : "Get Started Free",
  };
}
