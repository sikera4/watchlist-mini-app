import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

// Local-only component preview. These aliases are never used by Next.js builds.
export default defineConfig({
  root: path('./tests/preview'),
  server: { host: '127.0.0.1', port: 4173, strictPort: true },
  resolve: {
    alias: [
      { find: /^@\/api$/, replacement: path('./tests/preview/mock-data.tsx') },
      { find: '@/hooks/useWatchlists', replacement: path('./tests/preview/mock-data.tsx') },
      {
        find: '@/components/providers/TelegramAppProvider',
        replacement: path('./tests/preview/mock-telegram.ts'),
      },
      { find: 'next/navigation', replacement: path('./tests/preview/mock-navigation.ts') },
      { find: 'next/link', replacement: path('./tests/preview/mock-link.tsx') },
      { find: 'next/image', replacement: path('./tests/preview/mock-image.tsx') },
      { find: '@', replacement: path('./src') },
    ],
  },
});
