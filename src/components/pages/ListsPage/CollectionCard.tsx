import { useState } from 'react';
import Link from 'next/link';
import { Accordion, Button } from '@heroui/react';
import { FaArrowRight, FaUsers } from 'react-icons/fa6';
import type { List } from '@/api/types';
import CollectionCover from './CollectionCover';
import DeleteItemsDialog from './DeleteItemsDialog';
import ListItem from './ListItem';

type Filter = 'unseen' | 'seen' | 'all';

const filters: { key: Filter; label: string }[] = [
  { key: 'unseen', label: 'На очереди' },
  { key: 'seen', label: 'Просмотрено' },
  { key: 'all', label: 'Все' },
];

export default function CollectionCard({ watchlist }: { watchlist: List }) {
  const [filter, setFilter] = useState<Filter>('unseen');
  const [isEditing, setIsEditing] = useState(false);
  const [selection, setSelection] = useState<number[]>([]);

  const watched = watchlist.items.filter((item) => item.isSeen).length;
  const total = watchlist.items.length;
  const progress = total ? Math.round((watched / total) * 100) : 0;
  const visibleItems = watchlist.items.filter(
    (item) => filter === 'all' || (filter === 'seen' ? item.isSeen : !item.isSeen)
  );
  const selectedItems = watchlist.items.filter((item) => selection.includes(item.id));

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setSelection([]);
  };

  const toggleSelection = (id: number, selected: boolean) => {
    setSelection((current) =>
      selected ? [...new Set([...current, id])] : current.filter((value) => value !== id)
    );
  };

  return (
    <Accordion.Item
      id={watchlist.id}
      className="collection-card overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
    >
      <Accordion.Heading>
        <Accordion.Trigger className="gap-4 p-5 text-left">
          <CollectionCover items={watchlist.items} />

          <span className="min-w-0 flex-1">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {watchlist.userIds.length > 1 ? 'Совместный список' : 'Личная подборка'}
            </span>
            <span className="block break-words text-lg font-semibold leading-tight">
              {watchlist.name || 'Без названия'}
            </span>
            <span className="mt-2 block text-xs text-muted">
              {total
                ? `${total - watched} на очереди · ${watched} просмотрено`
                : 'Пока чистый лист'}
            </span>
          </span>

          <Accordion.Indicator className="shrink-0 text-muted" />
        </Accordion.Trigger>
      </Accordion.Heading>

      <div
        className="flex items-center gap-3 px-5 pb-4"
        aria-label={`Просмотрено ${watched} из ${total}`}
      >
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-default">
          <div
            className="h-full rounded-full bg-accent transition-[width] motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        {watchlist.userIds.length > 1 && (
          <span className="flex items-center gap-1 text-xs text-muted">
            <FaUsers aria-hidden="true" />
            {watchlist.userIds.length}
          </span>
        )}
        <span className="text-[11px] tabular-nums text-muted">{progress}%</span>
      </div>

      <Accordion.Panel>
        <Accordion.Body className="border-t border-border px-5 pb-5 pt-4">
          {total > 0 && (
            <>
              <div
                role="group"
                aria-label="Фильтр просмотра"
                className="mb-3 flex flex-wrap gap-1 rounded-xl bg-surface-secondary p-1"
              >
                {filters.map(({ key, label }) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={filter === key ? 'secondary' : 'ghost'}
                    aria-pressed={filter === key}
                    onPress={() => changeFilter(key)}
                    className="flex-1 text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs text-muted">
                  {isEditing
                    ? `Выбрано: ${selection.length}`
                    : `В подборке: ${visibleItems.length}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => {
                    setIsEditing((current) => !current);
                    setSelection([]);
                  }}
                >
                  {isEditing ? 'Готово' : 'Выбрать'}
                </Button>
              </div>
            </>
          )}

          {visibleItems.length ? (
            <ul className="divide-y divide-border/60">
              {visibleItems.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  watchlistId={watchlist.id}
                  isEditMode={isEditing}
                  isSelected={selection.includes(item.id)}
                  onSelectionChange={(selected) => toggleSelection(item.id, selected)}
                />
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center">
              <p className="font-medium">
                {!total
                  ? 'Что посмотрим первым?'
                  : filter === 'seen'
                    ? 'Всё интересное ещё впереди'
                    : 'Всё просмотрено!'}
              </p>
              <p className="mt-2 text-sm text-muted">
                {filter === 'seen' && total
                  ? 'Отмечайте просмотренные фильмы галочкой.'
                  : 'Загляните в Обзор и найдите следующую историю.'}
              </p>
            </div>
          )}

          {isEditing && selection.length > 0 && (
            <DeleteItemsDialog
              watchlistId={watchlist.id}
              items={selectedItems}
              onRemoved={() => {
                setSelection([]);
                setIsEditing(false);
              }}
            />
          )}

          <Link
            href="/explore"
            prefetch
            className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-accent transition-colors hover:bg-accent/5"
          >
            Найти что посмотреть <FaArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
