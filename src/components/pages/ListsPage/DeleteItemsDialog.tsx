import { useState } from 'react';
import { Button, Modal, Spinner, toast } from '@heroui/react';
import { MediaItem, useRemoveFromWatchlistMutation } from '@/api';

type Props = {
  watchlistId: string;
  items: MediaItem[];
  onRemoved: () => void;
};

export default function DeleteItemsDialog({ watchlistId, items, onRemoved }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useRemoveFromWatchlistMutation({
    onSuccess: () => {
      setIsOpen(false);
      onRemoved();
      toast.success('Удалено из списка');
    },
    onError: () => toast.danger('Не удалось удалить. Попробуйте ещё раз.'),
  });

  return (
    <Modal>
      <Button variant="danger-soft" className="mt-3 w-full" onPress={() => setIsOpen(true)}>
        Удалить выбранное ({items.length})
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDismissable={!mutation.isPending}
        isKeyboardDismissDisabled={mutation.isPending}
      >
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Удалить из списка?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>Будет удалено: {items.length}. Это изменит список для всех его участников.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                isDisabled={mutation.isPending}
                onPress={() => setIsOpen(false)}
              >
                Отмена
              </Button>
              <Button
                variant="danger"
                isPending={mutation.isPending}
                onPress={() => mutation.mutate({ watchlistId, mediaItems: items })}
              >
                {mutation.isPending && <Spinner size="sm" />}Удалить
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
