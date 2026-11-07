import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ListsPage from '@/components/pages/ListsPage/ListsPage';
import { SampleDataProvider } from '../preview/mock-data';

vi.mock('@/api', () => import('../preview/mock-data'));
vi.mock('@/hooks/useWatchlists', () => import('../preview/mock-data'));
vi.mock('@/components/providers/TelegramAppProvider', () => ({
  useAuthenticatedUserId: () => '42',
  useTelegramApp: () => null,
}));
vi.mock('@/components/providers/BrowsingStateProvider', () => ({
  useRememberPageScroll: () => {},
}));

afterEach(cleanup);

function showLists() {
  render(
    <SampleDataProvider>
      <ListsPage />
    </SampleDataProvider>
  );
}

it('shows collection summaries and filters unseen/watched media', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: /На выходные/ }));
  expect(await screen.findByRole('heading', { name: 'Дюна' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'Отель «Гранд Будапешт»' })).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Просмотрено' }));
  expect(await screen.findByRole('heading', { name: 'Отель «Гранд Будапешт»' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'Дюна' })).toBeNull();
});

it('marks an item watched and updates the visible filter', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: /На выходные/ }));
  fireEvent.click(await screen.findByRole('button', { name: 'Отметить просмотренным: Дюна' }));

  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Дюна' })).toBeNull());
  fireEvent.click(screen.getByRole('button', { name: 'Просмотрено' }));
  expect(await screen.findByRole('heading', { name: 'Дюна' })).toBeTruthy();
});

it('requires confirmation before removing selected media', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: /На выходные/ }));
  fireEvent.click(await screen.findByRole('button', { name: 'Выбрать' }));
  const control = screen
    .getByRole('checkbox', { name: 'Выбрать: Дюна' })
    .closest('[data-slot="checkbox"]')
    ?.querySelector('[data-slot="checkbox-control"]');

  expect(control?.classList.contains('border-2')).toBe(true);
  expect(control?.classList.contains('border-muted')).toBe(true);

  fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать: Дюна' }));
  expect(control?.classList.contains('border-accent')).toBe(true);

  fireEvent.click(screen.getByRole('button', { name: 'Удалить выбранное (1)' }));
  expect(await screen.findByRole('dialog')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Отмена' }));
  expect(screen.getByRole('heading', { name: 'Дюна' })).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Удалить выбранное (1)' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Удалить' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Дюна' })).toBeNull());
});

it('creates a list with a trimmed name', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: 'Новый список' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Тестовый список  ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Создать' }));
  expect(await screen.findByRole('button', { name: /Тестовый список/ })).toBeTruthy();
});
