import { List, useAddToWatchlistMutation } from '@/api';
import { toast, Button, Spinner } from '@heroui/react';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CardData } from './types';
import { checkIfWatchlistHasItem } from './utilities/checkIfWatchlistHasItem';

type Props = {
  watchlist: List;
  mediaItem: CardData;
};

const AddToWatchlistItem = ({ watchlist, mediaItem }: Props) => {
  const [isAdded, setIsAdded] = useState(
    checkIfWatchlistHasItem({ watchlist, itemId: mediaItem.id })
  );

  const t = useTranslations('ListPage');

  const addToWatchlistMutation = useAddToWatchlistMutation({
    onSuccess: () => {
      setIsAdded(true);
      toast.success(t('added'), { timeout: 2000 });
    },
    onError: () => {
      setIsAdded(false);
      toast.danger('Ошибка добавления фильма.');
    },
  });

  const handleAddMovieClick = (watchlist: List) => {
    addToWatchlistMutation.mutate({
      watchlistId: watchlist.id,
      mediaItem: {
        id: mediaItem.id,
        title: mediaItem.title,
        posterPath: mediaItem.posterPath,
        releaseDate: mediaItem.releaseDate,
        isSeen: false,
      },
    });
  };

  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3">
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-medium text-foreground">
          {watchlist.name || 'Без названия'}
        </p>
        <p className="mt-1 text-xs text-muted">
          {watchlist.userIds.length > 1 ? 'Совместный список' : 'Личная подборка'}
        </p>
      </div>

      {isAdded ? (
        <span
          role="status"
          aria-label={`Добавлено в список: ${watchlist.name}`}
          className="flex min-h-11 w-28 shrink-0 items-center justify-center gap-1.5 rounded-full bg-success/10 px-2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        >
          <FaCheck aria-hidden="true" className="size-3" />
          {t('added')}
        </span>
      ) : (
        <Button
          aria-label={`Добавить в список: ${watchlist.name}`}
          className="h-11 w-28 shrink-0 px-2 text-xs"
          isPending={addToWatchlistMutation.isPending}
          onPress={() => handleAddMovieClick(watchlist)}
        >
          {addToWatchlistMutation.isPending ? (
            <Spinner size="sm" />
          ) : (
            <FaPlus aria-hidden="true" className="size-3" />
          )}
          {addToWatchlistMutation.isPending ? 'Добавляем…' : t('add')}
        </Button>
      )}
    </li>
  );
};

export default AddToWatchlistItem;
