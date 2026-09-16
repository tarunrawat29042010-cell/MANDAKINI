import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'MANDAKINI — Affiliate Directory for Small Sellers & YouTube Creators',
  description:
    'Connect small sellers with YouTube creators. Submit your affiliate program and scale your brand reach.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#0d0d0d] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-[#1a1a1a] py-6 text-center text-xs text-zinc-600">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>MANDAKINI — Affiliate Directory</span>
            <span>Stage 1 • Seller Portal</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
