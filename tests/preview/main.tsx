import { createRoot } from 'react-dom/client';
import { Toast } from '@heroui/react';
import { NextIntlClientProvider } from 'next-intl';
import SearchForm from '../../src/components/pages/ExplorePage/SearchForm';
import messages from '../../messages/ru.json';
import ListsPage from '../../src/components/pages/ListsPage/ListsPage';
import Navigation from '../../src/components/ui/Navigation';
import { BrowsingStateProvider } from '../../src/components/providers/BrowsingStateProvider';
import { SampleDataProvider } from './mock-data';
import '../../src/app/globals.css';

const theme = new URLSearchParams(window.location.search).get('theme') ?? 'dark';
document.documentElement.dataset.theme = theme;
document.documentElement.classList.toggle('dark', theme === 'dark');
document.body.style.fontFamily = 'system-ui, sans-serif';

const isMobileFrame = new URLSearchParams(window.location.search).has('mobile');
const isSearchPreview = new URLSearchParams(window.location.search).has('search');

createRoot(document.getElementById('root')!).render(
  isMobileFrame ? (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px' }}>
      <iframe
        title="Mobile preview — 390 pixels"
        src={`/?theme=${theme}${isSearchPreview ? '&search=1' : ''}`}
        style={{ width: 390, height: 844, border: 0 }}
      />
    </div>
  ) : (
    <SampleDataProvider>
      <BrowsingStateProvider>
        {isSearchPreview ? (
          <NextIntlClientProvider locale="ru" messages={messages}>
            <div className="telegram-theme-surface app-page min-h-screen px-4 py-4">
              <SearchForm />
            </div>
          </NextIntlClientProvider>
        ) : (
          <ListsPage />
        )}
        <Navigation />
        <Toast.Provider placement="top" />
      </BrowsingStateProvider>
    </SampleDataProvider>
  )
);
