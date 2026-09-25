import { useEffect, useState } from "react";
import { api } from "./api.js";

// Lightweight polling-based notification: counts "New" repair requests so
// staff notice fresh leads without needing a full notifications system.
export function useNewRequestsCount(enabled) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    async function check() {
      try {
        const { repairRequests } = await api.get("/repair-requests");
        if (!cancelled) setCount(repairRequests.filter((r) => r.status === "New").length);
      } catch {
        // Ignore — not worth surfacing an error for a background poll.
      }
    }

    check();
    const interval = setInterval(check, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [enabled]);

  return count;
}
