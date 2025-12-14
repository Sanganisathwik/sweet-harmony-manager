import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CATEGORY_LABELS, Sweet, SweetCategory } from '@/types/database';

const sweetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  category: z.enum(['sweets', 'snacks', 'premium_sweets', 'gift_boxes', 'seasonal'] as const),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Price must be a positive number'),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), 'Quantity must be a non-negative integer'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type SweetFormData = z.infer<typeof sweetSchema>;

interface SweetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading: boolean;
  initialData?: Sweet;
}

export function SweetForm({ open, onOpenChange, onSubmit, isLoading, initialData }: SweetFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SweetFormData>({
    resolver: zodResolver(sweetSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'sweets',
      price: '0',
      quantity: '0',
      image_url: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        category: initialData.category,
        price: String(initialData.price),
        quantity: String(initialData.quantity),
        image_url: initialData.image_url || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        category: 'sweets',
        price: '0',
        quantity: '0',
        image_url: '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: SweetFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || null,
      category: data.category,
      price: Number(data.price),
      quantity: Number(data.quantity),
      image_url: data.image_url || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {initialData ? 'Edit Sweet' : 'Add New Sweet'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register('name')} placeholder="Chocolate Truffle" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="A delicious treat..." rows={3} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={watch('category')} onValueChange={(value: SweetCategory) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input id="price" type="number" step="0.01" min="0" {...register('price')} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input id="quantity" type="number" min="0" {...register('quantity')} />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" {...register('image_url')} placeholder="https://..." />
            {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Add Sweet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
