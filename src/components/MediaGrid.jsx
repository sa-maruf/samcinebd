// src/components/MediaGrid.jsx
import { useEffect, useState, useCallback } from "react";
import MediaCard from "./MediaCard";
import { GridSkeleton } from "./skeletons/Skeletons";
import { fetchMediaPage } from "../services/mediaService";

// স্ক্রিনের কলাম এবং কাঙ্ক্ষিত রো (মোবাইলে ১৫ রো, ডেক্সটপে ৭ রো) মেপে pageSize হিসাব করার ফাংশন
function getResponsivePageSize() {
  if (typeof window === "undefined") return 49;
  const width = window.innerWidth;

  if (width < 640) {
    // মোবাইল (<640px): ২ কলাম × ১৫ রো = ৩০ টি
    return 2 * 15;
  } else if (width < 768) {
    // sm (640px - 767px): ৩ কলাম × ১৫ রো = ৪৫ টি
    return 3 * 15;
  } else if (width < 1024) {
    // md (768px - 1023px): ৪ কলাম × ৭ রো = ২৮ টি
    return 4 * 7;
  } else if (width < 1280) {
    // lg (1024px - 1279px): ৫ কলাম × ৭ রো = ৩৫ টি
    return 5 * 7;
  } else if (width < 1536) {
    // xl (1280px - 1535px): ৬ কলাম × ৭ রো = ৪২ টি
    return 6 * 7;
  } else {
    // 2xl (>=1536px): ৭ কলাম × ৭ রো = ৪৯ টি
    return 7 * 7;
  }
}

function useResponsivePageSize() {
  const [pageSize, setPageSize] = useState(getResponsivePageSize);

  useEffect(() => {
    function onResize() {
      setPageSize(getResponsivePageSize());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return pageSize;
}

/**
 * @param {"movie"|"series"|null} type - null shows a mixed feed (Home)
 * @param {string|null} genre
 * @param {string|null} categoryId
 */
export default function MediaGrid({ type = null, genre = null, categoryId = null }) {
  const pageSize = useResponsivePageSize();

  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items, nextOffset, hasMore } = await fetchMediaPage({
        type,
        genre,
        categoryId,
        pageSize,
        offset: 0,
      });
      setItems(items);
      setOffset(nextOffset);
      setHasMore(hasMore);
    } catch (e) {
      setError("Couldn't load titles right now.");
    } finally {
      setLoading(false);
    }
  }, [type, genre, categoryId, pageSize]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const { items: more, nextOffset, hasMore } = await fetchMediaPage({
        type,
        genre,
        categoryId,
        pageSize,
        offset,
      });
      setItems((prev) => [...prev, ...more]);
      setOffset(nextOffset);
      setHasMore(hasMore);
    } catch (e) {
      setError("Couldn't load more titles.");
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) return <GridSkeleton count={pageSize} />;

  if (error) {
    return (
      <div className="text-center py-12 text-mist-500">
        <p>{error}</p>
        <button
          onClick={loadInitial}
          className="mt-3 text-sm text-marquee-400 hover:text-marquee-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-mist-500">
        <p className="text-mist-300 font-medium mb-1">No titles here yet.</p>
        <p className="text-sm">Check back soon, or submit a request below.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
        {items.map((media) => (
          <MediaCard key={media.id} media={media} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 rounded-pill bg-ink-800 border border-ink-600 text-sm font-medium text-mist-100 hover:border-marquee-500 hover:text-marquee-400 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}