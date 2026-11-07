import Poster from '@/components/ui/Poster';
import { useState } from 'react';
import CardOverlay from './CardOverlay';
import { CardData } from './types';

type Props = CardData;

const Card = ({ title, posterPath, genres, releaseDate, id, originalTitle, overview }: Props) => {
  const [isTapped, setIsTapped] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Показать действия: ${title}`}
        onClick={() => setIsTapped(true)}
        className="block w-full rounded-xl text-left focus-visible:outline-2 focus-visible:outline-accent"
      >
        <Poster
          path={posterPath}
          title={title}
          className="h-[270px] rounded-xl"
          sizes="(max-width: 640px) 50vw, 300px"
        />
      </button>
      <h4 className="text-lg font-bold mt-2">{title}</h4>
      <span className="text-sm font-light">
        {Boolean(releaseDate) && releaseDate}
        {Boolean(releaseDate && genres) && ', '}
        {genres}
      </span>

      <CardOverlay
        isVisible={isTapped}
        onClose={() => setIsTapped(false)}
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
