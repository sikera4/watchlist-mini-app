export type Movie = {
  title: string;
  poster_path: string;
  release_date?: string;
  genre_ids: number[];
  original_title: string;
  overview: string;
  id: number;
};

export type TvShow = {
  id: number;
  name: string;
  poster_path: string;
  genre_ids: number[];
  original_name: string;
  overview: string;
  first_air_date?: string;
}

export type MediaItem = {
  id: number;
  title: string;
  releaseDate?: string;
  posterPath: string;
  isSeen: boolean;
}

export type List = {
  id: string;
  name?: string;
  usersIds: number[];
  items: MediaItem[];
};

export type User = {
  userId: number;
  watchlists: string[];
};

export type Genre = {
  id: number;
  name: string;
};
