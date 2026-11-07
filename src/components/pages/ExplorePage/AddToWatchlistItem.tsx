import { List, useAddToWatchlistMutation } from '@/api';
import { toast, Button } from '@heroui/react';
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
    <div className="flex justify-between items-center gap-2">
      <span>{watchlist.name}</span>
      {isAdded ? (
        <Button isDisabled={true}>{t('added')}</Button>
      ) : (
        <Button
          isPending={addToWatchlistMutation.isPending}
          onPress={() => handleAddMovieClick(watchlist)}
        >
          {addToWatchlistMutation.isPending ? 'Добавляем…' : t('add')}
        </Button>
      )}
    </div>
  );
};

export default AddToWatchlistItem;
