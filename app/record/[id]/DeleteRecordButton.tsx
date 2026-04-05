"use client";

import { useRouter } from "next/navigation";

export default function DeleteRecordButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this record from your collection?")) return;
    await fetch(`/api/records/${id}`, { method: "DELETE" });
    router.push("/collection");
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="flex-1 bg-transparent border border-red-900/50 hover:border-red-700 hover:bg-red-950/30 text-red-400 font-medium py-2.5 rounded-lg transition-colors"
    >
      Delete
    </button>
  );
}
