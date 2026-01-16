import { TvShow } from "@/api";
import { CardData } from "../types";
import { formatYear } from "@/utilities/formatYear";

export const tvShowToCardData = (tvShow: TvShow): CardData => {
  return {
    title: tvShow.name,
    posterPath: tvShow.poster_path,
    id: tvShow.id,
    releaseDate: tvShow.first_air_date ? formatYear(new Date(tvShow.first_air_date)) : '',
    originalTitle: tvShow.original_name,
    overview: tvShow.overview,
  }
}
