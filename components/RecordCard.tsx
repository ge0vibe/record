"use client";

import { useState } from "react";
import Link from "next/link";
import { Record } from "@/lib/types";
import StarRating from "./StarRating";

interface RecordCardProps {
  record: Record;
  onDelete?: (id: number) => void;
}

export default function RecordCard({ record, onDelete }: RecordCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this record from your collection?")) return;
    setMenuOpen(false);
    await fetch(`/api/records/${record.id}`, { method: "DELETE" });
    onDelete?.(record.id);
  };

  return (
    <div className="relative group">
      <Link href={`/record/${record.id}`}>
        <div className="bg-[#111111] border border-[#1f1f1f] hover:border-[#333333] rounded-xl overflow-hidden transition-[border-color] duration-150 cursor-pointer">
          {/* Artwork */}
          <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
            {record.artworkUrl ? (
              <img
                src={record.artworkUrl}
                alt={`${record.album} by ${record.artist}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl text-[#2a2a2a]">♪</span>
              </div>
            )}
          </div>
          {/* Info */}
          <div className="px-3 pt-2.5 pb-3">
            <p className="text-[#888888] text-[13px] truncate leading-tight">{record.artist}</p>
            <p className="text-[#ededed] text-[15px] font-medium truncate mt-0.5 leading-tight">{record.album}</p>
            {(() => {
              const favCount = record.tracks?.filter((t) => t.isFavourite).length ?? 0;
              return (
                <div className={`flex items-center gap-1 mt-2 mb-0.5 ${favCount === 0 ? "invisible" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#f97316" style={{ filter: "drop-shadow(0 0 4px rgba(249,115,22,0.5))" }}>
                    <path d="M12 2c-2.5 5.5-5 8-5 11a5 5 0 0010 0c0-3-2.5-5.5-5-11zm0 14.5A2.5 2.5 0 019.5 14c0-1.3.8-2.5 2.5-4.5 1.7 2 2.5 3.2 2.5 4.5A2.5 2.5 0 0112 16.5z" />
                  </svg>
                  <span className="text-[11px] text-[#f97316]">{favCount}</span>
                </div>
              );
            })()}
          <div className="flex items-center justify-between mt-2.5">
              <StarRating value={record.starRating} readonly size="sm" />
              <button
                onClick={(e) => {
                  e.preventDefault();
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
      </Link>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute bottom-12 right-2 z-20 bg-[#1a1a1a] border border-[#333333] rounded-lg shadow-2xl overflow-hidden min-w-[120px]">
            <Link
              href={`/record/${record.id}/edit`}
              className="block px-4 py-2.5 text-sm text-[#ededed] hover:bg-[#222222] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#222222] transition-colors"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
