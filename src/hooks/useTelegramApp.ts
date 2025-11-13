import { useEffect } from "react";
import { WebApp } from "telegram-web-app";

export const useTelegramApp = (): {
  tgWebApp: WebApp | null;
} => {
  const tgWebApp: WebApp | null = typeof window !== 'undefined' ? window.Telegram?.WebApp ?? null : null;

  useEffect(() => {
    if (!tgWebApp) {
      console.log('Telegram Web App is not available');
      return;
    }

    tgWebApp.ready();
    tgWebApp.expand();
  }, [tgWebApp])

  return {
    tgWebApp,
  }
}
