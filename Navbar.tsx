'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { LogOut, PlusCircle, LayoutDashboard, Sparkles, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    // Check if Supabase URL is set
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) {
      setIsConfigured(false);
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {!isConfigured && (
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2 text-center text-xs text-amber-300">
          <span>Supabase credentials not configured in <code className="bg-amber-900/50 px-1 py-0.5 rounded">.env.local</code>. Please set <code className="text-amber-200">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-amber-200">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</span>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b border-[#1f1f1f] bg-[#0d0d0d]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
            <span className="font-semibold tracking-wider text-lg text-white font-sans">
              MANDAKINI
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded border border-[#2a2a2a] text-zinc-400 bg-[#161616]">
              Seller Portal
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-3 sm:gap-4">
            {loading ? (
              <div className="h-8 w-24 bg-[#1a1a1a] rounded animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-md transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-white bg-[#1a1a1a]'
                      : 'text-zinc-400 hover:text-white hover:bg-[#161616]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/listings/new"
                  className={`flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-1.5 rounded-md font-medium transition-all ${
                    pathname === '/listings/new'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Listing</span>
                </Link>

                <div className="hidden md:flex items-center pl-2 border-l border-[#262626]">
                  <span className="text-xs text-zinc-400 max-w-[140px] truncate" title={user.email ?? ''}>
                    {user.email}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Log out"
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 p-1.5 rounded hover:bg-[#1c1c1c] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs sm:text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-[#161616] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1 text-xs sm:text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-3.5 py-1.5 rounded-md transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seller Sign Up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
