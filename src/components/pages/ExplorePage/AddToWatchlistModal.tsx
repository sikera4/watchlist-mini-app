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

type Props = {
  mediaItem: CardData;
};

const AddToWatchlistModal = ({ mediaItem }: Props) => {
  const { isOpen, onOpenChange } = useDisclosure();

  const { watchlists, isLoading } = useWatchlists();

  const addToWatchlistMutation = useAddToWatchlistMutation({
    onSuccess: () => {
      addToast({
        title: 'Фильм успешно добавлен!',
        color: 'success',
      });
    },
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
  };

  const hasWatchlists = !isLoading && watchlists.length > 0;

  return (
    <>
      <Button onPress={onOpenChange}>Add to watchlist</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Add Movie to Watchlist</ModalHeader>
          <ModalBody>
            {hasWatchlists ? (
              <>
                {watchlists.map((watchlist) => {
                  return (
                    <div key={watchlist.id} className="flex justify-between items-center gap-2">
                      <span>{watchlist.name}</span>
                      <Button
                        onPress={() => handleAddMovieClick(watchlist)}
                        isLoading={
                          addToWatchlistMutation.isPending &&
                          addToWatchlistMutation.variables.watchlistId === watchlist.id
                        }
                      >
                        Add
                      </Button>
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
