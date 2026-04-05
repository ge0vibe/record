"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RecordCard from "@/components/RecordCard";
import StarRating from "@/components/StarRating";
import { Record } from "@/lib/types";

type ViewMode = "grid" | "list";

export default function CollectionPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    fetch("/api/records")
      .then((r) => r.json())
      .then((data) => { setRecords(data); setLoading(false); });
  }, []);

  const genres = Array.from(new Set(records.map((r) => r.genre).filter(Boolean))) as string[];

  const filtered = records.filter((r) => {
    const matchSearch =
      !search ||
      r.artist.toLowerCase().includes(search.toLowerCase()) ||
      r.album.toLowerCase().includes(search.toLowerCase());
    const matchGenre = !genreFilter || r.genre === genreFilter;
    return matchSearch && matchGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Collection</h1>
          <p className="text-zinc-400 mt-1">{records.length} record{records.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/add-record"
          className="bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Add Record
        </Link>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artist or album..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        {genres.length > 0 && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        )}
        <div className="flex border border-zinc-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setView("grid")}
            title="Grid view"
            className={`px-3 py-2 transition-colors ${view === "grid" ? "bg-zinc-700 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            title="List view"
            className={`px-3 py-2 transition-colors ${view === "list" ? "bg-zinc-700 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
                <div className="aspect-square bg-zinc-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i !== 0 ? "border-t border-zinc-800" : ""}`}>
                <div className="w-10 h-10 rounded bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-zinc-400 text-lg">
            {records.length === 0 ? "No records yet." : "No records match your search."}
          </p>
          {records.length === 0 && (
            <Link href="/add-record" className="mt-4 inline-block bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg transition-colors">
              Add your first record
            </Link>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {filtered.map((record, i) => (
            <Link
              key={record.id}
              href={`/record/${record.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-zinc-800 transition-colors ${i !== 0 ? "border-t border-zinc-800" : ""}`}
            >
              {record.artworkUrl ? (
                <img src={record.artworkUrl} alt={record.album} className="w-10 h-10 rounded object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">♪</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{record.album}</p>
                <p className="text-zinc-400 text-sm truncate">{record.artist}</p>
              </div>
              {record.genre && (
                <span className="text-zinc-500 text-xs hidden sm:block shrink-0">{record.genre}</span>
              )}
              {record.year && (
                <span className="text-zinc-500 text-xs hidden sm:block shrink-0 w-10 text-right">{record.year}</span>
              )}
              <div className="shrink-0">
                <StarRating value={record.starRating} readonly />
              </div>
              {record.cost != null && (
                <span className="text-zinc-400 text-sm shrink-0 w-14 text-right">£{record.cost.toFixed(2)}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
