'use client';

import { useWatchlists } from '@/hooks/useWatchlists';
import { Accordion, AccordionItem, Spinner } from '@heroui/react';
import CreateListForm from './CreateListForm';
import MovieListItem from './MovieListItem';

const CollectionsPage = () => {
  const { watchlists, isLoading } = useWatchlists();

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-2xl font-bold">Ваши списки</h2>
      <div className="mt-4">
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
                    <ul className="list-none flex flex-col gap-2">
                      {watchlist.movies.length ? (
                        watchlist.movies.map((movie) => (
                          <MovieListItem key={movie.id} movie={movie} watchlistId={watchlist.id} />
                        ))
                      ) : (
                        <span>Список пуст</span>
                      )}
                    </ul>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <span>Списков нет</span>
            )}
          </div>
        )}
      </div>
      <CreateListForm className="mt-4" />
    </div>
  );
};

export default CollectionsPage;
