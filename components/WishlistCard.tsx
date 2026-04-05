"use client";

import { useState } from "react";
import Link from "next/link";
import { WishlistItem } from "@/lib/types";
import StarRating from "./StarRating";

interface WishlistCardProps {
  item: WishlistItem;
  onDelete?: (id: number) => void;
}

export default function WishlistCard({ item, onDelete }: WishlistCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
          <div className="flex items-center justify-between mt-2.5">
            <StarRating value={item.starRating} readonly size="sm" />
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
          <div className="absolute bottom-12 right-2 z-20 bg-[#1a1a1a] border border-[#333333] rounded-lg shadow-2xl overflow-hidden min-w-[120px]">
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
  );
}
