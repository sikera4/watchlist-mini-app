import { Movie } from '@/api';
import AddMovieModal from './AddMovieModal';

type Params = {
  isVisible: boolean;
  movie: Movie;
};

const CardOverlay = ({ isVisible, movie }: Params) => {
  return (
    <div
      className={`flex opacity-${isVisible ? 1 : 0} absolute top-0 left-0 right-0 bottom-0 bg-background/60 justify-center items-center transition-opacity duration-200`}
    >
      {isVisible && <AddMovieModal movie={movie} />}
    </div>
  );
};

export default CardOverlay;
