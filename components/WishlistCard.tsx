import Link from "next/link";
import { WishlistItem } from "@/lib/types";
import StarRating from "./StarRating";

interface WishlistCardProps {
  item: WishlistItem;
  onDelete?: (id: number) => void;
}

export default function WishlistCard({ item, onDelete }: WishlistCardProps) {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all group">
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        {item.artworkUrl ? (
          <img
            src={item.artworkUrl}
            alt={`${item.album} by ${item.artist}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl text-zinc-700">♪</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
          Wishlist
        </div>
      </div>
      <div className="p-3">
        <p className="text-white font-semibold truncate">{item.album}</p>
        <p className="text-zinc-400 text-sm truncate">{item.artist}</p>
        <div className="mt-1 flex items-center justify-between">
          <StarRating value={item.starRating} readonly />
          {item.year && <span className="text-zinc-500 text-xs">{item.year}</span>}
        </div>
        {item.targetPrice && (
          <p className="text-green-400 text-sm mt-1">Target: £{item.targetPrice.toFixed(2)}</p>
        )}
        <div className="mt-2 flex gap-2">
          <Link
            href={`/wishlist/${item.id}/edit`}
            className="flex-1 text-center text-xs bg-zinc-800 hover:bg-zinc-700 text-white py-1 rounded transition-colors"
          >
            Edit
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 text-xs bg-red-900 hover:bg-red-800 text-white py-1 rounded transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
