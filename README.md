# MANDAKINI — Affiliate Directory (Stage 1)

> An affiliate directory that connects small sellers with YouTube creators.

Stage 1 focuses on **Seller Onboarding & Listing Submission**:
- **Seller Authentication**: Email & password signup/login powered by Supabase Auth.
- **Listing Submission**: Product name, affiliate link, short pitch (max 300 characters), optional product logo/image (Supabase Storage), niche/category dropdown, and commission info.
- **Listing Status**: Created as `pending` by default, reviewed and approved by admin in Supabase.
- **Seller Dashboard**: Visual cards showing submitted listings and their real-time approval status (`Pending Review` vs `Approved`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Near-black `#0d0d0d` theme with emerald `#10b981` accents)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Row-Level Security)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Database Schema Setup
Run the SQL script located in [`supabase/schema.sql`](./supabase/schema.sql) in your [Supabase SQL Editor](https://supabase.com/dashboard). This will:
- Create `public.sellers` table.
- Create `public.listings` table with RLS.
- Set up automatic trigger on user registration (`on_auth_user_created`).
- Set up `listing-images` storage bucket.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

1. Import this repository into [Vercel](https://vercel.com/new).
2. Set the following **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy**.
