import React from "react";
import { Card, EmptyState, InlineNotice } from "../../components/ui";

/**
 * PUBLIC_INTERFACE
 * Admin dashboard.
 *
 * REQ: REQ-006 - Admin portal with RBAC workflows and audit/versioning/approval (PRD).
 * REQ: REQ-009 - Analytics dashboards (PRD).
 */
export default function AdminDashboard() {
  return (
    <div className="k-col">
      <Card title="Admin Dashboard" subtitle="Workflows, approvals, audit, and operational analytics.">
        <InlineNotice title="RBAC note">
          RBAC enforcement is planned for backend. This UI is role-aware (admin/vendor) and provides module surfaces for
          workflow and audit operations.
        </InlineNotice>
      </Card>

      <EmptyState
        title="Admin capabilities are scaffolded"
        description="Workflows, audit trail, conformance checks, corrigendum generation, analytics and billing panels are ready for backend wiring."
      />
    </div>
  );
}
