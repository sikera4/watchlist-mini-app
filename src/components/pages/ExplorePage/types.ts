export type SearchFormValues = {
  searchInput: string;
};

export type CardData = {
  id: number;
  title: string;
  posterPath: string;
  genres?: string;
  releaseDate?: string;
  originalTitle: string;
  overview: string;
};
