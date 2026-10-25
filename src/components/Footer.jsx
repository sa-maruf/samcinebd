// src/components/Footer.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clapperboard,
  MonitorPlay,
  Popcorn,
  ShieldCheck,
  MonitorSmartphone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Film,
} from "lucide-react";
import { fetchGenres, fetchCategories } from "../services/mediaService";
import { getSocialLinks } from "../services/adminService"; // Correct function imported

const FEATURES = [
  {
    icon: Clapperboard,
    title: "Vast Collection",
    body: "Explore thousands of movies and TV series across all genres.",
  },
  {
    icon: MonitorPlay,
    title: "HD Quality Content",
    body: "Enjoy content in high-definition for the best viewing experience.",
  },
  {
    icon: Popcorn,
    title: "Latest Releases",
    body: "Stay updated with the latest movies and episodes added regularly.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    body: "Your privacy and security are our top priority. Safe & Secure.",
  },
  {
    icon: MonitorSmartphone,
    title: "Watch Anywhere",
    body: "Discover your favorite content on any device, anytime, anywhere.",
  },
  {
    icon: Film,
    title: "Movie & TV Series",
    body: "Discover your favorite Movies & TV Series, anytime, anywhere.",
  },
];

const SOCIAL_ICONS = [
  { key: "facebook", icon: Facebook, label: "Facebook" },
  { key: "twitter", icon: Twitter, label: "Twitter" },
  { key: "instagram", icon: Instagram, label: "Instagram" },
  { key: "youtube", icon: Youtube, label: "YouTube" },
];

function ChipRow({ label, items, basePath }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold uppercase tracking-widest text-marquee-500 mb-5">
        {label}
      </h4>
      <div className="flex flex-wrap gap-2 justify-center">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`${basePath}/${item.slug}`}
            className="text-xs px-3 py-1.5 rounded-pill bg-ink-800 border border-ink-600 text-mist-300 hover:border-marquee-500 hover:text-marquee-400 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const [links, setLinks] = useState(null);
  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getSocialLinks()
      .then(setLinks)
      .catch((err) => {
        console.error("Footer: couldn't load social links —", err);
        setLinks({ facebook: "", twitter: "", instagram: "", youtube: "" });
      });
    fetchGenres().then(setGenres).catch(() => setGenres([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const hasAnySocialLink = links != null && SOCIAL_ICONS.some(({ key }) => Boolean(links[key]));

  return (
    <footer className="bg-ink-900 border-t border-ink-600 mt-16">
      <div className="max-w-screen mx-auto px-4 md:px-6 pt-16 sm:pt-20 pb-14 md:pb-16">
        <div className="text-center">
          {/* Brand summary */}
          <div className=" shrink-0">
            <Link to="/">
              <h2 className="font-display text-5xl tracking-wide text-mist-100">
                SAM<span className="text-marquee-500">CINEBD</span>
              </h2>
            </Link>
            <p className="mt-4 text-xs sm:text-sm text-mist-500 leading-relaxed md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto">
              Your ultimate destination for movies and TV series. Discover the
              best content in HD quality. Anytime anywhere.Samcinebd is a discovery catalog for movies and TV series think of it as a guide not a player. Every title links out to legitimate streaming rental or purchase providers so you always know where to actually watch it.
            </p>
          </div>

          {/* Feature cards */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 mt-12">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center ">
                <div className="mx-auto lg:mx-auto h-12 w-12 rounded-md border border-ink-600 flex items-center justify-center mb-3">
                  <Icon size={22} className="text-marquee-400" />
                </div>
                <h3 className="text-sm font-semibold text-mist-100 mb-1">{title}</h3>
                <p className="text-xs text-mist-500 line-clamp-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-screen text-center mx-auto px-4 md:px-6 mt-6 space-y-8 pt-10">
          {/* Dynamic Categories / Genres chip sections */}
          <ChipRow label="Categories" items={categories} basePath="/category" />
          <ChipRow label="Genres" items={genres} basePath="/genre" />
        </div>

        {/* Dynamic social icons */}
        {hasAnySocialLink && (
          <div className="flex justify-center gap-3 mt-12">
            {SOCIAL_ICONS.map(({ key, icon: Icon, label }) => {
              const url = links[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 rounded-full bg-ink-800 border border-ink-600 flex items-center justify-center text-mist-300 hover:text-marquee-400 hover:border-marquee-500 transition-colors"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-600">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-mist-500 text-center">
          <span>© {new Date().getFullYear()} Samcinebd. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}