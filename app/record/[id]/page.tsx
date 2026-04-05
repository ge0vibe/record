import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import DeleteRecordButton from "./DeleteRecordButton";

export default async function RecordDetailPage({ params }: { params: { id: string } }) {
  const record = await prisma.record.findUnique({ where: { id: Number(params.id) } });
  if (!record) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/collection" className="text-zinc-400 hover:text-white text-sm transition-colors mb-6 inline-block">
        ← Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Artwork */}
        <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          {record.artworkUrl ? (
            <img
              src={record.artworkUrl}
              alt={`${record.album} by ${record.artist}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl text-zinc-700">♪</div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{record.album}</h1>
              <p className="text-xl text-zinc-400 mt-1">{record.artist}</p>
            </div>

            <StarRating value={record.starRating} readonly />

            <div className="grid grid-cols-2 gap-4">
              {record.year && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Year</p>
                  <p className="text-white">{record.year}</p>
                </div>
              )}
              {record.genre && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Genre</p>
                  <p className="text-white">{record.genre}</p>
                </div>
              )}
              {record.favouriteTrack && (
                <div className="col-span-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Favourite Track</p>
                  <p className="text-white">♪ {record.favouriteTrack}</p>
                </div>
              )}
              {record.cost !== null && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Paid</p>
                  <p className="text-white">£{record.cost.toFixed(2)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Added</p>
                <p className="text-white">
                  {new Date(record.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {record.notes && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{record.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <Link
              href={`/record/${record.id}/edit`}
              className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Edit
            </Link>
            <DeleteRecordButton id={record.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
