import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, InlineNotice } from "../components/ui";
import { useAuth } from "../state/auth";

/**
 * PUBLIC_INTERFACE
 * MFA verification page.
 *
 * REQ: REQ-001 - MFA support (PRD).
 */
export default function MfaPage() {
  const { verifyMfaFlow } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyMfaFlow({ code });
      navigate("/vendor", { replace: true });
    } catch (e2) {
      setError(e2?.message || "MFA verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 14px" }}>
      {error && (
        <div style={{ marginBottom: 12 }}>
          <InlineNotice kind="danger" title="Verification failed">
            {error}
          </InlineNotice>
        </div>
      )}
      <Card title="Verify MFA" subtitle="Enter the code from your authenticator. Backend endpoint is planned.">
        <form onSubmit={onSubmit} className="k-col">
          <input className="k-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
          <button className="k-btn k-btn-primary" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          <div className="k-muted" style={{ fontSize: 12 }}>
            Note: This UI is ready; backend MFA endpoints are not yet implemented.
          </div>
        </form>
      </Card>
    </div>
  );
}
