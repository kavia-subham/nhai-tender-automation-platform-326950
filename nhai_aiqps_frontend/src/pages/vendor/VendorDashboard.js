import React from "react";
import { Card, EmptyState } from "../../components/ui";
import { useVendor } from "../../state/vendor";

/**
 * PUBLIC_INTERFACE
 * Vendor dashboard.
 *
 * REQ: REQ-009 - Analytics dashboards (vendor-facing summaries) (PRD - analytics).
 */
export default function VendorDashboard() {
  const { activeTenderId } = useVendor();

  return (
    <div className="k-col">
      <Card title="Vendor Dashboard" subtitle="Your tender context, activity, and quick actions.">
        <div className="k-grid-2">
          <div className="k-card" style={{ padding: 14 }}>
            <div className="k-muted" style={{ fontSize: 12, fontWeight: 800 }}>
              Active Tender
            </div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>{activeTenderId || "None selected"}</div>
            <div className="k-muted" style={{ fontSize: 13, marginTop: 6 }}>
              Select a tender to scope chat history, dedupe, and insights.
            </div>
          </div>
          <div className="k-card" style={{ padding: 14 }}>
            <div className="k-muted" style={{ fontSize: 12, fontWeight: 800 }}>
              Quick Tips
            </div>
            <ul style={{ margin: "8px 0 0", paddingLeft: 16, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
              <li>Ask clause-specific questions for better traceability.</li>
              <li>Use speech-to-text when in meetings or quick scans.</li>
              <li>Review insights for missing information before submission.</li>
            </ul>
          </div>
        </div>
      </Card>

      <EmptyState
        title="Next: Select a tender and start querying"
        description="Tender listing and ingestion are planned. The portal already provides the full workflow surface with placeholders."
      />
    </div>
  );
}
