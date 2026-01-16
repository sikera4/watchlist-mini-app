'use client';

import { useState } from 'react';

import { useRemoveFromWatchlistMutation } from '@/api';
import AnimatedPresenceFacade from '@/components/ui/AnimatedPresenceFacade';
import { useWatchlists } from '@/hooks/useWatchlists';
import { Accordion, AccordionItem, Button, Spinner } from '@heroui/react';
import { FaPenToSquare, FaRegTrashCan } from 'react-icons/fa6';
import CreateListForm from './CreateListForm';
import ListItem from './ListItem';

const ListsPage = () => {
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
    <div className="p-4 min-h-screen relative">
      <h2 className="text-2xl font-bold">Ваши списки</h2>
      <div className="mt-4">
        {isLoading ? (
          <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)]">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex flex-col">
            {watchlists.length ? (
              <Accordion variant="shadow">
                {watchlists.map((watchlist) => {
                  const isEditMode = watchlistBeingEditedKey === watchlist.id;

                  return (
                    <AccordionItem key={watchlist.id} title={watchlist.name}>
                      {Boolean(watchlist.items.length) && (
                        <div className="flex gap-2 justify-end py-2">
                          <AnimatedPresenceFacade isVisible={isEditMode}>
                            <Button
                              isIconOnly={true}
                              size="sm"
                              color="danger"
                              isDisabled={!selectedItemsIds.length}
                              isLoading={removeFromWatchlistMutation.isPending}
                              onPress={handleDeleteButtonClick}
                            >
                              <FaRegTrashCan />
                            </Button>
                          </AnimatedPresenceFacade>
                          <Button
                            isIconOnly={true}
                            size="sm"
                            color={isEditMode ? 'primary' : 'default'}
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
                    </AccordionItem>
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
