'use client';

import { useAddUserMutation } from '@/api';
import { checkIfUserExists } from '@/utilities/checkIfUserExists';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { WebApp } from 'telegram-web-app';

const TelegramAppContext = createContext<WebApp | null>(null);

const useTelegramApp = () => {
  return useContext(TelegramAppContext);
};

type Params = {
  children: ReactNode;
};

const TelegramAppProvider = ({ children }: Params) => {
  const tgWebApp: WebApp | null =
    typeof window !== 'undefined' ? (window.Telegram?.WebApp ?? null) : null;

  const addUserMutation = useAddUserMutation();

  useEffect(() => {
    if (!tgWebApp) {
      console.log('Telegram Web App is not available');
      return;
    }

    tgWebApp.ready();
    tgWebApp.expand();

    const addUserToFireBase = async () => {
      const userId = tgWebApp?.initDataUnsafe?.user?.id;

      if (!userId) {
        return;
      }

      const userExists = await checkIfUserExists(userId);

      if (!userExists) {
        addUserMutation.mutate({
          userId,
        });
      }
    };

    addUserToFireBase();
  }, [tgWebApp]);

  return <TelegramAppContext.Provider value={tgWebApp}>{children}</TelegramAppContext.Provider>;
};

export default TelegramAppProvider;

export { useTelegramApp };
