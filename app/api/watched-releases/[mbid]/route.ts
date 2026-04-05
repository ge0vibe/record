import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { mbid: string } }) {
  await prisma.watchedRelease.delete({ where: { mbid: params.mbid } });
  return new NextResponse(null, { status: 204 });
}
