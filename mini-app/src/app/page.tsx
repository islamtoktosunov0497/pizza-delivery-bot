'use client';

import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import { Product, useCartStore } from '@/store/cartStore';
import { ProductCard } from '@/components/features/ProductCard';
import { CheckoutModal } from '@/components/features/CheckoutModal';
import { Button } from '@/components/ui/Button';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useTelegram } from '@/hooks/useTelegram';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { isReady } = useTelegramContext();
  const { webApp, lang } = useTelegram();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = translations[lang || 'kg'];

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(lang),
          getCategories(lang)
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err?.message || 'Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };

    if (isReady) {
      fetchData();
    }
  }, [isReady, lang]);

  const filteredProducts = activeCategory 
    ? products.filter(p => p.categoryId === activeCategory)
    : products;

  if (!isReady || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center p-6 text-center bg-slate-900">
        <div className="bg-red-900/20 text-red-400 p-4 rounded-2xl mb-4 w-full border border-red-900/50">
          <p className="font-bold mb-1">{t.error}</p>
          <p className="text-sm break-words">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>{t.retry}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-32">
      {/* Header */}
      <header className="px-6 py-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {t.pizzaMenu.replace('🍕', '')} <span className="text-orange-500">Menu</span>
            </h1>
            <p className="text-slate-400 mt-1 font-medium">
              {t.chooseBest}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
             <span className="text-xl">🌟</span>
          </div>
        </div>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md py-4 mb-2">
        <div className="flex gap-3 overflow-x-auto px-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                webApp?.HapticFeedback.selectionChanged();
              }}
              className={cn(
                "whitespace-nowrap px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 border",
                activeCategory === cat.id
                  ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/40"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 grid grid-cols-1 gap-6 mt-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
           <span className="text-5xl mb-4">🍱</span>
           <p className="font-medium">Бул категорияда азырынча тамак жок</p>
        </div>
      )}

      {/* Cart Float Button */}
      {isClient && totalItems > 0 && (
        <div className="fixed bottom-24 left-0 right-0 px-6 z-40 transition-all duration-500 animate-in slide-in-from-bottom-10">
          <Button 
            onClick={() => {
              setIsCheckoutOpen(true);
              webApp?.HapticFeedback.impactOccurred('medium');
            }}
            size="lg" 
            className="w-full h-16 rounded-3xl bg-orange-600 hover:bg-orange-500 shadow-[0_12px_40px_rgba(234,88,12,0.4)] flex items-center justify-between px-6 border-none"
          >
            <div className="flex items-center gap-3 bg-white/20 py-2 px-4 rounded-2xl">
              <ShoppingBag size={22} className="text-white shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">{totalItems} {t.products}</div>
                <div className="font-black text-white text-lg tracking-tight">{formatPrice(totalPrice)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <span className="font-black text-white tracking-tight uppercase">{t.order}</span>
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg">→</span>
               </div>
            </div>
          </Button>
        </div>
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
