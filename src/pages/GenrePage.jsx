// src/pages/GenrePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaGrid from "../components/MediaGrid";
import { fetchGenreBySlug } from "../services/mediaService";
import { GridSkeleton } from "../components/skeletons/Skeletons";

export default function GenrePage() {
  const { genreSlug } = useParams();
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchGenreBySlug(genreSlug)
      .then(setGenre)
      .finally(() => setLoading(false));
  }, [genreSlug]);

  return (
    <div className="max-w-screen-screen mx-auto px-4 md:px-6 py-8">
      
      
      {loading ? (
        <div className="h-9 w-48 bg-ink-800 animate-pulse rounded mb-6" />
      ) : (
        <h1 className="font-display text-3xl tracking-wide text-mist-100 mb-6">
          {genre?.name || "Not found"}
        </h1>
      )}

      {loading ? (
        <GridSkeleton />
      ) : genre ? (
        <MediaGrid genre={genre.name} />
      ) : (
        <p className="text-mist-500">This genre doesn't exist yet.</p>
      )}
    </div>
  );
}