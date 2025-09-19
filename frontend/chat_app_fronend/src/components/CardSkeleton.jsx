const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card bg-base-200 animate-pulse">
          <div className="card-body p-4">
            {/* Avatar skeleton */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-base-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-base-300 rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-base-300 rounded w-full"></div>
              <div className="h-3 bg-base-300 rounded w-2/3"></div>
            </div>
            
            {/* Button skeleton */}
            <div className="mt-4">
              <div className="h-8 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;