import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { getFarmingAdvisories } from "@/lib/weather";
import WeatherIcon from "@/components/WeatherIcon";

const WeatherSection = () => {
  // Public landing page: use a default location (no geolocation prompt).
  const { weather, loading } = useWeather({ place: "Kigali, Rwanda", useGeolocation: false });
  const advisories = weather ? getFarmingAdvisories(weather).slice(0, 3) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mb-20 flex mt-36 flex-col items-center">
      <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 w-full items-center">
        {/* Live weather card */}
        <div className="w-full md:w-1/2 lg:w-5/12">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B6E4F] to-[#14532d] text-white p-6 shadow-xl">
            {loading ? (
              <div className="flex items-center gap-2 py-10 justify-center">
                <Loader2 className="h-6 w-6 animate-spin" /> Loading live weather…
              </div>
            ) : weather ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">
                      {weather.location.name}
                      {weather.location.country ? `, ${weather.location.country}` : ""}
                    </p>
                    <p className="text-5xl font-bold mt-1">
                      {Math.round(weather.current.temperature)}°C
                    </p>
                    <p className="text-white/90">{weather.current.label}</p>
                  </div>
                  <WeatherIcon category={weather.current.category} className="h-16 w-16" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6 text-center">
                  {weather.daily.slice(1, 4).map((d) => (
                    <div key={d.date} className="rounded-lg bg-white/10 py-2">
                      <p className="text-xs text-white/70">
                        {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <WeatherIcon category={d.category} className="h-5 w-5 mx-auto my-1" />
                      <p className="text-sm font-semibold">{Math.round(d.tempMax)}°</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <img
                className="w-full rounded-lg object-cover"
                src="/assets/WeatherMan.png"
                alt="Weather forecast"
              />
            )}
          </div>
        </div>

        <div className="text-left w-full md:w-1/2 lg:w-7/12">
          <h2 className="font-bold text-xl text-[#0a7c42] mb-6">Weather Updates:</h2>
          <div className="flex flex-col gap-5 mb-8">
            {advisories.length > 0 ? (
              advisories.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <img src="/assets/smartFarmingIcon.svg" alt="" className="w-5 h-5 mt-1" />
                  <p className="font-medium">
                    <span className="font-semibold">{a.title}:</span> {a.detail}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <img src="/assets/smartFarmingIcon.svg" alt="" className="w-5 h-5 mt-1" />
                  <p className="font-medium">Real-time rainfall & irrigation guidance for your region.</p>
                </div>
                <div className="flex items-start gap-3">
                  <img src="/assets/smartFarmingIcon.svg" alt="" className="w-5 h-5 mt-1" />
                  <p className="font-medium">Drought and heat alerts with recommended actions.</p>
                </div>
                <div className="flex items-start gap-3">
                  <img src="/assets/smartFarmingIcon.svg" alt="" className="w-5 h-5 mt-1" />
                  <p className="font-medium">Frost warnings to protect your sensitive crops.</p>
                </div>
              </>
            )}
          </div>
          <Link
            to="/weather"
            className="inline-block bg-[#0a7c42] hover:bg-[#086835] text-white px-8 py-2 rounded-md font-medium"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;
