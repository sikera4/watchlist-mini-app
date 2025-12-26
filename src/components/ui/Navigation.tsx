'use client';

import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';
import { Tab, Tabs } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { route: '/', label: 'Списки' },
  { route: '/explore', label: 'Explore' },
];

const Navigation = () => {
  const pathname = usePathname();

  const registerHapticFeedback = useRegisterHapticFeedback();

  return (
    <nav className="pb-4 fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none">
      <Tabs
        selectedKey={pathname}
        className="pointer-events-auto"
        onSelectionChange={() => registerHapticFeedback('soft')}
      >
        {navItems.map(({ route, label }) => (
          <Tab key={route} title={<Link href={route}>{label}</Link>} />
        ))}
      </Tabs>
    </nav>
  );
};

export default Navigation;
