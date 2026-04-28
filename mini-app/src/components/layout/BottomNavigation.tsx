'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTelegram } from '@/hooks/useTelegram';
import { translations } from '@/lib/translations';

export function BottomNavigation() {
  const pathname = usePathname();
  const { webApp, lang } = useTelegram();
  const t = translations[lang || 'kg'];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] border-t border-slate-800 px-8 py-3 pb-safe flex justify-around items-center bg-slate-900/95 backdrop-blur-xl"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)'
      }}
    >
      <Link 
        href={`/?lang=${lang}`}
        className={cn(
          "flex flex-col items-center gap-1.5 p-3 px-6 rounded-2xl transition-all duration-300 active:scale-90",
          pathname === '/' 
            ? "text-orange-500 bg-orange-500/10 shadow-inner" 
            : "text-slate-500 hover:text-slate-300"
        )}
      >
        <div className="relative">
          <Home size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
          {pathname === '/' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{t.home}</span>
      </Link>

      <Link 
        href={`/orders?lang=${lang}`}
        className={cn(
          "flex flex-col items-center gap-1.5 p-3 px-6 rounded-2xl transition-all duration-300 active:scale-90",
          pathname === '/orders' 
            ? "text-orange-500 bg-orange-500/10 shadow-inner" 
            : "text-slate-500 hover:text-slate-300"
        )}
      >
        <div className="relative">
          <ReceiptText size={24} strokeWidth={pathname === '/orders' ? 2.5 : 2} />
          {pathname === '/orders' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{t.orders}</span>
      </Link>
    </div>
  );
}
