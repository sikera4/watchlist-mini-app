import { Genre } from '@/api';

type Params = {
  genresIds: number[];
  genres: Genre[];
};

export const formatGenres = ({ genres, genresIds }: Params): string => {
  return genres.length
    ? genresIds
        .map((id) => {
          const genre = genres.find((genre) => genre.id === id);

          return genre ? genre.name : null;
        })
        .join(', ')
    : '';
};
