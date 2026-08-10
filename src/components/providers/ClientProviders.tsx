'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { ReactNode } from 'react';
import TelegramAppProvider from './TelegramAppProvider';
import ThemeProvider from './ThemeProvider';

type Props = {
  children: ReactNode;
};

const ClientProviders = ({ children }: Props) => {
  return (
    <HeroUIProvider>
      <TelegramAppProvider>
        <ThemeProvider>{children}</ThemeProvider>
        <ToastProvider placement="top-center" />
      </TelegramAppProvider>
    </HeroUIProvider>
  );
};

export default ClientProviders;
