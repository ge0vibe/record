import Link from "next/link";
import { Record } from "@/lib/types";
import StarRating from "./StarRating";

interface RecordCardProps {
  record: Record;
}

export default function RecordCard({ record }: RecordCardProps) {
  return (
    <Link href={`/record/${record.id}`}>
      <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all hover:scale-[1.02] cursor-pointer group">
        <div className="aspect-square bg-zinc-800 relative overflow-hidden">
          {record.artworkUrl ? (
            <img
              src={record.artworkUrl}
              alt={`${record.album} by ${record.artist}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl text-zinc-700">♪</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-white font-semibold truncate">{record.album}</p>
          <p className="text-zinc-400 text-sm truncate">{record.artist}</p>
          <div className="mt-1 flex items-center justify-between">
            <StarRating value={record.starRating} readonly />
            {record.year && <span className="text-zinc-500 text-xs">{record.year}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
