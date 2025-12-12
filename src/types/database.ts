export type AppRole = 'admin' | 'customer';

export type SweetCategory = 'chocolate' | 'candy' | 'pastry' | 'ice_cream' | 'cookies' | 'cake' | 'other';

export interface Sweet {
  id: string;
  name: string;
  description: string | null;
  category: SweetCategory;
  price: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  sweet_id: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

export const CATEGORY_LABELS: Record<SweetCategory, string> = {
  chocolate: 'Chocolate',
  candy: 'Candy',
  pastry: 'Pastry',
  ice_cream: 'Ice Cream',
  cookies: 'Cookies',
  cake: 'Cake',
  other: 'Other',
};
