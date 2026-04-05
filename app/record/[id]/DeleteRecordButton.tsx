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
      className="flex-1 bg-red-900 hover:bg-red-800 text-white font-medium py-2.5 rounded-lg transition-colors"
    >
      Delete
    </button>
  );
}
