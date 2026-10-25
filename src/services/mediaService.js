import {
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const MEDIA = "media";
const GENRES = "genres";
const CATEGORIES = "categories";
const SLIDERS = "sliders";
const REQUESTS = "requests";

function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  return 0;
}

const _mediaCache = new Map();
const CACHE_TTL_MS = 60_000;

async function fetchPublishedMediaRaw(type) {
  const cacheKey = `published:${type || "all"}`;
  const cached = _mediaCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.items;
  }

  const clauses = [where("status", "==", "published")];
  if (type) clauses.push(where("type", "==", type));

  const snap = await getDocs(query(collection(db, MEDIA), ...clauses));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  _mediaCache.set(cacheKey, { items, at: Date.now() });
  return items;
}

export function invalidateMediaCache() {
  _mediaCache.clear();
}

export async function fetchMediaPage({
  type = null,
  genre = null,
  categoryId = null,
  pageSize = 8,
  offset = 0,
} = {}) {
  let items = await fetchPublishedMediaRaw(type);

  if (genre) items = items.filter((m) => (m.genres || []).includes(genre));
  if (categoryId) items = items.filter((m) => (m.categoryIds || []).includes(categoryId));

  items = [...items].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const timeA = Math.max(toMillis(a.updatedAt), toMillis(a.createdAt));
    const timeB = Math.max(toMillis(b.updatedAt), toMillis(b.createdAt));

    return timeB - timeA;
  });

  const page = items.slice(offset, offset + pageSize);
  const nextOffset = offset + pageSize;

  return {
    items: page,
    nextOffset,
    hasMore: nextOffset < items.length,
  };
}

/** Fetch related media based on current item's genres and categoryIds (Default: 5 items) */
export async function fetchRelatedMedia({ currentId, genres = [], categoryIds = [], limitCount = 5 }) {
  let items = await fetchPublishedMediaRaw();
  items = items.filter((m) => m.id !== currentId);

  const scored = items.map((m) => {
    let score = 0;
    if (m.genres) {
      m.genres.forEach((g) => {
        if (genres.includes(g)) score += 2;
      });
    }
    if (m.categoryIds) {
      m.categoryIds.forEach((c) => {
        if (categoryIds.includes(c)) score += 3;
      });
    }
    return { media: m, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limitCount).map((s) => s.media);
}

export async function fetchActiveSliders() {
  const snap = await getDocs(query(collection(db, SLIDERS), where("active", "==", true)));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function fetchGenres() {
  const snap = await getDocs(collection(db, GENRES));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchCategories() {
  const snap = await getDocs(collection(db, CATEGORIES));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchGenreBySlug(slug) {
  const snap = await getDocs(query(collection(db, GENRES), where("slug", "==", slug), limit(1)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function fetchCategoryBySlug(slug) {
  const snap = await getDocs(
    query(collection(db, CATEGORIES), where("slug", "==", slug), limit(1))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function fetchMediaBySlug(slug) {
  const q = query(
    collection(db, MEDIA),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();

  let categories = [];
  if (data.categoryIds && data.categoryIds.length > 0) {
    try {
      const allCategories = await fetchCategories();
      const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));
      categories = data.categoryIds
        .map((id) => categoryMap.get(id))
        .filter(Boolean);
    } catch {
      // Failed
    }
  }

  return { id: d.id, ...data, categories };
}

export async function fetchMediaById(id) {
  const snap = await getDoc(doc(db, MEDIA, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function incrementViewCount(id) {
  try {
    await updateDoc(doc(db, MEDIA, id), { viewCount: increment(1) });
  } catch {
    // swallow error
  }
}

export async function fetchSearchIndex() {
  const [mediaSnap, categoriesList] = await Promise.all([
    getDocs(query(collection(db, MEDIA), where("status", "==", "published"))),
    fetchCategories(),
  ]);

  const categoryNameById = new Map(categoriesList.map((c) => [c.id, c.name]));

  return mediaSnap.docs.map((d) => {
    const data = d.data();
    const categoryNames = (data.categoryIds || [])
      .map((id) => categoryNameById.get(id))
      .filter(Boolean);
    return {
      ...data,
      isPinned: false, // Search result-e PIN badge hide korar jonno
      id: d.id,
      categoryNames,
      releaseYearStr: data.releaseYear ? String(data.releaseYear) : "",
      cast: data.cast || data.starring || "",
    };
  });
}

export async function submitMovieRequest({ movieName, note = "" }) {
  return addDoc(collection(db, REQUESTS), {
    movieName,
    note,
    status: "pending",
    submittedAt: serverTimestamp(),
    resolvedAt: null,
  });
}

export async function fetchSocialLinks() {
  const snap = await getDoc(doc(doc(db, "settings", "socialLinks")));
  const empty = { facebook: "", twitter: "", instagram: "", youtube: "" };
  if (!snap.exists()) return empty;
  return { ...empty, ...snap.data() };
}