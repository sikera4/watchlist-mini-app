'use client';

import { Button, Spinner } from '@heroui/react';
import { FaFilm } from 'react-icons/fa6';

type Props = {
  state: 'loading' | 'outside-telegram' | 'error';
};

const AuthenticationScreen = ({ state }: Props) => {
  if (state === 'loading') {
    return (
      <main className="telegram-theme-surface min-h-screen flex flex-col items-center justify-center overflow-hidden p-6 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <div className="absolute size-20 animate-pulse rounded-full bg-primary/25 blur-2xl motion-reduce:animate-none" />
          <Spinner
            aria-label="Загрузка приложения"
            color="primary"
            size="lg"
            variant="gradient"
            classNames={{
              wrapper: 'size-16',
            }}
          />
          <FaFilm className="pointer-events-none absolute size-5 text-primary-foreground" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Watchlist</h1>
        <p className="mt-2 text-sm text-foreground/65">Загружаем ваши списки…</p>
      </main>
    );
  }

  const isError = state === 'error';

  return (
    <main className="telegram-theme-surface min-h-screen flex items-center justify-center p-6 text-center">
      <div className="flex max-w-sm flex-col items-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-default-100">
          <FaFilm className="size-7 text-primary" />
        </div>
        <h1 className="mt-5 text-xl font-bold">
          {isError ? 'Не удалось войти' : 'Откройте приложение в Telegram'}
        </h1>
        <p className="mt-2 text-sm text-foreground/65">
          {isError
            ? 'Не удалось подтвердить сессию Telegram. Попробуйте открыть приложение заново.'
            : 'Для входа нужна подтверждённая сессия Telegram-бота.'}
        </p>
        {isError && (
          <Button className="mt-5" color="primary" onPress={() => window.location.reload()}>
            Повторить
          </Button>
        )}
      </div>
    </main>
  );
};

export default AuthenticationScreen;
