import { MediaItem, useMarkAsSeenMutation } from '@/api';
import { PLACEHOLDER_URL } from '@/constants';
import { formatYear } from '@/utilities/formatYear';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { addToast, Button, Image } from '@heroui/react';
import { FaCircleCheck, FaEye } from 'react-icons/fa6';
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
    <div className="flex relative gap-4 items-center">
      <div className="rounded-md overflow-hidden">
        <Image
          src={getImageSrcByPath(posterPath)}
          alt={`${title} poster`}
          height={72}
          width={48}
          className="static object-cover rounded-md"
          fallbackSrc={PLACEHOLDER_URL}
        />
      </div>
      <div>
        <h4 className="text-lg font-bold">{title}</h4>
        {!!releaseDate && <span className="text-sm mt-1">{formatYear(new Date(releaseDate))}</span>}
      </div>
      <div className="absolute right-0">
        {isSeen ? (
          <div className="size-10 flex justify-center items-center">
            <FaCircleCheck className="size-6" />
          </div>
        ) : (
          <Button
            isIconOnly={true}
            variant="faded"
            onPress={handleMarkAsSeen}
            isLoading={markAsSeenMutation.isPending}
          >
            <FaEye className="size-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListItem;
