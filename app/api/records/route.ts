import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.record.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const body = await request.json();
  const record = await prisma.record.create({
    data: {
      artist: body.artist,
      album: body.album,
      year: body.year ? Number(body.year) : null,
      genre: body.genre || null,
      artworkUrl: body.artworkUrl || null,
      starRating: body.starRating ? Number(body.starRating) : 3,
      favouriteTrack: body.favouriteTrack || null,
      cost: body.cost ? Number(body.cost) : null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(record, { status: 201 });
}
