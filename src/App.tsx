
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
import AboutPage from './landingPage/AboutUs/AboutPage'
import PopularServices from './landingPage/Popular-Services/PopularServices'
import SmartFarming from './landingPage/smartFarmingBlog/smartFarming'
import Footer from './landingPage/Footer'
import LandingPageChart from './testCharts/LandingPageChart'
import SignUp from './auth/SignUp'
import SignIn from './auth/SignIn'
import VerifyOtp from './auth/VerifyOtp'
import ForgotPassword from './auth/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import TermsOfService from './legal/TermsOfService'
import PrivacyPolicy from './legal/PrivacyPolicy'

// Supplier portal
import SupplierDashboard from './roles/supplier/SupplierDashboard'
import SupplierProducts from './roles/supplier/SupplierProducts'
import SupplierOrders from './roles/supplier/SupplierOrders'
import { SupplierBuyers, SupplierAnalytics, SupplierSettings } from './roles/supplier/SupplierPlaceholders'

// Admin console
import AdminDashboard from './roles/admin/AdminDashboard'
import AdminUsers from './roles/admin/AdminUsers'
import AdminModeration from './roles/admin/AdminModeration'
import { AdminSuppliers, AdminAnalytics, AdminSettings } from './roles/admin/AdminPlaceholders'

// NGO / Government
import NgoDashboard from './roles/ngo/NgoDashboard'
import NgoPrograms from './roles/ngo/NgoPrograms'
import NgoRegions from './roles/ngo/NgoRegions'
import { NgoFarmers, NgoReports, NgoSettings } from './roles/ngo/NgoPlaceholders'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<PopularServices />} />
        <Route path="/blogs" element={<SmartFarming />} />
        <Route path="/contacts" element={<Footer />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/testCharts" element={<LandingPageChart />} />

        {/* Auth routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/crop-care" element={<ProtectedRoute><CropCare /></ProtectedRoute>} />
        <Route path="/soil-detects" element={<ProtectedRoute><SoilDetects /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/help-and-support" element={<ProtectedRoute><HelpandSupport /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Supplier portal */}
        <Route path="/supplier" element={<ProtectedRoute><SupplierDashboard /></ProtectedRoute>} />
        <Route path="/supplier/products" element={<ProtectedRoute><SupplierProducts /></ProtectedRoute>} />
        <Route path="/supplier/orders" element={<ProtectedRoute><SupplierOrders /></ProtectedRoute>} />
        <Route path="/supplier/buyers" element={<ProtectedRoute><SupplierBuyers /></ProtectedRoute>} />
        <Route path="/supplier/analytics" element={<ProtectedRoute><SupplierAnalytics /></ProtectedRoute>} />
        <Route path="/supplier/settings" element={<ProtectedRoute><SupplierSettings /></ProtectedRoute>} />

        {/* Admin console */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/suppliers" element={<ProtectedRoute><AdminSuppliers /></ProtectedRoute>} />
        <Route path="/admin/moderation" element={<ProtectedRoute><AdminModeration /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

        {/* NGO / Government */}
        <Route path="/ngo" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
        <Route path="/ngo/programs" element={<ProtectedRoute><NgoPrograms /></ProtectedRoute>} />
        <Route path="/ngo/regions" element={<ProtectedRoute><NgoRegions /></ProtectedRoute>} />
        <Route path="/ngo/farmers" element={<ProtectedRoute><NgoFarmers /></ProtectedRoute>} />
        <Route path="/ngo/reports" element={<ProtectedRoute><NgoReports /></ProtectedRoute>} />
        <Route path="/ngo/settings" element={<ProtectedRoute><NgoSettings /></ProtectedRoute>} />

        {/* <Route path="/pricing" element={<PricingPlan />} />  */}
      </Routes>
    </>
  )
}

export default App
