export type ListingStatus = 'pending' | 'approved' | 'rejected';

export type NicheCategory =
  | 'Tech'
  | 'Education'
  | 'Finance'
  | 'Lifestyle'
  | 'Health'
  | 'Other';

export const NICHE_OPTIONS: NicheCategory[] = [
  'Tech',
  'Education',
  'Finance',
  'Lifestyle',
  'Health',
  'Other',
];

export interface Seller {
  id: string;
  email: string;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  product_name: string;
  affiliate_link: string;
  pitch: string;
  image_url: string | null;
  niche: NicheCategory;
  commission_info: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at?: string;
}
