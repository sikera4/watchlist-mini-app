import { useCallback, useState } from 'react';
import { CardData } from '../../pages/ExplorePage/types';
import MediaItemInfoDrawer from '../MediaItemInfoDrawer';

export const useMediaItemInfoDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaItem, setMediaItem] = useState<CardData | null>(null);

  const openDrawer = useCallback((item: CardData) => {
    setMediaItem(item);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setMediaItem(null);
  }, []);

  const drawerNode = (
    <MediaItemInfoDrawer mediaItem={mediaItem} isOpen={isOpen} onClose={closeDrawer} />
  );

  return { drawerNode, openDrawer };
};
