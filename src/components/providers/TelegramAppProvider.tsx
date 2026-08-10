'use client';

import { auth } from '@/utilities/initializeFirebase';
import AuthenticationScreen from '@/components/ui/AuthenticationScreen';
import { browserSessionPersistence, setPersistence, signInWithCustomToken } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { WebApp } from 'telegram-web-app';

const TelegramAppContext = createContext<WebApp | null>(null);
const AuthenticatedUserIdContext = createContext<string | null>(null);

const useTelegramApp = () => {
  return useContext(TelegramAppContext);
};

const useAuthenticatedUserId = () => {
  return useContext(AuthenticatedUserIdContext);
};

type Params = {
  children: ReactNode;
};

const TelegramAppProvider = ({ children }: Params) => {
  const [tgWebApp, setTgWebApp] = useState<WebApp | null>(null);
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'outside-telegram' | 'error'>(
    'loading'
  );

  useEffect(() => {
    let isCancelled = false;

    const authenticate = async () => {
      await Promise.resolve();

      const webApp = window.Telegram?.WebApp ?? null;

      if (!webApp?.initData) {
        if (!isCancelled) {
          setStatus('outside-telegram');
        }
        return;
      }

      webApp.ready();
      webApp.expand();

      if (!isCancelled) {
        setTgWebApp(webApp);
      }

      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData: webApp.initData }),
        });

        if (!response.ok) {
          throw new Error(`Telegram authentication failed with status ${response.status}`);
        }

        const data = (await response.json()) as { firebaseToken: string };

        await setPersistence(auth, browserSessionPersistence);
        const credential = await signInWithCustomToken(auth, data.firebaseToken);

        if (!isCancelled) {
          setAuthenticatedUserId(credential.user.uid);
          setStatus('authenticated');
        }
      } catch (error) {
        console.error('Unable to authenticate with Telegram', error);

        if (!isCancelled) {
          setStatus('error');
        }
      }
    };

    void authenticate();

    return () => {
      isCancelled = true;
    };
  }, []);

  let content: ReactNode;

  if (status === 'outside-telegram') {
    content = <AuthenticationScreen state="outside-telegram" />;
  } else if (status === 'error') {
    content = <AuthenticationScreen state="error" />;
  } else if (status === 'loading') {
    content = <AuthenticationScreen state="loading" />;
  } else {
    content = children;
  }

  return (
    <TelegramAppContext.Provider value={tgWebApp}>
      <AuthenticatedUserIdContext.Provider value={authenticatedUserId}>
        {content}
      </AuthenticatedUserIdContext.Provider>
    </TelegramAppContext.Provider>
  );
};

export default TelegramAppProvider;

export { useAuthenticatedUserId, useTelegramApp };
