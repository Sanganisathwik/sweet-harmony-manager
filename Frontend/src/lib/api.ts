import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests - using Supabase session
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error getting auth session:', error);
  }
  return config;
});

// Sweets API
export const sweetsApi = {
  getAll: async (filters?: { 
    category?: string; 
    minPrice?: number; 
    maxPrice?: number; 
    search?: string 
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);
    
    const response = await api.get(`/sweets?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/sweets/${id}`);
    return response.data;
  },

  create: async (sweet: {
    name: string;
    description?: string;
    category: string;
    price: number;
    quantity: number;
    image_url?: string;
  }) => {
    const response = await api.post('/sweets', sweet);
    return response.data;
  },

  update: async (id: string, updates: Partial<{
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    image_url: string;
  }>) => {
    const response = await api.put(`/sweets/${id}`, updates);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/sweets/${id}`);
    return response.data;
  },

  seed: async () => {
    const response = await api.post('/sweets/seed');
    return response.data;
  },
};

// Purchases API - now uses JWT authentication (user ID extracted from token)
export const purchasesApi = {
  getAll: async () => {
    const response = await api.get('/purchases');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  create: async (purchase: { sweet_id: string; quantity: number }) => {
    const response = await api.post('/purchases', purchase);
    return response.data;
  },
};

// Auth API
export const authApi = {
  signUp: async (data: { email: string; password: string; full_name?: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  signOut: async () => {
    const response = await api.post('/auth/signout');
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },

  updateProfile: async (data: { full_name?: string; avatar_url?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

export default api;
