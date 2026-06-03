import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import SetupLayout from './components/SetupLayout';
import Login from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import ProfileSetup from './pages/setup/ProfileSetup';
import BusinessVerification from './pages/setup/BusinessVerification';
import TeamAccess from './pages/setup/TeamAccess';
import Preferences from './pages/setup/Preferences';
import Integrations from './pages/setup/Integrations';
import SupplierDashboard from './pages/SupplierDashboard';
import Marketplace from './pages/Marketplace';
import ActiveRoute from './pages/ActiveRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Setup Routes */}
        <Route element={<SetupLayout />}>
          <Route path="/setup/profile" element={<ProfileSetup />} />
          <Route path="/setup/verification" element={<BusinessVerification />} />
          <Route path="/setup/team" element={<TeamAccess />} />
          <Route path="/setup/integrations" element={<Integrations />} />
          <Route path="/setup/preferences" element={<Preferences />} />
        </Route>
        
        {/* Main App Routes */}
        <Route path="/dashboard" element={<SupplierDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/route-scanner" element={<ActiveRoute />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
