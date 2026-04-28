'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserOrders } from '@/lib/api';
import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { ReceiptText, RotateCw, Loader2 } from 'lucide-react';
import { translations } from '@/lib/translations';

interface OrderItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, webApp, lang } = useTelegram();
  const { isReady } = useTelegramContext();
  const { addItem, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();
  const t = translations[lang || 'kg'];

  useEffect(() => {
    if (isReady) {
      const fetchOrders = async () => {
        try {
          const telegramId = user?.id?.toString() || '123456789';
          const data = await getUserOrders(telegramId, lang);
          setOrders(data);
        } catch (error) {
          console.error('Failed to fetch user orders:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [isReady, user?.id, lang]);

  const handleReorder = (order: Order) => {
    webApp?.HapticFeedback.impactOccurred('medium');
    clearCart();
    order.items.forEach((item) => {
      addItem(item.product);
      if (item.quantity > 1) {
        updateQuantity(item.product.id, item.quantity);
      }
    });
    router.push(`/?lang=${lang}`);
  };

  if (!isReady || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-800 flex items-center gap-2">
          <ReceiptText size={24} className="text-slate-400" /> {t.ordersTitle}
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {t.ordersDesc}
        </p>
      </header>

      <div className="p-5 pb-32 flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <ReceiptText size={40} className="text-slate-300" strokeWidth={1.5} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">{t.noOrders}</h3>
             <p className="text-slate-500 max-w-[240px] leading-relaxed">
               {t.noOrdersDesc}
             </p>
             <Button 
                onClick={() => router.push(`/?lang=${lang}`)}
                className="mt-6 font-semibold shadow-md shadow-orange-500/20"
             >
                {t.viewMenu}
             </Button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.orderNo} #{order.id}</span>
                  <span className="text-sm font-medium text-slate-600 mt-1">
                    {new Date(order.createdAt).toLocaleDateString(t.dateLang, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="bg-green-50 text-green-700 font-semibold px-3 py-1.5 rounded-lg text-sm border border-green-100">
                  {t.delivered}
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 rounded-xl p-2.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-white shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[15px] font-medium text-slate-800 flex items-center gap-2">
                        {item.product.name}
                        <span className="text-xs font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100">
                          x{item.quantity}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                <span className="text-slate-500 font-medium">{t.total}</span>
                <span className="text-lg font-bold text-slate-800">{formatPrice(order.totalAmount)}</span>
              </div>

              <Button 
                onClick={() => handleReorder(order)} 
                variant="outline"
                className="w-full border-orange-200 bg-orange-50/50 text-orange-700 hover:bg-orange-100/50 flex items-center gap-2 transition-all font-semibold"
              >
                <RotateCw size={18} strokeWidth={2.5} /> {t.reorder}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
