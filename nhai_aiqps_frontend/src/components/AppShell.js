import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

function NavItem({ to, label, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      end
      aria-label={label}
    >
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {badge && <span className={`k-badge ${badge.kind || ""}`}>{badge.text}</span>}
    </NavLink>
  );
}

function groupForRole(role) {
  if (role === "admin") {
    return [
      {
        title: "Admin",
        items: [
          { to: "/admin", label: "Dashboard" },
          { to: "/admin/workflows", label: "Workflows" },
          { to: "/admin/audit", label: "Audit Trail" },
          { to: "/admin/analytics", label: "Analytics" },
          { to: "/admin/billing", label: "Usage & Billing" }
        ]
      }
    ];
  }
  return [
    {
      title: "Vendor",
      items: [
        { to: "/vendor", label: "Dashboard" },
        { to: "/vendor/tenders", label: "Tender Selection" },
        { to: "/vendor/chat", label: "Tender Chat", badge: { text: "STT", kind: "k-badge-success" } },
        { to: "/vendor/history", label: "History & Dedupe" },
        { to: "/vendor/insights", label: "AI Insights" }
      ]
    }
  ];
}

/**
 * PUBLIC_INTERFACE
 * Main application shell that provides:
 * - responsive two-pane layout patterns inside pages
 * - top bar with user context
 * - collapsible sidebar navigation
 *
 * REQ: REQ-016 - Two-pane layout with collapsible sidebar and top bar (style guide).
 */
export default function AppShell() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.portalRole || (location.pathname.startsWith("/admin") ? "admin" : "vendor");
  const navGroups = useMemo(() => groupForRole(role), [role]);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar" aria-label="Sidebar navigation">
        <div className="brand" style={{ padding: "6px 10px 12px" }}>
          <span className="brand-badge" aria-hidden="true" />
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontSize: 14 }}>NHAI AIQPS</span>
            <span className="k-muted" style={{ fontSize: 12, fontWeight: 650 }}>
              {role === "admin" ? "Admin Portal" : "Vendor Portal"}
            </span>
          </div>
        </div>

        {navGroups.map((g) => (
          <div key={g.title} style={{ marginBottom: 10 }}>
            <div className="nav-group-title">{g.title}</div>
            {g.items.map((it) => (
              <NavItem key={it.to} to={it.to} label={it.label} badge={it.badge} />
            ))}
          </div>
        ))}

        <div style={{ marginTop: 12 }} className="k-divider" />
        <div style={{ padding: 10 }}>
          <button className="k-btn k-btn-ghost" type="button" onClick={() => logout().then(() => navigate("/login"))}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar" role="banner">
          <button className="k-btn" type="button" onClick={() => setCollapsed((v) => !v)} aria-label="Toggle sidebar">
            {collapsed ? "☰" : "⟨⟩"}
          </button>

          <div className="k-spacer" />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="k-badge k-badge-primary">{role === "admin" ? "Admin" : "Vendor"}</span>
            <div style={{ textAlign: "right", lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 750 }}>{user?.email || "Anonymous"}</div>
              <div className="k-muted" style={{ fontSize: 12 }}>
                Session: {user ? "active" : "none"}
              </div>
            </div>
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.22)"
              }}
            />
          </div>
        </header>

        <main className="main" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
