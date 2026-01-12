import { PLACEHOLDER_URL } from '@/constants';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { Image } from '@heroui/react';
import NextImage from 'next/image';
import { useState } from 'react';
import CardOverlay from './CardOverlay';
import { CardData } from './types';

type Props = CardData;

const Card = ({ title, posterPath, genres, releaseDate, id }: Props) => {
  const [isTapped, setIsTapped] = useState(false);

  return (
    <div className="relative" onClick={() => setIsTapped(!isTapped)}>
      <Image
        alt={`${title} poster`}
        className="object-cover"
        classNames={{
          wrapper: '!max-w-none relative z-0 h-[270px]',
          img: 'object-cover border-md',
        }}
        src={getImageSrcByPath(posterPath)}
        fallbackSrc={PLACEHOLDER_URL}
        fill={true}
        as={NextImage}
      />
      <h4 className="text-lg font-bold mt-2">{title ?? name}</h4>
      <span className="text-sm font-light">
        {Boolean(releaseDate) && releaseDate}
        {Boolean(releaseDate && genres) && ', '}
        {genres}
      </span>

      <CardOverlay
        isVisible={isTapped}
        mediaItem={{
          title,
          posterPath,
          genres,
          releaseDate,
          id,
        }}
      />
    </div>
  );
};

export default Card;
