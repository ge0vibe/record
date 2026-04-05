"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/collection", label: "Collection", badge: "records" as const },
  { href: "/wishlist", label: "Wishlist", badge: "wishlist" as const },
  { href: "/spending", label: "Spending", badge: null },
  { href: "/stats", label: "Stats", badge: null },
];

export default function Navbar() {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ records: 0, wishlist: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/records").then((r) => r.json()),
      fetch("/api/wishlist").then((r) => r.json()),
    ])
      .then(([records, wishlist]) => {
        setCounts({
          records: Array.isArray(records) ? records.length : 0,
          wishlist: Array.isArray(wishlist) ? wishlist.length : 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[220px] flex-col bg-[#0a0a0a] border-r border-[#1f1f1f] z-50">
        <div className="px-5 py-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#a855f7] text-xl leading-none">●</span>
            <span className="text-[#ededed] font-semibold text-lg tracking-tight">rekord</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ href, label, badge }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            const count = badge === "records" ? counts.records : badge === "wishlist" ? counts.wishlist : null;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#1f1f1f] text-[#ededed] font-medium"
                    : "text-[#888888] hover:text-[#ededed] hover:bg-[#111111]"
                }`}
              >
                <span>{label}</span>
                {count !== null && count > 0 && (
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      isActive
                        ? "bg-[#a855f7]/20 text-[#a855f7]"
                        : "bg-[#1f1f1f] text-[#888888]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <Link
            href="/add-record"
            className="flex items-center justify-center w-full py-2 rounded-lg bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-medium transition-colors"
          >
            + Add Record
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a] border-b border-[#1f1f1f] z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#a855f7]">●</span>
          <span className="text-[#ededed] font-semibold">rekord</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/collection" className="text-[#888888] hover:text-[#ededed] text-sm transition-colors">Collection</Link>
          <Link href="/wishlist" className="text-[#888888] hover:text-[#ededed] text-sm transition-colors">Wishlist</Link>
          <Link href="/add-record" className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            + Add
          </Link>
        </div>
      </div>
    </>
  );
}
