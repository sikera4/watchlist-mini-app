import { useWatchlists } from '@/hooks/useWatchlists';
import { Button, Modal } from '@heroui/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import AddToWatchlistItem from './AddToWatchlistItem';
import { CardData } from './types';
import Poster from '@/components/ui/Poster';

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
        <Modal.Container scroll="inside">
          <Modal.Dialog className="max-h-[85dvh]">
            <Modal.CloseTrigger aria-label="Закрыть" />
            <Modal.Header className="pr-10">
              <Modal.Heading>{t('addToWatchlist')}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-4 pb-5">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-secondary p-3">
                <Poster
                  path={mediaItem.posterPath}
                  title={mediaItem.title}
                  className="h-16 w-11 shrink-0 rounded-lg"
                  sizes="44px"
                />
                <div className="min-w-0">
                  <p className="break-words font-semibold text-foreground">{mediaItem.title}</p>
                  {mediaItem.releaseDate && (
                    <p className="mt-1 text-xs text-muted">{mediaItem.releaseDate.slice(0, 4)}</p>
                  )}
                </div>
              </div>

              {isError && (
                <div role="alert" className="space-y-2 text-sm">
                  <p>Не удалось обновить списки.</p>
                  <Button variant="secondary" onPress={() => void refetch()}>
                    Повторить
                  </Button>
                </div>
              )}

              {watchlists.length > 0 ? (
                <>
                  <p className="text-sm text-muted">Можно добавить сразу в несколько списков.</p>
                  <ul aria-label="Ваши списки" className="flex flex-col gap-3">
                    {watchlists.map((watchlist) => (
                      <AddToWatchlistItem
                        key={`${watchlist.id}:${mediaItem.id}`}
                        watchlist={watchlist}
                        mediaItem={mediaItem}
                      />
                    ))}
                  </ul>
                </>
              ) : !isError ? (
                <div className="space-y-3">
                  <p>Сначала создайте список для фильмов и сериалов.</p>
                  <Link href="/" className="text-accent underline">
                    Перейти к спискам
                  </Link>
                </div>
              ) : null}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AddToWatchlistModal;
