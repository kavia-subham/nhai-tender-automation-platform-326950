import React, { useMemo, useState } from "react";
import { Card, InlineNotice, Tabs } from "../../components/ui";
import { useVendor } from "../../state/vendor";
import { nhaiApi } from "../../api/nhaiApi";

function canUseSpeechRecognition() {
  return typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
}

function startSpeechToText({ onResult, onError }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new SR();
  recog.lang = "en-IN";
  recog.interimResults = false;
  recog.maxAlternatives = 1;
  recog.onresult = (evt) => {
    const text = evt.results?.[0]?.[0]?.transcript || "";
    onResult(text);
  };
  recog.onerror = (e) => onError(e);
  recog.start();
  return recog;
}

/**
 * PUBLIC_INTERFACE
 * Vendor chat page (tender Q&A) with STT.
 *
 * REQ: REQ-003 - Ask questions via speech-to-text and text input (PRD).
 * REQ: REQ-016 - Two-pane layout and tabbed interfaces (style guide).
 */
export default function VendorChatPage() {
  const { activeTenderId, localHistory, setLocalHistory } = useVendor();
  const [tab, setTab] = useState("chat");
  const [text, setText] = useState("");
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const sttAvailable = useMemo(() => !!canUseSpeechRecognition(), []);
  const tabs = [
    { key: "chat", label: "Chat" },
    { key: "documents", label: "Document Context" },
    { key: "conformance", label: "Conformance" }
  ];

  async function send() {
    if (!text.trim()) return;
    if (!activeTenderId) {
      setNotice("Please select an active tender first (Tender Selection).");
      return;
    }
    setNotice(null);
    setBusy(true);

    const userMsg = { id: `u_${Date.now()}`, role: "user", text: text.trim(), ts: new Date().toISOString() };
    setLocalHistory((h) => [...h, userMsg]);
    setText("");

    try {
      // Backend planned: sendMessage(conversationId,...); currently not implemented.
      const res = await nhaiApi.sendMessage("placeholder-conversation", userMsg.text);
      setLocalHistory((h) => [
        ...h,
        { id: `a_${Date.now()}`, role: "assistant", text: res?.answer || JSON.stringify(res), ts: new Date().toISOString() }
      ]);
    } catch (e) {
      // Explicit placeholder behavior (not silent).
      setLocalHistory((h) => [
        ...h,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          text:
            "Backend chat endpoint is not implemented yet. This is a UI placeholder response.\n\n" +
            "Suggested next steps:\n" +
            "- Implement /chat endpoints in backend\n" +
            "- Wire conversation IDs and history\n\n" +
            `Error: ${e?.message || "unknown"}`,
          ts: new Date().toISOString()
        }
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="k-col">
      {notice && <InlineNotice title="Action required">{notice}</InlineNotice>}

      <div className="two-pane">
        <Card
          title="Context"
          subtitle="Tender scope, recent messages, and derived signals."
          right={<span className="k-badge k-badge-primary">Tender: {activeTenderId || "None"}</span>}
        >
          <div className="k-col">
            <div className="k-muted" style={{ fontSize: 13 }}>
              Recent messages
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {localHistory.slice(-6).map((m) => (
                <div key={m.id} className="k-card" style={{ padding: 10, background: "var(--surface-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span className={`k-badge ${m.role === "assistant" ? "k-badge-success" : ""}`}>
                      {m.role === "assistant" ? "AI" : "You"}
                    </span>
                    <span className="k-muted" style={{ fontSize: 11 }}>
                      {new Date(m.ts).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, whiteSpace: "pre-wrap", fontSize: 13, color: "var(--text-2)" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {localHistory.length === 0 && <div className="k-muted">No messages yet.</div>}
            </div>
          </div>
        </Card>

        <Card title="Tender Q&A" subtitle="Ask questions via text or speech-to-text.">
          <div className="k-col">
            <Tabs tabs={tabs} activeKey={tab} onChange={setTab} />

            {tab === "chat" && (
              <>
                <div className="k-col">
                  <textarea
                    className="k-input"
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ask a clause-specific question…"
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="k-btn k-btn-primary" type="button" onClick={send} disabled={busy}>
                      {busy ? "Sending…" : "Send"}
                    </button>
                    <button
                      className="k-btn k-btn-success"
                      type="button"
                      disabled={!sttAvailable || busy}
                      onClick={() => {
                        setNotice(null);
                        if (!sttAvailable) return;
                        startSpeechToText({
                          onResult: (t) => setText((prev) => (prev ? `${prev}\n${t}` : t)),
                          onError: (e) => setNotice(`Speech-to-text error: ${e?.error || e?.message || "unknown"}`)
                        });
                      }}
                      aria-label="Start speech-to-text"
                    >
                      {sttAvailable ? "Speech to text" : "STT not supported"}
                    </button>
                    <button className="k-btn" type="button" onClick={() => setLocalHistory([])}>
                      Clear local history
                    </button>
                  </div>
                </div>

                <div className="k-divider" />

                <InlineNotice title="Backend status">
                  Chat endpoints are planned. Once available, this page will stop using local placeholders and instead load
                  conversation IDs and persisted history.
                </InlineNotice>
              </>
            )}

            {tab === "documents" && (
              <InlineNotice title="Document context (planned)">
                Document ingestion for PDF/DOCX/TXT/PPTX and rendering to PDF is not yet implemented by backend. This tab
                is ready to show:
                <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                  <li>Uploaded/ingested docs</li>
                  <li>Extracted sections used as evidence</li>
                  <li>Hyperlink references</li>
                </ul>
              </InlineNotice>
            )}

            {tab === "conformance" && (
              <InlineNotice title="Conformance (planned)">
                Clause-by-clause conformance check against SBD/policies will appear here once backend supports it.
              </InlineNotice>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
