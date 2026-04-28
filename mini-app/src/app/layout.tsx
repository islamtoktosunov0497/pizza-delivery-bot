import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/providers/TelegramProvider";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pizza Delivery App",
  description: "Telegram Mini App for ordering pizza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <TelegramProvider>
          <main className="min-h-screen bg-slate-50 pb-24">
            {children}
          </main>
          <BottomNavigation />
        </TelegramProvider>
      </body>
    </html>
  );
}
