import { useEffect, useMemo, useState } from "react";
import { billingService, type UserSubscription } from "@/api";
import { useAuth } from "@/context/useAuth";
import {
  resolvePlanEntitlements,
  type PlanEntitlements,
} from "@/lib/planEntitlements";

/**
 * Farmer plan entitlements from auth profile, refreshed from billing when needed.
 */
export function usePlanEntitlements(): PlanEntitlements & {
  loading: boolean;
  subscription: UserSubscription | null;
  reload: () => void;
} {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(!user?.subscription);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    billingService
      .getSubscription()
      .then((sub) => {
        if (active) setSubscription(sub);
      })
      .catch(() => {
        if (active) setSubscription(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.id, nonce]);

  const entitlements = useMemo(
    () => resolvePlanEntitlements(user, subscription),
    [user, subscription],
  );

  return {
    ...entitlements,
    loading,
    subscription,
    reload: () => setNonce((n) => n + 1),
  };
}
