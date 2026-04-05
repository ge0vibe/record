import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ results: [] });

  const token = process.env.DISCOGS_TOKEN;
  if (!token) return NextResponse.json({ error: "Discogs token not configured" }, { status: 500 });

  try {
    const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(q)}&type=release&per_page=8&token=${token}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Rekord/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Discogs responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ results: data.results ?? [] });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
