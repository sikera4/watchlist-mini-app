import { MediaItem, useSetWatchedMutation } from '@/api';
import { formatYear } from '@/utilities/formatYear';
import { toast, Button, Checkbox, Spinner } from '@heroui/react';
import { FaCheck, FaRegCircle } from 'react-icons/fa6';
import Poster from '@/components/ui/Poster';

type Props = {
  item: MediaItem;
  watchlistId: string;
  isEditMode: boolean;
  isSelected: boolean;
  onSelectionChange: (isSelected: boolean) => void;
};

export default function ListItem({
  item,
  watchlistId,
  isEditMode,
  isSelected,
  onSelectionChange,
}: Props) {
  const { title, releaseDate, posterPath, isSeen, id } = item;

  const watchedMutation = useSetWatchedMutation({
    onSuccess: (_, { isSeen: nextIsSeen }) =>
      toast.success(nextIsSeen ? 'Отмечено как просмотренное' : 'Возвращено в очередь'),
    onError: () => toast.danger('Не удалось изменить статус. Попробуйте ещё раз.'),
  });

  const toggleWatched = () => {
    watchedMutation.mutate({ mediaId: id, watchlistId, isSeen: !isSeen });
  };

  return (
    <li className="flex items-center gap-3 rounded-xl py-3">
      <Poster
        path={posterPath}
        title={title}
        className={`h-20 w-14 shrink-0 rounded-lg ${isSeen ? 'opacity-60' : ''}`}
        sizes="56px"
      />

      <div className="min-w-0 flex-1">
        <h3
          className={`line-clamp-2 text-sm font-semibold leading-snug ${isSeen ? 'text-muted' : 'text-foreground'}`}
        >
          {title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          {releaseDate && <span>{formatYear(new Date(releaseDate))}</span>}
          {isSeen && (
            <span className="flex items-center gap-1 text-success">
              <FaCheck aria-hidden="true" /> Просмотрено
            </span>
          )}
        </div>
      </div>

      {isEditMode ? (
        <Checkbox
          aria-label={`Выбрать для удаления: ${title}`}
          isSelected={isSelected}
          onChange={onSelectionChange}
          className="shrink-0"
        >
          <Checkbox.Content aria-label={`Выбрать для удаления: ${title}`} className="p-3">
            <Checkbox.Control
              className={`size-5 border-2 ${isSelected ? 'border-accent' : 'border-muted'}`}
            >
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox.Content>
        </Checkbox>
      ) : (
        <Button
          isIconOnly
          aria-label={isSeen ? `Вернуть в очередь: ${title}` : `Отметить просмотренным: ${title}`}
          variant="ghost"
          className={`shrink-0 ${isSeen ? 'text-success' : 'text-muted'}`}
          onPress={toggleWatched}
          isPending={watchedMutation.isPending}
        >
          {watchedMutation.isPending ? (
            <Spinner size="sm" />
          ) : isSeen ? (
            <FaCheck />
          ) : (
            <FaRegCircle className="size-5" />
          )}
        </Button>
      )}
    </li>
  );
}
