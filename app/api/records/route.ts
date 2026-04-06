import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.record.findMany({
    orderBy: { createdAt: "desc" },
    include: { tracks: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tracklist: Array<{ position: string; title: string; duration?: string; order: number }> =
    body.tracklist ?? [];

  const record = await prisma.record.create({
    data: {
      artist: body.artist,
      album: body.album,
      year: body.year ? Number(body.year) : null,
      genre: body.genre || null,
      artworkUrl: body.artworkUrl || null,
      starRating: body.starRating ? Number(body.starRating) : 3,
      cost: body.cost ? Number(body.cost) : null,
      notes: body.notes || null,
      ...(tracklist.length > 0 && {
        tracks: {
          create: tracklist.map((t) => ({
            position: t.position,
            title: t.title,
            duration: t.duration || null,
            order: t.order,
          })),
        },
      }),
    },
    include: { tracks: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(record, { status: 201 });
}
