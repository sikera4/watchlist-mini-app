'use client';

import { useState } from 'react';

import { useRemoveFromWatchlistMutation } from '@/api';
import AnimatedPresenceFacade from '@/components/ui/AnimatedPresenceFacade';
import { useWatchlists } from '@/hooks/useWatchlists';
import { Accordion, Button, Spinner } from '@heroui/react';
import { FaPenToSquare, FaRegTrashCan } from 'react-icons/fa6';
import CreateListForm from './CreateListForm';
import ListItem from './ListItem';
import { useRememberPageScroll } from '@/components/providers/BrowsingStateProvider';

const ListsPage = () => {
  useRememberPageScroll('/');
  const { watchlists, isLoading } = useWatchlists();

  const [watchlistBeingEditedKey, setWatchlistsBeingEditedKey] = useState<string | null>(null);
  const [selectedItemsIds, setSelectedItemsIds] = useState<number[]>([]);

  const removeFromWatchlistMutation = useRemoveFromWatchlistMutation({
    onSuccess: () => {
      setSelectedItemsIds([]);
      setWatchlistsBeingEditedKey(null);
    },
  });

  const handleEditButtonClick = (watchlistId: string) => {
    setWatchlistsBeingEditedKey((prev) => (prev === watchlistId ? null : watchlistId));
    setSelectedItemsIds([]);
  };

  const handleSelectionChange = (itemId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItemsIds([...selectedItemsIds, itemId]);
    } else {
      setSelectedItemsIds(selectedItemsIds.filter((id) => id !== itemId));
    }
  };

  const handleDeleteButtonClick = () => {
    const watchlistBeingEdited = watchlists.find(
      (watchlist) => watchlist.id === watchlistBeingEditedKey
    );
    const mediaItemsToDelete =
      watchlistBeingEdited?.items.filter((mediaItem) => selectedItemsIds.includes(mediaItem.id)) ??
      [];

    if (watchlistBeingEditedKey) {
      removeFromWatchlistMutation.mutate({
        watchlistId: watchlistBeingEditedKey,
        mediaItems: mediaItemsToDelete,
      });
    }
  };

  return (
    <div className="app-page p-4 min-h-screen relative">
      <h2 className="text-2xl font-bold">Ваши списки</h2>
      <div className="mt-4">
        {isLoading ? (
          <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)]">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex flex-col">
            {watchlists.length ? (
              <Accordion>
                {watchlists.map((watchlist) => {
                  const isEditMode = watchlistBeingEditedKey === watchlist.id;

                  return (
                    <Accordion.Item key={watchlist.id} id={watchlist.id}>
                      <Accordion.Heading>
                        <Accordion.Trigger>
                          {watchlist.name}
                          <Accordion.Indicator />
                        </Accordion.Trigger>
                      </Accordion.Heading>
                      <Accordion.Panel>
                        <Accordion.Body>
                          {Boolean(watchlist.items.length) && (
                            <div className="flex gap-2 justify-end py-2">
                              <AnimatedPresenceFacade isVisible={isEditMode}>
                                <Button
                                  isIconOnly={true}
                                  size="sm"
                                  variant="danger"
                                  aria-label="Удалить выбранное"
                                  isDisabled={!selectedItemsIds.length}
                                  isPending={removeFromWatchlistMutation.isPending}
                                  onPress={handleDeleteButtonClick}
                                >
                                  <FaRegTrashCan />
                                </Button>
                              </AnimatedPresenceFacade>
                              <Button
                                isIconOnly={true}
                                size="sm"
                                variant={isEditMode ? 'primary' : 'secondary'}
                                aria-label={isEditMode ? 'Завершить выбор' : 'Выбрать для удаления'}
                                onPress={() => handleEditButtonClick(watchlist.id)}
                              >
                                <FaPenToSquare />
                              </Button>
                            </div>
                          )}
                          <ul className="list-none flex flex-col gap-2">
                            {watchlist.items.length ? (
                              watchlist.items.map((item) => (
                                <ListItem
                                  key={item.id}
                                  item={item}
                                  watchlistId={watchlist.id}
                                  isEditMode={isEditMode}
                                  onSelectionChange={(isSelected) =>
                                    handleSelectionChange(item.id, isSelected)
                                  }
                                />
                              ))
                            ) : (
                              <span>Список пуст</span>
                            )}
                          </ul>
                        </Accordion.Body>
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            ) : (
              <span>Списков нет</span>
            )}
            <CreateListForm className="mt-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListsPage;
