import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  BrowsingStateProvider,
  useBrowsingState,
} from '@/components/providers/BrowsingStateProvider';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
afterEach(cleanup);

function Search() {
  const { searchTerm, setSearchTerm, searchDraft, setSearchDraft } = useBrowsingState();

  return (
    <>
      <button
        onClick={() => {
          setSearchTerm('Dune');
          setSearchDraft('Dune draft');
        }}
      >
        Search
      </button>
      <output>
        {searchTerm} / {searchDraft}
      </output>
    </>
  );
}

it('preserves submitted search and draft when the page unmounts and returns', () => {
  const view = render(
    <BrowsingStateProvider>
      <Search />
    </BrowsingStateProvider>
  );
  fireEvent.click(screen.getByText('Search'));
  view.rerender(
    <BrowsingStateProvider>
      <div>Lists</div>
    </BrowsingStateProvider>
  );
  view.rerender(
    <BrowsingStateProvider>
      <Search />
    </BrowsingStateProvider>
  );
  expect(screen.getByText('Dune / Dune draft')).toBeTruthy();
});
