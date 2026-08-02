import { type FC, useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Search, LocateFixed, Droplets, Wind } from "lucide-react"
import WeatherIcon from "@/components/WeatherIcon"
import {
  searchPlaces,
  getForecast,
  getFarmingAdvisories,
  type GeoLocation,
  type WeatherBundle,
} from "@/lib/weather"

const labelFor = (loc: GeoLocation) =>
  [loc.name, loc.admin1, loc.country].filter(Boolean).join(", ")

const FilterBar: FC = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeoLocation[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)

  const [selected, setSelected] = useState<GeoLocation | null>(null)
  const [weather, setWeather] = useState<WeatherBundle | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced autocomplete search.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const places = await searchPlaces(q, 6, controller.signal)
        setResults(places)
        setOpen(true)
      } catch {
        /* aborted or network error */
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  // Close dropdown on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const loadWeather = async (loc: GeoLocation) => {
    setSelected(loc)
    setQuery(labelFor(loc))
    setOpen(false)
    setError(null)
    setLoadingWeather(true)
    setWeather(null)
    try {
      const { current, daily } = await getForecast(loc.latitude, loc.longitude)
      setWeather({ location: loc, current, daily })
    } catch {
      setError("Couldn't load weather for this place. Please try again.")
    } finally {
      setLoadingWeather(false)
    }
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported on this device.")
      return
    }
    setError(null)
    setLoadingWeather(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void loadWeather({
          name: "Your location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => {
        setLoadingWeather(false)
        setError("Location access denied. Search for a place instead.")
      },
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }

  const topAdvisory = useMemo(
    () => (weather ? getFarmingAdvisories(weather)[0] : null),
    [weather],
  )

  return (
    <div className="bg-white mx-auto max-w-[calc(100%-16px)] sm:max-w-[calc(100%-32px)] md:max-w-[calc(100%-64px)] lg:max-w-4xl px-4 sm:px-6 py-5 border border-gray-100 shadow-2xl rounded-2xl">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2C6E49]/10">
          <MapPin className="h-5 w-5 text-[#2C6E49]" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
            Check farming conditions in your area
          </h3>
          <p className="text-xs text-gray-500">Search any location to see live weather & advice.</p>
        </div>
      </div>

      {/* Search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div ref={containerRef} className="relative flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="Search a city, district or town…"
              className="h-11 pl-9 pr-9 text-sm rounded-xl"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Autocomplete dropdown */}
          {open && (query.trim().length >= 2) && (
            <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
              {searching && results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching…
                </div>
              ) : results.length > 0 ? (
                <ul className="max-h-64 overflow-auto py-1">
                  {results.map((loc) => (
                    <li key={`${loc.latitude},${loc.longitude}`}>
                      <button
                        type="button"
                        onClick={() => loadWeather(loc)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                      >
                        <MapPin className="h-4 w-4 shrink-0 text-[#2C6E49]" />
                        <span className="truncate">
                          <span className="font-medium text-gray-800">{loc.name}</span>
                          <span className="text-gray-500">
                            {[loc.admin1, loc.country].filter(Boolean).length > 0 &&
                              ` — ${[loc.admin1, loc.country].filter(Boolean).join(", ")}`}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">No matching places found.</div>
              )}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={useMyLocation}
          className="h-11 rounded-xl gap-2 border-[#2C6E49]/30 text-[#2C6E49] hover:bg-[#2C6E49]/5 font-semibold"
        >
          <LocateFixed className="h-4 w-4" />
          Use my location
        </Button>
      </div>

      {/* Error */}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* Weather preview */}
      {(loadingWeather || weather) && (
        <div className="mt-4 rounded-xl border border-gray-100 bg-gradient-to-br from-[#0B6E4F] to-[#14532d] p-4 text-white">
          {loadingWeather ? (
            <div className="flex items-center justify-center gap-2 py-6 text-white/90">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading live conditions…
            </div>
          ) : weather ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 sm:min-w-[190px]">
                <WeatherIcon category={weather.current.category} className="h-12 w-12 shrink-0" />
                <div>
                  <p className="text-3xl font-bold leading-none">
                    {Math.round(weather.current.temperature)}°C
                  </p>
                  <p className="text-sm text-white/90">{weather.current.label}</p>
                  <p className="text-xs text-white/70 mt-0.5">
                    {selected ? labelFor(selected) : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-xs text-white/90 sm:border-l sm:border-white/20 sm:pl-4">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4" /> {Math.round(weather.current.humidity)}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-4 w-4" /> {Math.round(weather.current.windSpeed)} km/h
                </span>
              </div>

              {topAdvisory && (
                <div className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-xs sm:text-sm">
                  <span className="font-semibold">{topAdvisory.title}:</span>{" "}
                  {topAdvisory.detail}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default FilterBar
