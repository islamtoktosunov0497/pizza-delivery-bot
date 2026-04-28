'use client';

import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { useCartStore } from '@/store/cartStore';
import { createOrder } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { CartList } from './CartList';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { user, onClose: closeTelegramApp, webApp, lang } = useTelegram();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const t = translations[lang || 'kg'];
  
  const [name, setName] = useState(user?.first_name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!phone && !user?.id) || !address) {
      setError(t.fillAll);
      webApp?.HapticFeedback.notificationOccurred('error');
      return;
    }

    if (items.length === 0) {
      setError(t.noProducts);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createOrder({
        telegramId: user?.id?.toString() || '123456789',
        name,
        phone,
        address,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotalPrice()
      });
      
      webApp?.HapticFeedback.notificationOccurred('success');
      clearCart();
      
      if (webApp) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         (webApp as any).showAlert(t.orderSuccess, () => {
             closeTelegramApp();
         });
      } else {
         alert(t.orderSuccess);
         onClose();
      }

    } catch (err) {
      setError(t.error);
      webApp?.HapticFeedback.notificationOccurred('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-slate-900 rounded-t-[3rem] z-[70] shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col max-h-[90vh] border-t border-slate-800",
          isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        <div className="w-full flex justify-center pt-4 pb-2" onClick={onClose} role="button">
          <div className="w-16 h-1.5 bg-slate-800 rounded-full" />
        </div>
        
        <div className="px-8 pb-5 pt-2 flex items-center justify-between border-b border-slate-800/50 shrink-0">
          <h2 className="text-2xl font-black text-white tracking-tight">{t.checkout}</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
          >
            <ChevronDown size={24} />
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-6 pb-[140px] no-scrollbar">
          <CartList />

          <form id="checkout-form" onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <h3 className="font-bold text-white uppercase text-xs tracking-widest border-b border-slate-800 pb-3">{t.deliveryInfo}</h3>
            
            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-2xl text-sm border border-red-900/30 font-bold animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">{t.fullName}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-white placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">{t.phone}</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-white placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">{t.address}</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                rows={3}
                className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-white placeholder:text-slate-600 font-medium resize-none"
                required
              />
            </div>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 pb-safe shadow-[0_-20px_40px_rgba(0,0,0,0.3)]">
          <Button 
            type="submit" 
            form="checkout-form" 
            className="w-full h-16 text-lg font-black bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-900/20 border-none uppercase tracking-tight"
            disabled={loading || items.length === 0}
          >
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> {t.wait}</span>
            ) : (
              t.confirmOrder
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
