'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import TelegramAppProvider, { useTelegramApp } from './TelegramAppProvider';
import { HeroUIProvider, ToastProvider } from '@heroui/react';

type Props = {
  children: ReactNode;
};

const ClientProviders = ({ children }: Props) => {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const tgWebApp = useTelegramApp();

  if (tgWebApp?.colorScheme) {
    setColorMode(tgWebApp.colorScheme);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TelegramAppProvider>
        <HeroUIProvider>
          <main className={`${colorMode} bg-background text-foreground`}>{children}</main>
          <ToastProvider />
        </HeroUIProvider>
      </TelegramAppProvider>
    </QueryClientProvider>
  );
};

export default ClientProviders;
