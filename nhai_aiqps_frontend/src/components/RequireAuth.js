import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/auth";

/**
 * PUBLIC_INTERFACE
 * Route guard to require an authenticated session.
 *
 * REQ: REQ-001 - Vendor/admin portals require authenticated access (PRD).
 */
export function RequireAuth({ children }) {
  const { isAuthenticated, isMfaRequired } = useAuth();
  const location = useLocation();

  if (isMfaRequired) return <Navigate to="/mfa" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
