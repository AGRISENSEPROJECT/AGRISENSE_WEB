
import Navbar from './Navbar/Navbar'
import HeroSection from './HeroSection/Hero'
import PopularServices from './Popular-Services/PopularServices'
import AboutUs from './AboutUs/AboutUs'
import HowDoWeWork from './HowDoWeWork/HowDoWeWork'
import PricingPlan from './PricingPlan/PricingPlan'
import Counter from './Counter/Counter'
import Partners from './Partners'
import SmartFarming from './smartFarmingBlog/smartFarming';
import WeatherSection from './WeatherSection'
import TestimonialCarousel from './Testimonies'
import Waitlist from './Waitlist'
import Footer from './Footer'
import AppDownloadFab from '@/components/AppDownloadFab'
import { useEffect } from 'react'

const LandingPage = () => {
      useEffect(() => {
        document.title = 'Landing | AGRISENSE';
      }, []);
  return (
    <div id="home">
      <Navbar />
      <HeroSection />
      <div id="about">
        <AboutUs />
      </div>
      <div id="services">
        <PopularServices />
      </div>
      <HowDoWeWork />
      <PricingPlan />
      <Counter />
      <Partners />
      <div id="blogs">
        <SmartFarming />
      </div>
      <WeatherSection />
      <TestimonialCarousel />
      <Waitlist />
      <div id="contact">
        <Footer />
      </div>
      <AppDownloadFab />
    </div>
  )
}

export default LandingPage
