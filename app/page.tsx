import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";

export default async function Home() {
  const [records, wishlistItems] = await Promise.all([
    prisma.record.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.wishlistItem.findMany(),
  ]);

  const totalSpent = records.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  const recentRecords = records.slice(0, 4);

  const genreCounts = records.reduce<Record<string, number>>((acc, r) => {
    if (r.genre) acc[r.genre] = (acc[r.genre] ?? 0) + 1;
    return acc;
  }, {});
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#ededed]">Dashboard</h1>
        <p className="text-[#888888] mt-1">Welcome back to your collection.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <Link
          href="/collection"
          className="bg-[#111111] border border-[#1f1f1f] hover:border-[#333333] rounded-xl p-5 transition-[border-color] duration-150 group"
        >
          <div className="text-[#888888] text-xs mb-1">Records</div>
          <div className="text-[#ededed] text-2xl font-bold">{records.length}</div>
        </Link>
        <Link
          href="/wishlist"
          className="bg-[#111111] border border-[#1f1f1f] hover:border-[#333333] rounded-xl p-5 transition-[border-color] duration-150"
        >
          <div className="text-[#888888] text-xs mb-1">Wishlist</div>
          <div className="text-[#ededed] text-2xl font-bold">{wishlistItems.length}</div>
        </Link>
        <Link
          href="/spending"
          className="bg-[#111111] border border-[#1f1f1f] hover:border-[#333333] rounded-xl p-5 transition-[border-color] duration-150"
        >
          <div className="text-[#888888] text-xs mb-1">Total Spent</div>
          <div className="text-[#ededed] text-2xl font-bold">
            £{totalSpent.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </Link>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <div className="text-[#888888] text-xs mb-1">Top Genre</div>
          <div className="text-[#ededed] text-2xl font-bold truncate">{topGenre ?? "—"}</div>
        </div>
      </div>

      {/* Recently Added */}
      {recentRecords.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#ededed] font-semibold">Recently Added</h2>
            <Link href="/collection" className="text-[#888888] hover:text-[#ededed] text-sm transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentRecords.map((record) => (
              <Link key={record.id} href={`/record/${record.id}`}>
                <div className="bg-[#111111] rounded-xl overflow-hidden border border-[#1f1f1f] hover:border-[#333333] transition-[border-color] duration-150">
                  <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
                    {record.artworkUrl ? (
                      <img src={record.artworkUrl} alt={record.album} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-[#2a2a2a]">♪</div>
                    )}
                  </div>
                  <div className="px-3 pt-2.5 pb-3">
                    <p className="text-[#888888] text-[13px] truncate">{record.artist}</p>
                    <p className="text-[#ededed] text-[15px] font-medium truncate mt-0.5">{record.album}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Full collection list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#ededed] font-semibold">Collection</h2>
          <Link href="/collection" className="text-[#888888] hover:text-[#ededed] text-sm transition-colors">
            View all →
          </Link>
        </div>
        {records.length === 0 ? (
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-10 text-center">
            <p className="text-[#888888] mb-4">No records yet.</p>
            <Link
              href="/add-record"
              className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Add your first record
            </Link>
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
            <div className="overflow-y-auto max-h-[320px]">
              {records.map((record, i) => (
                <Link
                  key={record.id}
                  href={`/record/${record.id}`}
                  className={`flex items-center gap-4 px-5 py-3 hover:bg-[#161616] transition-colors ${
                    i !== 0 ? "border-t border-[#1f1f1f]" : ""
                  }`}
                >
                  {record.artworkUrl ? (
                    <img src={record.artworkUrl} alt={record.album} className="w-9 h-9 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded bg-[#1a1a1a] flex items-center justify-center text-[#333] shrink-0">♪</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#ededed] text-sm font-medium truncate">{record.album}</p>
                    <p className="text-[#888888] text-xs truncate">{record.artist}</p>
                  </div>
                  {record.genre && (
                    <span className="bg-[#1f1f1f] text-[#a855f7] text-[11px] rounded-full px-2 py-0.5 hidden sm:block shrink-0">
                      {record.genre}
                    </span>
                  )}
                  <StarRating value={record.starRating} readonly size="sm" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
