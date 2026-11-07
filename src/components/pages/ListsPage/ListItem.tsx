import { MediaItem, useMarkAsSeenMutation } from '@/api';
import { motion } from 'framer-motion';
import { formatYear } from '@/utilities/formatYear';
import { toast, Button, Checkbox } from '@heroui/react';
import Poster from '@/components/ui/Poster';
import { FaCircleCheck, FaRegCircleCheck } from 'react-icons/fa6';
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
      toast.success('Отмечено как просмотренное');
    },
    onError: () => {
      toast.danger('Не удалось отметить просмотренным');
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
        <Poster
          path={posterPath}
          title={title}
          className="w-12 h-18 shrink-0 rounded-md"
          sizes="48px"
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
          aria-label={isSeen ? `${title}: просмотрено` : `Отметить просмотренным: ${title}`}
          variant={isSeen ? 'ghost' : 'secondary'}
          onPress={handleMarkAsSeen}
          isPending={markAsSeenMutation.isPending}
          isDisabled={isSeen}
        >
          {isSeen ? <FaRegCircleCheck className="size-6" /> : <FaCircleCheck className="size-6" />}
        </Button>
        <AnimatedPresenceFacade isVisible={isEditMode}>
          <Checkbox aria-label={`Выбрать: ${title}`} onChange={onSelectionChange}>
            <Checkbox.Content aria-label={`Выбрать: ${title}`}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox.Content>
          </Checkbox>
        </AnimatedPresenceFacade>
      </motion.div>
    </div>
  );
};

export default ListItem;
