"use client";

import { useState } from "react";
import { Track } from "@/lib/types";

interface TracklistProps {
  tracks: Track[];
}

function FlameIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{
        transition: "opacity 150ms, color 150ms, filter 150ms",
        opacity: active ? 1 : 0.25,
        color: active ? "#f97316" : "currentColor",
        filter: active ? "drop-shadow(0 0 6px rgba(249,115,22,0.6))" : "none",
      }}
    >
      <path d="M12 2c-2.5 5.5-5 8-5 11a5 5 0 0010 0c0-3-2.5-5.5-5-11zm0 14.5A2.5 2.5 0 019.5 14c0-1.3.8-2.5 2.5-4.5 1.7 2 2.5 3.2 2.5 4.5A2.5 2.5 0 0112 16.5z" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#444]">
      <path d="M9 3v10.55A4 4 0 1011 17V7h4V3H9z" />
    </svg>
  );
}

interface TrackRowProps {
  track: Track;
  onToggle: (id: string) => void;
}

function TrackRow({ track, onToggle }: TrackRowProps) {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1 rounded hover:bg-white/[0.02] group">
      <span
        className="shrink-0 text-[11px] text-[#555] font-mono text-center rounded px-1 py-0.5 leading-tight"
        style={{ background: "rgba(255,255,255,0.05)", minWidth: "36px" }}
      >
        {track.position || "—"}
      </span>
      <span className="flex-1 min-w-0 text-[14px] text-[#ededed] truncate">{track.title}</span>
      {track.duration && (
        <span className="shrink-0 text-[12px] text-[#555] tabular-nums">{track.duration}</span>
      )}
      <button
        type="button"
        onClick={() => onToggle(track.id)}
        className="shrink-0 flex items-center justify-center w-6 h-6 rounded hover:bg-white/5 transition-colors"
        aria-label={track.isFavourite ? "Remove from favourites" : "Add to favourites"}
      >
        <FlameIcon active={track.isFavourite} />
      </button>
    </div>
  );
}

export default function Tracklist({ tracks: initialTracks }: TracklistProps) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);

  const toggleFavourite = async (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavourite: !t.isFavourite } : t))
    );
    try {
      await fetch(`/api/tracks/${id}/favourite`, { method: "PATCH" });
    } catch {
      // Revert on error
      setTracks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isFavourite: !t.isFavourite } : t))
      );
    }
  };

  const isVinyl = tracks.some((t) => /^[A-Za-z]/.test(t.position));

  type Group = { label: string; tracks: Track[] };
  let groups: Group[];

  if (isVinyl) {
    const sideMap = new Map<string, Track[]>();
    for (const track of tracks) {
      const side = track.position.match(/^([A-Za-z])/)?.[1]?.toUpperCase() ?? "?";
      if (!sideMap.has(side)) sideMap.set(side, []);
      sideMap.get(side)!.push(track);
    }
    groups = Array.from(sideMap.entries()).map(([side, t]) => ({ label: `Side ${side}`, tracks: t }));
  } else {
    groups = [{ label: "", tracks }];
  }

  const favourites = tracks.filter((t) => t.isFavourite);

  return (
    <div className="mt-8">
      <p className="text-[11px] text-[#555] uppercase tracking-wider mb-3">Tracklist</p>

      {tracks.length === 0 ? (
        <div className="flex items-center gap-2 text-[#444] text-sm">
          <NoteIcon />
          <span>No tracklist — added manually</span>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {groups.map((group, gi) => (
              <div key={gi}>
                {group.label && (
                  <p className="text-[10px] text-[#444] uppercase tracking-widest mb-1.5 font-medium px-1">
                    {group.label}
                  </p>
                )}
                <div>
                  {group.tracks.map((track) => (
                    <TrackRow key={track.id} track={track} onToggle={toggleFavourite} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {favourites.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#555]">
              <span>Favourites:</span>
              {favourites.map((t, i) => (
                <span key={t.id} className="flex items-center gap-1 text-[#888]">
                  <span style={{ color: "#f97316" }}>
                    <FlameIcon active />
                  </span>
                  {t.title}
                  {i < favourites.length - 1 && <span className="text-[#333]">·</span>}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
