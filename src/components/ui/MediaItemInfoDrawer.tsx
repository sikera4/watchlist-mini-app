import { Drawer } from '@heroui/react';
import Poster from './Poster';
import { CardData } from '../pages/ExplorePage/types';

type Props = {
  mediaItem: CardData | null;
  isOpen: boolean;
  onClose: () => void;
};

const MediaItemInfoDrawer = ({ mediaItem, isOpen, onClose }: Props) => {
  return (
    <Drawer>
      <Drawer.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Drawer.Content placement="bottom">
          <Drawer.Dialog className="max-h-[90dvh]">
            <Drawer.Handle />
            <Drawer.CloseTrigger aria-label="Закрыть" />
            <Drawer.Header>
              <Drawer.Heading>{mediaItem?.title ?? 'О фильме'}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="pb-8">
              {mediaItem && (
                <div className="flex flex-col items-center">
                  <Poster
                    path={mediaItem.posterPath}
                    title={mediaItem.title}
                    className="w-56 h-84 rounded-xl"
                    sizes="224px"
                  />
                  <span>{mediaItem.originalTitle}</span>
                  <div className="text-sm text-muted">
                    {mediaItem.releaseDate}
                    {mediaItem.releaseDate && mediaItem.genres && ', '}
                    {mediaItem.genres}
                  </div>
                  <p className="mt-2">{mediaItem.overview}</p>
                </div>
              )}
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default MediaItemInfoDrawer;
