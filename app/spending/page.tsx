import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SpendingPage() {
  const records = await prisma.record.findMany({
    orderBy: { cost: "desc" },
  });

  const recordsWithCost = records.filter((r) => r.cost !== null);
  const totalSpent = recordsWithCost.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  const avgCost = recordsWithCost.length > 0 ? totalSpent / recordsWithCost.length : 0;
  const mostExpensive = recordsWithCost[0] ?? null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Spending</h1>
      <p className="text-zinc-400 mb-10">How much you&apos;ve invested in your collection.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-400 text-sm mb-1">Total Spent</div>
          <div className="text-4xl font-bold text-white">£{totalSpent.toFixed(2)}</div>
          <div className="text-zinc-500 text-xs mt-1">{recordsWithCost.length} of {records.length} records priced</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-400 text-sm mb-1">Average Cost</div>
          <div className="text-4xl font-bold text-white">£{avgCost.toFixed(2)}</div>
          <div className="text-zinc-500 text-xs mt-1">per record</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-400 text-sm mb-1">Most Expensive</div>
          {mostExpensive ? (
            <>
              <div className="text-4xl font-bold text-white">£{mostExpensive.cost!.toFixed(2)}</div>
              <div className="text-zinc-500 text-xs mt-1 truncate">{mostExpensive.artist} — {mostExpensive.album}</div>
            </>
          ) : (
            <div className="text-4xl font-bold text-zinc-600">—</div>
          )}
        </div>
      </div>

      {recordsWithCost.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">All Priced Records</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            {recordsWithCost.map((record, i) => (
              <Link
                key={record.id}
                href={`/record/${record.id}`}
                className={`flex items-center justify-between px-5 py-4 hover:bg-zinc-800 transition-colors ${
                  i !== 0 ? "border-t border-zinc-800" : ""
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-zinc-600 text-sm w-6 text-right shrink-0">{i + 1}</span>
                  {record.artworkUrl ? (
                    <img src={record.artworkUrl} alt={record.album} className="w-10 h-10 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">♪</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{record.album}</p>
                    <p className="text-zinc-400 text-xs truncate">{record.artist}</p>
                  </div>
                </div>
                <span className="text-white font-semibold shrink-0 ml-4">£{record.cost!.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg mb-4">No records have a cost set yet.</p>
          <Link href="/collection" className="text-red-500 hover:text-red-400 text-sm transition-colors">
            Go to Collection →
          </Link>
        </div>
      )}
    </div>
  );
}
