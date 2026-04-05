import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [recordCount, wishlistCount] = await Promise.all([
    prisma.record.count(),
    prisma.wishlistItem.count(),
  ]);

  const recentRecords = await prisma.record.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-red-500">●</span> rekord
        </h1>
        <p className="text-zinc-400 text-xl">Your vinyl collection, catalogued.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-16">
        <Link href="/collection" className="bg-zinc-900 border border-zinc-800 hover:border-red-600 rounded-xl p-6 text-center transition-all">
          <div className="text-4xl font-bold text-white mb-1">{recordCount}</div>
          <div className="text-zinc-400 text-sm">Records</div>
        </Link>
        <Link href="/wishlist" className="bg-zinc-900 border border-zinc-800 hover:border-purple-600 rounded-xl p-6 text-center transition-all">
          <div className="text-4xl font-bold text-white mb-1">{wishlistCount}</div>
          <div className="text-zinc-400 text-sm">Wishlist</div>
        </Link>
      </div>

      {recentRecords.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recently Added</h2>
            <Link href="/collection" className="text-sm text-zinc-400 hover:text-white transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentRecords.map((record) => (
              <Link key={record.id} href={`/record/${record.id}`}>
                <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all hover:scale-[1.02]">
                  <div className="aspect-square bg-zinc-800 overflow-hidden">
                    {record.artworkUrl ? (
                      <img src={record.artworkUrl} alt={record.album} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-zinc-700">♪</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{record.album}</p>
                    <p className="text-zinc-400 text-xs truncate">{record.artist}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recentRecords.length === 0 && (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">🎵</div>
          <p className="text-zinc-400 text-lg mb-6">Your collection is empty. Start adding records!</p>
          <Link
            href="/add-record"
            className="bg-red-600 hover:bg-red-500 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Add Your First Record
          </Link>
        </div>
      )}
    </div>
  );
}
