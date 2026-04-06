import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const record = await prisma.record.findUnique({
    where: { id: Number(params.id) },
    include: { tracks: { orderBy: { order: "asc" } } },
  });
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const record = await prisma.record.update({
    where: { id: Number(params.id) },
    data: {
      artist: body.artist,
      album: body.album,
      year: body.year ? Number(body.year) : null,
      genre: body.genre || null,
      artworkUrl: body.artworkUrl || null,
      starRating: body.starRating ? Number(body.starRating) : 3,
      cost: body.cost ? Number(body.cost) : null,
      notes: body.notes || null,
    },
    include: { tracks: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(record);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.record.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
