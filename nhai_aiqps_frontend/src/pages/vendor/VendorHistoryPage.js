import React, { useEffect, useState } from "react";
import { Card, InlineNotice } from "../../components/ui";
import { useVendor } from "../../state/vendor";
import { nhaiApi } from "../../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Vendor history/dedupe/categorization.
 *
 * REQ: REQ-004 - Deduplicating and categorizing questions (PRD).
 * REQ: REQ-003 - Viewing chat history scoped to tender and user (PRD).
 */
export default function VendorHistoryPage() {
  const { activeTenderId, localHistory } = useVendor();
  const [notice, setNotice] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      if (!activeTenderId) return;
      try {
        const res = await nhaiApi.getDedupeAndCategories(activeTenderId);
        setSummary(res);
      } catch (e) {
        setNotice("Backend dedupe/categorization endpoint not implemented yet; showing local placeholder view.");
      }
    })();
  }, [activeTenderId]);

  return (
    <div className="k-col">
      {notice && <InlineNotice title="Placeholder mode">{notice}</InlineNotice>}

      <Card title="History & Dedupe" subtitle="Chat history, duplicates, and categories for the selected tender.">
        <div className="k-col">
          <div className="k-muted" style={{ fontSize: 13 }}>
            Tender: <strong>{activeTenderId || "None selected"}</strong>
          </div>

          {summary && (
            <InlineNotice kind="success" title="Backend summary">
              <code style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(summary, null, 2)}</code>
            </InlineNotice>
          )}

          <div className="k-card" style={{ padding: 12, background: "var(--surface-2)" }}>
            <div style={{ fontWeight: 900 }}>Local messages (placeholder)</div>
            <div className="k-muted" style={{ fontSize: 13, marginTop: 6 }}>
              These messages are stored only in-browser until backend history endpoints exist.
            </div>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {localHistory
                .filter((m) => m.role === "user")
                .slice(-12)
                .map((m) => (
                  <div key={m.id} style={{ fontSize: 13, color: "var(--text-2)" }}>
                    • {m.text}
                  </div>
                ))}
              {localHistory.length === 0 && <div className="k-muted">No local messages yet.</div>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
