// src/components/SearchResults.jsx
import { useSearch } from "../context/SearchContext";
import MediaCard from "./MediaCard";

export default function SearchResults() {
  const { query, results } = useSearch();

  return (
    <div className="max-w-screen mx-auto px-4 md:px-6 py-8">
      <h2 className="text-sm text-mist-500 mb-4">
        {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
        <span className="text-mist-100">"{query}"</span>
      </h2>

      {results.length === 0 ? (
        <div className="text-center py-16 text-mist-500">
          <p className="text-mist-300 font-medium mb-1 text-lg">No Results Found</p>
          <p className="text-sm">Try a different spelling, or submit a request below.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {results.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      )}
    </div>
  );
}
