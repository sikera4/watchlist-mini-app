import { FaFilm } from 'react-icons/fa6';
import type { MediaItem } from '@/api/types';
import Poster from '@/components/ui/Poster';

export default function CollectionCover({ items }: { items: MediaItem[] }) {
  return (
    <span aria-hidden="true" className="relative block h-24 w-25 shrink-0">
      {items.length ? (
        items.slice(0, 3).map((item, index) => (
          <span
            key={item.id}
            className="absolute bottom-1 block h-22 w-15 overflow-hidden rounded-lg border-2 border-surface shadow-md"
            style={{
              left: index * 17,
              transform: `rotate(${(index - 1) * 8}deg)`,
              zIndex: 3 - index,
            }}
          >
            <Poster
              path={item.posterPath}
              title={item.title}
              className="h-full w-full"
              sizes="60px"
            />
          </span>
        ))
      ) : (
        <span className="flex h-full items-center justify-center rounded-2xl bg-accent/8 text-accent">
          <FaFilm className="size-7" />
        </span>
      )}
    </span>
  );
}
