import { prisma } from "@/lib/prisma";

export default async function StatsPage() {
  const [records, wishlistItems] = await Promise.all([
    prisma.record.findMany(),
    prisma.wishlistItem.findMany(),
  ]);

  const totalSpent = records.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  const avgRating =
    records.length > 0
      ? records.reduce((sum, r) => sum + r.starRating, 0) / records.length
      : 0;

  const genreCounts = records.reduce<Record<string, number>>((acc, r) => {
    if (r.genre) acc[r.genre] = (acc[r.genre] ?? 0) + 1;
    return acc;
  }, {});
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const decadeCounts = records.reduce<Record<string, number>>((acc, r) => {
    if (r.year) {
      const decade = `${Math.floor(r.year / 10) * 10}s`;
      acc[decade] = (acc[decade] ?? 0) + 1;
    }
    return acc;
  }, {});
  const topDecades = Object.entries(decadeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#ededed] mb-1">Stats</h1>
      <p className="text-[#888888] mb-8">A breakdown of your collection.</p>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Records", value: records.length },
          { label: "Wishlist", value: wishlistItems.length },
          { label: "Total Spent", value: `£${totalSpent.toLocaleString("en-GB", { minimumFractionDigits: 2 })}` },
          { label: "Avg Rating", value: avgRating.toFixed(1) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
            <div className="text-[#888888] text-xs mb-1">{label}</div>
            <div className="text-[#ededed] text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top Genres */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <h2 className="text-[#ededed] font-semibold mb-4">Top Genres</h2>
          {topGenres.length === 0 ? (
            <p className="text-[#888888] text-sm">No genres set yet.</p>
          ) : (
            <div className="space-y-3">
              {topGenres.map(([genre, count]) => {
                const pct = Math.round((count / records.length) * 100);
                return (
                  <div key={genre}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#ededed]">{genre}</span>
                      <span className="text-[#888888]">{count}</span>
                    </div>
                    <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div className="h-full bg-[#a855f7] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Decades */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <h2 className="text-[#ededed] font-semibold mb-4">By Decade</h2>
          {topDecades.length === 0 ? (
            <p className="text-[#888888] text-sm">No years set yet.</p>
          ) : (
            <div className="space-y-3">
              {topDecades.map(([decade, count]) => {
                const pct = Math.round((count / records.length) * 100);
                return (
                  <div key={decade}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#ededed]">{decade}</span>
                      <span className="text-[#888888]">{count}</span>
                    </div>
                    <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div className="h-full bg-[#a855f7] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
