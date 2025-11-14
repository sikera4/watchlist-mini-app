'use client';

import { Flex, SegmentGroup } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { route: '/', label: 'Списки' },
  { route: '/explore', label: 'Explore' },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav>
      <Flex p={4} position="fixed" bottom={0} left={0} right={0} justifyContent="center">
        <SegmentGroup.Root size="lg" value={pathname}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            items={navItems.map(({ route, label }) => ({
              value: route,
              label: <Link href={route}>{label}</Link>,
            }))}
          />
        </SegmentGroup.Root>
      </Flex>
    </nav>
  );
};

export default Navigation;
