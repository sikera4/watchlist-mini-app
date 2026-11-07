import Poster from '@/components/ui/Poster';
import { useState } from 'react';
import CardOverlay from './CardOverlay';
import { CardData } from './types';

type Props = CardData;

const Card = ({ title, posterPath, genres, releaseDate, id, originalTitle, overview }: Props) => {
  const [isTapped, setIsTapped] = useState(false);

  return (
    <div className="relative" onClick={() => setIsTapped(!isTapped)}>
      <Poster
        path={posterPath}
        title={title}
        className="h-[270px] rounded-xl"
        sizes="(max-width: 640px) 50vw, 300px"
      />
      <h4 className="text-lg font-bold mt-2">{title}</h4>
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
          originalTitle,
          overview,
        }}
      />
    </div>
  );
};

export default Card;
