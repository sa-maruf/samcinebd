// scripts/seed.js
//
// Populates Firestore with sample genres, categories, titles, and a slider
// so the catalog isn't empty on first run.
//
// Setup:
//   1. Firebase Console → Project Settings → Service Accounts →
//      "Generate new private key" → save as scripts/serviceAccountKey.json
//      (this file is gitignored — never commit it).
//   2. npm install firebase-admin --save-dev
//   3. node scripts/seed.js
//
// Notes on sample data:
//   - Poster/backdrop images use a placeholder image service (picsum.photos)
//     rather than real studio artwork — swap these for licensed images
//     (e.g. via the TMDB API, which you're allowed to use with attribution
//     under their API terms) before going live.
//   - Synopses below are short, original summaries written for this seed
//     script, not copied from any official source.
//   - `providers[].url` points to each platform's general search page for
//     the title, not a claimed direct watch link — replace with verified
//     deep links once you've confirmed real availability per title.

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "serviceAccountKey.json"), "utf-8")
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function poster(seed) {
  return `https://picsum.photos/seed/${seed}/500/750`;
}
function backdrop(seed) {
  return `https://picsum.photos/seed/${seed}-bd/1280/720`;
}

function searchProviders(title) {
  const q = encodeURIComponent(title);
  return [
    { name: "Netflix", type: "info", url: `https://www.netflix.com/search?q=${q}`, logoUrl: "" },
    { name: "Prime Video", type: "info", url: `https://www.amazon.com/s?k=${q}&i=instant-video`, logoUrl: "" },
    { name: "JustWatch", type: "info", url: `https://www.justwatch.com/us/search?q=${q}`, logoUrl: "" },
  ];
}

const GENRES = ["Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Animation", "Fantasy", "Horror"];
const CATEGORIES = ["Hollywood", "Anime", "Documentaries", "Indie"];

const MEDIA = [
  {
    title: "Skyline Drift",
    type: "movie",
    synopsis:
      "A cargo pilot stranded on a dying orbital station races to repair a failing reactor before her last supply run runs out.",
    cast: ["Mara Kessel", "Diego Ortiz", "Yuna Park"],
    genres: ["Sci-Fi", "Thriller"],
    releaseYear: 2024,
    durationMinutes: 118,
    imdbRating: 7.6,
    ageRating: "PG-13",
    qualityBadge: "1080p",
    languageBadge: "English",
    trailerYouTubeId: "dQw4w9WgXcQ",
  },
  {
    title: "The Long Harvest",
    type: "movie",
    synopsis:
      "Three siblings return to their family farm after a decade apart, forced to confront old grudges before the land is sold.",
    cast: ["Owen Castellan", "Priya Nair"],
    genres: ["Drama"],
    releaseYear: 2023,
    durationMinutes: 104,
    imdbRating: 8.1,
    ageRating: "PG-13",
    qualityBadge: "1080p",
    languageBadge: "English",
    trailerYouTubeId: "dQw4w9WgXcQ",
  },
  {
    title: "Paper Tigers",
    type: "movie",
    synopsis:
      "A washed-up con artist assembles a crew of amateurs for one final, absurdly complicated heist at a city aquarium.",
    cast: ["Felix Amaro", "Grace Odom", "Tomas Weil"],
    genres: ["Comedy", "Thriller"],
    releaseYear: 2024,
    durationMinutes: 97,
    imdbRating: 6.9,
    ageRating: "PG-13",
    qualityBadge: "720p",
    languageBadge: "Dual Audio",
    trailerYouTubeId: "dQw4w9WgXcQ",
  },
  {
    title: "Hollow Meridian",
    type: "series",
    synopsis:
      "In a city built inside a collapsed volcano, a detective investigates disappearances that trace back to the founding families.",
    cast: ["Renata Cho", "Liam Ferris"],
    genres: ["Fantasy", "Thriller"],
    releaseYear: 2024,
    seasons: 2,
    imdbRating: 8.4,
    ageRating: "18+",
    qualityBadge: "1080p",
    languageBadge: "English",
    trailerYouTubeId: "dQw4w9WgXcQ",
  },
  {
    title: "Static Bloom",
    type: "series",
    synopsis:
      "Four strangers linked by a shared recurring dream try to figure out what it means before it starts bleeding into reality.",
    cast: ["Ines Talbot", "Marcus Webb", "Sana Iqbal"],
    genres: ["Sci-Fi", "Drama"],
    releaseYear: 2023,
    seasons: 1,
    imdbRating: 7.8,
    ageRating: "PG-13",
    qualityBadge: "4K",
    languageBadge: "English",
    trailerYouTubeId: "dQw4w9WgXcQ",
  },
  {
    title: "Nine Lanterns",
    type: "series",
    synopsis:
      "An animated anthology following nine lantern-keepers across a floating archipelago, each episode a different keeper's story.",
    cast: ["Voice: Aki Sato", "Voice: Ben Okafor"],
    genres: ["Animation", "Fantasy"],
    releaseYear: 2022,
    seasons: 3,
    imdbRating: 8.7,
    ageRating: "PG",
    qualityBadge: "1080p",
    languageBadge: "Dual Audio",
    trailerYouTubeId: "dQw4w9WgXcQ",
  },
];

async function seed() {
  console.log("Seeding genres...");
  const genreRefs = {};
  for (const name of GENRES) {
    const ref = await db.collection("genres").add({
      name,
      slug: slugify(name),
      iconUrl: "",
      createdAt: FieldValue.serverTimestamp(),
    });
    genreRefs[name] = ref.id;
  }

  console.log("Seeding categories...");
  const categoryRefs = {};
  for (const name of CATEGORIES) {
    const ref = await db.collection("categories").add({
      name,
      slug: slugify(name),
      iconUrl: "",
      createdAt: FieldValue.serverTimestamp(),
    });
    categoryRefs[name] = ref.id;
  }

  console.log("Seeding media...");
  const mediaRefs = [];
  for (const item of MEDIA) {
    const seedKey = slugify(item.title);
    const ref = await db.collection("media").add({
      ...item,
      slug: seedKey,
      posterUrl: poster(seedKey),
      backdropUrl: backdrop(seedKey),
      categoryIds: [categoryRefs["Hollywood"]],
      providers: searchProviders(item.title),
      viewCount: Math.floor(Math.random() * 500_000),
      featured: true,
      status: "published",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    mediaRefs.push({ id: ref.id, ...item, seedKey });
  }

  console.log("Seeding sliders (first 3 titles)...");
  for (const [i, m] of mediaRefs.slice(0, 3).entries()) {
    await db.collection("sliders").add({
      mediaId: m.id,
      title: m.title,
      targetUrl: `/title/${m.seedKey}`,
      customTagline: m.synopsis.slice(0, 90) + "...",
      backdropUrl: backdrop(m.seedKey),
      order: i,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  console.log(`Done — seeded ${GENRES.length} genres, ${CATEGORIES.length} categories, ${MEDIA.length} titles, 3 sliders.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
