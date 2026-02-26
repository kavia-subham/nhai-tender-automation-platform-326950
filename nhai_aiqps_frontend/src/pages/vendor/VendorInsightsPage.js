import React, { useEffect, useState } from "react";
import { Card, InlineNotice } from "../../components/ui";
import { useVendor } from "../../state/vendor";
import { nhaiApi } from "../../api/nhaiApi";

/**
 * PUBLIC_INTERFACE
 * Vendor AI insights page.
 *
 * REQ: REQ-005 - AI-derived insights (missing info/anomalies/clarifications) (PRD).
 */
export default function VendorInsightsPage() {
  const { activeTenderId } = useVendor();
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    (async () => {
      if (!activeTenderId) return;
      setNotice(null);
      try {
        const res = await nhaiApi.getInsights(activeTenderId);
        setData(res);
      } catch (e) {
        setNotice("Backend insights endpoint not implemented yet; showing placeholder insights.");
        setData({
          missingInfo: ["Bid security details unclear", "Clarify lane closure schedule"],
          anomalies: ["Conflicting deadlines found in two sections (placeholder)"],
          clarifications: ["Confirm whether JV partners need separate EMD documents"]
        });
      }
    })();
  }, [activeTenderId]);

  return (
    <div className="k-col">
      {notice && <InlineNotice title="Placeholder mode">{notice}</InlineNotice>}

      <Card title="AI Insights" subtitle="Missing information, anomalies, and suggested clarifications.">
        {!activeTenderId && <InlineNotice title="Select a tender first">Go to Tender Selection to choose context.</InlineNotice>}

        {activeTenderId && data && (
          <div className="k-grid-2">
            <div className="k-card" style={{ padding: 14 }}>
              <div style={{ fontWeight: 900 }}>Missing info</div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
                {data.missingInfo?.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="k-card" style={{ padding: 14 }}>
              <div style={{ fontWeight: 900 }}>Anomalies</div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
                {data.anomalies?.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="k-card" style={{ padding: 14 }}>
              <div style={{ fontWeight: 900 }}>Suggested clarifications</div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
                {data.clarifications?.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
