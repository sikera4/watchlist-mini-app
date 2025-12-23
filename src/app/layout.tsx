import Providers from '@/components/providers';
import Navigation from '@/components/ui/Navigation';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Watchlist Mini App',
  description: 'A simple watchlist application built with Next.js and TMDB API',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js?59" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <NextIntlClientProvider>
            <Providers>
              {children}
              <Navigation />
            </Providers>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
