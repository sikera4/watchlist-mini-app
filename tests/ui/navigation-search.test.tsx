import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { BrowsingStateProvider } from '@/components/providers/BrowsingStateProvider';
import SearchForm from '@/components/pages/ExplorePage/SearchForm';
import Navigation from '@/components/ui/Navigation';
import messages from '../../messages/ru.json';

const route = vi.hoisted(() => ({ pathname: '/', pending: false }));

vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));
vi.mock('next/link', async () => {
  const fixture = await import('../preview/mock-link');

  return { ...fixture, useLinkStatus: () => ({ pending: route.pending }) };
});
vi.mock('@/components/providers/TelegramAppProvider', () => ({
  useTelegramApp: () => null,
}));

afterEach(() => {
  cleanup();
  route.pathname = '/';
  route.pending = false;
});

it('keeps matching heights for search and clear controls without losing search state', async () => {
  render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <BrowsingStateProvider>
        <SearchForm />
      </BrowsingStateProvider>
    </NextIntlClientProvider>
  );

  const input = screen.getByRole('textbox') as HTMLInputElement;
  expect(input.classList.contains('h-12')).toBe(true);
  expect(screen.getByRole('button', { name: 'Искать' }).classList.contains('h-12')).toBe(true);

  fireEvent.change(input, { target: { value: 'Дюна' } });
  fireEvent.click(screen.getByRole('button', { name: 'Искать' }));

  const clear = await screen.findByRole('button', { name: 'Назад' });
  expect(clear.classList.contains('h-12')).toBe(true);
  expect(input.value).toBe('Дюна');
  expect(input.disabled).toBe(true);

  fireEvent.click(clear);
  expect(input.value).toBe('');
  expect(input.disabled).toBe(false);
});

it('keeps navigation mounted and the pending indicator out of the tab layout', () => {
  const view = render(<Navigation />);
  const navigation = screen.getByRole('navigation');
  const explore = screen.getByRole('link', { name: 'Обзор' });

  route.pending = true;
  view.rerender(<Navigation />);

  expect(screen.getByRole('navigation')).toBe(navigation);
  expect(screen.getAllByRole('status').every((node) => node.classList.contains('absolute'))).toBe(
    true
  );

  route.pending = false;
  route.pathname = '/explore';
  view.rerender(<Navigation />);

  expect(screen.getByRole('navigation')).toBe(navigation);
  expect(explore.getAttribute('aria-current')).toBe('page');
  expect(screen.getByRole('link', { name: 'Списки' }).hasAttribute('aria-current')).toBe(false);
});
