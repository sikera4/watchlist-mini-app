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
    <TelegramAppProvider>
      <HeroUIProvider>
        <ThemeProvider>{children}</ThemeProvider>
        <ToastProvider placement="top-center" />
      </HeroUIProvider>
    </TelegramAppProvider>
  );
};

export default ClientProviders;
