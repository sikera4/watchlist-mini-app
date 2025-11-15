'use client';

import { Tab, Tabs } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { route: '/', label: 'Списки' },
  { route: '/explore', label: 'Explore' },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="p-4 fixed bottom-0 left-0 right-0 flex justify-center">
      <Tabs selectedKey={pathname}>
        {navItems.map(({ route, label }) => (
          <Tab key={route} title={<Link href={route}>{label}</Link>} />
        ))}
      </Tabs>
    </nav>
  );
};

export default Navigation;
