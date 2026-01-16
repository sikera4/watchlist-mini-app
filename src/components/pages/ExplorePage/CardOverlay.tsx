'use client';

import { useMediaItemInfoDrawer } from '@/components/ui/hooks/useMediaItemInfoDrawer';
import AddToWatchlistModal from './AddToWatchlistModal';
import { CardData } from './types';
import { Button } from '@heroui/react';

type Params = {
  isVisible: boolean;
  mediaItem: CardData;
};

const CardOverlay = ({ isVisible, mediaItem }: Params) => {
  const { drawerNode, openDrawer } = useMediaItemInfoDrawer();

  return (
    <div
      className={`flex opacity-${isVisible ? 1 : 0} absolute top-0 left-0 right-0 bottom-0 bg-background/60 flex-col justify-center items-center transition-opacity duration-200`}
    >
      {isVisible && (
        <>
          <AddToWatchlistModal mediaItem={mediaItem} />
          <Button className="mt-2" onPress={() => openDrawer(mediaItem)}>
            Подробнее
          </Button>
        </>
      )}
      {drawerNode}
    </div>
  );
};

export default CardOverlay;
