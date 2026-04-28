import { Product, useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { translations } from '@/lib/translations';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { lang, webApp } = useTelegram();
  const t = translations[lang || 'kg'];

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(product);
    webApp?.HapticFeedback.impactOccurred('light');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-[2rem] p-5 border border-slate-700/50 flex flex-col gap-4 transition-all hover:border-orange-500/30 group">
      <div className="relative">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-700 shadow-2xl mx-auto group-hover:border-orange-500/50 transition-colors duration-500">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
          />
        </div>
        {quantity > 0 && (
          <div className="absolute top-0 right-1/4 bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg animate-in zoom-in">
            {quantity}
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 text-center">
        <h3 className="font-bold text-xl text-white tracking-tight">{product.name}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 mt-2 mb-4 leading-relaxed px-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto bg-slate-900/50 p-2 rounded-2xl border border-slate-700/50">
          <span className="font-bold text-lg text-orange-400 ml-2">
            {formatPrice(product.price)}
          </span>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => quantity > 1 ? updateQuantity(product.id, quantity - 1) : removeItem(product.id)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm active:scale-90 transition-transform"
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <button 
                onClick={handleAdd}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm active:scale-90 transition-transform"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <Button 
              onClick={handleAdd} 
              size="sm"
              className="rounded-xl px-5 font-bold bg-orange-600 hover:bg-orange-500 text-white border-none h-10 shadow-lg shadow-orange-900/20"
            >
              {t.add}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
