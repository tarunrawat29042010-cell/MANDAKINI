-- ==============================================================================
-- MANDAKINI — Stage 1 Supabase Database Schema & Storage Setup
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- It creates:
-- 1. `sellers` table (linked to auth.users)
-- 2. Automatic trigger to create a seller row on auth signup
-- 3. `listings` table (with pending status, constraints, and RLS)
-- 4. Supabase Storage bucket for product/brand images
-- 5. Helpful admin queries for reviewing & approving listings
-- ==============================================================================

-- Enable UUID extension (enabled by default in Supabase, but good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. SELLERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on sellers
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Policy: Sellers can read their own profile
CREATE POLICY "Sellers can read own profile"
    ON public.sellers
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Policy: Sellers can update their own profile
CREATE POLICY "Sellers can update own profile"
    ON public.sellers
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. AUTOMATIC TRIGGER FOR AUTH SIGNUP
-- ------------------------------------------------------------------------------
-- Whenever a seller signs up via Supabase Auth, automatically insert a row in public.sellers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.sellers (id, email, created_at)
    VALUES (NEW.id, NEW.email, now())
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it already exists, then re-create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. LISTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    affiliate_link TEXT NOT NULL,
    pitch VARCHAR(300) NOT NULL,
    image_url TEXT,
    niche TEXT NOT NULL CHECK (niche IN ('Tech', 'Education', 'Finance', 'Lifestyle', 'Health', 'Other')),
    commission_info TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast queries by seller and by status
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);

-- Enable Row Level Security (RLS) on listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Policy: Sellers can view ONLY their own listings
CREATE POLICY "Sellers can view own listings"
    ON public.listings
    FOR SELECT
    TO authenticated
    USING (auth.uid() = seller_id);

-- Policy: Sellers can insert listings with their own seller_id and status = 'pending'
CREATE POLICY "Sellers can insert own listings"
    ON public.listings
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = seller_id
        AND (status = 'pending' OR status IS NULL)
    );

-- Policy: Sellers can update their own listings (preventing them from changing status)
CREATE POLICY "Sellers can update own listings"
    ON public.listings
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = seller_id)
    WITH CHECK (
        auth.uid() = seller_id
        -- Ensure status is not modified by regular user
        AND status = (SELECT l.status FROM public.listings l WHERE l.id = id)
    );

-- ------------------------------------------------------------------------------
-- 4. STORAGE BUCKET FOR LISTING IMAGES
-- ------------------------------------------------------------------------------
-- Create bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Allow public read access to listing images
CREATE POLICY "Public read listing images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'listing-images');

-- Storage Policy: Allow authenticated users (sellers) to upload listing images
CREATE POLICY "Authenticated users can upload listing images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'listing-images');

-- Storage Policy: Allow users to update their uploaded images
CREATE POLICY "Users can update own listing images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'listing-images' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- ------------------------------------------------------------------------------
-- 5. ADMIN UTILITY QUERIES (RUN THESE IN SUPABASE DASHBOARD AS ADMIN)
-- ------------------------------------------------------------------------------
-- A) View all pending listings awaiting approval:
-- SELECT id, product_name, niche, commission_info, affiliate_link, pitch, status, created_at
-- FROM public.listings
-- WHERE status = 'pending'
-- ORDER BY created_at DESC;

-- B) Approve a specific listing by ID:
-- UPDATE public.listings
-- SET status = 'approved', updated_at = now()
-- WHERE id = '<listing-uuid-here>';

-- C) Approve all pending listings at once:
-- UPDATE public.listings
-- SET status = 'approved', updated_at = now()
-- WHERE status = 'pending';
