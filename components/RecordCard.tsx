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
