import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseTracklist(raw: string | null) {
  return raw ? JSON.parse(raw) : null;
}

export async function GET() {
  const items = await prisma.wishlistItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items.map((item) => ({ ...item, tracklist: parseTracklist(item.tracklist) })));
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.wishlistItem.create({
    data: {
      artist: body.artist,
      album: body.album,
      year: body.year ? Number(body.year) : null,
      genre: body.genre || null,
      artworkUrl: body.artworkUrl || null,
      starRating: body.starRating ? Number(body.starRating) : 3,
      targetPrice: body.targetPrice ? Number(body.targetPrice) : null,
      notes: body.notes || null,
      tracklist: body.tracklist?.length > 0 ? JSON.stringify(body.tracklist) : null,
    },
  });
  return NextResponse.json({ ...item, tracklist: item.tracklist ? JSON.parse(item.tracklist) : null }, { status: 201 });
}
