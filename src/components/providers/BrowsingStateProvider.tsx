'use client';

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

function useBrowsingStateValue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const scrollPositions = useRef<Record<string, number>>({});

  return { searchTerm, setSearchTerm, searchDraft, setSearchDraft, scrollPositions };
}

const BrowsingContext = createContext<ReturnType<typeof useBrowsingStateValue> | null>(null);

export function BrowsingStateProvider({ children }: { children: ReactNode }) {
  const state = useBrowsingStateValue();

  return <BrowsingContext.Provider value={state}>{children}</BrowsingContext.Provider>;
}

export function useBrowsingState() {
  const state = useContext(BrowsingContext);

  if (!state) throw new Error('BrowsingStateProvider is required');

  return state;
}

export function useRememberPageScroll(route: string) {
  const pathname = usePathname();
  const { scrollPositions } = useBrowsingState();

  useEffect(() => {
    if (pathname !== route) return;

    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPositions.current[route] ?? 0, behavior: 'instant' });
    });
    const remember = () => {
      scrollPositions.current[route] = window.scrollY;
    };
    window.addEventListener('scroll', remember, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', remember);
    };
  }, [pathname, route, scrollPositions]);
}
