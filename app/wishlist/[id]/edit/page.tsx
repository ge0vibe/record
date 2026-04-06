import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RecordForm from "@/components/RecordForm";

export default async function EditWishlistPage({ params }: { params: { id: string } }) {
  const item = await prisma.wishlistItem.findUnique({ where: { id: Number(params.id) } });
  if (!item) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/wishlist" className="text-[#888888] hover:text-[#ededed] text-sm transition-colors mb-6 inline-block">
        ← Back to Wishlist
      </Link>
      <h1 className="text-3xl font-bold text-[#ededed] mb-5">Edit Wishlist Item</h1>
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
          targetPrice: item.targetPrice,
          notes: item.notes,
        }}
      />
    </div>
  );
}
