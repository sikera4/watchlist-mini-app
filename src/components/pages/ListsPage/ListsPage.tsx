'use client';

import CreateListForm from './CreateListForm';
import { useUserDataQuery, useWatchlistsQuery } from '@/api';
import { useTelegramApp } from '@/components/providers/TelegramAppProvider';
import { Accordion, AccordionItem, Spinner } from '@heroui/react';

const CollectionsPage = () => {
  const tgWebApp = useTelegramApp();

  const userId = tgWebApp?.initDataUnsafe?.user?.id ?? 1;

  const userDataQuery = useUserDataQuery(userId, {
    enabled: Boolean(userId),
  });

  const watchlistsQuery = useWatchlistsQuery(userDataQuery.data?.watchlists ?? [], {
    enabled: Boolean(userDataQuery.data?.watchlists?.length),
  });

  const isLoading = userDataQuery.isLoading || watchlistsQuery.isLoading;

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-2xl font-bold">Ваши списки</h2>
      {isLoading ? (
        <div className="p-4 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col">
          {watchlistsQuery.data?.length ? (
            <Accordion>
              {watchlistsQuery.data.map((watchlist, i) => (
                <AccordionItem key={i} title={watchlist.name}>
                  <ul className="list-disc list-inside">
                    {watchlist.movies.map((movie, j) => (
                      <li key={j}>{movie.id}</li>
                    ))}
                  </ul>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <span>Списков нет</span>
          )}
        </div>
      )}
      <CreateListForm />
    </div>
  );
};

export default CollectionsPage;
