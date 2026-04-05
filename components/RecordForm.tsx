"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

interface RecordFormProps {
  mode: "record" | "wishlist";
  initialData?: Record<string, unknown>;
  recordId?: number;
}

const GENRES = ["Rock", "Pop", "Jazz", "Classical", "Hip-Hop", "Electronic", "R&B", "Country", "Folk", "Metal", "Punk", "Blues", "Soul", "Reggae", "Latin", "Other"];

export default function RecordForm({ mode, initialData, recordId }: RecordFormProps) {
  const router = useRouter();
  const isEdit = !!recordId;

  const [form, setForm] = useState({
    artist: (initialData?.artist as string) || "",
    album: (initialData?.album as string) || "",
    year: (initialData?.year as string) || "",
    genre: (initialData?.genre as string) || "",
    artworkUrl: (initialData?.artworkUrl as string) || "",
    starRating: (initialData?.starRating as number) || 3,
    favouriteTrack: (initialData?.favouriteTrack as string) || "",
    cost: mode === "record" ? String(initialData?.cost ?? "") : "",
    targetPrice: mode === "wishlist" ? String(initialData?.targetPrice ?? "") : "",
    notes: (initialData?.notes as string) || "",
  });

  const [artworkPreview, setArtworkPreview] = useState((initialData?.artworkUrl as string) || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleArtworkUrlChange = (url: string) => {
    setForm((f) => ({ ...f, artworkUrl: url }));
    setArtworkPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "record"
      ? isEdit ? `/api/records/${recordId}` : "/api/records"
      : isEdit ? `/api/wishlist/${recordId}` : "/api/wishlist";

    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...form,
      year: form.year ? Number(form.year) : null,
      cost: mode === "record" && form.cost ? Number(form.cost) : undefined,
      targetPrice: mode === "wishlist" && form.targetPrice ? Number(form.targetPrice) : undefined,
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();

      if (mode === "record") {
        router.push(`/record/${data.id}`);
      } else {
        router.push("/wishlist");
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Artist *</label>
            <input
              required
              value={form.artist}
              onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. The Beatles"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Album *</label>
            <input
              required
              value={form.album}
              onChange={(e) => setForm((f) => ({ ...f, album: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. Abbey Road"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="1969"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Genre</label>
              <select
                value={form.genre}
                onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="">Select...</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Favourite Track</label>
            <input
              value={form.favouriteTrack}
              onChange={(e) => setForm((f) => ({ ...f, favouriteTrack: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. Come Together"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              {mode === "record" ? "Cost (£)" : "Target Price (£)"}
            </label>
            <input
              type="number"
              step="0.01"
              value={mode === "record" ? form.cost : form.targetPrice}
              onChange={(e) =>
                setForm((f) =>
                  mode === "record"
                    ? { ...f, cost: e.target.value }
                    : { ...f, targetPrice: e.target.value }
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="0.00"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Star Rating</label>
            <StarRating
              value={form.starRating}
              onChange={(v) => setForm((f) => ({ ...f, starRating: v }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
              placeholder="Any notes about this record..."
            />
          </div>
        </div>

        {/* Right column — artwork */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Artwork URL</label>
            <input
              type="url"
              value={form.artworkUrl}
              onChange={(e) => handleArtworkUrlChange(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              placeholder="https://..."
            />
          </div>

          <div className="aspect-square bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden flex items-center justify-center">
            {artworkPreview ? (
              <img
                src={artworkPreview}
                alt="Artwork preview"
                className="w-full h-full object-cover"
                onError={() => setArtworkPreview("")}
              />
            ) : (
              <div className="text-center text-zinc-600">
                <div className="text-6xl mb-2">♪</div>
                <p className="text-sm">Artwork preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : mode === "record" ? "Add to Collection" : "Add to Wishlist"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
