import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { nhaiApi } from "../api/nhaiApi";

const AuthContext = createContext(null);

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const STORAGE_KEY = "nhai_aiqps_auth";

/**
 * PUBLIC_INTERFACE
 * Provider for authentication and role context.
 *
 * Contract:
 *  - loginFlow({email, password}) -> sets state to "mfa_required" or "authenticated"
 *  - verifyMfaFlow({code}) -> sets "authenticated"
 *  - logout() clears local session
 *
 * Errors:
 *  - Propagates backend/NotImplemented errors to UI.
 */
export function AuthProvider({ children }) {
  // REQ: REQ-001 - Registration/login with MFA (PRD)
  const [session, setSession] = useState(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return safeParse(raw) || { status: "anonymous", token: null, user: null };
  });

  function persist(next) {
    setSession(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const loginFlow = useCallback(
    async ({ email, password, portalRole }) => {
      // REQ: REQ-001 - Login flow is single entrypoint (avoid ad-hoc login calls)
      // portalRole: "vendor" | "admin" determines initial landing.
      const res = await nhaiApi.login({ email, password, portalRole });
      // Expected shape (planned): { status: "mfa_required"|"ok", token?, user? }
      if (res?.status === "mfa_required") {
        persist({ status: "mfa_required", token: res.token || null, user: res.user || { email, portalRole } });
        return { next: "mfa" };
      }
      persist({
        status: "authenticated",
        token: res.token || "placeholder-token",
        user: res.user || { email, portalRole }
      });
      return { next: "app" };
    },
    []
  );

  const verifyMfaFlow = useCallback(
    async ({ code }) => {
      // REQ: REQ-001 - MFA verification flow
      const res = await nhaiApi.verifyMfa({ code });
      persist({
        status: "authenticated",
        token: res?.token || session.token || "placeholder-token",
        user: res?.user || session.user
      });
      return { ok: true };
    },
    [session.token, session.user]
  );

  const logout = useCallback(async () => {
    await nhaiApi.logout().catch(() => {});
    persist({ status: "anonymous", token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      session,
      token: session.token,
      user: session.user,
      isAuthenticated: session.status === "authenticated",
      isMfaRequired: session.status === "mfa_required",
      loginFlow,
      verifyMfaFlow,
      logout
    }),
    [session, loginFlow, verifyMfaFlow, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access auth context.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
