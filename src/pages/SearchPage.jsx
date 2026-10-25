// src/pages/SearchPage.jsx
import { useSearch } from "../context/SearchContext";
import SearchResults from "../components/SearchResults";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const { isSearching } = useSearch();

  if (!isSearching) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center text-mist-500">
        <p className="mb-2">Nothing searched yet.</p>
        <Link to="/" className="text-marquee-400 hover:text-marquee-300 underline text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  return <SearchResults />;
}
