import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

export type UseQueryOptionsWithoutQueryKeyAndFn<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryFn' | 'queryKey'>;
