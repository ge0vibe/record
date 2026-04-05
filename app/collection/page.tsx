"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RecordCard from "@/components/RecordCard";
import { Record } from "@/lib/types";

export default function CollectionPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

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
      </div>

      {loading ? (
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
