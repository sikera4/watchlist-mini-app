import { useWatchlists } from '@/hooks/useWatchlists';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import AddToWatchlistItem from './AddToWatchlistItem';
import { CardData } from './types';

type Props = {
  mediaItem: CardData;
};

const AddToWatchlistModal = ({ mediaItem }: Props) => {
  const { isOpen, onOpenChange } = useDisclosure();

  const { watchlists, isLoading } = useWatchlists();

  const t = useTranslations('ListPage');

  const hasWatchlists = !isLoading && watchlists.length > 0;

  return (
    <>
      <Button onPress={onOpenChange} isDisabled={!watchlists.length}>
        {t('addToWatchlist')}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t('addToWatchlist')}</ModalHeader>
          <ModalBody className="pb-4">
            {hasWatchlists ? (
              <>
                {watchlists.map((watchlist) => {
                  return (
                    <AddToWatchlistItem
                      key={watchlist.id}
                      watchlist={watchlist}
                      mediaItem={mediaItem}
                    />
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
