import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseTracklist(raw: string | null) {
  return raw ? JSON.parse(raw) : null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const item = await prisma.wishlistItem.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...item, tracklist: parseTracklist(item.tracklist) });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const item = await prisma.wishlistItem.update({
    where: { id: Number(params.id) },
    data: {
      artist: body.artist,
      album: body.album,
      year: body.year ? Number(body.year) : null,
      genre: body.genre || null,
      artworkUrl: body.artworkUrl || null,
      starRating: body.starRating ? Number(body.starRating) : 3,
      targetPrice: body.targetPrice ? Number(body.targetPrice) : null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json({ ...item, tracklist: parseTracklist(item.tracklist) });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.wishlistItem.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
