'use client';

import { useWatchlists } from '@/hooks/useWatchlists';
import { Accordion, AccordionItem, Spinner } from '@heroui/react';
import CreateListForm from './CreateListForm';

const CollectionsPage = () => {
  const { watchlists, isLoading } = useWatchlists();
  console.log(watchlists);

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-2xl font-bold">Ваши списки</h2>
      {isLoading ? (
        <div className="p-4 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col">
          {watchlists.length ? (
            <Accordion>
              {watchlists.map((watchlist, i) => (
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
