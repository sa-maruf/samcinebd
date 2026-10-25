// src/components/skeletons/Skeletons.jsx

export function CardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="skeleton-poster" />
      <div className="p-3 space-y-2">
        <div className="skeleton-line-lg w-4/5" />
        <div className="flex justify-between pt-1">
          <div className="skeleton-line w-10" />
          <div className="skeleton-line w-16" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 28 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full aspect-[21/13] sm:aspect-[21/11] md:aspect-[21/9] lg:aspect-[21/6] border-b border-white/10 overflow-hidden">
      {/* Background Backdrop Skeleton */}
      <div className="skeleton-backdrop absolute inset-0 !rounded-none !aspect-auto" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Centered Title & Button Skeleton */}
      <div className="absolute inset-x-0 bottom-10 xl:bottom-12 flex flex-col items-center text-center z-10 px-4">
        {/* Title Placeholder */}
        <div className="skeleton-line-lg w-3/4 sm:w-1/2 max-w-md h-6 sm:h-7 md:h-9 pb-2 sm:pb-4 xl:pb-6 rounded mb-3 sm:mb-4 xl:mb-6" />
        
        {/* Button Placeholder */}
        <div className="skeleton h-7 md:h-8 w-28 md:w-32 rounded-pill" />
      </div>

      {/* Centered Bottom Navigation Dots Skeleton */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <div className="skeleton h-1.5 w-6 rounded-full" />
        <div className="skeleton h-1.5 w-1.5 rounded-full opacity-60" />
        <div className="skeleton h-1.5 w-1.5 rounded-full opacity-60" />
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
        {/* Responsive Poster Matches Details.jsx */}
        <div className="skeleton-poster w-[88%] sm:w-[60%] md:w-[38%] lg:w-[32%] aspect-[2/3] shrink-0 rounded-card" />
        
        <div className="flex-1 pt-1 w-full">
          {/* Title */}
          <div className="skeleton-line-lg w-3/4 h-8 md:h-10 mb-4" />

          {/* Age, Type, Language Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2 mt-4">
            <div className="skeleton-badge w-12 h-6" />
            <div className="skeleton-badge w-16 h-6" />
            <div className="skeleton-badge w-14 h-6" />
          </div>

          {/* Rating, Year, Duration, Views */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="skeleton-line w-12 h-4" />
            <div className="skeleton-line w-16 h-4" />
            <div className="skeleton-line w-16 h-4" />
            <div className="skeleton-line w-20 h-4" />
          </div>

          {/* Genres */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <div className="skeleton-line w-12 h-3 mr-1" />
            <div className="skeleton-badge w-16 h-6" />
            <div className="skeleton-badge w-20 h-6" />
            <div className="skeleton-badge w-16 h-6" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <div className="skeleton-line w-16 h-3 mr-1" />
            <div className="skeleton-badge w-24 h-5" />
            <div className="skeleton-badge w-20 h-5" />
          </div>

          {/* Qualities */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <div className="skeleton-line w-14 h-3 mr-1" />
            <div className="skeleton-badge w-12 h-5" />
            <div className="skeleton-badge w-12 h-5" />
          </div>

          {/* Cast */}
          <div className="mt-6 space-y-2">
            <div className="skeleton-line w-full h-4" />
            <div className="skeleton-line w-2/3 h-4" />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8 pt-6 border-t border-ink-800/80 space-y-3">
        <div className="skeleton-line-lg w-32 h-7 mb-4" />
        <div className="space-y-2 max-w-full">
          <div className="skeleton-line w-full h-4" />
          <div className="skeleton-line w-full h-4" />
          <div className="skeleton-line w-5/6 h-4" />
          <div className="skeleton-line w-4/5 h-4" />
        </div>
      </div>

      {/* Trailer Section */}
      <div className="mt-10">
        <div className="skeleton-line-lg w-32 h-8 mb-4" />
        <div className="skeleton aspect-video w-full rounded-card bg-ink-800/50 border border-ink-700/50" />
      </div>


      {/* Screenshots Grid Section */}
      <div className="mt-10">
        <div className="skeleton-line-lg w-40 h-8 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="skeleton aspect-video rounded-card bg-ink-800/50 border border-ink-700/50" />
          ))}
        </div>
      </div>


      {/* Watch & Download Links Section */}
      <div className="mt-10">
        <div className="skeleton-line-lg w-64 h-8 mb-6" />
        <div className="space-y-4">
          <div className="skeleton-line w-32 h-4 mb-2" />
          
          {/* Table/List Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="skeleton w-full h-14 bg-ink-800/50 rounded-card border border-ink-700/50" />
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}