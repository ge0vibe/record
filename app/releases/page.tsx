"use client";

import { useEffect, useState } from "react";

type Release = {
  id: string;
  artist: string;
  album: string;
  date: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDay(dateStr: string) {
  const parts = dateStr.split("-");
  const day = parts[2] ? parseInt(parts[2]) : null;
  if (!day) return dateStr;
  const suffix =
    day === 1 || day === 21 || day === 31 ? "st"
    : day === 2 || day === 22 ? "nd"
    : day === 3 || day === 23 ? "rd"
    : "th";
  return `${day}${suffix}`;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

export default function ReleasesPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "watching">("all");

  useEffect(() => {
    fetch("/api/watched-releases")
      .then((r) => r.json())
      .then((data: { mbid: string }[]) => setWatched(new Set(data.map((d) => d.mbid))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/releases?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(true); } else { setReleases(data); }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [year, month]);

  function prevMonth() {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else { setMonth(month - 1); }
  }

  function nextMonth() {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else { setMonth(month + 1); }
  }

  async function toggleWatch(release: Release) {
    const isWatched = watched.has(release.id);
    setWatched((prev) => {
      const next = new Set(prev);
      if (isWatched) next.delete(release.id); else next.add(release.id);
      return next;
    });
    if (isWatched) {
      await fetch(`/api/watched-releases/${encodeURIComponent(release.id)}`, { method: "DELETE" });
    } else {
      await fetch("/api/watched-releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mbid: release.id, artist: release.artist, album: release.album, releaseDate: release.date }),
      });
    }
  }

  const displayed = filter === "watching" ? releases.filter((r) => watched.has(r.id)) : releases;

  const grouped: Record<string, Release[]> = {};
  for (const r of displayed) {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  }
  const dates = Object.keys(grouped).sort();
  const watchingCount = releases.filter((r) => watched.has(r.id)).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#ededed]">New Releases</h1>
          <p className="text-[#888888] mt-1">Upcoming album releases via MusicBrainz</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent border border-[#1f1f1f] hover:border-[#333333] text-[#888888] hover:text-[#ededed] transition-colors text-lg"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="text-[#ededed] font-medium w-36 text-center text-sm">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent border border-[#1f1f1f] hover:border-[#333333] text-[#888888] hover:text-[#ededed] transition-colors text-lg"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-[#111111] border border-[#1f1f1f] rounded-lg p-1 w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter === "all" ? "bg-[#1f1f1f] text-[#ededed]" : "text-[#888888] hover:text-[#ededed]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("watching")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
            filter === "watching" ? "bg-[#1f1f1f] text-[#ededed]" : "text-[#888888] hover:text-[#ededed]"
          }`}
        >
          <StarIcon filled={filter === "watching"} />
          Watching
          {watchingCount > 0 && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${
              filter === "watching" ? "bg-[#a855f7]/20 text-[#a855f7]" : "bg-[#1f1f1f] text-[#888888]"
            }`}>
              {watchingCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#111111] border border-[#1f1f1f] rounded-xl px-5 py-4 animate-pulse">
              <div className="flex gap-6">
                <div className="h-4 bg-[#1a1a1a] rounded w-16 shrink-0" />
                <div className="h-4 bg-[#1a1a1a] rounded w-40" />
                <div className="h-4 bg-[#1a1a1a] rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-[#888888]">Failed to load releases. Try again later.</p>
        </div>
      ) : dates.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4 text-[#2a2a2a]">♪</div>
          {filter === "watching" ? (
            <p className="text-[#888888] text-lg">No watched releases for {MONTH_NAMES[month - 1]} {year}.</p>
          ) : (
            <>
              <p className="text-[#888888] text-lg">No releases found for {MONTH_NAMES[month - 1]} {year}.</p>
              <p className="text-[#555] text-sm mt-2">MusicBrainz coverage of future releases may be limited.</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              <h2 className="text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-2 px-1">
                {MONTH_NAMES[month - 1]} {formatDay(date)}
              </h2>
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
                {grouped[date].map((release, i) => {
                  const isWatched = watched.has(release.id);
                  return (
                    <div
                      key={release.id}
                      className={`flex items-center gap-4 px-5 py-3.5 ${i !== 0 ? "border-t border-[#1f1f1f]" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#333] shrink-0 text-xs">
                        ♪
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#ededed] font-medium truncate">{release.album}</p>
                        <p className="text-[#888888] text-sm truncate">{release.artist}</p>
                      </div>
                      <span className="text-[#555] text-xs shrink-0 hidden sm:block">{release.date}</span>
                      <button
                        onClick={() => toggleWatch(release)}
                        title={isWatched ? "Remove from watching" : "Add to watching"}
                        className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                          isWatched
                            ? "text-[#a855f7] hover:bg-[#a855f7]/10"
                            : "text-[#555] hover:text-[#888888] hover:bg-[#1a1a1a]"
                        }`}
                      >
                        <StarIcon filled={isWatched} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && releases.length > 0 && (
        <p className="text-[#555] text-xs text-center mt-8">
          {releases.length} release{releases.length !== 1 ? "s" : ""} · Data from MusicBrainz
        </p>
      )}
    </div>
  );
}
