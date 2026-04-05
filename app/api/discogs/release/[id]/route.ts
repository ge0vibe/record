import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = process.env.DISCOGS_TOKEN;
  if (!token) return NextResponse.json({ error: "Discogs token not configured" }, { status: 500 });

  try {
    const url = `https://api.discogs.com/releases/${params.id}?token=${token}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Rekord/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Discogs responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch release" }, { status: 502 });
  }
}
