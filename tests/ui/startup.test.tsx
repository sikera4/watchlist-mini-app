import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AppStartupGate from '@/components/ui/AppStartupGate';
import { withTimeout } from '@/utilities/withTimeout';

const { query } = vi.hoisted(() => ({ query: vi.fn() }));

vi.mock('@/api/hooks/useWatchlistsQuery', () => ({ useWatchlistsQuery: query }));
vi.mock('@/components/ui/AuthenticationScreen', () => ({
  default: ({ state, onRetry }: { state: string; onRetry?: () => void }) => (
    <div>
      {state}
      <button onClick={onRetry}>retry</button>
    </div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('startup data gate', () => {
  it('keeps the splash visible until the authenticated user query resolves', () => {
    query.mockReturnValue({ data: undefined, isError: false, isPaused: false });
    const view = render(<AppStartupGate userId="42">Lists page</AppStartupGate>);
    expect(screen.queryByText('Lists page')).toBeNull();
    expect(screen.getByText('loading')).toBeTruthy();
    expect(query).toHaveBeenCalledWith('42');

    query.mockReturnValue({ data: [], isError: false, isPaused: false });
    view.rerender(<AppStartupGate userId="42">Lists page</AppStartupGate>);
    expect(screen.getByText('Lists page')).toBeTruthy();
    expect(screen.queryByText('loading')).toBeNull();
  });

  it.each([
    { isError: true, isPaused: false },
    { isError: false, isPaused: true },
  ])('offers retry for a failed or offline initial load: %j', (state) => {
    const refetch = vi.fn();
    query.mockReturnValue({ data: undefined, ...state, refetch });
    render(<AppStartupGate userId="42">Lists page</AppStartupGate>);
    expect(screen.getByText('data-error')).toBeTruthy();
    fireEvent.click(screen.getByText('retry'));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it('keeps loaded content visible when a background refresh fails', () => {
    query.mockReturnValue({ data: [], isError: true, isPaused: false });
    render(<AppStartupGate userId="42">Lists page</AppStartupGate>);
    expect(screen.getByText('Lists page')).toBeTruthy();
  });
});

describe('bounded loading', () => {
  it('returns results and preserves request errors', async () => {
    await expect(withTimeout(Promise.resolve([]))).resolves.toEqual([]);
    await expect(withTimeout(Promise.reject(new Error('denied')))).rejects.toThrow('denied');
  });

  it('rejects a stalled request and clears its timer', async () => {
    vi.useFakeTimers();
    const assertion = expect(withTimeout(new Promise(() => {}), 100)).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(100);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
});
