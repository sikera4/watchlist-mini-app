import { MediaItem, useMarkAsSeenMutation } from '@/api';
import { motion } from 'framer-motion';
import { PLACEHOLDER_URL } from '@/constants';
import { formatYear } from '@/utilities/formatYear';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { addToast, Button, Checkbox, Chip, Image } from '@heroui/react';
import { FaCircleCheck, FaRegCircleCheck } from 'react-icons/fa6';
import NextImage from 'next/image';
import AnimatedPresenceFacade from '@/components/ui/AnimatedPresenceFacade';

type Props = {
  item: MediaItem;
  watchlistId: string;
  isEditMode: boolean;
  onSelectionChange: (isSelected: boolean) => void;
};

const ListItem = ({ item, watchlistId, isEditMode, onSelectionChange }: Props) => {
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
      <motion.div className="flex gap-1 items-center" animate={{ width: isEditMode ? 76 : 40 }}>
        <Button
          isIconOnly={true}
          variant={isSeen ? 'light' : 'faded'}
          onPress={handleMarkAsSeen}
          isLoading={markAsSeenMutation.isPending}
          isDisabled={isSeen}
        >
          {isSeen ? <FaRegCircleCheck className="size-6" /> : <FaCircleCheck className="size-6" />}
        </Button>
        <AnimatedPresenceFacade isVisible={isEditMode}>
          <Checkbox size="lg" color="default" onValueChange={onSelectionChange} />
        </AnimatedPresenceFacade>
      </motion.div>
    </div>
  );
};

export default ListItem;
