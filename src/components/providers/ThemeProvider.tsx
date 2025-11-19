'use client';

import { ReactNode } from 'react';
import { useTelegramApp } from './TelegramAppProvider';

type Props = {
  children: ReactNode;
};

const ThemeProvider = ({ children }: Props) => {
  const tgWebApp = useTelegramApp();

  return (
    <main className={`${tgWebApp?.colorScheme ?? 'dark'} bg-background text-foreground`}>
      {children}
    </main>
  );
};

export default ThemeProvider;
