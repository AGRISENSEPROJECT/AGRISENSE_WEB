import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RolePicker from "./pages/RolePicker.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Inventory from "./pages/Inventory.jsx";
import Deliveries from "./pages/Deliveries.jsx";
import Analytics from "./pages/Analytics.jsx";
import Buyers from "./pages/Buyers.jsx";
import Help from "./pages/Help.jsx";
import Settings from "./pages/Settings.jsx";

import GovDashboard from "./pages/gov/GovDashboard.jsx";
import Regions from "./pages/gov/Regions.jsx";
import Subsidies from "./pages/gov/Subsidies.jsx";
import Registry from "./pages/gov/Registry.jsx";
import Reports from "./pages/gov/Reports.jsx";

import NgoDashboard from "./pages/ngo/NgoDashboard.jsx";
import Programs from "./pages/ngo/Programs.jsx";
import Beneficiaries from "./pages/ngo/Beneficiaries.jsx";
import Distributions from "./pages/ngo/Distributions.jsx";
import Funding from "./pages/ngo/Funding.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RolePicker />} />

      <Route element={<Layout />}>
        {/* Supplier portal */}
        <Route path="/supplier" element={<Navigate to="/supplier/dashboard" replace />} />
        <Route path="/supplier/dashboard" element={<Dashboard />} />
        <Route path="/supplier/orders" element={<Orders />} />
        <Route path="/supplier/inventory" element={<Inventory />} />
        <Route path="/supplier/deliveries" element={<Deliveries />} />
        <Route path="/supplier/analytics" element={<Analytics />} />
        <Route path="/supplier/buyers" element={<Buyers />} />
        <Route path="/supplier/help" element={<Help />} />
        <Route path="/supplier/settings" element={<Settings />} />

        {/* Government portal */}
        <Route path="/gov" element={<Navigate to="/gov/dashboard" replace />} />
        <Route path="/gov/dashboard" element={<GovDashboard />} />
        <Route path="/gov/regions" element={<Regions />} />
        <Route path="/gov/subsidies" element={<Subsidies />} />
        <Route path="/gov/registry" element={<Registry />} />
        <Route path="/gov/reports" element={<Reports />} />
        <Route path="/gov/help" element={<Help />} />
        <Route path="/gov/settings" element={<Settings />} />

        {/* NGO portal */}
        <Route path="/ngo" element={<Navigate to="/ngo/dashboard" replace />} />
        <Route path="/ngo/dashboard" element={<NgoDashboard />} />
        <Route path="/ngo/programs" element={<Programs />} />
        <Route path="/ngo/beneficiaries" element={<Beneficiaries />} />
        <Route path="/ngo/distributions" element={<Distributions />} />
        <Route path="/ngo/funding" element={<Funding />} />
        <Route path="/ngo/help" element={<Help />} />
        <Route path="/ngo/settings" element={<Settings />} />

        {/* Legacy supplier URLs */}
        <Route path="/dashboard" element={<Navigate to="/supplier/dashboard" replace />} />
        <Route path="/orders" element={<Navigate to="/supplier/orders" replace />} />
        <Route path="/inventory" element={<Navigate to="/supplier/inventory" replace />} />
        <Route path="/deliveries" element={<Navigate to="/supplier/deliveries" replace />} />
        <Route path="/analytics" element={<Navigate to="/supplier/analytics" replace />} />
        <Route path="/buyers" element={<Navigate to="/supplier/buyers" replace />} />
        <Route path="/help" element={<Navigate to="/supplier/help" replace />} />
        <Route path="/settings" element={<Navigate to="/supplier/settings" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
