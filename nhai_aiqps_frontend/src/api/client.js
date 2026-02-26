const DEFAULT_TIMEOUT_MS = 20000;

/**
 * Small typed-ish API error that preserves context for debugging.
 */
export class ApiError extends Error {
  constructor(message, { status, url, details }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.details = details;
  }
}

/**
 * Returns the backend base URL.
 *
 * REQ: REQ-015 - Frontend must be wired to backend REST endpoints (work item).
 * Configuration: set REACT_APP_API_BASE_URL in environment.
 */
function getApiBaseUrl() {
  return (process.env.REACT_APP_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");
}

/**
 * Builds a stable request ID for tracing. (Frontend-only, best-effort.)
 */
function makeRequestId() {
  return `fe_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * PUBLIC_INTERFACE
 * Performs an HTTP request to the backend API with:
 * - consistent JSON parsing
 * - timeout
 * - rich error context
 *
 * Contract:
 * Inputs:
 *  - method: "GET" | "POST" | "PUT" | "DELETE"
 *  - path: string (must start with "/")
 *  - options: { token?: string, body?: any, headers?: Record<string,string>, timeoutMs?: number }
 * Outputs:
 *  - { ok: true, data: any, requestId: string } on success
 * Errors:
 *  - throws ApiError with status/url/details on non-2xx
 * Side effects:
 *  - network call
 */
export async function apiRequest(method, path, options = {}) {
  // REQ: REQ-015 - Single canonical API request flow (avoid patchy per-call fetch)
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;
  const requestId = makeRequestId();

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutHandle = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
      ...(options.headers || {})
    };
    if (options.token) headers.Authorization = `Bearer ${options.token}`;

    const resp = await fetch(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    const contentType = resp.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const payload = isJson ? await resp.json().catch(() => ({})) : await resp.text().catch(() => "");
    if (!resp.ok) {
      throw new ApiError(`API request failed: ${resp.status}`, {
        status: resp.status,
        url,
        details: payload
      });
    }

    return { ok: true, data: payload, requestId };
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new ApiError("API request timed out", { status: 0, url, details: { timeoutMs } });
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError("Network error", { status: 0, url, details: { message: err?.message } });
  } finally {
    window.clearTimeout(timeoutHandle);
  }
}
