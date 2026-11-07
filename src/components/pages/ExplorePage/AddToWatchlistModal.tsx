import { useWatchlists } from '@/hooks/useWatchlists';
import { Button, Modal } from '@heroui/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import AddToWatchlistItem from './AddToWatchlistItem';
import { CardData } from './types';

type Props = {
  mediaItem: CardData;
};

const AddToWatchlistModal = ({ mediaItem }: Props) => {
  const { watchlists, isError, refetch } = useWatchlists();

  const t = useTranslations('ListPage');

  return (
    <Modal>
      <Button>{t('addToWatchlist')}</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger aria-label="Закрыть" />
            <Modal.Header>
              <Modal.Heading>{t('addToWatchlist')}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="pb-4">
              {isError && (
                <Button variant="secondary" onPress={() => void refetch()}>
                  Обновить списки
                </Button>
              )}
              {watchlists.length > 0 ? (
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
                <div className="space-y-3">
                  <p>Сначала создайте список для фильмов и сериалов.</p>
                  <Link href="/" className="text-accent underline">
                    Перейти к спискам
                  </Link>
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AddToWatchlistModal;
