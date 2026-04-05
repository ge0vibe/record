import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.wishlistItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
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
      favouriteTrack: body.favouriteTrack || null,
      targetPrice: body.targetPrice ? Number(body.targetPrice) : null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
