import React, { useEffect, useState } from "react";
import { Card, InlineNotice } from "../../components/ui";
import { nhaiApi } from "../../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Admin workflows management.
 *
 * REQ: REQ-006 - Draft/review/approval/publish workflows with audit/versioning (PRD).
 */
export default function AdminWorkflowsPage() {
  const [items, setItems] = useState([
    { id: "wf_001", title: "Draft reply for NHAI-RFP-2026-001", state: "draft" },
    { id: "wf_002", title: "Review corrigendum for NHAI-RFP-2026-002", state: "review" }
  ]);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await nhaiApi.listWorkflows();
        if (Array.isArray(res)) setItems(res);
      } catch (e) {
        setNotice("Backend workflow endpoints not implemented yet; showing placeholders.");
      }
    })();
  }, []);

  return (
    <div className="k-col">
      {notice && <InlineNotice title="Placeholder mode">{notice}</InlineNotice>}

      <Card title="Workflows" subtitle="Draft → Review → Approval → Publish.">
        <div className="k-col">
          {items.map((wf) => (
            <div key={wf.id} className="k-card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 900 }}>{wf.title}</div>
                <div className="k-muted" style={{ fontSize: 12 }}>
                  {wf.id}
                </div>
              </div>
              <div className="k-spacer" />
              <span className={`k-badge ${wf.state === "approved" ? "k-badge-success" : "k-badge-primary"}`}>{wf.state}</span>
              <button className="k-btn" type="button" onClick={() => setNotice("State changes are planned (backend).")}>
                Advance
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
