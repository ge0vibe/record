"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-5xl mb-4 text-[rgba(255,255,255,0.08)]">⚠</div>
      <h2 className="text-[#ededed] text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-[#666666] text-sm mb-6">{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset} className="btn-primary px-5 py-2 text-sm">
        Try again
      </button>
    </div>
  );
}
