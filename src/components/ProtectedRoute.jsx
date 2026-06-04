import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSetup } from '../context/SetupContext';

const STEP_ROUTES = [
  '/setup/profile',       // Step 1
  '/setup/verification',  // Step 2
  '/setup/team',          // Step 3
  '/setup/integrations',  // Step 4
  '/setup/preferences'    // Step 5
];

export default function ProtectedRoute({ children }) {
  const { setupState } = useSetup();
  const location = useLocation();

  // Find index of current route
  const currentStepIndex = STEP_ROUTES.indexOf(location.pathname);
  
  // If we are on a setup route, check if we are allowed to be here
  if (currentStepIndex !== -1) {
    // You can access any step up to highestStepCompleted + 1
    // (e.g., if highest completed is 0, you can access index 0. If 1, you can access index 1)
    const allowedMaxStepIndex = setupState.highestStepCompleted;
    
    if (currentStepIndex > allowedMaxStepIndex) {
      // Redirect to the highest allowed step they haven't completed yet
      const redirectPath = STEP_ROUTES[allowedMaxStepIndex] || STEP_ROUTES[0];
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
}
