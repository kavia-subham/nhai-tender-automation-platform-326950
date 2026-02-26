import { apiRequest } from "./client";

/**
 * Placeholder helper: provides a stable contract while backend endpoints are not yet implemented.
 */
function notImplemented(name) {
  const err = new Error(`${name} is not implemented by backend yet.`);
  err.name = "NotImplementedError";
  return Promise.reject(err);
}

/**
 * PUBLIC_INTERFACE
 * NHAI AIQPS API wrapper.
 *
 * Contract:
 *  - Each method returns a Promise resolving to a JSON object (or throws).
 *  - Methods that are not backed by the current backend return NotImplementedError.
 *
 * REQ: REQ-015 - Wire UI to backend REST endpoints with placeholders.
 */
export const nhaiApi = {
  // REQ: REQ-015 - health endpoint wiring based on OpenAPI evidence
  async health() {
    const res = await apiRequest("GET", "/");
    return res.data;
  },

  // --- Auth (planned) ---
  // REQ: REQ-001 - Vendor registration/login with MFA (PRD)
  registerVendor: async (_payload) => notImplemented("registerVendor"),
  login: async (_payload) => notImplemented("login"),
  beginMfa: async (_payload) => notImplemented("beginMfa"),
  verifyMfa: async (_payload) => notImplemented("verifyMfa"),
  logout: async () => Promise.resolve({ ok: true }),

  // --- Vendor portal (planned) ---
  // REQ: REQ-002 - Select NHAI tender/RFP as active context (PRD)
  listTenders: async () => notImplemented("listTenders"),
  setActiveTender: async (_tenderId) => notImplemented("setActiveTender"),

  // REQ: REQ-003 - Chat via text + speech-to-text (PRD)
  createConversation: async (_tenderId) => notImplemented("createConversation"),
  sendMessage: async (_conversationId, _message) => notImplemented("sendMessage"),
  getHistory: async (_tenderId) => notImplemented("getHistory"),

  // REQ: REQ-004 - Dedupe and categorization (PRD)
  getDedupeAndCategories: async (_tenderId) => notImplemented("getDedupeAndCategories"),

  // REQ: REQ-005 - AI insights (missing info/anomalies/clarifications) (PRD)
  getInsights: async (_tenderId) => notImplemented("getInsights"),

  // --- Admin portal (planned) ---
  // REQ: REQ-006 - RBAC workflows/audit/versioning/approval/publish (PRD)
  listWorkflows: async () => notImplemented("listWorkflows"),
  updateWorkflowState: async (_workflowId, _state) => notImplemented("updateWorkflowState"),
  getAuditLog: async () => notImplemented("getAuditLog"),

  // REQ: REQ-007 - Clause-by-clause conformance checks (PRD)
  runConformanceCheck: async (_payload) => notImplemented("runConformanceCheck"),

  // REQ: REQ-008 - Corrigendum generation with approvals (PRD)
  generateCorrigendum: async (_payload) => notImplemented("generateCorrigendum"),

  // --- Analytics & billing (planned) ---
  // REQ: REQ-009 - Analytics dashboards (PRD)
  getAnalytics: async () => notImplemented("getAnalytics"),

  // REQ: REQ-010 - Usage tracking and billing reporting (PRD)
  getBillingSummary: async () => notImplemented("getBillingSummary")
};
