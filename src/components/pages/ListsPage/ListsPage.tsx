'use client';

import { Container, Heading, Stack } from '@chakra-ui/react';
import CreateListForm from './CreateListForm';
import { useUserDataQuery, useWatchlistsQuery } from '@/api';
import { useTelegramApp } from '@/components/providers/TelegramAppProvider';

const CollectionsPage = () => {
  const tgWebApp = useTelegramApp();

  const userId = tgWebApp?.initDataUnsafe?.user?.id ?? null;

  const userDataQuery = useUserDataQuery(userId, {
    enabled: Boolean(userId),
  });

  const watchlistsQuery = useWatchlistsQuery(userDataQuery.data?.watchlists ?? [], {
    enabled: Boolean(userDataQuery.data?.watchlists?.length),
  });

  return (
    <Container p={4} minHeight="100vh">
      <Heading>Ваши списки</Heading>
      <Stack mt={4}>{watchlistsQuery.data?.map((watchlist) => watchlist.id)}</Stack>
      <CreateListForm />
    </Container>
  );
};

export default CollectionsPage;
