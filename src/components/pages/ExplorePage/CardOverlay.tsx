'use client';

import { useMediaItemInfoDrawer } from '@/components/ui/hooks/useMediaItemInfoDrawer';
import AddToWatchlistModal from './AddToWatchlistModal';
import { CardData } from './types';
import { Button } from '@heroui/react';

type Params = {
  isVisible: boolean;
  mediaItem: CardData;
  onClose: () => void;
};

const CardOverlay = ({ isVisible, mediaItem, onClose }: Params) => {
  const { drawerNode, openDrawer } = useMediaItemInfoDrawer();

  return (
    <>
      {isVisible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-surface/95 p-3 shadow-sm backdrop-blur-sm">
          <AddToWatchlistModal mediaItem={mediaItem} />
          <Button variant="secondary" onPress={() => openDrawer(mediaItem)}>
            Подробнее
          </Button>
          <Button size="sm" variant="ghost" onPress={onClose}>
            Закрыть
          </Button>
        </div>
      )}
      {drawerNode}
    </>
  );
};

export default CardOverlay;
