import { Movie } from "@/api";
import { CardData } from "../types";
import { formatYear } from "@/utilities/formatYear";

export const movieToCardData = (movie: Movie): CardData => {
  return {
    title: movie.title,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date ? formatYear(new Date(movie.release_date)) : '',
    originalTitle: movie.original_title,
    overview: movie.overview,
    id: movie.id,
  }
}
