import { createContext, ReactNode, useContext, useState } from 'react';
import type { List, MediaItem } from '../../src/api/types';

export type { List, MediaItem } from '../../src/api/types';

const sampleItems: MediaItem[] = [
  {
    id: 1,
    title: 'Дюна',
    posterPath: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    releaseDate: '2021-09-15',
    isSeen: false,
  },
  {
    id: 2,
    title: 'Интерстеллар',
    posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    releaseDate: '2014-11-05',
    isSeen: false,
  },
  {
    id: 3,
    title: 'Отель «Гранд Будапешт»',
    posterPath: '/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    releaseDate: '2014-02-26',
    isSeen: true,
  },
];

const initialLists: List[] = [
  { id: 'weekend', name: 'На выходные', userIds: ['42', '43'], items: sampleItems },
  {
    id: 'favorites',
    name: 'Хочется пересмотреть',
    userIds: ['42'],
    items: [sampleItems[1], sampleItems[2]],
  },
  { id: 'discoveries', name: 'Новые открытия', userIds: ['42'], items: [] },
];

function useDataState() {
  return useState<List[]>(
    new URLSearchParams(window.location.search).has('empty') ? [] : initialLists
  );
}

const DataContext = createContext<ReturnType<typeof useDataState> | null>(null);

export function SampleDataProvider({ children }: { children: ReactNode }) {
  const state = useDataState();

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

function useData() {
  const data = useContext(DataContext);

  if (!data) throw new Error('SampleDataProvider required');

  return data;
}

export function useWatchlists() {
  const [watchlists] = useData();

  return { watchlists, isLoading: false, isError: false, refetch: () => {} };
}

type Callbacks<T = unknown> = { onSuccess?: (data: undefined, variables: T) => unknown };

function useSampleMutation<T>(apply: (params: T) => void, options?: Callbacks<T>) {
  const [isPending, setPending] = useState(false);

  return {
    isPending,
    mutate: (params: T) => {
      setPending(true);
      setTimeout(() => {
        apply(params);
        setPending(false);
        options?.onSuccess?.(undefined, params);
      }, 200);
    },
  };
}

export function useCreateListMutation(options?: Callbacks) {
  const [, setLists] = useData();

  return useSampleMutation(
    ({ name }: { name: string }) =>
      setLists((lists) => [...lists, { id: String(Date.now()), name, userIds: ['42'], items: [] }]),
    options
  );
}

export function useAddToWatchlistMutation(options?: Callbacks) {
  const [, setLists] = useData();

  return useSampleMutation(
    ({ watchlistId, mediaItem }: { watchlistId: string; mediaItem: MediaItem }) =>
      setLists((lists) =>
        lists.map((list) =>
          list.id === watchlistId && !list.items.some((item) => item.id === mediaItem.id)
            ? { ...list, items: [...list.items, mediaItem] }
            : list
        )
      ),
    options
  );
}

type WatchedParams = { watchlistId: string; mediaId: number; isSeen: boolean };

export function useSetWatchedMutation(options?: Callbacks<WatchedParams>) {
  const [, setLists] = useData();

  return useSampleMutation(
    ({ watchlistId, mediaId, isSeen }: WatchedParams) =>
      setLists((lists) =>
        lists.map((list) =>
          list.id !== watchlistId
            ? list
            : {
                ...list,
                items: list.items.map((item) => (item.id === mediaId ? { ...item, isSeen } : item)),
              }
        )
      ),
    options
  );
}

export function useRemoveFromWatchlistMutation(options?: Callbacks) {
  const [, setLists] = useData();

  return useSampleMutation(
    ({ watchlistId, mediaItems }: { watchlistId: string; mediaItems: MediaItem[] }) =>
      setLists((lists) =>
        lists.map((list) =>
          list.id !== watchlistId
            ? list
            : {
                ...list,
                items: list.items.filter((item) => !mediaItems.some(({ id }) => item.id === id)),
              }
        )
      ),
    options
  );
}
