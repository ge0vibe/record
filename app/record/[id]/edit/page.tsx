import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RecordForm from "@/components/RecordForm";

export default async function EditRecordPage({ params }: { params: { id: string } }) {
  const record = await prisma.record.findUnique({ where: { id: Number(params.id) } });
  if (!record) notFound();

  return (
    <div className="max-w-3xl">
      <Link href={`/record/${record.id}`} className="text-[#888888] hover:text-[#ededed] text-sm transition-colors mb-6 inline-block">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold text-[#ededed] mb-5">Edit Record</h1>
      <RecordForm
        mode="record"
        recordId={record.id}
        initialData={{
          artist: record.artist,
          album: record.album,
          year: record.year,
          genre: record.genre,
          artworkUrl: record.artworkUrl,
          starRating: record.starRating,
          favouriteTrack: record.favouriteTrack,
          cost: record.cost,
          notes: record.notes,
        }}
      />
    </div>
  );
}
