import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  type LucideProps,
} from "lucide-react";
import type { WeatherCategory } from "@/lib/weather";

const ICONS: Record<WeatherCategory, React.ComponentType<LucideProps>> = {
  clear: Sun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

interface WeatherIconProps extends LucideProps {
  category: WeatherCategory;
}

const WeatherIcon = ({ category, ...props }: WeatherIconProps) => {
  const Icon = ICONS[category] ?? Cloud;
  return <Icon {...props} />;
};

export default WeatherIcon;
