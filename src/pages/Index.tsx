import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { SweetFilters } from '@/components/sweets/SweetFilters';
import { SweetGrid } from '@/components/sweets/SweetGrid';
import { useSweets, usePurchaseSweet } from '@/hooks/useSweets';
import { useAuth } from '@/contexts/AuthContext';
import { Sweet, SweetCategory } from '@/types/database';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-sweets.jpg';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<SweetCategory | 'all'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const filters = useMemo(() => ({
    search: search || undefined,
    category: category !== 'all' ? category : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  }), [search, category, minPrice, maxPrice]);

  const { data: sweets, isLoading } = useSweets(filters);
  const purchaseMutation = usePurchaseSweet();

  const handlePurchase = async (sweet: Sweet) => {
    if (!user) {
      toast.error('Please sign in to make a purchase');
      navigate('/auth');
      return;
    }

    if (sweet.quantity === 0) {
      toast.error('This item is out of stock');
      return;
    }

    setPurchasingId(sweet.id);
    try {
      await purchaseMutation.mutateAsync({
        sweetId: sweet.id,
        quantity: 1,
        userId: user.id,
      });
    } finally {
      setPurchasingId(null);
    }
  };

  const scrollToSweets = () => {
    document.getElementById('sweets-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Delicious sweets"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        </div>
        <div className="container relative z-10 flex h-full items-center">
          <div className="max-w-xl">
            <h1 className="font-serif text-5xl font-bold leading-tight text-foreground md:text-6xl">
              Indulge in <span className="text-primary">Sweet</span> Perfection
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Discover our handcrafted collection of premium chocolates, pastries, and confections. 
              Each treat is made with love and the finest ingredients.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={scrollToSweets}>
                Browse Sweets
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              {!user && (
                <Button size="lg" variant="outline" onClick={() => navigate('/auth?mode=signup')}>
                  Create Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sweets Section */}
      <main id="sweets-section" className="container py-12">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground">Our Collection</h2>
          <p className="mt-2 text-muted-foreground">
            Browse our selection of delicious treats
          </p>
        </div>

        <SweetFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
        />

        <div className="mt-8">
          <SweetGrid
            sweets={sweets}
            isLoading={isLoading}
            onPurchase={handlePurchase}
            purchasingId={purchasingId}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Sweet Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
