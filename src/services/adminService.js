// src/services/adminService.js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  getCountFromServer,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { invalidateMediaCache } from "./mediaService"; // Cache clear feature added

const MEDIA = "media";
const GENRES = "genres";
const CATEGORIES = "categories";
const SETTINGS = "settings";
const SOCIAL_LINKS_DOC_ID = "socialLinks";
const SLIDERS = "sliders";
const REQUESTS = "requests";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  return 0;
}

// ---------- Media (Movies & TV Series) ----------

export async function listAllMedia(type = null) {
  // Equality-only filter; sort client-side (Pinned first, then by latest updated/created).
  const clauses = type ? [where("type", "==", type)] : [];
  const q = query(collection(db, MEDIA), ...clauses);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return items.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const timeA = Math.max(toMillis(a.updatedAt), toMillis(a.createdAt));
    const timeB = Math.max(toMillis(b.updatedAt), toMillis(b.createdAt));

    return timeB - timeA;
  });
}

export async function createMedia(data) {
  const res = await addDoc(collection(db, MEDIA), {
    ...data,
    slug: data.slug || slugify(data.title),
    status: data.status || "published",
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  invalidateMediaCache(); // Instantly update home page cache
  return res;
}

export async function updateMedia(id, data) {
  const res = await updateDoc(doc(db, MEDIA, id), { 
    ...data, 
    updatedAt: serverTimestamp() 
  });

  invalidateMediaCache(); // Instantly update home page cache
  return res;
}

export async function deleteMedia(id) {
  const res = await deleteDoc(doc(db, MEDIA, id));
  
  invalidateMediaCache(); // Instantly update home page cache
  return res;
}

// ---------- Genres ----------

export async function listGenres() {
  const snap = await getDocs(query(collection(db, GENRES), orderBy("name", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createGenre(name, iconUrl = "") {
  return addDoc(collection(db, GENRES), {
    name,
    slug: slugify(name),
    iconUrl,
    createdAt: serverTimestamp(),
  });
}

export async function updateGenre(id, data) {
  const patch = { ...data };
  if (patch.name) patch.slug = slugify(patch.name);
  return updateDoc(doc(db, GENRES, id), patch);
}

export async function deleteGenre(id) {
  return deleteDoc(doc(db, GENRES, id));
}

// ---------- Categories ----------

export async function listCategories() {
  const snap = await getDocs(query(collection(db, CATEGORIES), orderBy("name", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createCategory(name, iconUrl = "") {
  return addDoc(collection(db, CATEGORIES), {
    name,
    slug: slugify(name),
    iconUrl,
    createdAt: serverTimestamp(),
  });
}

export async function updateCategory(id, data) {
  const patch = { ...data };
  if (patch.name) patch.slug = slugify(patch.name);
  return updateDoc(doc(db, CATEGORIES, id), patch);
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, CATEGORIES, id));
}

// ---------- Sliders ----------

export async function listSliders() {
  const snap = await getDocs(query(collection(db, SLIDERS), orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createSlider(data) {
  return addDoc(collection(db, SLIDERS), { ...data, createdAt: serverTimestamp() });
}

export async function updateSlider(id, data) {
  return updateDoc(doc(db, SLIDERS, id), data);
}

export async function deleteSlider(id) {
  return deleteDoc(doc(db, SLIDERS, id));
}

// ---------- Requests ----------

export async function listRequests() {
  const snap = await getDocs(query(collection(db, REQUESTS), orderBy("submittedAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateRequestStatus(id, status) {
  return updateDoc(doc(db, REQUESTS, id), {
    status,
    resolvedAt: status === "pending" ? null : serverTimestamp(),
  });
}

export async function deleteRequest(id) {
  return deleteDoc(doc(db, REQUESTS, id));
}

// ---------- Storage uploads ----------

export async function uploadPoster(file) {
  const path = `posters/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadBackdrop(file) {
  const path = `backdrops/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ---------- Dashboard stats ----------

export async function getDashboardStats() {
  const [movieCount, seriesCount, pendingCount, sliderCount, genreCount, categoryCount] =
    await Promise.all([
      getCountFromServer(query(collection(db, MEDIA), where("type", "==", "movie"))),
      getCountFromServer(query(collection(db, MEDIA), where("type", "==", "series"))),
      getCountFromServer(query(collection(db, REQUESTS), where("status", "==", "pending"))),
      getCountFromServer(collection(db, SLIDERS)),
      getCountFromServer(collection(db, GENRES)),
      getCountFromServer(collection(db, CATEGORIES)),
    ]);
  return {
    totalMovies: movieCount.data().count,
    totalSeries: seriesCount.data().count,
    pendingRequests: pendingCount.data().count,
    totalSliders: sliderCount.data().count,
    totalGenres: genreCount.data().count,
    totalCategories: categoryCount.data().count,
  };
}

// ---------- Social Links (footer) ----------

const EMPTY_SOCIAL_LINKS = { facebook: "", twitter: "", instagram: "", youtube: "" };

export async function getSocialLinks() {
  const snap = await getDoc(doc(db, SETTINGS, SOCIAL_LINKS_DOC_ID));
  if (!snap.exists()) return EMPTY_SOCIAL_LINKS;
  return { ...EMPTY_SOCIAL_LINKS, ...snap.data() };
}

export async function updateSocialLinks(links) {
  return setDoc(
    doc(db, SETTINGS, SOCIAL_LINKS_DOC_ID),
    { ...links, updatedAt: serverTimestamp() },
    { merge: true }
  );
}