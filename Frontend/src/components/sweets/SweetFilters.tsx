import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { CATEGORY_LABELS, SweetCategory } from '@/types/database';

interface SweetFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: SweetCategory | 'all';
  onCategoryChange: (value: SweetCategory | 'all') => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
}

export function SweetFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: SweetFiltersProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search sweets..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="$0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            min={0}
            step={0.01}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="$999"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            min={0}
            step={0.01}
          />
        </div>
      </div>
    </div>
  );
}
