"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ background: "#0a0a0a", color: "#ededed", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.1 }}>⚠</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Something went wrong</h2>
          <p style={{ color: "#666666", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            {error.message || "A critical error occurred."}
          </p>
          <button
            onClick={reset}
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", border: "none", borderRadius: "10px", color: "#fff", padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 500 }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
