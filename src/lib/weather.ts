// Weather integration powered by Open-Meteo (https://open-meteo.com).
// Open-Meteo is free for non-commercial use and requires NO API key.

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export type WeatherCategory =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export interface GeoLocation {
  name: string;
  country?: string;
  admin1?: string; // province/state
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  label: string;
  category: WeatherCategory;
}

export interface DailyWeather {
  date: string;
  weatherCode: number;
  label: string;
  category: WeatherCategory;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  precipitationProbability: number;
}

export interface WeatherBundle {
  location: GeoLocation;
  current: CurrentWeather;
  daily: DailyWeather[];
}

// Map WMO weather codes to a human label + a category used to pick an icon.
export function describeWeatherCode(code: number): { label: string; category: WeatherCategory } {
  const map: Record<number, { label: string; category: WeatherCategory }> = {
    0: { label: "Clear sky", category: "clear" },
    1: { label: "Mainly clear", category: "clear" },
    2: { label: "Partly cloudy", category: "cloudy" },
    3: { label: "Overcast", category: "cloudy" },
    45: { label: "Fog", category: "fog" },
    48: { label: "Depositing rime fog", category: "fog" },
    51: { label: "Light drizzle", category: "drizzle" },
    53: { label: "Moderate drizzle", category: "drizzle" },
    55: { label: "Dense drizzle", category: "drizzle" },
    56: { label: "Light freezing drizzle", category: "drizzle" },
    57: { label: "Dense freezing drizzle", category: "drizzle" },
    61: { label: "Slight rain", category: "rain" },
    63: { label: "Moderate rain", category: "rain" },
    65: { label: "Heavy rain", category: "rain" },
    66: { label: "Light freezing rain", category: "rain" },
    67: { label: "Heavy freezing rain", category: "rain" },
    71: { label: "Slight snow", category: "snow" },
    73: { label: "Moderate snow", category: "snow" },
    75: { label: "Heavy snow", category: "snow" },
    77: { label: "Snow grains", category: "snow" },
    80: { label: "Slight rain showers", category: "rain" },
    81: { label: "Moderate rain showers", category: "rain" },
    82: { label: "Violent rain showers", category: "rain" },
    85: { label: "Slight snow showers", category: "snow" },
    86: { label: "Heavy snow showers", category: "snow" },
    95: { label: "Thunderstorm", category: "storm" },
    96: { label: "Thunderstorm with slight hail", category: "storm" },
    99: { label: "Thunderstorm with heavy hail", category: "storm" },
  };
  return map[code] ?? { label: "Unknown", category: "cloudy" };
}

interface GeocodeResponse {
  results?: Array<{
    name: string;
    country?: string;
    admin1?: string;
    admin2?: string;
    latitude: number;
    longitude: number;
  }>;
}

export interface FarmLocationParts {
  village?: string | null;
  cell?: string | null;
  sector?: string | null;
  district?: string | null;
  province?: string | null;
  country?: string | null;
}

/**
 * Build the most specific place query possible from farm location fields.
 * Tries village → cell → sector → district → province → country.
 */
export function formatFarmPlace(farm: FarmLocationParts): string {
  return [farm.village, farm.cell, farm.sector, farm.district, farm.province, farm.country]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join(", ");
}

/** Progressive queries from most specific to broadest (for geocode fallback). */
export function farmPlaceCandidates(farm: FarmLocationParts): string[] {
  const parts = [farm.village, farm.cell, farm.sector, farm.district, farm.province, farm.country]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean);
  if (parts.length === 0) return [];
  const candidates: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    candidates.push(parts.slice(i).join(", "));
  }
  return candidates;
}

/** Resolve a place name (e.g. "Remera, Gasabo, Rwanda") to coordinates. */
export async function geocode(query: string): Promise<GeoLocation | null> {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as GeocodeResponse;
  const first = data.results?.[0];
  if (!first) return null;
  return {
    name: first.name,
    country: first.country,
    admin1: first.admin1 ?? first.admin2,
    latitude: first.latitude,
    longitude: first.longitude,
  };
}

/**
 * Reverse-geocode coordinates to the smallest available place name
 * (village / locality when available). Uses BigDataCloud client API (CORS-friendly).
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeoLocation | null> {
  try {
    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client` +
      `?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      locality?: string;
      city?: string;
      localityInfo?: {
        administrative?: Array<{ name?: string; adminLevel?: number; description?: string }>;
      };
      principalSubdivision?: string;
      countryName?: string;
    };

    const admins = [...(data.localityInfo?.administrative ?? [])]
      .filter((a) => a.name)
      .sort((a, b) => (b.adminLevel ?? 0) - (a.adminLevel ?? 0));

    // Most local label (cell / neighbourhood / village).
    const smallest =
      data.locality ||
      admins[0]?.name ||
      data.city ||
      data.principalSubdivision ||
      "Your location";

    // Next useful level up (sector / district / city) — skip duplicates of `smallest`.
    const mid =
      [data.city, ...admins.map((a) => a.name), data.principalSubdivision]
        .filter((n): n is string => Boolean(n && n !== smallest))
        .find(Boolean) || undefined;

    return {
      name: smallest,
      admin1: mid,
      country: data.countryName,
      latitude,
      longitude,
    };
  } catch {
    return null;
  }
}

/** Short display label: "Kiyovu, Nyarugenge, Rwanda". */
export function formatWeatherLocation(loc: {
  name: string;
  admin1?: string;
  country?: string;
}): string {
  return [loc.name, loc.admin1, loc.country]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .filter((p, i, arr) => arr.indexOf(p) === i)
    .join(", ");
}

