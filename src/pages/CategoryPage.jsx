// src/pages/CategoryPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaGrid from "../components/MediaGrid";
import { fetchCategoryBySlug } from "../services/mediaService";
import { GridSkeleton } from "../components/skeletons/Skeletons";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCategoryBySlug(categorySlug)
      .then(setCategory)
      .finally(() => setLoading(false));
  }, [categorySlug]);

  return (
    <div className="max-w-screen-screen mx-auto px-4 md:px-6 py-8">
    
      
      {loading ? (
        <div className="h-9 w-48 bg-ink-800 animate-pulse rounded mb-6" />
      ) : (
        <h1 className="font-display text-3xl tracking-wide text-mist-100 mb-6">
          {category?.name || "Not found"}
        </h1>
      )}

      {loading ? (
        <GridSkeleton />
      ) : category ? (
        <MediaGrid categoryId={category.id} />
      ) : (
        <p className="text-mist-500">This category doesn't exist yet.</p>
      )}
    </div>
  );
}