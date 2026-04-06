"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WishlistItem } from "@/lib/types";

interface WishlistCardProps {
  item: WishlistItem;
  onDelete?: (id: number) => void;
}

export default function WishlistCard({ item, onDelete }: WishlistCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [cost, setCost] = useState(item.targetPrice ? String(item.targetPrice) : "");
  const [moving, setMoving] = useState(false);

  const handleMoveToCollection = async () => {
    setMoving(true);
    try {
      await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: item.artist,
          album: item.album,
          year: item.year,
          genre: item.genre,
          artworkUrl: item.artworkUrl,
          notes: item.notes,
          cost: cost ? Number(cost) : null,
          tracklist: item.tracklist ?? undefined,
        }),
      });
      await fetch(`/api/wishlist/${item.id}`, { method: "DELETE" });
      onDelete?.(item.id);
      router.refresh();
    } catch {
      setMoving(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <div className="bg-[#111111] border border-[#1f1f1f] hover:border-[#333333] rounded-xl overflow-hidden transition-[border-color] duration-150">
          {/* Artwork */}
          <div className="aspect-square bg-[#1a1a1a] overflow-hidden relative">
            {item.artworkUrl ? (
              <img
                src={item.artworkUrl}
                alt={`${item.album} by ${item.artist}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl text-[#2a2a2a]">♪</span>
              </div>
            )}
            {item.targetPrice && (
              <div className="absolute bottom-2 left-2 bg-[#0a0a0a]/80 text-[#a855f7] text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium">
                £{item.targetPrice.toFixed(2)}
              </div>
            )}
          </div>
          {/* Info */}
          <div className="px-3 pt-2.5 pb-3">
            <p className="text-[#888888] text-[13px] truncate leading-tight">{item.artist}</p>
            <p className="text-[#ededed] text-[15px] font-medium truncate mt-0.5 leading-tight">{item.album}</p>
            <div className="flex items-center justify-end mt-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="text-[#888888] hover:text-[#ededed] transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-[#1f1f1f] text-base leading-none"
                aria-label="Actions"
              >
                ⋯
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute bottom-12 right-2 z-20 bg-[#1a1a1a] border border-[#333333] rounded-lg shadow-2xl overflow-hidden min-w-[150px]">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowPriceModal(true);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm text-[#a855f7] hover:bg-[#222222] transition-colors"
              >
                Add to Collection
              </button>
              <Link
                href={`/wishlist/${item.id}/edit`}
                className="block px-4 py-2.5 text-sm text-[#ededed] hover:bg-[#222222] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm("Remove from wishlist?")) onDelete(item.id);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#222222] transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h2 className="text-[#ededed] font-semibold text-lg mb-1">Add to Collection</h2>
            <p className="text-[#888888] text-sm mb-5">
              {item.artist} — {item.album}
            </p>
            <label className="block text-sm font-medium text-[#888888] mb-1">Price Paid (£)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-3 py-2 text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#a855f7] transition-colors mb-5"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleMoveToCollection}
                disabled={moving}
                className="flex-1 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                {moving ? "Moving..." : "Add to Collection"}
              </button>
              <button
                onClick={() => setShowPriceModal(false)}
                disabled={moving}
                className="flex-1 bg-transparent border border-[#1f1f1f] hover:border-[#333333] text-[#ededed] font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
