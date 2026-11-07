'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { ReactNode } from 'react';
import TelegramAppProvider from './TelegramAppProvider';
import ThemeProvider from './ThemeProvider';
import { BrowsingStateProvider } from './BrowsingStateProvider';

type Props = {
  children: ReactNode;
};

const ClientProviders = ({ children }: Props) => {
  return (
    <HeroUIProvider>
      <TelegramAppProvider>
        <BrowsingStateProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </BrowsingStateProvider>
        <ToastProvider placement="top-center" />
      </TelegramAppProvider>
    </HeroUIProvider>
  );
};

export default ClientProviders;
