// src/components/MediaCard.jsx
import { Link } from "react-router-dom";
import { Pin } from "lucide-react";

/** Formats a raw view count like YouTube: 1234567 -> "1.2M views" */
function formatViews(n) {
  if (n == null) return "0 views";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${n} views`;
}

export default function MediaCard({ media }) {
  const {
    slug,
    title,
    posterUrl,
    ageRating,
    type,
    languageBadge,
    releaseYear,
    viewCount,
    isPinned,
  } = media;

  return (
    <Link
      to={`/title/${slug}`}
      className="group surface-card overflow-hidden block focus-visible:ring-2 focus-visible:ring-marquee-400"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden ">
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* gradient for badge legibility over bright posters */}
        <div className="absolute font-thin inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* Top-Left: Movie/Series Badge */}
        <span
          className={`badge font-thin font-sans text-[10px] absolute top-2 left-2 text-white ${
            type === "series" ? "bg-signal-series/90" : "bg-signal-movie/90"
          }`}
        >
          {type === "series" ? "Series" : "Movie"}
        </span>

        {/* Top-Right: Age Rating */}
        {ageRating && (
          <span className="badge font-thin font-sans text-[10px] absolute top-2 right-2 bg-signal-mature/90 text-white">
            {ageRating}
          </span>
        )}

        {/* Bottom-Left: Language (Moved from bottom-right) */}
        {languageBadge && (
          <span className="badge font-thin font-sans text-[10px] absolute bottom-2 left-2 bg-ink-950/80 text-mist-100 border border-ink-600">
            {languageBadge}
          </span>
        )}

        {/* Bottom-Right: PIN Badge (Language এর জায়গায়) */}
        {isPinned && (
          <span className="badge font-thin font-sans text-[10px] absolute bottom-2 right-2 bg-marquee-500 text-ink-950 flex items-center gap-1 shadow-md">
            <Pin size={10} className="fill-current" /> PIN
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between text-mist-500">
          <span className="font-sans text-[10px]">{releaseYear}</span>
          <span className="font-sans text-[10px]">{formatViews(viewCount)}</span>
        </div>
        <h3 className="mt-2 text-[13px] font-medium  text-mist-100 leading-snug truncate">{title}</h3>
      </div>
    </Link>
  );
}