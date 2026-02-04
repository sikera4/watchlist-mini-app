'use client';

import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';
import { Tab, Tabs } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import { Key } from 'react';

const navItems = [
  { route: '/', label: 'Списки' },
  { route: '/explore', label: 'Explore' },
];

const Navigation = () => {
  const pathname = usePathname();

  const registerHapticFeedback = useRegisterHapticFeedback();
  const router = useRouter();

  const handleSelectionChange = (key: Key) => {
    registerHapticFeedback('soft');

    if (typeof key === 'string') {
      router.push(key);
    }
  };

  return (
    <nav className="pb-4 fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
      <Tabs
        selectedKey={pathname}
        className="pointer-events-auto"
        onSelectionChange={handleSelectionChange}
      >
        {navItems.map(({ route, label }) => (
          <Tab key={route} title={label} />
        ))}
      </Tabs>
    </nav>
  );
};

export default Navigation;
