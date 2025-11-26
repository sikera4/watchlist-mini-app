import AddMovieModal from './AddMovieModal';

type Params = {
  isVisible: boolean;
  movieId: number;
};

const CardOverlay = ({ isVisible, movieId }: Params) => {
  return (
    <div
      className={`flex opacity-${isVisible ? 1 : 0} absolute top-0 left-0 right-0 bottom-0 bg-background/60 justify-center items-center transition-opacity duration-200`}
    >
      {isVisible && <AddMovieModal movieId={movieId} />}
    </div>
  );
};

export default CardOverlay;
