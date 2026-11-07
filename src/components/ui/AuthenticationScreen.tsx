'use client';

import { Button, Spinner } from '@heroui/react';
import { FaFilm } from 'react-icons/fa6';

type Props = {
  state: 'loading' | 'outside-telegram' | 'error' | 'data-error';
  onRetry?: () => void;
};

const AuthenticationScreen = ({ state, onRetry }: Props) => {
  if (state === 'loading') {
    return (
      <main className="telegram-theme-surface min-h-screen flex flex-col items-center justify-center overflow-hidden p-6 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <div className="absolute size-20 animate-pulse rounded-full bg-accent/25 blur-2xl motion-reduce:animate-none" />
          <Spinner aria-label="Загрузка приложения" size="lg" className="size-16 text-accent" />
          <FaFilm className="pointer-events-none absolute size-5 text-accent" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Watchlist</h1>
        <p className="mt-2 text-sm text-foreground/65">Загружаем ваши списки…</p>
      </main>
    );
  }

  const isError = state === 'error' || state === 'data-error';
  const isDataError = state === 'data-error';

  return (
    <main className="telegram-theme-surface min-h-screen flex items-center justify-center p-6 text-center">
      <div className="flex max-w-sm flex-col items-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-secondary">
          <FaFilm className="size-7 text-accent" />
        </div>
        <h1 className="mt-5 text-xl font-bold">
          {isDataError
            ? 'Не удалось загрузить списки'
            : isError
              ? 'Не удалось войти'
              : 'Откройте приложение в Telegram'}
        </h1>
        <p className="mt-2 text-sm text-foreground/65">
          {isDataError
            ? 'Проверьте подключение к интернету и попробуйте ещё раз. Ваши списки сохранены.'
            : isError
              ? 'Не удалось подтвердить сессию Telegram. Попробуйте открыть приложение заново.'
              : 'Для входа нужна подтверждённая сессия Telegram-бота.'}
        </p>
        {isError && (
          <Button
            className="mt-5"
            variant="primary"
            onPress={onRetry ?? (() => window.location.reload())}
          >
            Повторить
          </Button>
        )}
      </div>
    </main>
  );
};

export default AuthenticationScreen;
