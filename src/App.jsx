import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Providers
import { SetupProvider } from './context/SetupContext';
import { CartProvider } from './context/CartContext';

// Components
import SetupLayout from './components/SetupLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import MarketplaceLayout from './components/MarketplaceLayout';
import AdminLayout from './components/AdminLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import ProfileSetup from './pages/setup/ProfileSetup';
import BusinessVerification from './pages/setup/BusinessVerification';
import TeamAccess from './pages/setup/TeamAccess';
import Preferences from './pages/setup/Preferences';
import Integrations from './pages/setup/Integrations';
import ActiveRoute from './pages/ActiveRoute';

// Admin Pages
import AdminDashboardOverview from './pages/dashboard/AdminDashboardOverview';
import AdminShipments from './pages/dashboard/AdminShipments';
import AdminInventory from './pages/dashboard/AdminInventory';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Inventory from './pages/dashboard/Inventory';
import Orders from './pages/dashboard/Orders';
import Analytics from './pages/dashboard/Analytics';
import Compliance from './pages/dashboard/Compliance';
import Support from './pages/dashboard/Support';

// Marketplace Pages
import MarketplaceHome from './pages/marketplace/MarketplaceHome';
import Suppliers from './pages/marketplace/Suppliers';
import Logistics from './pages/marketplace/Logistics';
import MarketplaceAnalytics from './pages/marketplace/MarketplaceAnalytics';
import MarketplaceShipments from './pages/marketplace/MarketplaceShipments';
import MarketplaceInventory from './pages/marketplace/MarketplaceInventory';

function App() {
  return (
    <HelmetProvider>
      <SetupProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Setup Routes */}
              <Route element={<SetupLayout />}>
                <Route path="/setup/profile" element={
                  <ProtectedRoute><ProfileSetup /></ProtectedRoute>
                } />
                <Route path="/setup/verification" element={
                  <ProtectedRoute><BusinessVerification /></ProtectedRoute>
                } />
                <Route path="/setup/team" element={
                  <ProtectedRoute><TeamAccess /></ProtectedRoute>
                } />
                <Route path="/setup/integrations" element={
                  <ProtectedRoute><Integrations /></ProtectedRoute>
                } />
                <Route path="/setup/preferences" element={
                  <ProtectedRoute><Preferences /></ProtectedRoute>
                } />
              </Route>
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="compliance" element={<Compliance />} />
                <Route path="support" element={<Support />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardOverview />} />
                <Route path="shipments" element={<AdminShipments />} />
                <Route path="inventory" element={<AdminInventory />} />
              </Route>

              {/* Marketplace Routes */}
              <Route path="/marketplace" element={<MarketplaceLayout />}>
                <Route index element={<MarketplaceHome />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="logistics" element={<Logistics />} />
                <Route path="shipments" element={<MarketplaceShipments />} />
                <Route path="inventory" element={<MarketplaceInventory />} />
                <Route path="analytics" element={<MarketplaceAnalytics />} />
              </Route>

              {/* Other */}
              <Route path="/route-scanner" element={<ActiveRoute />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </SetupProvider>
    </HelmetProvider>
  );
}

export default App;
