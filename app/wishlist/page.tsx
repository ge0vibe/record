"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WishlistCard from "@/components/WishlistCard";
import { WishlistItem } from "@/lib/types";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this from your wishlist?")) return;
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = items.filter(
    (i) =>
      !search ||
      i.artist.toLowerCase().includes(search.toLowerCase()) ||
      i.album.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Wishlist</h1>
          <p className="text-zinc-400 mt-1">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/add-wishlist"
          className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Add to Wishlist
        </Link>
      </div>

      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artist or album..."
          className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
              <div className="aspect-square bg-zinc-800" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-zinc-800 rounded" />
                <div className="h-3 bg-zinc-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-zinc-400 text-lg">
            {items.length === 0 ? "Your wishlist is empty." : "No items match your search."}
          </p>
          {items.length === 0 && (
            <Link href="/add-wishlist" className="mt-4 inline-block bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-lg transition-colors">
              Add your first wishlist item
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <WishlistCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
