import AddToWatchlistModal from './AddToWatchlistModal';
import { CardData } from './types';

type Params = {
  isVisible: boolean;
  mediaItem: CardData;
};

const CardOverlay = ({ isVisible, mediaItem }: Params) => {
  return (
    <div
      className={`flex opacity-${isVisible ? 1 : 0} absolute top-0 left-0 right-0 bottom-0 bg-background/60 justify-center items-center transition-opacity duration-200`}
    >
      {isVisible && <AddToWatchlistModal mediaItem={mediaItem} />}
    </div>
  );
};

export default CardOverlay;
