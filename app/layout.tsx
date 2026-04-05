import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "rekord — Vinyl Collection Tracker",
  description: "Track your vinyl record collection and wishlist",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-[#0a0a0a] text-[#ededed] h-screen overflow-hidden`}>
        <Navbar />
        <div className="md:ml-[220px] h-screen overflow-y-auto">
          <main className="pt-20 md:pt-10 pb-8 max-w-[1200px] mx-auto px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
