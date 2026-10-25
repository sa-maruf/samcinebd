// src/pages/TVSeries.jsx
import MediaGrid from "../components/MediaGrid";

export default function TVSeries() {
  return (
    <div className="max-w-screen mx-auto px-4 md:px-6 py-8">
      <h1 className="font-display text-3xl tracking-wide text-mist-100 mb-6">TV Series</h1>
      <MediaGrid type="series" />
    </div>
  );
}
