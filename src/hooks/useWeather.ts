import { useCallback, useEffect, useState } from "react";
import {
  getWeatherByCoords,
  getWeatherByPlace,
  type WeatherBundle,
} from "@/lib/weather";

const DEFAULT_PLACE = "Kigali, Rwanda";

interface UseWeatherOptions {
  /** Preferred place query, e.g. "Gasabo, Rwanda" derived from a farm. */
  place?: string;
  /** Try the browser geolocation API before falling back to `place`/default. */
  useGeolocation?: boolean;
}

interface UseWeatherResult {
  weather: WeatherBundle | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

function getGeolocation(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 8000, maximumAge: 10 * 60 * 1000 },
    );
  });
}

export function useWeather({ place, useGeolocation = true }: UseWeatherOptions = {}): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // 1. Explicit place (e.g. from a selected farm) takes priority.
        if (place && place.trim()) {
          const byPlace = await getWeatherByPlace(place.trim());
          if (byPlace) {
            if (active) setWeather(byPlace);
            return;
          }
        }

        // 2. Browser geolocation.
        if (useGeolocation) {
          const pos = await getGeolocation();
          if (pos) {
            const byCoords = await getWeatherByCoords(
              pos.coords.latitude,
              pos.coords.longitude,
              "Your location",
            );
            if (active) setWeather(byCoords);
            return;
          }
        }

        // 3. Default location.
        const fallback = await getWeatherByPlace(DEFAULT_PLACE);
        if (active) {
          if (fallback) setWeather(fallback);
          else setError("Unable to load weather data.");
        }
      } catch {
        if (active) setError("Unable to load weather data.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [place, useGeolocation, nonce]);

  return { weather, loading, error, reload };
}
