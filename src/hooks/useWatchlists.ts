import { useWatchlistsQuery } from '@/api';
import { useAuthenticatedUserId } from '@/components/providers/TelegramAppProvider';

export const useWatchlists = () => {
  const userId = useAuthenticatedUserId();

  const watchlistsQuery = useWatchlistsQuery(userId);

  return {
    watchlists: watchlistsQuery.data ?? [],
    isLoading: watchlistsQuery.isLoading,
    isError: watchlistsQuery.isError,
    refetch: watchlistsQuery.refetch,
  };
};
