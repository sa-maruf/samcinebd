// src/pages/Home.jsx
import HeroSlider from "../components/HeroSlider";
import MediaGrid from "../components/MediaGrid";

export default function Home() {
  return (
    <div>
      <HeroSlider />

      <section className="max-w-screen-screen mx-auto px-4 md:px-6 py-6 space-y-10">
        <div className="flex items-center justify-between gap-4 mt-2 mb-2">
          <hr className="flex-1 border-t border-white/10" />
          <h2 className="font-display text-xl md:text-2xl tracking-wide text-mist-100 whitespace-nowrap">
            Trending Now
          </h2>
          <hr className="flex-1 border-t border-white/10" />
        </div>
        {/* Mixed feed: no `type` filter shows both movies and series */}
        <MediaGrid type={null} />
      </section>
    </div>
  );
}