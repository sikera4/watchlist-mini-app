import Providers from '@/components/providers';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import Navigation from '@/components/ui/Navigation';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Noto_Sans_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ViewTransition } from 'react';

const TELEGRAM_THEME_BOOTSTRAP = `
  (() => {
    const root = document.documentElement;
    const webApp = window.Telegram && window.Telegram.WebApp;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const getLaunchParameter = (name) => {
      const searchParameters = new URLSearchParams(window.location.search);
      const hashParameters = new URLSearchParams(window.location.hash.slice(1));

      return searchParameters.get(name) || hashParameters.get(name);
    };

    const parseLaunchTheme = () => {
      const serializedTheme = getLaunchParameter('tgWebAppThemeParams');

      if (!serializedTheme) {
        return null;
      }

      try {
        return JSON.parse(serializedTheme);
      } catch {
        return null;
      }
    };

    const isDarkColor = (color) => {
      if (!/^#[0-9a-f]{6}$/i.test(color || '')) {
        return prefersDark;
      }

      const red = Number.parseInt(color.slice(1, 3), 16);
      const green = Number.parseInt(color.slice(3, 5), 16);
      const blue = Number.parseInt(color.slice(5, 7), 16);

      return (red * 0.299 + green * 0.587 + blue * 0.114) / 255 < 0.5;
    };

    const themeParams = webApp && webApp.themeParams
      ? webApp.themeParams
      : parseLaunchTheme();
    const colorScheme = webApp && webApp.colorScheme
      ? webApp.colorScheme
      : themeParams && themeParams.bg_color
        ? isDarkColor(themeParams.bg_color) ? 'dark' : 'light'
        : prefersDark ? 'dark' : 'light';

    root.classList.toggle('dark', colorScheme === 'dark');
    root.dataset.theme = colorScheme;
    root.style.colorScheme = colorScheme;

    if (themeParams) {
      const variables = {
        bg_color: '--tg-theme-bg-color',
        text_color: '--tg-theme-text-color',
        hint_color: '--tg-theme-hint-color',
        link_color: '--tg-theme-link-color',
        button_color: '--tg-theme-button-color',
        button_text_color: '--tg-theme-button-text-color'
      };

      Object.keys(variables).forEach((key) => {
        if (/^#[0-9a-f]{6}$/i.test(themeParams[key] || '')) {
          root.style.setProperty(variables[key], themeParams[key]);
        }
      });
    }
  })();
`;

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
        <Script id="telegram-theme-bootstrap" strategy="beforeInteractive">
          {TELEGRAM_THEME_BOOTSTRAP}
        </Script>
      </head>
      <body className="telegram-theme-surface min-h-screen antialiased">
        <ReactQueryProvider>
          <NextIntlClientProvider>
            <Providers>
              <ViewTransition name="page-content">
                {children}
                <Navigation />
              </ViewTransition>
            </Providers>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
