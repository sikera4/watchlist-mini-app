'use client';

import { Accordion, Button, Spinner } from '@heroui/react';
import { FaFilm, FaLayerGroup } from 'react-icons/fa6';
import { useRememberPageScroll } from '@/components/providers/BrowsingStateProvider';
import { useWatchlists } from '@/hooks/useWatchlists';
import CollectionCard from './CollectionCard';
import CreateListForm from './CreateListForm';

export default function ListsPage() {
  useRememberPageScroll('/');

  const { watchlists, isLoading, isError, refetch } = useWatchlists();
  const items = watchlists.flatMap((list) => list.items);
  const watchedCount = items.filter((item) => item.isSeen).length;

  return (
    <div className="app-page mx-auto min-h-screen max-w-2xl px-5 pt-7 sm:pt-10">
      <header className="mb-7">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <FaFilm aria-hidden="true" /> Watchlist
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ваша кинотека</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Для тихого вечера. Или целого киномарафона.
        </p>
      </header>

      {isError && (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm"
        >
          <p>Не удалось обновить списки. Показываем последние загруженные данные.</p>
          <Button variant="tertiary" size="sm" className="mt-2" onPress={() => void refetch()}>
            Повторить
          </Button>
        </div>
      )}

      {isLoading ? (
        <div role="status" className="flex justify-center py-12">
          <Spinner />
          <span className="sr-only">Загружаем списки</span>
        </div>
      ) : (
        <>
          {watchlists.length > 0 && (
            <dl className="mb-7 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-surface px-2 py-4">
              {[
                ['Списки', watchlists.length],
                ['На очереди', items.length - watchedCount],
                ['Просмотрено', watchedCount],
              ].map(([label, count]) => (
                <div key={label} className="px-2 text-center">
                  <dd className="text-2xl font-semibold tabular-nums">{count}</dd>
                  <dt className="mt-1 text-xs text-muted">{label}</dt>
                </div>
              ))}
            </dl>
          )}

          <div className="mb-5">
            <CreateListForm />
          </div>

          {watchlists.length > 0 ? (
            <Accordion allowsMultipleExpanded className="flex flex-col gap-4">
              {watchlists.map((watchlist) => (
                <CollectionCard key={watchlist.id} watchlist={watchlist} />
              ))}
            </Accordion>
          ) : !isError ? (
            <section className="rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <FaLayerGroup className="size-6" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold">Хорошие истории начинаются здесь</h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
                Создайте первый список — например, «На выходные». Затем добавьте фильмы и сериалы из
                Обзора.
              </p>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
