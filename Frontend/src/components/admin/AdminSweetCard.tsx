import { useState } from 'react';
import { Sweet, CATEGORY_LABELS } from '@/types/database';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, Edit, Trash2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface AdminSweetCardProps {
  sweet: Sweet;
  onEdit: () => void;
  onDelete: () => void;
  onRestock: (quantity: number) => void;
  isDeleting?: boolean;
  isRestocking?: boolean;
}

export function AdminSweetCard({
  sweet,
  onEdit,
  onDelete,
  onRestock,
  isDeleting,
  isRestocking,
}: AdminSweetCardProps) {
  const [restockAmount, setRestockAmount] = useState('10');
  const isOutOfStock = sweet.quantity === 0;

  const handleRestock = () => {
    const amount = parseInt(restockAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      onRestock(amount);
      setRestockAmount('10');
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {sweet.image_url ? (
          <img
            src={sweet.image_url}
            alt={sweet.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <Badge variant="secondary" className="absolute left-3 top-3">
          {CATEGORY_LABELS[sweet.category]}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
            {sweet.name}
          </h3>
          <span className="text-lg font-bold text-primary">
            ${Number(sweet.price).toFixed(2)}
          </span>
        </div>
        <p className={cn(
          "mt-2 text-sm font-medium",
          isOutOfStock ? "text-destructive" : "text-muted-foreground"
        )}>
          Stock: {sweet.quantity}
        </p>
        
        <div className="mt-4 flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={restockAmount}
            onChange={(e) => setRestockAmount(e.target.value)}
            className="w-20"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleRestock}
            disabled={isRestocking}
          >
            <Plus className="mr-1 h-4 w-4" />
            {isRestocking ? 'Adding...' : 'Restock'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
          <Edit className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="flex-1">
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Sweet</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{sweet.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
