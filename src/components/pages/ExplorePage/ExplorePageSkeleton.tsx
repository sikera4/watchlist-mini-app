import Skeleton from '@/components/ui/Skeleton';

const cardsIds = [0, 1, 2, 3];

const ExplorePageSkeleton = () => {
  const card = (
    <div>
      <Skeleton className="h-[270px] rounded-lg" />
      <Skeleton className="h-5 rounded-sm mt-2" />
      <Skeleton className="h-3 rounded-sm w-4/5 mt-1" />
      <Skeleton className="h-3 rounded-sm w-2/5 mt-1" />
    </div>
  );

  return (
    <div className="p-4 relative min-h-screen">
      <div className="grid grid-cols-6 gap-4">
        <Skeleton className="h-12 rounded-lg col-span-4" />
        <Skeleton className="h-12 rounded-lg col-span-2" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {cardsIds.map((id) => (
          <div key={id}>{card}</div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePageSkeleton;
