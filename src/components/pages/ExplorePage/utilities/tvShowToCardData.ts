import { TvShow } from "@/api";
import { CardData } from "../types";

export const tvShowToCardData = (tvShow: TvShow): CardData => {
  return {
    title: tvShow.name,
    posterPath: tvShow.poster_path,
    id: tvShow.id,
  }
}
