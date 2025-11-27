import { Movie, useAddMovieToWatchlistMutation } from '@/api';
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

type Props = {
  movie: Movie;
};

const AddMovieModal = ({ movie }: Props) => {
  const { isOpen, onOpenChange } = useDisclosure();

  const { watchlists, isLoading } = useWatchlists();

  const addMovieToWatchlistMutation = useAddMovieToWatchlistMutation({
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
    addMovieToWatchlistMutation.mutate({
      watchlistId: watchlist.id,
      movie: {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
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
                          addMovieToWatchlistMutation.isPending &&
                          addMovieToWatchlistMutation.variables.watchlistId === watchlist.id
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

export default AddMovieModal;
