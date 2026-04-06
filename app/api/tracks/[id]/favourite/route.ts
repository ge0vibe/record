import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const track = await prisma.track.findUnique({ where: { id: params.id } });
  if (!track) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.track.update({
    where: { id: params.id },
    data: { isFavourite: !track.isFavourite },
  });
  return NextResponse.json(updated);
}
