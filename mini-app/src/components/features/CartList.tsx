'use client';

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { translations } from '@/lib/translations';

export function CartList() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const { lang } = useTelegram();
  const t = translations[lang || 'kg'];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🛒</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{t.cartEmpty}</h3>
        <p className="text-slate-400 text-sm max-w-[200px]">
          {t.goMenu}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-white uppercase text-xs tracking-widest">{t.yourOrders}</h3>
        <button 
          onClick={clearCart}
          className="text-xs text-red-400 hover:bg-red-900/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 font-bold border border-red-900/30"
        >
          <Trash2 size={14} /> {t.clear}
        </button>
      </div>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden bg-slate-900 border-2 border-slate-700">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
              <p className="font-bold text-orange-400 text-sm mt-1">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-1.5 border border-slate-700/50 shadow-inner">
              <button 
                onClick={() => items.length === 1 && item.quantity === 1 ? clearCart() : updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-slate-800 text-white transition-colors"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="w-4 text-center text-sm font-black text-white">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-slate-800 text-white transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{t.total}</span>
        <span className="text-2xl font-black text-white tracking-tight">{formatPrice(getTotalPrice())}</span>
      </div>
    </div>
  );
}
