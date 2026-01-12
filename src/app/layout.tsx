import Providers from '@/components/providers';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import Navigation from '@/components/ui/Navigation';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Noto_Sans_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const font = Noto_Sans_Display({
  subsets: ['latin', 'cyrillic'],
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
    <html lang="en" suppressHydrationWarning className={font.className}>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js?59" strategy="beforeInteractive" />
      </head>
      <body className="antialiased">
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
