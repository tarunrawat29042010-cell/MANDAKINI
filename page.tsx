import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Stage 1 Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 1: Seller Portal & Listing Intake</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
          Connect your small brand with{' '}
          <span className="text-emerald-400">YouTube creators</span>.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
          MANDAKINI is an affiliate directory designed specifically for small sellers.
          List your affiliate program, set your commissions, and attract creators eager to promote your products.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <span>Sign Up & Create Listing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-[#161616] hover:bg-[#1f1f1f] border border-[#262626] transition-colors"
          >
            Seller Log In
          </Link>
        </div>

        {/* Feature Cards / Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 border-t border-[#1a1a1a]">
          <div className="p-5 rounded-xl bg-[#121212] border border-[#1f1f1f]">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Curated Quality</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every listing is manually verified to ensure high-quality, authentic products for creator audiences.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121212] border border-[#1f1f1f]">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Direct Affiliate Links</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use your existing affiliate tracking software. Creators join your program directly through your link.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121212] border border-[#1f1f1f]">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Targeted Niches</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Categorized by Tech, Education, Finance, Lifestyle, Health, and more for exact creator audience match.
            </p>
          </div>
        </div>

        {/* Workflow Checklist */}
        <div className="mt-12 p-6 rounded-xl bg-[#111111] border border-[#1f1f1f] text-left">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            How Stage 1 Works For Sellers
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>1. Create your seller account with your email and password</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>2. Submit your product, affiliate URL, 300-character pitch, and optional image</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>3. Track status (<span className="text-amber-400 font-medium">Pending</span> → <span className="text-emerald-400 font-medium">Approved</span>) in real-time on your dashboard</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
