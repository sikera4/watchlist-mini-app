'use client';

import { getQueryClient } from '@/utilities/getQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const ReactQueryProvider = ({ children }: Props) => {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
