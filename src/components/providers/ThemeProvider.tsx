'use client';

import { ReactNode, useEffect } from 'react';
import { useTelegramApp } from './TelegramAppProvider';

type Props = {
  children: ReactNode;
};

const ThemeProvider = ({ children }: Props) => {
  const tgWebApp = useTelegramApp();

  useEffect(() => {
    if (!tgWebApp) {
      return;
    }

    const applyTheme = () => {
      const root = document.documentElement;
      const isDark = tgWebApp.colorScheme === 'dark';

      root.classList.toggle('dark', isDark);
      root.dataset.theme = tgWebApp.colorScheme;
      root.style.colorScheme = tgWebApp.colorScheme;
    };

    applyTheme();
    tgWebApp.onEvent('themeChanged', applyTheme);

    return () => {
      tgWebApp.offEvent('themeChanged', applyTheme);
    };
  }, [tgWebApp]);

  return <main className="telegram-theme-surface min-h-screen">{children}</main>;
};

export default ThemeProvider;
