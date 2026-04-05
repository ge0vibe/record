import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));

  const paddedMonth = String(month).padStart(2, "0");
  const daysInMonth = new Date(year, month, 0).getDate();

  const query = `firstreleasedate:[${year}-${paddedMonth}-01 TO ${year}-${paddedMonth}-${daysInMonth}] AND primarytype:Album`;
  const url = `https://musicbrainz.org/ws/2/release-group?query=${encodeURIComponent(query)}&fmt=json&limit=100`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "rekord-vinyl-tracker/1.0",
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch from MusicBrainz" }, { status: 502 });
  }

  const data = await res.json();

  const releases = ((data["release-groups"] as any[]) || [])
    .map((rg) => ({
      id: rg.id as string,
      artist: (rg["artist-credit"]?.[0]?.name ||
        rg["artist-credit"]?.[0]?.artist?.name ||
        "Unknown Artist") as string,
      album: rg.title as string,
      date: (rg["first-release-date"] as string) || null,
    }))
    .filter((r) => r.date && r.date.startsWith(`${year}-${paddedMonth}`))
    .sort((a, b) => (a.date as string).localeCompare(b.date as string));

  return NextResponse.json(releases);
}
