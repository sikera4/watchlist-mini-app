export type Movie = {
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  id: number;
};

export type List = {
  id: number;
  name?: string;
  users: string[];
  movies: {
    id: number;
    isSeen: boolean;
  }
}
