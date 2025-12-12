import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Sweet, SweetCategory } from '@/types/database';
import { toast } from 'sonner';

interface SweetsFilters {
  search?: string;
  category?: SweetCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
}

export function useSweets(filters?: SweetsFilters) {
  return useQuery({
    queryKey: ['sweets', filters],
    queryFn: async () => {
      let query = supabase
        .from('sweets')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Sweet[];
    },
  });
}

export function useCreateSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sweets')
        .insert(sweet)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add sweet: ' + error.message);
    },
  });
}

export function useUpdateSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sweet> & { id: string }) => {
      const { data, error } = await supabase
        .from('sweets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update sweet: ' + error.message);
    },
  });
}

export function useDeleteSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete sweet: ' + error.message);
    },
  });
}

export function usePurchaseSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity, userId }: { sweetId: string; quantity: number; userId: string }) => {
      // First get the sweet to check quantity and price
      const { data: sweet, error: sweetError } = await supabase
        .from('sweets')
        .select('*')
        .eq('id', sweetId)
        .single();

      if (sweetError) throw sweetError;
      if (!sweet) throw new Error('Sweet not found');
      if (sweet.quantity < quantity) throw new Error('Insufficient stock');

      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          sweet_id: sweetId,
          quantity,
          total_price: sweet.price * quantity,
        });

      if (purchaseError) throw purchaseError;

      // Update sweet quantity
      const { error: updateError } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity - quantity })
        .eq('id', sweetId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Purchase successful!');
    },
    onError: (error) => {
      toast.error('Purchase failed: ' + error.message);
    },
  });
}

export function useRestockSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { data: sweet, error: fetchError } = await supabase
        .from('sweets')
        .select('quantity')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('sweets')
        .update({ quantity: (sweet?.quantity || 0) + quantity })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Stock updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update stock: ' + error.message);
    },
  });
}
