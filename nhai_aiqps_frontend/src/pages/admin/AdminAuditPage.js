import React, { useEffect, useState } from "react";
import { Card, InlineNotice } from "../../components/ui";
import { nhaiApi } from "../../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Admin audit trail.
 *
 * REQ: REQ-006 - Audit trail and version history (PRD).
 */
export default function AdminAuditPage() {
  const [notice, setNotice] = useState(null);
  const [items, setItems] = useState([
    { id: "a_001", at: new Date().toISOString(), who: "admin@example.com", action: "WORKFLOW_CREATED", target: "wf_001" }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await nhaiApi.getAuditLog();
        if (Array.isArray(res)) setItems(res);
      } catch (e) {
        setNotice("Backend audit endpoints not implemented yet; showing placeholder events.");
      }
    })();
  }, []);

  return (
    <div className="k-col">
      {notice && <InlineNotice title="Placeholder mode">{notice}</InlineNotice>}
      <Card title="Audit Trail" subtitle="Immutable events for approvals, publications, and key actions.">
        <div className="k-col">
          {items.map((it) => (
            <div key={it.id} className="k-card" style={{ padding: 12, background: "var(--surface-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span className="k-badge k-badge-primary">{it.action}</span>
                <span className="k-muted" style={{ fontSize: 12 }}>
                  {new Date(it.at).toLocaleString()}
                </span>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-2)" }}>
                <strong>{it.who}</strong> → <code>{it.target}</code>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
