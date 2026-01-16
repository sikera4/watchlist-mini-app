import { PLACEHOLDER_URL } from '@/constants';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { Drawer, DrawerBody, DrawerContent, Image } from '@heroui/react';
import NextImage from 'next/image';
import { CardData } from '../pages/ExplorePage/types';

type Props = {
  mediaItem: CardData | null;
  isOpen: boolean;
  onClose: () => void;
};

const MediaItemInfoDrawer = ({ mediaItem, isOpen, onClose }: Props) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <DrawerContent>
        <DrawerBody className="py-8">
          {mediaItem && (
            <div className="flex flex-col items-center">
              <div className="w-66 h-100 relative">
                <Image
                  alt={`${mediaItem.title} poster`}
                  src={getImageSrcByPath(mediaItem.posterPath)}
                  fallbackSrc={PLACEHOLDER_URL}
                  fill={true}
                  as={NextImage}
                  className="rounded-lg object-cover"
                  classNames={{
                    wrapper: '!max-w-none h-100',
                    img: 'object-cover border-md',
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold mt-4">{mediaItem.title}</h2>
              <span>{mediaItem.originalTitle}</span>
              <div className="text-md text-gray-500">
                {mediaItem.releaseDate}
                {mediaItem.releaseDate && mediaItem.genres && ', '}
                {mediaItem.genres}
              </div>
              <p className="mt-2">{mediaItem.overview}</p>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MediaItemInfoDrawer;
