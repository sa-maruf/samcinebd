import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  PlayCircle,
  ExternalLink,
  Image as ImageIcon,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { fetchMediaBySlug, incrementViewCount, fetchRelatedMedia } from "../services/mediaService";
import { DetailsSkeleton } from "../components/skeletons/Skeletons";
import MediaCard from "../components/MediaCard";

const PROVIDER_TYPE_LABEL = {
  watch: "Watch",
  download: "Download",
  stream: "Watch",
  rent: "Watch",
  buy: "Download",
  info: "Watch",
};

function formatViews(n) {
  if (n == null) return "0 views";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${n} views`;
}

function seasonsLabel(seasons) {
  if (!seasons) return null;
  const n = Number(seasons);
  if (!Number.isNaN(n) && String(n) === String(seasons).trim()) {
    return `${n} Season${n > 1 ? "s" : ""}`;
  }
  return seasons;
}

export default function Details() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Slider reference for smooth horizontal navigation
  const sliderRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchMediaBySlug(slug).then((result) => {
      if (cancelled) return;
      if (!result) {
        setNotFound(true);
        setLoading(false);
      } else {
        setMedia(result);
        incrementViewCount(result.id);

        // Fetch 8-10 related media items for the slider
        fetchRelatedMedia({
          currentId: result.id,
          genres: result.genres,
          categoryIds: result.categoryIds,
          limitCount: 10,
        }).then((related) => {
          if (!cancelled) setRelatedList(related);
        });

        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function handleProviderClick(provider) {
    if (!provider?.url) return;

    navigate("/download", {
      state: {
        targetUrl: provider.url,
        title: media?.title,
        providerName: provider.name || PROVIDER_TYPE_LABEL[provider.type] || "Download",
      },
    });
  }

  // Smooth Horizontal Scroll functionality for Slider
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const scrollAmount = direction === "left" ? -container.clientWidth * 0.75 : container.clientWidth * 0.75;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-16">
        <DetailsSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-mist-100 mb-2">Title not found</h1>
        <p className="text-mist-500 mb-6">This may have been removed or the link is wrong.</p>
        <Link to="/" className="text-marquee-400 hover:text-marquee-300 underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const {
    title,
    synopsis,
    posterUrl,
    trailerYouTubeId,
    screenshots = [],
    cast = [],
    genres = [],
    categories = [],
    categoryNames = [],
    qualities = [],
    qualityBadge,
    releaseYear,
    durationMinutes,
    imdbRating,
    ageRating,
    languageBadge,
    type,
    seasons,
    viewCount,
    providers = [],
  } = media;

  const displayCategories = categories.length > 0 ? categories : categoryNames;

  const displayQualities = qualities.length > 0
    ? qualities
    : qualityBadge
      ? [qualityBadge]
      : [];

  // Separate Watch Links and Download Links
  const watchProviders = providers.filter(p => p.type === "watch" || p.type === "stream");
  const downloadProviders = providers.filter(p => p.type !== "watch" && p.type !== "stream");

  // Group Download Providers by Section/Season Title
  const downloadSectionsMap = downloadProviders.reduce((acc, p) => {
    const sectionTitle = p.sectionTitle || "Download Links";
    if (!acc[sectionTitle]) {
      acc[sectionTitle] = [];
    }
    acc[sectionTitle].push(p);
    return acc;
  }, {});

  const downloadSectionTitles = Object.keys(downloadSectionsMap);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-16 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
        <img
          src={posterUrl}
          alt={title}
          className="w-[88%] sm:w-[60%] md:w-[38%] lg:w-[32%] h-auto aspect-[2/3] object-cover rounded-card shadow-card shrink-0 border border-ink-600 self-start"
        />

        <div className="flex-1 pt-1">
          <h1 className="font-display text-2xl md:text-4xl tracking-wide text-mist-100">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-2 mt-4">
            {ageRating && <span className="badge rounded-md font-thin bg-signal-mature/90 text-white">{ageRating}</span>}
            <span className={`badge rounded-md font-thin text-white ${type === "series" ? "bg-signal-series/90" : "bg-signal-movie/90"}`}>
              {type === "series" ? "Series" : "Movie"}
            </span>
            {languageBadge && <span className="badge rounded-md font-thin bg-ink-800 border border-ink-600 text-mist-100">{languageBadge}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-mist-300">
            {imdbRating != null && (
              <span className="inline-flex items-center gap-1 text-signal-rating font-medium">
                <Star size={15} fill="currentColor" /> {imdbRating.toFixed(1)}
              </span>
            )}
            {releaseYear && (
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} /> {releaseYear}
              </span>
            )}
            {durationMinutes && (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> {durationMinutes} min
              </span>
            )}
            {type === "series" && seasons && <span>{seasonsLabel(seasons)}</span>}
            <span className="text-mist-500 font-mono text-xs">{formatViews(viewCount)}</span>
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="text-xs text-mist-500 font-medium">Genres:</span>
              {genres.map((g) => (
                <Link
                  key={g}
                  to={`/genre/${g.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-xs px-3 py-1 rounded-md bg-ink-800 border border-ink-600 text-mist-300 hover:border-marquee-500 hover:text-marquee-400 transition-colors"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {displayCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="text-xs text-mist-500 font-medium">Categories:</span>
              {displayCategories.map((c) => {
                const catName = typeof c === "object" ? c.name : c;
                return (
                  <Link
                    key={catName}
                    to={`/category/${catName.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-marquee-500/10 border border-marquee-500/30 text-marquee-400 hover:bg-marquee-500/20 transition-colors"
                  >
                    {catName}
                  </Link>
                );
              })}
            </div>
          )}

          {displayQualities.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="text-xs text-mist-500 font-medium">Quality:</span>
              {displayQualities.map((q) => (
                <span
                  key={q}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-ink-800 border border-ink-600 text-mist-100 font-medium"
                >
                  {q}
                </span>
              ))}
            </div>
          )}

          {cast.length > 0 && (
            <p className="mt-6 text-sm text-mist-500">
              <span className="text-mist-300 font-medium">Cast: </span>
              {cast.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 pt-6 border-t border-ink-800/80">
        <h3 className="font-display text-xl text-mist-100 mb-2">Description</h3>
        <p className="text-sm md:text-base text-mist-300 leading-relaxed max-w-full">
          {synopsis}
        </p>
      </div>


      {/* Trailer / Watch Video */}
      {trailerYouTubeId && (
        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-wide text-mist-100 mb-4 flex items-center gap-2">
            <PlayCircle size={22} className="text-marquee-400" /> Watch Video
          </h2>
          <div className="aspect-video w-full rounded-card overflow-hidden border border-ink-600 bg-ink-900 flex items-center justify-center">
            {(() => {
              const videoData = trailerYouTubeId.trim();

              if (videoData.match(/\.(mp4|webm|mkv|ogg)$/i)) {
                return (
                  <video controls className="w-full h-full object-contain">
                    <source src={videoData} />
                    Your browser does not support the video tag.
                  </video>
                );
              }

              if (videoData.startsWith("http") && !videoData.includes("youtube.com") && !videoData.includes("youtu.be")) {
                const embedUrl = videoData.includes("drive.google.com")
                  ? videoData.replace(/\/view.*/, "/preview")
                  : videoData;

                return (
                  <iframe
                    className="w-full h-full border-none"
                    src={embedUrl}
                    title={`${title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }

              let ytId = videoData;
              const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
              const match = videoData.match(ytRegex);

              if (match && match[1]) {
                ytId = match[1];
              }

              return (
                <iframe
                  className="w-full h-full border-none"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={`${title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            })()}
          </div>
        </section>
      )}


      {/* Screenshots Grid Section */}
      {screenshots && screenshots.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-wide text-mist-100 mb-4 flex items-center gap-2">
            <ImageIcon size={22} className="text-marquee-400" /> Screenshots
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
            {screenshots.map((imgUrl, idx) => (
              <div
                key={idx}
                className="aspect-video rounded-card overflow-hidden border border-ink-600 bg-ink-900 group shadow-md"
              >
                <img
                  src={imgUrl}
                  alt={`${title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}


      {/* Watch & Download Links Section */}
      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-wide text-mist-100 mb-6 flex items-center gap-2">
          <Download size={22} className="text-marquee-400" /> Watch & Download Links
        </h2>

        {providers.length === 0 ? (
          <p className="text-sm text-mist-500">No links listed yet for this title.</p>
        ) : (
          <div className="space-y-8">
            {/* 1. WATCH ONLINE TABLE */}
            {watchProviders.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-mist-300 mb-3 uppercase tracking-wider">
                  Watch Online
                </h3>

                {/* Mobile View */}
                <div className="sm:hidden space-y-2.5">
                  {watchProviders.map((p, i) => (
                    <div
                      key={i}
                      className="bg-ink-900 border border-ink-700/80 rounded-card p-3 grid grid-cols-12 items-center gap-2 shadow-sm"
                    >
                      <span className="font-medium text-[11px] text-mist-100 truncate col-span-6">
                        {p.name || `Watch Server ${i + 1}`}
                      </span>

                      {p.quality ? (
                        <span className="text-[11px] font-sans font-semibold text-marquee-400 col-span-3 text-center">
                          {p.quality}
                        </span>
                      ) : (
                        <span className="text-mist-500 text-[11px] col-span-3 text-center">-</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleProviderClick(p)}
                        className="col-span-3 inline-flex items-center justify-end gap-1 text-marquee-500 font-semibold text-[11px] transition-colors shadow-sm"
                      >
                        Watch <ExternalLink size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Fixed 50% / 25% / 25% alignment */}
                <div className="hidden sm:block overflow-x-auto rounded-card border border-ink-700 bg-ink-900/90 shadow-card">
                  <table className="w-full table-fixed text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="bg-ink-800/80 border-b border-ink-700 text-xs font-semibold uppercase tracking-wider text-mist-400">
                        <th className="py-3 px-4 w-[40%]">Link</th>
                        <th className="py-3 px-4 text-center w-[30%]">Quality</th>
                        <th className="py-3 px-4 text-right w-[30%]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-800/60 text-sm">
                      {watchProviders.map((p, i) => (
                        <tr key={i} className="hover:bg-ink-800/40 transition-colors">
                          <td className="font-medium py-3.5 px-4 text-sm text-mist-100 truncate">
                            {p.name || `Watch Server ${i + 1}`}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {p.quality ? (
                              <span className="text-sm font-sans font-semibold text-marquee-400 inline-block">
                                {p.quality}
                              </span>
                            ) : (
                              <span className="text-mist-500 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleProviderClick(p)}
                              className="inline-flex items-center gap-1.5 text-marquee-500 font-semibold text-sm transition-colors shadow-sm"
                            >
                              Watch <ExternalLink size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. DOWNLOAD LINKS SECTIONS */}
            {downloadSectionTitles.length > 0 && (
              <div className="space-y-8">
                {downloadSectionTitles.map((sectionTitle) => {
                  const sectionProviders = downloadSectionsMap[sectionTitle];
                  return (
                    <div key={sectionTitle}>
                      <h3 className="text-sm font-semibold text-mist-300 mb-3 uppercase tracking-wider">
                        {sectionTitle}
                      </h3>

                      {/* Mobile View */}
                      <div className="sm:hidden space-y-2.5">
                        {sectionProviders.map((p, i) => (
                          <div
                            key={i}
                            className="bg-ink-900 border border-ink-700/80 rounded-card p-3 grid grid-cols-12 items-center gap-2 shadow-sm"
                          >
                            <span className="font-medium text-[11px] text-mist-100 truncate col-span-6">
                              {p.name || `Download Link ${i + 1}`}
                            </span>

                            {p.quality ? (
                              <span className="text-[11px] font-sans font-semibold text-marquee-400 col-span-3 text-center">
                                {p.quality}
                              </span>
                            ) : (
                              <span className="text-mist-500 text-[11px] col-span-3 text-center">-</span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleProviderClick(p)}
                              className="col-span-3 inline-flex items-center justify-end gap-1 text-marquee-500 font-semibold text-[11px] transition-colors shadow-sm"
                            >
                              Download <ExternalLink size={11} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Desktop View - Fixed 50% / 25% / 25% alignment */}
                      <div className="hidden sm:block overflow-x-auto rounded-card border border-ink-700 bg-ink-900/90 shadow-card">
                        <table className="w-full table-fixed text-left border-collapse min-w-[400px]">
                          <thead>
                            <tr className="bg-ink-800/80 border-b border-ink-700 text-xs font-semibold uppercase tracking-wider text-mist-400">
                              <th className="py-3 px-4 w-[40%]">Link</th>
                              <th className="py-3 px-4 text-center w-[30%]">Quality</th>
                              <th className="py-3 px-4 text-right w-[30%]">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ink-800/60 text-sm">
                            {sectionProviders.map((p, i) => (
                              <tr key={i} className="hover:bg-ink-800/40 transition-colors">
                                <td className="py-3.5 px-4 text-sm font-medium text-mist-100 truncate">
                                  {p.name || `Server Link ${i + 1}`}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {p.quality ? (
                                    <span className="text-sm font-sans font-semibold text-marquee-400 inline-block">
                                      {p.quality}
                                    </span>
                                  ) : (
                                    <span className="text-mist-500 text-sm">-</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleProviderClick(p)}
                                    className="inline-flex items-center gap-1.5 text-marquee-500 font-semibold text-sm transition-colors shadow-sm"
                                  >
                                    Download <ExternalLink size={12} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Related Movies Section - Interactive Slider */}
      {relatedList.length > 0 && (
        <section className="mt-14 pt-8 border-t border-ink-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl tracking-wide text-mist-100">
              You Might Also Like
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Slide Left"
                className="p-1.5 sm:p-2 rounded-full bg-ink-800 border border-ink-600 text-mist-300 hover:text-white hover:bg-ink-700 hover:border-marquee-500 transition-colors shadow-sm active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Slide Right"
                className="p-1.5 sm:p-2 rounded-full bg-ink-800 border border-ink-600 text-mist-300 hover:text-white hover:bg-ink-700 hover:border-marquee-500 transition-colors shadow-sm active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {relatedList.map((item) => (
              <div
                key={item.id}
                className="w-[140px] sm:w-[170px] md:w-[185px] shrink-0 snap-start"
              >
                <MediaCard media={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}