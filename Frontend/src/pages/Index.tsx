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
              Discover our handcrafted collection of premium Sweets. 
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

      {/* Sweet Traditions Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-100 via-pink-100 to-amber-100 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-amber-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
          Our Sweet Traditions
        </h2>

        {/* Horizontal Layout */}
        <div className="space-y-16">
          {/* Traditional - Image Left */}
          <div className="flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm bg-white/60 rounded-3xl p-8 shadow-xl border border-orange-200/50">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-orange-300">
                <img 
                  src="/sweetsImgs/TraditionalSweets.jpg" 
                  alt="Traditional Sweets"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4 text-gray-800 font-serif">Traditional</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                From humble beginnings in a small town to a beloved household name, We have been crafting traditional Indian delicacies with love and expertise for generations. Each sweet tells a story of heritage, flavor, and sweet memories shared across families.
              </p>
            </div>
          </div>

          {/* Purity - Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 backdrop-blur-sm bg-white/60 rounded-3xl p-8 shadow-xl border border-pink-200/50">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-pink-300">
                <img 
                  src="/sweetsImgs/PureGhee.jpg" 
                  alt="Purity - Pure Ghee"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-3xl font-bold mb-4 text-gray-800 font-serif">Purity</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Crafted with purity and tradition, our sweets are made with our finest cattle ghee, ensuring each bite is a taste of pure bliss.
              </p>
            </div>
          </div>

          {/* Social Responsibility - Image Left */}
          <div className="flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm bg-white/60 rounded-3xl p-8 shadow-xl border border-amber-200/50">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-amber-300">
                <img 
                  src="/sweetsImgs/Community.jpg" 
                  alt="Social Responsibility - Education"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4 text-gray-800 font-serif">Social Responsibility</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                We not only delighted taste buds but also nurtured minds. By establishing schools and colleges for students, we embody a commitment to uplift the community and pave the way for a brighter future.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Sweet Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
