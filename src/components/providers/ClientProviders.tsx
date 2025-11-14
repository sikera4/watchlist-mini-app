'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useColorMode } from '../ui/color-mode';
import { Provider } from '../ui/provider';
import TelegramAppProvider, { useTelegramApp } from './TelegramAppProvider';

type Props = {
  children: ReactNode;
};

const ClientProviders = ({ children }: Props) => {
  const { setColorMode } = useColorMode();

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
        <Provider>{children}</Provider>
      </TelegramAppProvider>
    </QueryClientProvider>
  );
};

export default ClientProviders;
