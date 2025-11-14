'use client';

import { useAddUserMutation } from '@/api';
import { checkIfUserExists } from '@/utilities/checkIfUserExists';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { WebApp } from 'telegram-web-app';

const TelegramAppContext = createContext<WebApp | null>(null);

const useTelegramApp = () => {
  return useContext(TelegramAppContext);
};

type Params = {
  children: ReactNode;
};

const TelegramAppProvider = ({ children }: Params) => {
  const [tgWebApp, setTgWebApp] = useState<WebApp | null>(null);

  const addUserMutation = useAddUserMutation();

  useEffect(() => {
    const tgWebApp: WebApp | null =
      typeof window !== 'undefined' ? (window.Telegram?.WebApp ?? null) : null;

    if (!tgWebApp) {
      console.log('Telegram Web App is not available');
      return;
    }

    tgWebApp.ready();
    tgWebApp.expand();

    setTgWebApp(tgWebApp);

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
  }, []);

  return <TelegramAppContext.Provider value={tgWebApp}>{children}</TelegramAppContext.Provider>;
};

export default TelegramAppProvider;

export { useTelegramApp };
