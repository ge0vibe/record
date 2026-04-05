import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          <span className="text-red-500">●</span> rekord
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/collection" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Collection
          </Link>
          <Link href="/wishlist" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Wishlist
          </Link>
          <Link
            href="/add-record"
            className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Record
          </Link>
        </div>
      </div>
    </nav>
  );
}
