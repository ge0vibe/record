import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";

export default async function Home() {
  const records = await prisma.record.findMany({ orderBy: { createdAt: "desc" } });

  const totalSpent = records.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  const recentRecords = records.slice(0, 4);

  const genreCounts = records.reduce<Record<string, number>>((acc, r) => {
    if (r.genre) acc[r.genre] = (acc[r.genre] ?? 0) + 1;
    return acc;
  }, {});
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Stats */}
      <h2 className="text-lg font-semibold text-white mb-3">Stats</h2>
      <div className="flex gap-3 mb-6">
        <Link href="/collection" className="bg-zinc-900 border border-zinc-800 hover:border-red-600 rounded-xl px-5 py-3 transition-all flex items-center gap-3">
          <span className="text-xl font-bold text-white">{records.length}</span>
          <span className="text-zinc-400 text-sm">Records</span>
        </Link>
        <Link href="/spending" className="bg-zinc-900 border border-zinc-800 hover:border-green-600 rounded-xl px-5 py-3 transition-all flex items-center gap-3">
          <span className="text-xl font-bold text-white">£{totalSpent.toFixed(2)}</span>
          <span className="text-zinc-400 text-sm">Total Spent</span>
        </Link>
        {topGenre && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 flex items-center gap-3">
            <span className="text-xl font-bold text-white">{topGenre}</span>
            <span className="text-zinc-400 text-sm">Top Genre</span>
          </div>
        )}
      </div>

      {/* Collection list */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Collection</h2>
          <Link href="/collection" className="text-sm text-zinc-400 hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        {records.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
            <p className="text-zinc-400 mb-4">No records yet.</p>
            <Link href="/add-record" className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg text-sm transition-colors">
              Add your first record
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-y-auto max-h-[305px]">
              {records.map((record, i) => (
                <Link
                  key={record.id}
                  href={`/record/${record.id}`}
                  className={`flex items-center gap-4 px-5 py-3 hover:bg-zinc-800 transition-colors ${i !== 0 ? "border-t border-zinc-800" : ""}`}
                >
                  {record.artworkUrl ? (
                    <img src={record.artworkUrl} alt={record.album} className="w-9 h-9 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded bg-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">♪</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{record.album}</p>
                    <p className="text-zinc-400 text-xs truncate">{record.artist}</p>
                  </div>
                  {record.genre && (
                    <span className="text-zinc-500 text-xs hidden sm:block shrink-0">{record.genre}</span>
                  )}
                  <StarRating value={record.starRating} readonly />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recently Added */}
      {recentRecords.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recently Added</h2>
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
    </div>
  );
}
