import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AddToWatchlistModal from '@/components/pages/ExplorePage/AddToWatchlistModal';

vi.mock('@/hooks/useWatchlists', () => ({
  useWatchlists: () => ({ watchlists: [], isError: false, refetch: vi.fn() }),
}));
vi.mock('@/api', () => ({ useAddToWatchlistMutation: () => ({ mutate: vi.fn() }) }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

afterEach(cleanup);

it('opens the migrated modal and shows a useful empty state instead of a spinner', async () => {
  render(
    <AddToWatchlistModal
      mediaItem={{
        id: 1,
        title: 'Example',
        posterPath: '',
        genres: '',
        originalTitle: 'Example',
        overview: '',
      }}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'addToWatchlist' }));
  expect(await screen.findByRole('dialog')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Перейти к спискам' }).getAttribute('href')).toBe('/');
  fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
});
