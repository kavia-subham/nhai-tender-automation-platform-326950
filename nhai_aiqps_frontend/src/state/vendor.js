import React, { createContext, useContext, useMemo, useState } from "react";

const VendorContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Vendor portal state provider.
 *
 * Contract:
 *  - activeTenderId: string|null
 *  - setActiveTenderId(id)
 *  - localHistory: array of messages for UI placeholder when backend missing
 */
export function VendorProvider({ children }) {
  // REQ: REQ-002 - Tender selection context scoped to vendor portal (PRD)
  const [activeTenderId, setActiveTenderId] = useState(null);

  // Placeholder history so the chat UI is functional even when backend endpoints are missing.
  // This is explicitly marked as placeholder and should be removed once backend history exists.
  const [localHistory, setLocalHistory] = useState([]);

  const value = useMemo(
    () => ({
      activeTenderId,
      setActiveTenderId,
      localHistory,
      setLocalHistory
    }),
    [activeTenderId, localHistory]
  );

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook for vendor state.
 */
export function useVendor() {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error("useVendor must be used inside VendorProvider");
  return ctx;
}
