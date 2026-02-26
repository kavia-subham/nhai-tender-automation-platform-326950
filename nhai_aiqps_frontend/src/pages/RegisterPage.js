import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, InlineNotice } from "../components/ui";
import { nhaiApi } from "../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Vendor registration.
 *
 * REQ: REQ-001 - Vendor registration (PRD).
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("vendor@example.com");
  const [company, setCompany] = useState("Example Infra Pvt Ltd");
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);
    try {
      await nhaiApi.registerVendor({ email, company });
      setOk(true);
      window.setTimeout(() => navigate("/login"), 600);
    } catch (e2) {
      setError(e2?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 14px" }}>
      {error && (
        <div style={{ marginBottom: 12 }}>
          <InlineNotice kind="danger" title="Registration failed">
            {error}
          </InlineNotice>
        </div>
      )}
      {ok && (
        <div style={{ marginBottom: 12 }}>
          <InlineNotice kind="success" title="Registered (placeholder)">
            Vendor registration endpoint is planned. Redirecting to login…
          </InlineNotice>
        </div>
      )}
      <Card title="Vendor registration" subtitle="Create a vendor account. MFA enrollment will be available after sign-in.">
        <form onSubmit={onSubmit} className="k-col">
          <label style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
            Company
            <input className="k-input" value={company} onChange={(e) => setCompany(e.target.value)} style={{ marginTop: 6 }} />
          </label>
          <label style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
            Email
            <input className="k-input" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: 6 }} />
          </label>

          <button className="k-btn k-btn-primary" type="submit" disabled={loading}>
            {loading ? "Submitting…" : "Register"}
          </button>

          <div className="k-muted" style={{ fontSize: 13 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
