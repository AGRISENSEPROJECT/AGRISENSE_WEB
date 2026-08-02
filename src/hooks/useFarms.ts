import { useCallback, useEffect, useState } from "react";
import { ApiError, farmService, type Farm } from "@/api";

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await farmService.getAll();
      setFarms(res.farms || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load farms.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { farms, loading, error, reload };
}
