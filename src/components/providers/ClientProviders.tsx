'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import TelegramAppProvider from './TelegramAppProvider';
import ThemeProvider from './ThemeProvider';

type Props = {
  children: ReactNode;
};

const ClientProviders = ({ children }: Props) => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <TelegramAppProvider>
        <HeroUIProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <ToastProvider />
        </HeroUIProvider>
      </TelegramAppProvider>
    </QueryClientProvider>
  );
};

export default ClientProviders;
