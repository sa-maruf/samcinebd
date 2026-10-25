# CineScout — Movie & Media Discovery Catalog

A dark-mode, IMDb/Letterboxd-style discovery platform. Every title stores
metadata and links **out** to legitimate providers (streaming, rental,
purchase) — the app never stores, hosts, or serves video files itself.

## Setup

```bash
npm install
cp .env.example .env   # fill in your Firebase project's config
npm run dev
```

Deploy security rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Deploy hosting (after `npm run build`):

```bash
firebase login
firebase use --add           # pick your project, or edit .firebaserc directly
npm run build
firebase deploy --only hosting
```

## Seeding sample data

To populate the catalog with sample genres, categories, titles, and a
slider so it isn't empty on first run:

```bash
npm install
# Firebase Console → Project Settings → Service Accounts →
# "Generate new private key" → save as scripts/serviceAccountKey.json
npm run seed
```

The seed script uses placeholder images (picsum.photos) and generic
provider *search* links, not verified deep links — see the comment block
at the top of `scripts/seed.js` for what to swap in before going live.

## Creating your first admin

This app deliberately does **not** let anyone self-register as admin from
the client. Create the first admin manually:

1. Firebase Console → Authentication → Add User (email + password).
2. Firebase Console → Firestore → create a document at
   `admins/{that user's UID}` with fields `{ email, createdAt }`.
3. Sign in at `/admin-sam8/login`.

Every subsequent admin is added the same way (Firestore write rules block
client-side self-promotion — see `firestore.rules`).

## Phases

- **Phase 1** — Firebase config (`src/config/firebase.js`), Firestore
  schema (`docs/firestore-schema.md`), security rules, indexes, and the
  `mediaService.js` query layer.
- **Phase 2** — `tailwind.config.js` design tokens and `src/index.css`
  skeleton-loader utility classes.
- **Phase 3** — Core components: `Navbar` (fuzzy search + active-link
  reset), `MediaCard` (strict badge layout), `MediaGrid` (responsive
  page size + Load More), `HeroSlider`, `Footer`, skeleton components.
- **Phase 4** — Pages: `Home`, `Movies`, `TVSeries`, `GenrePage`,
  `CategoryPage`, `Details` (backdrop, trailer embed, "Where to Watch"
  provider links), `RequestPage`, `AboutPage`. Wired in `App.jsx`.
- **Phase 5** — Admin dashboard at `/admin-sam8`: Firebase Auth login
  gated by `admins/{uid}` membership, sidebar scoped to Dashboard /
  Movies / TV Series / Genres / Categories / Sliders / Movie Requests,
  full CRUD via `adminService.js`, poster/backdrop uploads to Storage.

## Notes

- Footer social icons are driven by a single `settings/socialLinks` Firestore
  doc (`{facebook, twitter, instagram, youtube}`), publicly readable and
  editable only by admins — manage it under **Social Links** in the sidebar.
  An icon only renders in the footer if its URL is set.
- `media.providers[]` only ever holds outbound links — there is no
  download/source-file field anywhere in the schema or admin form.
- **Query strategy — no composite indexes required.** Every server-side
  Firestore query in `mediaService.js` and `adminService.js` uses
  equality-only filters (Firestore indexes these automatically). Sorting
  by `createdAt`, filtering by `genre`/`categoryId` (array-contains), and
  pagination all happen client-side on the equality-filtered result set,
  with a 60s in-memory cache so repeated "Load More" clicks and page
  navigations don't refetch from Firestore every time. This trades a
  small amount of over-fetching for zero index-deployment risk — `Movies`,
  `TV Series`, every `Genre`/`Category` combo, and `Home` all "just work"
  without deploying `firestore.indexes.json` (now empty). If the catalog
  grows large (thousands of published titles), switch back to server-side
  `orderBy` + `startAfter` cursors and deploy the matching composite
  indexes per filter combination — `firebase deploy --only firestore:indexes`
  will print the exact index Firestore needs the first time each
  combination runs, or you can predefine them.
- The fuzzy search index (`fetchSearchIndex`) is a small denormalized
  `{id, title, slug, type, posterUrl}` list loaded once at app start and
  searched client-side with Fuse.js — swap for a hosted search service
  (Algolia, Typesense) if the catalog grows large.
