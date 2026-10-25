// src/pages/Movies.jsx
import MediaGrid from "../components/MediaGrid";

export default function Movies() {
  return (
    <div className="max-w-screen mx-auto px-4 md:px-6 py-8">
      <h1 className="font-display text-3xl tracking-wide text-mist-100 mb-6">Movies</h1>
      <MediaGrid type="movie" />
    </div>
  );
}
