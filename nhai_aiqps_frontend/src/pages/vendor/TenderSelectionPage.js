import React, { useEffect, useState } from "react";
import { Card, InlineNotice } from "../../components/ui";
import { useVendor } from "../../state/vendor";
import { nhaiApi } from "../../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Tender selection page.
 *
 * REQ: REQ-002 - Selecting an NHAI-published tender/RFP as active context (PRD).
 */
export default function TenderSelectionPage() {
  const { activeTenderId, setActiveTenderId } = useVendor();
  const [tenders, setTenders] = useState([
    { id: "NHAI-RFP-2026-001", title: "Sample Tender (placeholder)", status: "Published" },
    { id: "NHAI-RFP-2026-002", title: "Sample Tender 2 (placeholder)", status: "Published" }
  ]);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    (async () => {
      // Attempt backend list; fallback to placeholders.
      try {
        const res = await nhaiApi.listTenders();
        if (Array.isArray(res)) setTenders(res);
      } catch (e) {
        setNotice("Tender listing endpoint not implemented yet; showing placeholder tenders.");
      }
    })();
  }, []);

  return (
    <div className="k-col">
      {notice && (
        <InlineNotice title="Placeholder mode">
          {notice}
        </InlineNotice>
      )}

      <Card title="Tender Selection" subtitle="Choose an NHAI-published tender to scope all queries and history.">
        <div className="k-col">
          {tenders.map((t) => (
            <button
              key={t.id}
              className={`k-btn ${activeTenderId === t.id ? "k-btn-primary" : ""}`}
              type="button"
              onClick={() => setActiveTenderId(t.id)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
            >
              <span style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 900 }}>{t.title}</div>
                <div className="k-muted" style={{ fontSize: 12 }}>
                  {t.id} • {t.status}
                </div>
              </span>
              <span className="k-badge k-badge-success">Select</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
