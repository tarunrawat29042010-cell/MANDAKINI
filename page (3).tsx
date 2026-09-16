'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Listing } from '@/types';
import ListingCard from '@/components/ListingCard';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  Package,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justCreated = searchParams.get('created') === 'true';

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerEmail, setSellerEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreatedBanner, setShowCreatedBanner] = useState(justCreated);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirectedFrom=/dashboard');
        return;
      }

      setSellerEmail(user.email ?? 'Seller');

      const { data, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setListings((data as Listing[]) || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch listings';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const pendingCount = listings.filter((l) => l.status === 'pending').length;
  const approvedCount = listings.filter((l) => l.status === 'approved').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
      {/* Newly Created Toast Banner */}
      {showCreatedBanner && (
        <div className="flex items-center justify-between p-4 mb-8 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Listing submitted successfully!</strong> It has been recorded as{' '}
              <span className="underline decoration-amber-500 font-semibold text-amber-300">
                Pending Review
              </span>
              . You can track its status below.
            </span>
          </div>
          <button
            onClick={() => setShowCreatedBanner(false)}
            className="text-xs text-zinc-400 hover:text-white ml-3 px-2 py-1 rounded bg-[#181818] border border-[#2b2b2b]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#161616] text-zinc-400 border border-[#262626] mb-2">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Seller Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your Affiliate Listings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Logged in as <span className="text-zinc-200 font-medium">{sellerEmail}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchListings}
            disabled={loading}
            title="Refresh listings"
            className="p-2.5 rounded-lg text-zinc-400 hover:text-white bg-[#141414] hover:bg-[#1c1c1c] border border-[#262626] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Listing</span>
          </Link>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Total Listings</p>
            <p className="text-2xl font-bold text-white mt-1">{listings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#1c1c1c] border border-[#262626] flex items-center justify-center text-zinc-400">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-500 uppercase tracking-wider font-medium">Pending Review</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950/30 border border-amber-800/40 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-500 uppercase tracking-wider font-medium">Approved</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {error && (
        <div className="flex items-start gap-2.5 p-4 mb-6 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 rounded-xl bg-[#141414] border border-[#222222] animate-pulse" />
          <div className="h-48 rounded-xl bg-[#141414] border border-[#222222] animate-pulse" />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#141414] border border-[#222222] rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#1c1c1c] border border-[#262626] flex items-center justify-center mx-auto text-zinc-500 mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">No listings submitted yet</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto mb-6">
            Submit your first affiliate program so creators can begin reviewing your offer.
          </p>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Listing</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="h-10 w-48 bg-[#141414] rounded mb-6 animate-pulse" />
          <div className="h-64 bg-[#141414] rounded-2xl animate-pulse" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
