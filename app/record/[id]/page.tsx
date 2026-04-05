import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import DeleteRecordButton from "./DeleteRecordButton";

export default async function RecordDetailPage({ params }: { params: { id: string } }) {
  const record = await prisma.record.findUnique({ where: { id: Number(params.id) } });
  if (!record) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/collection" className="text-[#888888] hover:text-[#ededed] text-sm transition-colors mb-6 inline-block">
        ← Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Artwork */}
        <div className="aspect-square bg-[#111111] rounded-2xl overflow-hidden border border-[#1f1f1f]">
          {record.artworkUrl ? (
            <img
              src={record.artworkUrl}
              alt={`${record.album} by ${record.artist}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl text-[#2a2a2a]">♪</div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <p className="text-[#888888] text-sm mb-1">{record.artist}</p>
              <h1 className="text-3xl font-bold text-[#ededed]">{record.album}</h1>
            </div>

            <StarRating value={record.starRating} readonly />

            <div className="grid grid-cols-2 gap-4">
              {record.year && (
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Year</p>
                  <p className="text-[#ededed]">{record.year}</p>
                </div>
              )}
              {record.genre && (
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Genre</p>
                  <span className="bg-[#1f1f1f] text-[#a855f7] text-[11px] rounded-full px-2 py-0.5">
                    {record.genre}
                  </span>
                </div>
              )}
              {record.favouriteTrack && (
                <div className="col-span-2">
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Favourite Track</p>
                  <p className="text-[#ededed]">♪ {record.favouriteTrack}</p>
                </div>
              )}
              {record.cost !== null && (
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Paid</p>
                  <p className="text-[#ededed]">£{record.cost.toFixed(2)}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Added</p>
                <p className="text-[#ededed]">
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
                <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Notes</p>
                <p className="text-[#888888] text-sm leading-relaxed">{record.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <Link
              href={`/record/${record.id}/edit`}
              className="flex-1 text-center bg-transparent border border-[#1f1f1f] hover:border-[#333333] text-[#ededed] font-medium py-2.5 rounded-lg transition-colors"
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
