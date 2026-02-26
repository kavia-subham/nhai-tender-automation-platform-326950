import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/theme.css";
import "./styles/layout.css";

import { AuthProvider } from "./state/auth";
import { VendorProvider } from "./state/vendor";

import AppShell from "./components/AppShell";
import { RequireAuth } from "./components/RequireAuth";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MfaPage from "./pages/MfaPage";
import NotFoundPage from "./pages/NotFoundPage";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import TenderSelectionPage from "./pages/vendor/TenderSelectionPage";
import VendorChatPage from "./pages/vendor/VendorChatPage";
import VendorHistoryPage from "./pages/vendor/VendorHistoryPage";
import VendorInsightsPage from "./pages/vendor/VendorInsightsPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminWorkflowsPage from "./pages/admin/AdminWorkflowsPage";
import AdminAuditPage from "./pages/admin/AdminAuditPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminBillingPage from "./pages/admin/AdminBillingPage";

/**
 * PUBLIC_INTERFACE
 * Application root.
 *
 * REQ: REQ-016 - Responsive portal layout with sidebar and top bar (style guide).
 * REQ: REQ-015 - Wire UI to backend REST endpoints via centralized API flow.
 */
function App() {
  return (
    <AuthProvider>
      <VendorProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mfa" element={<MfaPage />} />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route path="vendor" element={<VendorDashboard />} />
              <Route path="vendor/tenders" element={<TenderSelectionPage />} />
              <Route path="vendor/chat" element={<VendorChatPage />} />
              <Route path="vendor/history" element={<VendorHistoryPage />} />
              <Route path="vendor/insights" element={<VendorInsightsPage />} />

              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/workflows" element={<AdminWorkflowsPage />} />
              <Route path="admin/audit" element={<AdminAuditPage />} />
              <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="admin/billing" element={<AdminBillingPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </VendorProvider>
    </AuthProvider>
  );
}

export default App;
