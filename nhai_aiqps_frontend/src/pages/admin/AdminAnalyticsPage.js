import React, { useEffect, useState } from "react";
import { Card, InlineNotice } from "../../components/ui";
import { nhaiApi } from "../../api/nhaiApi";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

/**
 * PUBLIC_INTERFACE
 * Admin analytics dashboard.
 *
 * REQ: REQ-009 - Analytics dashboards for usage/tender activity/workflow throughput (PRD).
 */
export default function AdminAnalyticsPage() {
  const [notice, setNotice] = useState(null);
  const [data, setData] = useState([
    { name: "Mon", chats: 12 },
    { name: "Tue", chats: 18 },
    { name: "Wed", chats: 9 },
    { name: "Thu", chats: 22 },
    { name: "Fri", chats: 17 }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await nhaiApi.getAnalytics();
        if (Array.isArray(res)) setData(res);
      } catch (e) {
        setNotice("Backend analytics endpoints not implemented yet; showing placeholder chart.");
      }
    })();
  }, []);

  return (
    <div className="k-col">
      {notice && <InlineNotice title="Placeholder mode">{notice}</InlineNotice>}

      <Card title="Analytics" subtitle="Usage, tender activity, and workflow throughput.">
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="chats" stroke="var(--primary)" fill="rgba(59,130,246,0.18)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
