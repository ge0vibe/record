"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WishlistCard from "@/components/WishlistCard";
import StarRating from "@/components/StarRating";
import { WishlistItem } from "@/lib/types";

type ViewMode = "grid" | "list";

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
    </svg>
  );
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); });
  }, []);

  const handleDelete = async (id: number) => {
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
    <div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Fixed header */}
      <div className="shrink-0 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#ededed]">Wishlist</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-[#1f1f1f] rounded-full px-3 py-1 text-xs">
                <span className="text-[#888888]">Items </span>
                <span className="text-[#ededed] font-medium">{items.length}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex border border-[#1f1f1f] rounded-lg overflow-hidden">
              <button
                onClick={() => setView("grid")}
                title="Grid view"
                className={`px-3 py-2 transition-colors ${
                  view === "grid" ? "bg-[#1f1f1f] text-[#ededed]" : "bg-transparent text-[#888888] hover:text-[#ededed]"
                }`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setView("list")}
                title="List view"
                className={`px-3 py-2 transition-colors ${
                  view === "list" ? "bg-[#1f1f1f] text-[#ededed]" : "bg-transparent text-[#888888] hover:text-[#ededed]"
                }`}
              >
                <ListIcon />
              </button>
            </div>
            <Link
              href="/add-wishlist"
              className="bg-[#a855f7] hover:bg-[#9333ea] text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              + Add
            </Link>
          </div>
        </div>
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artist or album..."
            className="w-full max-w-sm bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-2 text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#a855f7] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      {/* Loading */}
      {loading ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#111111] rounded-xl overflow-hidden border border-[#1f1f1f] animate-pulse">
                <div className="aspect-square bg-[#1a1a1a]" />
                <div className="px-3 pt-2.5 pb-3 space-y-2">
                  <div className="h-3 bg-[#1a1a1a] rounded w-2/3" />
                  <div className="h-4 bg-[#1a1a1a] rounded" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i !== 0 ? "border-t border-[#1f1f1f]" : ""}`}>
                <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#1a1a1a] rounded w-1/3" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4 text-[#2a2a2a]">♪</div>
          <p className="text-[#888888] text-lg">
            {items.length === 0 ? "Your wishlist is empty." : "No items match your search."}
          </p>
          {items.length === 0 && (
            <Link
              href="/add-wishlist"
              className="mt-4 inline-block bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-2.5 rounded-lg transition-colors"
            >
              Add your first wishlist item
            </Link>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <WishlistCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-3.5 ${i !== 0 ? "border-t border-[#1f1f1f]" : ""}`}
            >
              {item.artworkUrl ? (
                <img src={item.artworkUrl} alt={item.album} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#333] shrink-0">♪</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[#ededed] font-medium truncate">{item.album}</p>
                <p className="text-[#888888] text-sm truncate">{item.artist}</p>
              </div>
              {item.genre && (
                <span className="bg-[#1f1f1f] text-[#a855f7] text-[11px] rounded-full px-2 py-0.5 hidden sm:block shrink-0">
                  {item.genre}
                </span>
              )}
              <div className="hidden sm:block shrink-0">
                <StarRating value={item.starRating} readonly size="sm" />
              </div>
              {item.targetPrice != null && (
                <span className="text-[#a855f7] text-sm shrink-0 w-14 text-right">
                  £{item.targetPrice.toFixed(2)}
                </span>
              )}
              <div className="flex gap-1.5 shrink-0">
                <Link
                  href={`/wishlist/${item.id}/edit`}
                  className="px-3 py-1 bg-transparent border border-[#1f1f1f] hover:border-[#333333] text-[#ededed] text-xs rounded-lg transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-red-400 hover:bg-red-950/30 text-xs rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
