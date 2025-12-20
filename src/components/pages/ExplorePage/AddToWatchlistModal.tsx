import { useAddToWatchlistMutation } from '@/api';
import { List } from '@/api/types';
import { useWatchlists } from '@/hooks/useWatchlists';
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { CardData } from './types';
import { useTranslations } from 'next-intl';
import { checkIfWatchlistHasItem } from './utilities/checkIfWatchlistHasItem';

type Props = {
  mediaItem: CardData;
};

const AddToWatchlistModal = ({ mediaItem }: Props) => {
  const { isOpen, onOpenChange } = useDisclosure();

  const { watchlists, isLoading } = useWatchlists();

  const t = useTranslations('ListPage');

  const addToWatchlistMutation = useAddToWatchlistMutation({
    onError: () => {
      addToast({
        title: 'Ошибка добавления фильма.',
        color: 'danger',
      });
    },
  });

  const handleAddMovieClick = (watchlist: List) => {
    addToWatchlistMutation.mutate({
      watchlistId: watchlist.id,
      movie: {
        id: mediaItem.id,
        title: mediaItem.title,
        poster_path: mediaItem.posterPath,
        release_date: mediaItem.releaseDate,
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

  const hasWatchlists = !isLoading && watchlists.length > 0;

  return (
    <>
      <Button onPress={onOpenChange}>{t('addToWatchlist')}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t('addToWatchlist')}</ModalHeader>
          <ModalBody>
            {hasWatchlists ? (
              <>
                {watchlists.map((watchlist) => {
                  return (
                    <div key={watchlist.id} className="flex justify-between items-center gap-2">
                      <span>{watchlist.name}</span>
                      {checkIfWatchlistHasItem({ watchlist, itemId: mediaItem.id }) ? (
                        <span>{t('added')}</span>
                      ) : (
                        <Button onPress={() => handleAddMovieClick(watchlist)}>{t('add')}</Button>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddToWatchlistModal;
