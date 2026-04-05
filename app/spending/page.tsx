import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SpendingPage() {
  const records = await prisma.record.findMany({ orderBy: { cost: "desc" } });

  const recordsWithCost = records.filter((r) => r.cost !== null);
  const totalSpent = recordsWithCost.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  const avgCost = recordsWithCost.length > 0 ? totalSpent / recordsWithCost.length : 0;
  const mostExpensive = recordsWithCost[0] ?? null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#ededed] mb-1">Spending</h1>
      <p className="text-[#888888] mb-8">How much you&apos;ve invested in your collection.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
          <div className="text-[#888888] text-xs mb-1">Total Spent</div>
          <div className="text-4xl font-bold text-[#ededed]">
            £{totalSpent.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[#555] text-xs mt-1">
            {recordsWithCost.length} of {records.length} records priced
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
          <div className="text-[#888888] text-xs mb-1">Average Cost</div>
          <div className="text-4xl font-bold text-[#ededed]">£{avgCost.toFixed(2)}</div>
          <div className="text-[#555] text-xs mt-1">per record</div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
          <div className="text-[#888888] text-xs mb-1">Most Expensive</div>
          {mostExpensive ? (
            <>
              <div className="text-4xl font-bold text-[#ededed]">£{mostExpensive.cost!.toFixed(2)}</div>
              <div className="text-[#555] text-xs mt-1 truncate">
                {mostExpensive.artist} — {mostExpensive.album}
              </div>
            </>
          ) : (
            <div className="text-4xl font-bold text-[#333333]">—</div>
          )}
        </div>
      </div>

      {recordsWithCost.length > 0 ? (
        <div>
          <h2 className="text-[#ededed] font-semibold mb-4">All Priced Records</h2>
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
            {recordsWithCost.map((record, i) => (
              <Link
                key={record.id}
                href={`/record/${record.id}`}
                className={`flex items-center justify-between px-5 py-4 hover:bg-[#161616] transition-colors ${
                  i !== 0 ? "border-t border-[#1f1f1f]" : ""
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-[#555] text-sm w-6 text-right shrink-0">{i + 1}</span>
                  {record.artworkUrl ? (
                    <img src={record.artworkUrl} alt={record.album} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#333] shrink-0">♪</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[#ededed] text-sm font-medium truncate">{record.album}</p>
                    <p className="text-[#888888] text-xs truncate">{record.artist}</p>
                  </div>
                </div>
                <span className="text-[#ededed] font-semibold shrink-0 ml-4">£{record.cost!.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-5xl mb-4 text-[#2a2a2a]">£</div>
          <p className="text-[#888888] text-lg mb-4">No records have a cost set yet.</p>
          <Link href="/collection" className="text-[#a855f7] hover:text-[#9333ea] text-sm transition-colors">
            Go to Collection →
          </Link>
        </div>
      )}
    </div>
  );
}
