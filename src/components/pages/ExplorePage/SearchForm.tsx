'use client';

import { Button, Input, Label, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useBrowsingState } from '@/components/providers/BrowsingStateProvider';
import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';
import { SearchFormValues } from './types';

export default function SearchForm() {
  const { searchTerm, setSearchTerm, searchDraft, setSearchDraft } = useBrowsingState();
  const registerHapticFeedback = useRegisterHapticFeedback();
  const t = useTranslations('ListPage');

  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: { searchInput: searchDraft },
  });

  const search = ({ searchInput }: SearchFormValues) => {
    setSearchTerm(searchInput);
    registerHapticFeedback('soft');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchDraft('');
    reset({ searchInput: '' });
  };

  return (
    <form onSubmit={handleSubmit(search)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <TextField className="min-w-0" isDisabled={Boolean(searchTerm)}>
          <Label className="sr-only">{t('searchPlaceholder')}</Label>
          <Input
            className="h-12 w-full"
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
            {...register('searchInput', {
              onChange: (event) => setSearchDraft(event.target.value),
            })}
          />
        </TextField>

        {searchTerm ? (
          <Button className="h-12" variant="secondary" onPress={clearSearch} size="lg">
            {t('clearSearchButtonCaption')}
          </Button>
        ) : (
          <Button className="h-12" variant="primary" type="submit" size="lg">
            {t('searchButtonCaption')}
          </Button>
        )}
      </div>
    </form>
  );
}
