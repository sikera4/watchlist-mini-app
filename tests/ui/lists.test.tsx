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

it('marks and unmarks an item watched, updating filters in both directions', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: /На выходные/ }));
  fireEvent.click(await screen.findByRole('button', { name: 'Отметить просмотренным: Дюна' }));

  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Дюна' })).toBeNull());
  fireEvent.click(screen.getByRole('button', { name: 'Просмотрено' }));
  expect(await screen.findByRole('heading', { name: 'Дюна' })).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Вернуть в очередь: Дюна' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Дюна' })).toBeNull());

  fireEvent.click(screen.getByRole('button', { name: 'На очереди' }));
  expect(await screen.findByRole('heading', { name: 'Дюна' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Отметить просмотренным: Дюна' })).toBeTruthy();
});

it('requires confirmation before removing selected media', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: /На выходные/ }));
  fireEvent.click(await screen.findByRole('button', { name: 'Удалить элементы' }));
  expect(screen.getByText(/Ничего не удалится без подтверждения/)).toBeTruthy();
  expect(
    (screen.getByRole('button', { name: 'Удалить выбранное (0)' }) as HTMLButtonElement).disabled
  ).toBe(true);

  const control = screen
    .getByRole('checkbox', { name: 'Выбрать для удаления: Дюна' })
    .closest('[data-slot="checkbox"]')
    ?.querySelector('[data-slot="checkbox-control"]');

  expect(control?.classList.contains('border-2')).toBe(true);
  expect(control?.classList.contains('border-muted')).toBe(true);

  fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать для удаления: Дюна' }));
  expect(control?.classList.contains('border-accent')).toBe(true);

  fireEvent.click(screen.getByRole('button', { name: 'Удалить выбранное (1)' }));
  expect(await screen.findByRole('dialog')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Отмена' }));
  expect(screen.getByRole('heading', { name: 'Дюна' })).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Удалить выбранное (1)' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Удалить' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Дюна' })).toBeNull());
});

it('cancels delete mode without changing items and clears the selection', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: /На выходные/ }));
  fireEvent.click(await screen.findByRole('button', { name: 'Удалить элементы' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать для удаления: Дюна' }));
  fireEvent.click(screen.getByRole('button', { name: 'Отменить выбор' }));

  expect(screen.getByRole('heading', { name: 'Дюна' })).toBeTruthy();
  expect(screen.queryByRole('checkbox', { name: 'Выбрать для удаления: Дюна' })).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Удалить элементы' }));
  expect(
    (screen.getByRole('button', { name: 'Удалить выбранное (0)' }) as HTMLButtonElement).disabled
  ).toBe(true);
});

it('creates a list with a trimmed name', async () => {
  showLists();
  fireEvent.click(screen.getByRole('button', { name: 'Новый список' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Тестовый список  ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Создать' }));
  expect(await screen.findByRole('button', { name: /Тестовый список/ })).toBeTruthy();
});
