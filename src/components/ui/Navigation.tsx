'use client';

import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';
import Link, { useLinkStatus } from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCompass, FaLayerGroup } from 'react-icons/fa6';

const navItems = [
  { route: '/', label: 'Списки', Icon: FaLayerGroup },
  { route: '/explore', label: 'Обзор', Icon: FaCompass },
];

function PendingIndicator() {
  const { pending } = useLinkStatus();

  return pending ? (
    <span role="status" className="size-2 animate-pulse rounded-full bg-current">
      <span className="sr-only">Открываем страницу…</span>
    </span>
  ) : null;
}

const Navigation = () => {
  const pathname = usePathname();

  const registerHapticFeedback = useRegisterHapticFeedback();

  return (
    <nav
      aria-label="Основная навигация"
      className="app-navigation fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="flex gap-1 rounded-full border border-border bg-surface/95 p-1.5 shadow-lg backdrop-blur-xl pointer-events-auto">
        {navItems.map(({ route, label, Icon }) => (
          <Link
            key={route}
            href={route}
            prefetch={true}
            scroll={false}
            aria-current={pathname === route ? 'page' : undefined}
            onNavigate={() => registerHapticFeedback('soft')}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${pathname === route ? 'bg-accent text-accent-foreground' : 'text-muted hover:bg-surface-secondary'}`}
          >
            <Icon aria-hidden="true" />
            {label}
            <PendingIndicator />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
