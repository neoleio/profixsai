import { useEffect, useState } from "react";
import { api } from "./api.js";

// Same lightweight polling pattern as useNewRequestsCount, kept as its own
// hook/endpoint so the two notification badges (repair requests vs.
// messages) stay fully independent of each other.
export function useNewMessagesCount(enabled) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    async function check() {
      try {
        const { feedback } = await api.get("/feedback");
        if (!cancelled) setCount(feedback.filter((m) => m.status === "New").length);
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
