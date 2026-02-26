import React from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";

/**
 * PUBLIC_INTERFACE
 * Fallback route.
 */
export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 14px" }}>
      <EmptyState
        title="Page not found"
        description="The page you requested does not exist."
        action={
          <Link className="k-btn k-btn-primary" to="/login">
            Go to login
          </Link>
        }
      />
    </div>
  );
}
