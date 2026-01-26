
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard/Dashbooard'
import LandingPage from './landingPage/LandingPage'
import CropCare from './Dashboard/Cropcare/CropCare'
import SoilDetects from './Dashboard/SoilDetects/SoilDetects'
import Weather from './Dashboard/Weather/Weather'
import Analytics from './Dashboard/Analytics'
import Community from './Dashboard/Community'
import HelpandSupport from './Dashboard/HelpandSupport'
import Settings from './Dashboard/Settings'
import AboutUs from './landingPage/AboutUs/AboutUs'
import PopularServices from './landingPage/Popular-Services/PopularServices'
import SmartFarming from './landingPage/smartFarmingBlog/smartFarming'
import Footer from './landingPage/Footer'
import LandingPageChart from './testCharts/LandingPageChart'
import SignIn from './auth/SignIn'
import ForgotPassword from './auth/ForgotPassword'
import VerifyOTP from './auth/VerifyOTP'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<PopularServices />} />
        <Route path="/blogs" element={<SmartFarming />} />
        <Route path="/contacts" element={<Footer />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="testCharts" element={<LandingPageChart/>}/>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/crop-care" element={<ProtectedRoute><CropCare/></ProtectedRoute>}/>
        <Route path="/soil-detects" element={<ProtectedRoute><SoilDetects/></ProtectedRoute>}/>
        <Route path="/weather" element={<ProtectedRoute><Weather/></ProtectedRoute>}/>
        <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>}/>
        <Route path="/community" element={<ProtectedRoute><Community/></ProtectedRoute>}/>
        <Route path="/help-and-support" element={<ProtectedRoute><HelpandSupport/></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>

        {/* <Route path="/pricing" element={<PricingPlan />} />  */}
      </Routes>
    </>
  )
}

export default App
