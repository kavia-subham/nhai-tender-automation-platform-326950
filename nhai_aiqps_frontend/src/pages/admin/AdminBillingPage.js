import React, { useEffect, useState } from "react";
import { Card, InlineNotice } from "../../components/ui";
import { nhaiApi } from "../../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Admin usage & billing.
 *
 * REQ: REQ-010 - Usage tracking and billing reporting (PRD).
 */
export default function AdminBillingPage() {
  const [notice, setNotice] = useState(null);
  const [summary, setSummary] = useState({ period: "This month", tokens: 120000, chats: 340, documents: 18 });

  useEffect(() => {
    (async () => {
      try {
        const res = await nhaiApi.getBillingSummary();
        if (res) setSummary(res);
      } catch (e) {
        setNotice("Backend billing endpoints not implemented yet; showing placeholder summary.");
      }
    })();
  }, []);

  return (
    <div className="k-col">
      {notice && <InlineNotice title="Placeholder mode">{notice}</InlineNotice>}
      <Card title="Usage & Billing" subtitle="Usage events and billing rollups (reporting/integration points).">
        <div className="k-grid-2">
          <div className="k-card" style={{ padding: 14 }}>
            <div className="k-muted" style={{ fontSize: 12, fontWeight: 800 }}>
              Period
            </div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>{summary.period}</div>
          </div>
          <div className="k-card" style={{ padding: 14 }}>
            <div className="k-muted" style={{ fontSize: 12, fontWeight: 800 }}>
              Chats
            </div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>{summary.chats}</div>
          </div>
          <div className="k-card" style={{ padding: 14 }}>
            <div className="k-muted" style={{ fontSize: 12, fontWeight: 800 }}>
              Tokens (placeholder metric)
            </div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>{summary.tokens.toLocaleString()}</div>
          </div>
          <div className="k-card" style={{ padding: 14 }}>
            <div className="k-muted" style={{ fontSize: 12, fontWeight: 800 }}>
              Documents processed
            </div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>{summary.documents}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
