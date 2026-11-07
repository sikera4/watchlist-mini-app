'use client';

import { Toast } from '@heroui/react';
import { ReactNode } from 'react';
import TelegramAppProvider from './TelegramAppProvider';
import ThemeProvider from './ThemeProvider';
import { BrowsingStateProvider } from './BrowsingStateProvider';

type Props = {
  children: ReactNode;
};

const ClientProviders = ({ children }: Props) => {
  return (
    <TelegramAppProvider>
      <BrowsingStateProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </BrowsingStateProvider>
      <Toast.Provider placement="top" />
    </TelegramAppProvider>
  );
};

export default ClientProviders;
