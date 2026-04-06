"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TrackInput } from "@/lib/types";

interface SearchResult {
  id: number;
  title: string;
  year?: string;
  label?: string[];
  thumb?: string;
}

export type { TrackInput };

export interface AutofillFields {
  artist: string;
  album: string;
  year: string;
  genre: string;
  artworkUrl: string;
  tracklist?: TrackInput[];
}

interface DiscogsSearchProps {
  onAutofill: (fields: AutofillFields) => void;
  onScrollToFields?: () => void;
}

const DISCOGS_GENRE_MAP: [string, string][] = [
  ["Hip Hop", "Hip-Hop"],
  ["Funk / Soul", "Soul"],
  ["Folk, World, & Country", "Folk"],
  ["Rock", "Rock"],
  ["Pop", "Pop"],
  ["Jazz", "Jazz"],
  ["Classical", "Classical"],
  ["Electronic", "Electronic"],
  ["R&B", "R&B"],
  ["Country", "Country"],
  ["Folk", "Folk"],
  ["Metal", "Metal"],
  ["Punk", "Punk"],
  ["Blues", "Blues"],
  ["Reggae", "Reggae"],
  ["Latin", "Latin"],
  ["Soul", "Soul"],
];

function mapGenre(genres?: string[], styles?: string[]): string {
  const all = [...(genres ?? []), ...(styles ?? [])];
  for (const g of all) {
    const exact = DISCOGS_GENRE_MAP.find(([key]) => key.toLowerCase() === g.toLowerCase());
    if (exact) return exact[1];
    const partial = DISCOGS_GENRE_MAP.find(([key]) =>
      g.toLowerCase().includes(key.toLowerCase())
    );
    if (partial) return partial[1];
  }
  return "";
}

function parseTitle(title: string): { artist: string; album: string } {
  const idx = title.indexOf(" - ");
  if (idx === -1) return { artist: "", album: title };
  return { artist: title.slice(0, idx), album: title.slice(idx + 3) };
}

export default function DiscogsSearch({ onAutofill, onScrollToFields }: DiscogsSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [fetchingRelease, setFetchingRelease] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/discogs/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.results ?? []);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch {
      setError("Search unavailable — fill in manually");
      setIsOpen(false);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSuccess(false);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handleSelect = async (result: SearchResult) => {
    setIsOpen(false);
    setFetchingRelease(true);
    setError(null);
    try {
      const res = await fetch(`/api/discogs/release/${result.id}`);
      if (!res.ok) throw new Error();
      const release = await res.json();

      let artist = "";
      if (release.artists?.length) {
        artist = release.artists[0].name
          .replace(/\s*\(\d+\)$/, "")
          .trim();
        if (artist.toLowerCase() === "various") artist = "";
      }

      const primaryImage =
        release.images?.find((img: { type: string }) => img.type === "primary") ??
        release.images?.[0];
      const artworkUrl: string = primaryImage?.uri ?? "";

      const rawTracklist: Array<{ position: string; title: string; duration?: string; type_?: string }> =
        release.tracklist ?? [];
      const tracklist: TrackInput[] = rawTracklist
        .filter((t) => t.type_ === "track" || !t.type_)
        .map((t, i) => ({
          position: t.position ?? "",
          title: t.title,
          duration: t.duration || undefined,
          order: i,
        }));

      onAutofill({
        artist,
        album: release.title ?? "",
        year: release.year ? String(release.year) : "",
        genre: mapGenre(release.genres, release.styles),
        artworkUrl,
        tracklist: tracklist.length > 0 ? tracklist : undefined,
      });

      setSuccess(true);
      onScrollToFields?.();
    } catch {
      setError("Search unavailable — fill in manually");
    } finally {
      setFetchingRelease(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isLoading = searching || fetchingRelease;

  return (
    <div ref={containerRef} className="relative mb-6">
      <label className="block text-sm font-medium text-[#888888] mb-1">Search Discogs</label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search by artist or album..."
          className="w-full bg-[#111111] border border-[#1f1f1f] rounded-xl px-3 py-2 pr-10 text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#a855f7] transition-colors"
        />

        {/* Spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Success checkmark */}
        {success && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Found</span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#111111] border border-[#1f1f1f] rounded-xl shadow-2xl max-h-[320px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#555]">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            results.map((result, i) => {
              const { artist, album } = parseTitle(result.title);
              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelect(result)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-l-2 ${
                    i === activeIndex
                      ? "bg-[#1f1f1f] border-[#a855f7]"
                      : "hover:bg-[#1a1a1a] border-transparent"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-[#1f1f1f] flex items-center justify-center">
                    {result.thumb ? (
                      <img src={result.thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#444] text-base">♪</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-[#ededed] truncate">
                      {album || result.title}
                    </div>
                    {artist && (
                      <div className="text-[13px] text-[#888] truncate">{artist}</div>
                    )}
                    <div className="text-[12px] text-[#555] truncate">
                      {[result.year, result.label?.[0]].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Error / success messages */}
      <div className="mt-1.5 flex items-center justify-between">
        <div>
          {error && <p className="text-xs text-[#888]">{error}</p>}
          {success && !error && (
            <p className="text-xs text-emerald-500">Found on Discogs</p>
          )}
        </div>
        <p className="text-xs text-[#444]">
          Powered by{" "}
          <a
            href="https://www.discogs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666] hover:text-[#a855f7] transition-colors underline"
          >
            Discogs
          </a>
        </p>
      </div>
    </div>
  );
}
