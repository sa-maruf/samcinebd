// src/admin/components/AdminSkeletons.jsx

/** Renders `rows` skeleton <tr> — drop inside a <tbody> while `loading` is true. */
export function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-ink-700 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              {c === 0 ? (
                <div className="skeleton h-10 w-8 rounded-md" />
              ) : (
                <div className="skeleton-line w-3/4" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Grid of stat-card-shaped skeletons for the Dashboard overview. */
export function StatCardsSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card p-4 md:p-5 flex items-center gap-3 md:gap-4">
          <div className="skeleton h-10 w-10 md:h-11 md:w-11 rounded-md shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="skeleton-line w-16" />
            <div className="skeleton-line-lg w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Grid of small card skeletons for the Genres/Categories taxonomy pages. */
export function ChipGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card p-4 flex items-center justify-between gap-2">
          <div className="skeleton-line w-20" />
        </div>
      ))}
    </div>
  );
}

/** Row skeletons for list-style admin pages (Sliders). */
export function ListRowSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="skeleton h-12 w-20 rounded-md shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="skeleton-line w-1/3" />
            <div className="skeleton-line w-1/2" />
          </div>
          <div className="skeleton-badge" />
        </div>
      ))}
    </>
  );
}