/** Search for multiple matching places (for autocomplete). */
export async function searchPlaces(
  query: string,
  count = 5,
  signal?: AbortSignal,
): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as GeocodeResponse;
  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

interface ForecastResponse {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
}

/** Fetch current conditions + a 7-day forecast for the given coordinates. */
export async function getForecast(
  latitude: number,
  longitude: number,
): Promise<{ current: CurrentWeather; daily: DailyWeather[] }> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch weather forecast.");
  const data = (await res.json()) as ForecastResponse;

  const c = data.current;
  const curDesc = describeWeatherCode(c?.weather_code ?? 0);
  const current: CurrentWeather = {
    temperature: c?.temperature_2m ?? 0,
    apparentTemperature: c?.apparent_temperature ?? 0,
    humidity: c?.relative_humidity_2m ?? 0,
    precipitation: c?.precipitation ?? 0,
    windSpeed: c?.wind_speed_10m ?? 0,
    weatherCode: c?.weather_code ?? 0,
    isDay: (c?.is_day ?? 1) === 1,
    label: curDesc.label,
    category: curDesc.category,
  };

  const daily: DailyWeather[] = (data.daily?.time ?? []).map((date, i) => {
    const desc = describeWeatherCode(data.daily!.weather_code[i]);
    return {
      date,
      weatherCode: data.daily!.weather_code[i],
      label: desc.label,
      category: desc.category,
      tempMax: data.daily!.temperature_2m_max[i],
      tempMin: data.daily!.temperature_2m_min[i],
      precipitation: data.daily!.precipitation_sum[i],
      precipitationProbability: data.daily!.precipitation_probability_max?.[i] ?? 0,
    };
  });

  return { current, daily };
}

/** Convenience: resolve by coordinates and reverse-geocode a precise display name. */
export async function getWeatherByCoords(
  latitude: number,
  longitude: number,
  name = "Your location",
): Promise<WeatherBundle> {
  const [forecast, reversed] = await Promise.all([
    getForecast(latitude, longitude),
    reverseGeocode(latitude, longitude),
  ]);
  const location: GeoLocation = reversed ?? { name, latitude, longitude };
  return { location, current: forecast.current, daily: forecast.daily };
}

/**
 * Try multiple place queries (most specific first) until one geocodes,
 * then fetch the forecast for those coordinates.
 */
export async function getWeatherByPlaceQueries(
  queries: string[],
): Promise<WeatherBundle | null> {
  for (const q of queries) {
    const trimmed = q.trim();
    if (!trimmed) continue;
    const location = await geocode(trimmed);
    if (!location) continue;
    const { current, daily } = await getForecast(location.latitude, location.longitude);
    // Prefer the query's most-specific label when geocode returns a coarse name.
    const displayName = trimmed.split(",")[0]?.trim() || location.name;
    return {
      location: { ...location, name: displayName },
      current,
      daily,
    };
  }
  return null;
}

/** Convenience: resolve by place name via geocoding, then fetch the forecast. */
export async function getWeatherByPlace(query: string): Promise<WeatherBundle | null> {
  return getWeatherByPlaceQueries([query]);
}

export type AdvisoryLevel = "info" | "warning" | "danger" | "success";

export interface Advisory {
  level: AdvisoryLevel;
  title: string;
  detail: string;
}

/** Derive actionable farming advisories from real weather data. */
export function getFarmingAdvisories(bundle: WeatherBundle): Advisory[] {
  const advisories: Advisory[] = [];
  const { current, daily } = bundle;

  const next3 = daily.slice(0, 3);
  const maxRainProb = Math.max(0, ...next3.map((d) => d.precipitationProbability));
  const totalRain = next3.reduce((s, d) => s + d.precipitation, 0);
  const minTemp = Math.min(...daily.map((d) => d.tempMin));
  const maxTemp = Math.max(...daily.map((d) => d.tempMax));

  if (maxRainProb >= 60 || totalRain >= 10) {
    advisories.push({
      level: "warning",
      title: "Rain expected soon",
      detail: `Up to ${Math.round(maxRainProb)}% chance of rain in the next 3 days — consider delaying irrigation and protect seedlings.`,
    });
  } else if (current.temperature >= 30 && maxRainProb < 30) {
    advisories.push({
      level: "danger",
      title: "Hot & dry conditions",
      detail: "High temperatures with little rain expected — irrigate early morning or late evening to reduce water loss.",
    });
  } else {
    advisories.push({
      level: "success",
      title: "Favourable conditions",
      detail: "Weather looks stable for routine field work and planting.",
    });
  }

  if (minTemp <= 5) {
    advisories.push({
      level: "danger",
      title: "Cold / frost risk",
      detail: `Temperatures may drop to ${Math.round(minTemp)}°C — cover sensitive crops to avoid frost damage.`,
    });
  }

  if (maxTemp >= 35) {
    advisories.push({
      level: "warning",
      title: "Heat stress risk",
      detail: `Highs near ${Math.round(maxTemp)}°C this week — monitor crops for heat stress and keep soil moist.`,
    });
  }

  if (current.windSpeed >= 30) {
    advisories.push({
      level: "warning",
      title: "Strong winds",
      detail: `Winds around ${Math.round(current.windSpeed)} km/h — delay spraying and secure young plants.`,
    });
  }

  if (current.humidity >= 85) {
    advisories.push({
      level: "info",
      title: "High humidity",
      detail: "Humid conditions increase fungal disease risk — scout crops and ensure good airflow.",
    });
  }

  return advisories;
}
