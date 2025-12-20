import { List } from "@/api"

type Params = {
  watchlist: List;
  itemId: number;
}

export const checkIfWatchlistHasItem = ({ itemId, watchlist }: Params) => {
  return watchlist.movies.some((movie) => movie.id === itemId);
}
