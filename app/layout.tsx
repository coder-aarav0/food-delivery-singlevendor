import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Agentation } from 'agentation';

export const metadata: Metadata = {
  title: 'FreshMart | Hyperlocal Grocery Delivery',
  description: 'Order fresh groceries, dairy, produce, and daily essentials delivered to your doorstep in 30 minutes.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#15803D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { CartProvider } from '@/context/CartContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[var(--bg-app)] text-[var(--text-body)] antialiased">
        {process.env.NODE_ENV === 'development' && (
          <Agentation endpoint="http://localhost:4747" />
        )}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
