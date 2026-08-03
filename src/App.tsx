import { Navigate, Route, Routes } from 'react-router-dom'
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
import { routes } from './lib/routes'

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
    <Routes>
      {/* Public */}
      <Route path={routes.home} element={<LandingPage />} />
      <Route path={routes.about} element={<AboutPage />} />
      <Route path={routes.services} element={<PopularServices />} />
      <Route path={routes.blog} element={<SmartFarming />} />
      <Route path={routes.contact} element={<Footer />} />
      <Route path="/testCharts" element={<LandingPageChart />} />

      {/* Legal */}
      <Route path={routes.legal.terms} element={<TermsOfService />} />
      <Route path={routes.legal.privacy} element={<PrivacyPolicy />} />

      {/* Auth */}
      <Route path={routes.auth.login} element={<SignIn />} />
      <Route path={routes.auth.register} element={<SignUp />} />
      <Route path={routes.auth.verifyOtp} element={<VerifyOtp />} />
      <Route path={routes.auth.forgotPassword} element={<ForgotPassword />} />

      {/* Farmer app */}
      <Route path={routes.app.root} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={routes.app.cropCare} element={<ProtectedRoute><CropCare /></ProtectedRoute>} />
      <Route path={routes.app.soil} element={<ProtectedRoute><SoilDetects /></ProtectedRoute>} />
      <Route path={routes.app.weather} element={<ProtectedRoute><Weather /></ProtectedRoute>} />
      <Route path={routes.app.analytics} element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path={routes.app.community} element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path={routes.app.help} element={<ProtectedRoute><HelpandSupport /></ProtectedRoute>} />
      <Route path={routes.app.settings} element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Supplier portal */}
      <Route path={routes.supplier.root} element={<ProtectedRoute><SupplierDashboard /></ProtectedRoute>} />
      <Route path={routes.supplier.products} element={<ProtectedRoute><SupplierProducts /></ProtectedRoute>} />
      <Route path={routes.supplier.orders} element={<ProtectedRoute><SupplierOrders /></ProtectedRoute>} />
      <Route path={routes.supplier.buyers} element={<ProtectedRoute><SupplierBuyers /></ProtectedRoute>} />
      <Route path={routes.supplier.analytics} element={<ProtectedRoute><SupplierAnalytics /></ProtectedRoute>} />
      <Route path={routes.supplier.settings} element={<ProtectedRoute><SupplierSettings /></ProtectedRoute>} />

      {/* Admin console */}
      <Route path={routes.admin.root} element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path={routes.admin.users} element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path={routes.admin.suppliers} element={<ProtectedRoute><AdminSuppliers /></ProtectedRoute>} />
      <Route path={routes.admin.moderation} element={<ProtectedRoute><AdminModeration /></ProtectedRoute>} />
      <Route path={routes.admin.analytics} element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
      <Route path={routes.admin.settings} element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

      {/* NGO / Government */}
      <Route path={routes.ngo.root} element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
      <Route path={routes.ngo.programs} element={<ProtectedRoute><NgoPrograms /></ProtectedRoute>} />
      <Route path={routes.ngo.regions} element={<ProtectedRoute><NgoRegions /></ProtectedRoute>} />
      <Route path={routes.ngo.farmers} element={<ProtectedRoute><NgoFarmers /></ProtectedRoute>} />
      <Route path={routes.ngo.reports} element={<ProtectedRoute><NgoReports /></ProtectedRoute>} />
      <Route path={routes.ngo.settings} element={<ProtectedRoute><NgoSettings /></ProtectedRoute>} />

      {/* Legacy redirects — keep old bookmarks working */}
      <Route path="/signin" element={<Navigate to={routes.auth.login} replace />} />
      <Route path="/signup" element={<Navigate to={routes.auth.register} replace />} />
      <Route path="/verify-otp" element={<Navigate to={routes.auth.verifyOtp} replace />} />
      <Route path="/forgot-password" element={<Navigate to={routes.auth.forgotPassword} replace />} />
      <Route path="/terms" element={<Navigate to={routes.legal.terms} replace />} />
      <Route path="/privacy" element={<Navigate to={routes.legal.privacy} replace />} />
      <Route path="/blogs" element={<Navigate to={routes.blog} replace />} />
      <Route path="/contacts" element={<Navigate to={routes.contact} replace />} />
      <Route path="/dashboard" element={<Navigate to={routes.app.root} replace />} />
      <Route path="/crop-care" element={<Navigate to={routes.app.cropCare} replace />} />
      <Route path="/soil-detects" element={<Navigate to={routes.app.soil} replace />} />
      <Route path="/weather" element={<Navigate to={routes.app.weather} replace />} />
      <Route path="/analytics" element={<Navigate to={routes.app.analytics} replace />} />
      <Route path="/community" element={<Navigate to={routes.app.community} replace />} />
      <Route path="/help-and-support" element={<Navigate to={routes.app.help} replace />} />
      <Route path="/settings" element={<Navigate to={routes.app.settings} replace />} />
    </Routes>
  )
}

export default App
