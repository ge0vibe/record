import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RecordForm from "@/components/RecordForm";

export default async function EditWishlistPage({ params }: { params: { id: string } }) {
  const item = await prisma.wishlistItem.findUnique({ where: { id: Number(params.id) } });
  if (!item) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/wishlist" className="text-zinc-400 hover:text-white text-sm transition-colors mb-6 inline-block">
        ← Back to Wishlist
      </Link>
      <h1 className="text-3xl font-bold text-white mb-8">Edit Wishlist Item</h1>
      <RecordForm
        mode="wishlist"
        recordId={item.id}
        initialData={{
          artist: item.artist,
          album: item.album,
          year: item.year,
          genre: item.genre,
          artworkUrl: item.artworkUrl,
          starRating: item.starRating,
          favouriteTrack: item.favouriteTrack,
          targetPrice: item.targetPrice,
          notes: item.notes,
        }}
      />
    </div>
  );
}
