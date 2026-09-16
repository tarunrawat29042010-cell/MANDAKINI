'use client';

import { Listing } from '@/types';
import { ExternalLink, Clock, CheckCircle2, XCircle, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [imgError, setImgError] = useState(false);

  const formattedDate = new Date(listing.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getStatusBadge = () => {
    switch (listing.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/40 text-rose-400 border border-rose-800/50">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/40 text-amber-400 border border-amber-800/50">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-[#141414] hover:bg-[#171717] border border-[#222222] hover:border-[#2f2f2f] rounded-xl p-5 sm:p-6 transition-all">
      {/* Top Header: Image, Title, Niche, Status */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {listing.image_url && !imgError ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#1c1c1c] border border-[#262626] shrink-0">
                <Image
                  src={listing.image_url}
                  alt={listing.product_name}
                  fill
                  sizes="48px"
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-[#1c1c1c] border border-[#262626] flex items-center justify-center shrink-0 text-zinc-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="font-medium text-base text-zinc-100 group-hover:text-white transition-colors">
                {listing.product_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#2a2a2a]">
                  <Tag className="w-3 h-3 text-zinc-500" />
                  {listing.niche}
                </span>
                <span className="text-xs text-zinc-500">• {formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">{getStatusBadge()}</div>
        </div>

        {/* Pitch */}
        <p className="text-sm text-zinc-300 leading-relaxed bg-[#0f0f0f] p-3.5 rounded-lg border border-[#1d1d1d] mb-4">
          &ldquo;{listing.pitch}&rdquo;
        </p>
      </div>

      {/* Footer Info: Commission & Affiliate Link */}
      <div className="pt-3 border-t border-[#1e1e1e] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-zinc-500">Commission:</span>
          <span className="font-medium text-zinc-200">
            {listing.commission_info || 'Not specified'}
          </span>
        </div>

        <a
          href={listing.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline font-medium group/link"
        >
          <span>Affiliate Program</span>
          <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
}
