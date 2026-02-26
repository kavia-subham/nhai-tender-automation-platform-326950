import React from "react";

export function Card({ title, subtitle, right, children }) {
  return (
    <section className="k-card">
      {(title || subtitle || right) && (
        <div className="k-card-header" style={{ display: "flex", alignItems: "start", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            {title && <h2 className="k-title">{title}</h2>}
            {subtitle && <p className="k-subtitle">{subtitle}</p>}
          </div>
          <div className="k-spacer" />
          {right}
        </div>
      )}
      <div className="k-card-body">{children}</div>
    </section>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div
      className="k-card"
      style={{
        padding: 18,
        background: "linear-gradient(180deg, rgba(59,130,246,0.06), rgba(255,255,255,1))"
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
        <div
          aria-hidden="true"
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "linear-gradient(135deg, var(--primary), var(--success))",
            boxShadow: "var(--shadow-sm)"
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, letterSpacing: "-0.01em" }}>{title}</div>
          <div className="k-muted" style={{ fontSize: 13, marginTop: 6 }}>
            {description}
          </div>
          {action && <div style={{ marginTop: 12 }}>{action}</div>}
        </div>
      </div>
    </div>
  );
}

export function Tabs({ tabs, activeKey, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`k-btn ${activeKey === t.key ? "k-btn-primary" : ""}`}
          onClick={() => onChange(t.key)}
          aria-current={activeKey === t.key ? "page" : undefined}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function InlineNotice({ kind = "info", title, children }) {
  const bg =
    kind === "success"
      ? "rgba(6,182,212,0.10)"
      : kind === "danger"
        ? "rgba(239,68,68,0.10)"
        : "rgba(59,130,246,0.10)";
  const border =
    kind === "success"
      ? "rgba(6,182,212,0.22)"
      : kind === "danger"
        ? "rgba(239,68,68,0.22)"
        : "rgba(59,130,246,0.22)";

  return (
    <div style={{ padding: 12, borderRadius: 12, background: bg, border: `1px solid ${border}` }}>
      {title && <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>}
      <div style={{ fontSize: 13, color: "var(--text-2)" }}>{children}</div>
    </div>
  );
}
