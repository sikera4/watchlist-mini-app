import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import AddToWatchlistModal from '@/components/pages/ExplorePage/AddToWatchlistModal';
import { SampleDataProvider } from '../preview/mock-data';
import messages from '../../messages/ru.json';

vi.mock('@/api', () => import('../preview/mock-data'));
vi.mock('@/hooks/useWatchlists', () => import('../preview/mock-data'));

afterEach(cleanup);

it('shows media context, spaced list rows, and updates only the successfully added list', async () => {
  render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <SampleDataProvider>
        <AddToWatchlistModal
          mediaItem={{ id: 1, title: 'Дюна', originalTitle: 'Dune', overview: '', posterPath: '' }}
        />
      </SampleDataProvider>
    </NextIntlClientProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Добавить в список' }));

  const dialog = await screen.findByRole('dialog');
  expect(within(dialog).getByText('Дюна')).toBeTruthy();
  expect(
    within(dialog).getByRole('list', { name: 'Ваши списки' }).classList.contains('gap-3')
  ).toBe(true);
  expect(
    within(dialog).getByRole('status', { name: 'Добавлено в список: На выходные' })
  ).toBeTruthy();
  expect(
    within(dialog).queryByRole('button', { name: 'Добавить в список: На выходные' })
  ).toBeNull();

  fireEvent.click(
    within(dialog).getByRole('button', { name: 'Добавить в список: Новые открытия' })
  );
  expect(
    await within(dialog).findByRole('status', { name: 'Добавлено в список: Новые открытия' })
  ).toBeTruthy();
  expect(
    within(dialog).getByRole('button', { name: 'Добавить в список: Хочется пересмотреть' })
  ).toBeTruthy();
  expect(screen.getByRole('dialog')).toBe(dialog);
});
