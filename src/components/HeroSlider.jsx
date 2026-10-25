// src/components/HeroSlider.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchActiveSliders } from "../services/mediaService";
import { HeroSkeleton } from "./skeletons/Skeletons";

// Helper function to handle both relative and full internal URLs safely
function getLinkConfig(targetUrl) {
  if (!targetUrl) return { isExternal: false, url: "/" };

  const cleanUrl = targetUrl.trim();

  // 1. If it starts with "/" (e.g. /title/dune-part-two)
  if (cleanUrl.startsWith("/")) {
    return { isExternal: false, url: cleanUrl };
  }

  // 2. Check if full URL belongs to the current origin (e.g. http://localhost:5173 or https://your-domain.com)
  try {
    const parsed = new URL(cleanUrl, window.location.origin);
    if (parsed.origin === window.location.origin) {
      // Extract path, query, and hash (e.g. /title/dune-part-two)
      return { isExternal: false, url: parsed.pathname + parsed.search + parsed.hash };
    }
  } catch (e) {
    // If invalid URL, fallback to raw string
  }

  // 3. Otherwise, it's genuinely an external domain (e.g. https://google.com)
  return { isExternal: true, url: cleanUrl };
}

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSliders()
      .then(setSlides)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading) return <HeroSkeleton />;
  if (slides.length === 0) return null;

  const slide = slides[index];
  const { isExternal, url: resolvedUrl } = getLinkConfig(slide.targetUrl);

  return (
    <div className="relative w-full aspect-[21/13] sm:aspect-[21/11] md:aspect-[21/9] lg:aspect-[21/6] border-b border-white/10 overflow-hidden">
      <img
        src={slide.backdropUrl}
        alt={slide.title || ""}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Bottom overlay for background text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Centered Title & Action Button */}
      <div className="absolute inset-x-0 bottom-10 xl:bottom-12  flex flex-col items-center text-center z-10">
        {slide.title && (
          <h2 className="text-base sm:text-xl  md:text-3xl pb-2 sm:pb-4 xl:pb-6 font-bold text-mist-100 drop-shadow-md tracking-wide max-w-3xl">
            {slide.title}
          </h2>
        )}
        <div className="flex text-xs justify-center">
          {isExternal ? (
            <a
              href={resolvedUrl}
              // target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-xs md:text-sm hover:bg-marquee-400 transition-colors shadow-lg"
            >
              View Details
            </a>
          ) : (
            <Link
              to={resolvedUrl}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-xs md:text-sm hover:bg-marquee-400 transition-colors shadow-lg"
            >
             View Details
            </Link>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="hidden absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 md:h-9 md:w-9 rounded-full glass sm:flex items-center justify-center text-mist-100 hover:text-marquee-400 z-20"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label="Next slide"
            className="hidden absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 md:h-9 md:w-9 rounded-full glass sm:flex items-center justify-center text-mist-100 hover:text-marquee-400 z-20"
          >
            <ChevronRight size={18} />
          </button>

          {/* Centered Dots Navigation at Bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-marquee-400" : "w-1.5 bg-mist-700 hover:bg-mist-500"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}