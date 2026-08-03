import { useAuth } from "@/context/useAuth";
import { routes } from "@/lib/routes";

/**
 * Resolves where the primary "Get Started" call-to-action should point,
 * based on whether the visitor is already authenticated.
 */
export function useGetStarted() {
  const { isAuthenticated } = useAuth();
  return {
    isAuthenticated,
    to: isAuthenticated ? routes.app.root : routes.auth.register,
    label: isAuthenticated ? "Go to Dashboard" : "Get Started Free",
  };
}
