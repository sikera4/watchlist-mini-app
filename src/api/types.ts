export type Movie = {
  title: string;
  poster_path: string;
  release_date?: string;
  genre_ids: number[];
  id: number;
};

export type TvShow = {
  id: number;
  name: string;
  poster_path: string;
  genre_ids: number[];
}

export type MovieInList = Omit<Movie, 'genre_ids'> & {
  isSeen: boolean;
}

export type List = {
  id: string;
  name?: string;
  usersIds: number[];
  movies: MovieInList[];
};

export type User = {
  userId: number;
  watchlists: string[];
};

export type Genre = {
  id: number;
  name: string;
};
