import { MediaItem, useMarkAsSeenMutation } from '@/api';
import { PLACEHOLDER_URL } from '@/constants';
import { formatYear } from '@/utilities/formatYear';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { addToast, Button, Image } from '@heroui/react';
import { FaCircleCheck, FaRegCircleCheck } from 'react-icons/fa6';
import NextImage from 'next/image';

type Props = {
  item: MediaItem;
  watchlistId: string;
};

const ListItem = ({ item, watchlistId }: Props) => {
  const { title, releaseDate, posterPath, isSeen, id } = item;

  const markAsSeenMutation = useMarkAsSeenMutation({
    onSuccess: () => {
      addToast({
        color: 'success',
        title: 'Marked as seen',
      });
    },
    onError: () => {
      addToast({
        color: 'danger',
        title: 'Failed to mark as seen',
      });
    },
  });

  const handleMarkAsSeen = () => {
    if (!isSeen) {
      markAsSeenMutation.mutate({ movieId: id, watchlistId });
    }
  };

  return (
    <div className="flex relative gap-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <Image
          src={getImageSrcByPath(posterPath)}
          alt={`${title} poster`}
          fill={true}
          classNames={{
            wrapper: '!max-w-none min-w-12 w-12 h-18 relative',
            img: 'rounded-md cover',
          }}
          fallbackSrc={PLACEHOLDER_URL}
          as={NextImage}
        />
        <div>
          <h4 className="text-lg font-bold">{title}</h4>
          {!!releaseDate && (
            <span className="text-sm mt-1">{formatYear(new Date(releaseDate))}</span>
          )}
        </div>
      </div>
      <div>
        {isSeen ? (
          <div className="size-10 flex justify-center items-center">
            <FaRegCircleCheck className="size-6" />
          </div>
        ) : (
          <Button
            isIconOnly={true}
            variant="faded"
            onPress={handleMarkAsSeen}
            isLoading={markAsSeenMutation.isPending}
          >
            <FaCircleCheck className="size-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListItem;
