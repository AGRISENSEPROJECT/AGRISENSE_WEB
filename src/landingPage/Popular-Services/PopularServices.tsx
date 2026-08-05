import type React from "react"
import SupplierMarketInsights from "/assets/serviceImages/SupplierMarketInsights.png"
import WeatherClimate from "/assets/serviceImages/WeatherAndClimate.png"
import FarmManagement from "/assets/serviceImages/FarmManagement.png"
import SoilCropAnalysis from "/assets/serviceImages/Soil-And-Crop-Analysis.png"
import GvtsNgos from "/assets/serviceImages/gvtsAndNgos.png"
import FarmerSupplier from "/assets/serviceImages/Farmer-Suppliaer-MarketPlace.png"
import supplierMarketIcon from "/assets/icons/supplier-market.svg"
import weatherClimateIcon from "/assets/icons/weather-climate.svg"
import farmManagementIcon from "/assets/icons/Farm-management.svg"
import soilCropIcon from "/assets/icons/soil-crop-analysis.svg"
import gorvenmentIcon from "/assets/icons/government.svg"
import farmerSupplierIcon from "/assets/icons/farmer-supplier.svg"

interface Service {
  title: string
  description: string
  imageUrl: string
  icon: string
}

const PopularServices: React.FC = () => {
  const services: Service[] = [
    {
      title: "Supplier & Market Insights",
      description: "Track produce demand and supplier pricing for smarter selling.",
      imageUrl: SupplierMarketInsights,
      icon: supplierMarketIcon,
    },
    {
      title: "Weather & Climate Monitor",
      description: "Hyperlocal forecasts and alerts for your sector and fields.",
      imageUrl: WeatherClimate,
      icon: weatherClimateIcon,
    },
    {
      title: "Farm Management",
      description: "Organize farms, acreage and field activities in one place.",
      imageUrl: FarmManagement,
      icon: farmManagementIcon,
    },
    {
      title: "Soil & Crop Analysis",
      description: "Understand soil health and get crop recommendations.",
      imageUrl: SoilCropAnalysis,
      icon: soilCropIcon,
    },
    {
      title: "Gvt & NGO Support",
      description: "Tools for programs, outreach and regional farm support.",
      imageUrl: GvtsNgos,
      icon: gorvenmentIcon,
    },
    {
      title: "Farmer-Supplier Marketplace",
      description: "Connect growers with trusted input suppliers nearby.",
      imageUrl: FarmerSupplier,
      icon: farmerSupplierIcon,
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center bg-[#2C6E49F2] p-4 sm:p-8 md:py-14">
      <div className="mb-6 text-center sm:mb-8">
        <p className="mb-3 text-lg font-bold text-white sm:mb-5">Popular Services We Provide</p>
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          Boost your farm&apos;s productivity today!
        </h1>
      </div>
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-xl sm:p-6"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2C6E49] shadow-lg sm:mb-4 sm:h-14 sm:w-14">
              <img src={service.icon || "/placeholder.svg"} alt="" className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <h2 className="mb-2 text-center text-base font-semibold text-gray-800 sm:text-lg">
              {service.title}
            </h2>
            <p className="mb-4 text-center text-sm text-gray-500 sm:mb-5">{service.description}</p>

            <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg">
              <img
                src={service.imageUrl || "/placeholder.svg"}
                alt={service.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularServices
