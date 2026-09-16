'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { NICHE_OPTIONS, NicheCategory } from '@/types';
import {
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  ShoppingBag,
  Percent,
  HelpCircle,
} from 'lucide-react';
import Image from 'next/image';

export default function CreateListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productName, setProductName] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [pitch, setPitch] = useState('');
  const [niche, setNiche] = useState<NicheCategory>('Tech');
  const [commissionInfo, setCommissionInfo] = useState('');
  
  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setSellerId(user.id);
      } else {
        router.push('/login?redirectedFrom=/listings/new');
      }
    });
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('Image size must be less than 4MB');
      return;
    }

    setError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sellerId) {
      setError('You must be signed in to create a listing.');
      return;
    }

    if (!productName.trim()) {
      setError('Product or brand name is required.');
      return;
    }

    if (!affiliateLink.trim()) {
      setError('Affiliate program link is required.');
      return;
    }

    // Validate URL
    let formattedUrl = affiliateLink.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError('Please provide a valid URL for the affiliate program.');
      return;
    }

    if (!pitch.trim()) {
      setError('Pitch is required.');
      return;
    }

    if (pitch.length > 300) {
      setError('Pitch must be 300 characters or fewer.');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      let uploadedImageUrl: string | null = null;

      // 1. Upload image to Supabase Storage if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const sanitizedFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${sellerId}/${sanitizedFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn('Image upload failed, proceeding without image:', uploadError.message);
          // If storage bucket is not configured yet, we can continue or inform
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filePath);

          uploadedImageUrl = publicUrlData.publicUrl;
        }
      }

      // 2. Insert into `listings` table
      // Notice: `status` is explicitly set to 'pending'
      const { error: insertError } = await supabase.from('listings').insert({
        seller_id: sellerId,
        product_name: productName.trim(),
        affiliate_link: formattedUrl,
        pitch: pitch.trim(),
        image_url: uploadedImageUrl,
        niche,
        commission_info: commissionInfo.trim() || null,
        status: 'pending',
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 3. Redirect to dashboard to view listing status
      router.push('/dashboard?created=true');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit listing. Please check your connection.';
      setError(msg);
      setSubmitting(false);
    }
  };

  const remainingChars = 300 - pitch.length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Affiliate Listing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Submit your product listing
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
          Provide your affiliate details so YouTube creators can evaluate and promote your brand.
          All listings are reviewed by the MANDAKINI team before publication.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 mb-6 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs sm:text-sm leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Listing Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5 sm:p-7 space-y-5">
          {/* Product/Brand Name */}
          <div>
            <label htmlFor="productName" className="block text-xs font-medium text-zinc-200 mb-1.5">
              Product or Brand Name <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                id="productName"
                type="text"
                required
                placeholder="e.g. Acme Cloud Analytics, Lumina Desk Lamp"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#262626] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Affiliate Link */}
          <div>
            <label htmlFor="affiliateLink" className="block text-xs font-medium text-zinc-200 mb-1.5">
              Affiliate Program Link (URL) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                id="affiliateLink"
                type="url"
                required
                placeholder="https://yourbrand.com/affiliates or Impact/Rewardful URL"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#262626] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Where creators register or apply to become your affiliate.
            </p>
          </div>

          {/* Niche & Commission Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Niche Dropdown */}
            <div>
              <label htmlFor="niche" className="block text-xs font-medium text-zinc-200 mb-1.5">
                Niche / Category <span className="text-emerald-400">*</span>
              </label>
              <select
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value as NicheCategory)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#262626] text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {NICHE_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Commission Info */}
            <div>
              <label htmlFor="commissionInfo" className="block text-xs font-medium text-zinc-200 mb-1.5">
                Commission Info <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  id="commissionInfo"
                  type="text"
                  placeholder="e.g. 20% recurring or $50 per sale"
                  value={commissionInfo}
                  onChange={(e) => setCommissionInfo(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#262626] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Short Pitch */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="pitch" className="block text-xs font-medium text-zinc-200">
                Short Pitch for Creators <span className="text-emerald-400">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  remainingChars < 20
                    ? 'text-amber-400 font-medium'
                    : 'text-zinc-500'
                }`}
              >
                {pitch.length} / 300 characters
              </span>
            </div>
            <textarea
              id="pitch"
              required
              rows={4}
              maxLength={300}
              placeholder="Why should YouTube creators promote this? Mention your target audience, conversion rates, product USP, or high retention."
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#262626] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block text-xs font-medium text-zinc-200 mb-1.5">
              Product / Brand Logo Image <span className="text-zinc-500 font-normal">(optional)</span>
            </label>

            {imagePreview ? (
              <div className="relative flex items-center gap-4 p-3 rounded-lg bg-[#0d0d0d] border border-[#262626]">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-[#1a1a1a] border border-[#2f2f2f] shrink-0">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-medium text-zinc-200 truncate">{imageFile?.name}</p>
                  <p className="text-zinc-500 mt-0.5">
                    {imageFile ? (imageFile.size / 1024).toFixed(1) : 0} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-[#1f1f1f] transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#2b2b2b] hover:border-emerald-500/60 rounded-lg p-5 text-center cursor-pointer transition-colors bg-[#0f0f0f] hover:bg-[#121212]"
              >
                <UploadCloud className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-300 font-medium">
                  Click to upload product or logo image
                </p>
                <p className="text-[11px] text-zinc-600 mt-1">
                  PNG, JPG, or WEBP (up to 4MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Curation Notice */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#111111] border border-[#1d1d1d] text-xs text-zinc-400">
          <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Every listing starts with <strong className="text-amber-400">Pending</strong> status.
            Once approved by the admin in Supabase, it will become active in future stages for creators.
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {submitting ? (
            <span>Submitting Listing...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Listing for Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
