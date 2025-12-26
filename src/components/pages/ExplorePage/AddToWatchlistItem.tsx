import { List, useAddToWatchlistMutation } from '@/api';
import { addToast, Button } from '@heroui/react';
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
    onError: () => {
      setIsAdded(false);
      addToast({
        title: 'Ошибка добавления фильма.',
        color: 'danger',
      });
    },
  });

  const handleAddMovieClick = (watchlist: List) => {
    setIsAdded(true);

    addToWatchlistMutation.mutate({
      watchlistId: watchlist.id,
      movie: {
        id: mediaItem.id,
        title: mediaItem.title,
        posterPath: mediaItem.posterPath,
        releaseDate: mediaItem.releaseDate,
        isSeen: false,
      },
    });

    addToast({
      color: 'success',
      title: t('added'),
      shouldShowTimeoutProgress: true,
      timeout: 2000,
    });
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <span>{watchlist.name}</span>
      {isAdded ? (
        <Button isDisabled={true}>{t('added')}</Button>
      ) : (
        <Button onPress={() => handleAddMovieClick(watchlist)}>{t('add')}</Button>
      )}
    </div>
  );
};

export default AddToWatchlistItem;
