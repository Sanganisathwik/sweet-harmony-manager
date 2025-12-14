import { Sweet, CATEGORY_LABELS } from '@/types/database';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: () => void;
  isLoading?: boolean;
  showPurchaseButton?: boolean;
}

export function SweetCard({ sweet, onPurchase, isLoading, showPurchaseButton = true }: SweetCardProps) {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {sweet.image_url ? (
          <img
            src={sweet.image_url}
            alt={sweet.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute left-3 top-3"
        >
          {CATEGORY_LABELS[sweet.category]}
        </Badge>
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
          {sweet.name}
        </h3>
        {sweet.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {sweet.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${Number(sweet.price).toFixed(2)}
          </span>
          <span className={cn(
            "text-sm",
            isOutOfStock ? "text-destructive" : "text-muted-foreground"
          )}>
            {sweet.quantity} in stock
          </span>
        </div>
      </CardContent>
      {showPurchaseButton && (
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={onPurchase}
            disabled={isOutOfStock || isLoading}
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isLoading ? 'Processing...' : 'Purchase'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
