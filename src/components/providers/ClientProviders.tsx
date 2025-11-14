'use client';

import { ReactNode, useState } from 'react';
import { Provider } from '../ui/provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTelegramApp } from '@/hooks/useTelegramApp';
import { useColorMode } from '../ui/color-mode';
import AddUserToFirebase from './AddUserToFirebase';

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

  const { tgWebApp } = useTelegramApp();

  if (tgWebApp?.colorScheme) {
    setColorMode(tgWebApp.colorScheme);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>{children}</Provider>
      <AddUserToFirebase />
    </QueryClientProvider>
  );
};

export default ClientProviders;
