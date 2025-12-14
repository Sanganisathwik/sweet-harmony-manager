import { Sweet } from '@/types/database';
import { SweetCard } from './SweetCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

interface SweetGridProps {
  sweets: Sweet[] | undefined;
  isLoading: boolean;
  onPurchase?: (sweet: Sweet) => void;
  purchasingId?: string | null;
  showPurchaseButton?: boolean;
}

export function SweetGrid({ sweets, isLoading, onPurchase, purchasingId, showPurchaseButton }: SweetGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!sweets?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground/50" />
        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">No sweets found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sweets.map((sweet) => (
        <SweetCard
          key={sweet.id}
          sweet={sweet}
          onPurchase={() => onPurchase?.(sweet)}
          isLoading={purchasingId === sweet.id}
          showPurchaseButton={showPurchaseButton}
        />
      ))}
    </div>
  );
}
