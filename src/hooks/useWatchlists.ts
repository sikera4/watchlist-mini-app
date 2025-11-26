import { useUserDataQuery, useWatchlistsQuery } from "@/api";
import { useTelegramApp } from "@/components/providers/TelegramAppProvider";

export const useWatchlists = () => {
  const tgWebApp = useTelegramApp();

  const userId = tgWebApp?.initDataUnsafe?.user?.id ?? 1;

  const userDataQuery = useUserDataQuery(userId, {
    enabled: Boolean(userId),
  });

  const watchlistsQuery = useWatchlistsQuery(userDataQuery.data?.watchlists ?? [], {
    enabled: Boolean(userDataQuery.data?.watchlists?.length),
  });

  return {
    watchlists: watchlistsQuery.data ?? [],
    isLoading: userDataQuery.isLoading || watchlistsQuery.isLoading,
  }
}
