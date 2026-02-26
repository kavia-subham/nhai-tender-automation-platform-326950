import React, { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../state/auth";
import { Card, InlineNotice } from "../components/ui";
import { nhaiApi } from "../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Login page for vendor/admin.
 *
 * REQ: REQ-001 - Registration/login with MFA (PRD).
 */
export default function LoginPage() {
  const { loginFlow } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [portalRole, setPortalRole] = useState("vendor");
  const [email, setEmail] = useState("vendor@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = useMemo(() => location.state?.from || (portalRole === "admin" ? "/admin" : "/vendor"), [location.state, portalRole]);

  async function checkHealth() {
    setError(null);
    try {
      const res = await nhaiApi.health();
      setHealth(res);
    } catch (e) {
      setError(e?.message || "Health check failed");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginFlow({ email, password, portalRole });
      if (res?.next === "mfa") navigate("/mfa", { replace: true });
      else navigate(from, { replace: true });
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="brand-badge" aria-hidden="true" />
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>NHAI AIQPS</div>
          <div className="k-muted" style={{ fontSize: 13 }}>
            Vendor/Admin Portal (backend currently only exposes health endpoint)
          </div>
        </div>
        <div className="k-spacer" />
        <button type="button" className="k-btn" onClick={checkHealth}>
          Check backend health
        </button>
      </div>

      {health && (
        <InlineNotice kind="success" title="Backend reachable">
          GET / response: <code>{JSON.stringify(health)}</code>
        </InlineNotice>
      )}

      {error && (
        <div style={{ marginTop: 12 }}>
          <InlineNotice kind="danger" title="Action failed">
            {error}
          </InlineNotice>
        </div>
      )}

      <div style={{ marginTop: 12 }} className="k-grid-2">
        <Card
          title="Sign in"
          subtitle="Choose vendor or admin portal and sign in. MFA is scaffolded; backend endpoints are pending."
        >
          <form onSubmit={onSubmit} className="k-col">
            <label style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
              Portal
              <select
                className="k-input"
                value={portalRole}
                onChange={(e) => setPortalRole(e.target.value)}
                style={{ marginTop: 6 }}
              >
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
              Email
              <input className="k-input" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: 6 }} />
            </label>

            <label style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
              Password
              <input
                className="k-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginTop: 6 }}
              />
            </label>

            <button className="k-btn k-btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="k-muted" style={{ fontSize: 13 }}>
              Don’t have an account? <Link to="/register">Register vendor</Link>
            </div>
          </form>
        </Card>

        <Card title="What’s implemented today?" subtitle="You can navigate the portal UI and see placeholders.">
          <ul style={{ margin: 0, paddingLeft: 16, color: "var(--text-2)", fontSize: 13, lineHeight: 1.6 }}>
            <li>App shell with vendor/admin navigation</li>
            <li>Tender selection + chat UI (local placeholder history)</li>
            <li>History/dedupe/categorization & insights placeholders</li>
            <li>Admin workflows/audit/analytics/billing placeholders</li>
            <li>Backend wiring via a single API client flow (health is real; others are NotImplemented)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
