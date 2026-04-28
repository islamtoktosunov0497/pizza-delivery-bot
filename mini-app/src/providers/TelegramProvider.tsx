'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface TelegramContextType {
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({ isReady: false });

export const useTelegramContext = () => useContext(TelegramContext);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const initTelegram = async () => {
        // Wait briefly for telegram web app script to load and initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsReady(true);
      };

      initTelegram();
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ isReady }}>
      <div className={`min-h-[100dvh] w-full bg-slate-50 relative pb-20 overflow-x-hidden ${isReady ? 'opacity-100 transition-opacity duration-300' : 'opacity-0'}`}>
        {children}
      </div>
    </TelegramContext.Provider>
  );
}
