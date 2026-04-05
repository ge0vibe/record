import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.watchedRelease.findMany({ orderBy: { releaseDate: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.watchedRelease.create({
    data: {
      mbid: body.mbid,
      artist: body.artist,
      album: body.album,
      releaseDate: body.releaseDate,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
