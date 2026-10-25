// src/context/SearchContext.jsx
import { createContext, useContext, useMemo, useState, useCallback } from "react";
import Fuse from "fuse.js";

const SearchContext = createContext(null);

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "cast", weight: 0.3 },
    { name: "genres", weight: 0.15 },
    { name: "categoryNames", weight: 0.1 },
    { name: "releaseYearStr", weight: 0.05 },
  ],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function SearchProvider({ index = [], children }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => new Fuse(index, FUSE_OPTIONS), [index]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // ৪ ডিজিটের বছর সার্চ করা হয়েছে কি না তা চেক করা (যেমন: 1990 - 2099)
    const isYearQuery = /^(19|20)\d{2}$/.test(trimmed);

    if (isYearQuery) {
      // বছর সার্চ হলে কেবল টাইটেল বা Release Year-এর সাথে হুবহু মিল থাকা মুভিগুলোই দেখাবে
      return index.filter((item) => {
        const yearInTitle = item.title && item.title.includes(trimmed);
        const yearInRelease = item.releaseYearStr === trimmed;
        return yearInTitle || yearInRelease;
      });
    }

    // সাধারণ সার্চের ক্ষেত্রে Fuse.js কাজ করবে
    return fuse.search(trimmed).map((r) => r.item);
  }, [query, fuse, index]);

  const isSearching = query.trim().length > 0;

  const resetSearch = useCallback(() => setQuery(""), []);

  const value = { query, setQuery, results, isSearching, resetSearch };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}