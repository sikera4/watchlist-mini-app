import { useUserDataQuery, useWatchlistsQuery } from '@/api';
import { useAuthenticatedUserId } from '@/components/providers/TelegramAppProvider';

export const useWatchlists = () => {
  const userId = useAuthenticatedUserId();

  const userDataQuery = useUserDataQuery(userId, {
    enabled: Boolean(userId),
  });

  const watchlistsQuery = useWatchlistsQuery(userDataQuery.data?.watchlists ?? [], {
    enabled: Boolean(userDataQuery.data?.watchlists?.length),
  });

  return {
    watchlists: watchlistsQuery.data ?? [],
    isLoading: userDataQuery.isLoading || watchlistsQuery.isLoading,
  };
};
