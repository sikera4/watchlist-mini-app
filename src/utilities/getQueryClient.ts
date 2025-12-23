import { isServer, QueryClient } from "@tanstack/react-query"

const makeQueryClient = () => {
  return new QueryClient({
      defaultOptions: {
        queries: {
          retry: 2,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60, // 1 minute
        },
      },
  })
}

let browserQueryClient: QueryClient;

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
