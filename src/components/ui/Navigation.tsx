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

  return (
    <span
      role="status"
      className={`pointer-events-none absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current ${pending ? 'opacity-100 transition-opacity delay-150 duration-150 motion-reduce:transition-none' : 'opacity-0'}`}
    >
      <span className="sr-only">{pending ? 'Открываем страницу…' : ''}</span>
    </span>
  );
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
            className={`relative flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${pathname === route ? 'bg-accent text-accent-foreground' : 'text-muted hover:bg-surface-secondary'}`}
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
