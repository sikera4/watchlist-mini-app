import { db } from '@/utilities/initializeFirebase';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { createWatchlist } from '../firestore/watchlists';
import { getUserDataQueryKey } from './useUserDataQuery';
import { getWatchlistsQueryKey } from './useWatchlistsQuery';

type Params = {
  name?: string;
  userId: string;
};

const createList = async (params: Params) => {
  await createWatchlist(db, params.userId, params.name);
};

export const useCreateListMutation = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createList,
    onSuccess: async (_, variables, ...otherParams) => {
      await queryClient.invalidateQueries({ queryKey: getUserDataQueryKey(variables.userId) });
      await queryClient.invalidateQueries({ queryKey: getWatchlistsQueryKey() });

      options?.onSuccess?.(_, variables, ...otherParams);
    },
  });
};
