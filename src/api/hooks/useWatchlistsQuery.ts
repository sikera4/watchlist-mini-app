import { UseQueryOptionsWithoutQueryKeyAndFn } from '@/types';
import { db } from '@/utilities/initializeFirebase';
import { useQuery } from '@tanstack/react-query';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { List } from '../types';

const getWatchlists = async (watchlistsIds: string[]) => {
  const watchlistsCollection = collection(db, 'watchlists');

  const q = query(watchlistsCollection, where(documentId(), 'in', watchlistsIds));

  const querySnapshot = await getDocs(q);

  const lists: List[] = [];

  querySnapshot.forEach((doc) => {
    lists.push(doc.data() as List);
  });

  return lists;
};

export const useWatchlistsQuery = (
  watchlistsIds: string[],
  options?: UseQueryOptionsWithoutQueryKeyAndFn<List[], unknown, List[], string[]>
) => {
  return useQuery({
    ...options,
    queryFn: () => getWatchlists(watchlistsIds),
    queryKey: ['user', 'lists', ...watchlistsIds],
  });
};
