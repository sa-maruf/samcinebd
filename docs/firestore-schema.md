# Firestore Schema — Movie & Media Discovery Catalog

This is a **catalog/discovery** data model: every title stores metadata and
links out to legitimate external providers (Netflix, Prime Video, JustWatch,
YouTube trailer, etc.). No video files, streams, or download URLs are stored
or served by this app.

---

## Collection: `media`

One document per Movie or TV Series. `type` distinguishes them so Home can
query a mixed feed.

```
media/{mediaId}
├─ title: string
├─ slug: string                 // URL-safe, unique — e.g. "dune-part-two"
├─ type: "movie" | "series"
├─ synopsis: string
├─ posterUrl: string            // Firebase Storage or external CDN URL
├─ backdropUrl: string
├─ trailerYouTubeId: string     // for embedded trailer player, not the film itself
├─ cast: array<string>          // simple names, or array<{name, role, photoUrl}>
├─ genres: array<string>        // references genres/{genreId}.name, denormalized for query speed
├─ categoryIds: array<string>   // references categories/{categoryId}
├─ releaseYear: number
├─ releaseDate: timestamp
├─ durationMinutes: number
├─ imdbRating: number           // e.g. 8.4
├─ ageRating: string            // "PG-13", "18+", "U/A"
├─ qualityBadge: string         // "1080p" | "4K" — display badge only, not a file reference
├─ languageBadge: string        // "English" | "Hindi" | "Dual Audio"
├─ seasons: string               // only for type = "series" — free text ("3", "Season 1-4", "Ongoing")
├─ viewCount: number            // incremented on details-page view, shown as "1.2M views"
├─ providers: array<{
│     name: string              // "Netflix", "Prime Video", "JustWatch"
│     type: "stream" | "rent" | "buy" | "info"
│     url: string               // link OUT to the legitimate provider/info page
│     logoUrl: string
│   }>
├─ featured: boolean            // eligible for hero slider selection
├─ status: "published" | "draft"
├─ createdAt: timestamp
└─ updatedAt: timestamp
```

**Indexes needed** (see `firestore.indexes.json`):
- `type ASC, status ASC, createdAt DESC` — Home / Movies / TV Series feeds with Load More
- `genres ARRAY_CONTAINS, status ASC, createdAt DESC` — Genre filter pages
- `categoryIds ARRAY_CONTAINS, status ASC, createdAt DESC` — Category filter pages

---

## Collection: `genres`

```
genres/{genreId}
├─ name: string        // "Action", "Sci-Fi"
├─ slug: string
├─ iconUrl: string
└─ createdAt: timestamp
```

## Collection: `categories`

```
categories/{categoryId}
├─ name: string        // "Hollywood", "Anime", "Documentaries"
├─ slug: string
├─ iconUrl: string
└─ createdAt: timestamp
```

## Collection: `sliders`

Hero banner entries, manually curated by admins (independent of `featured`
flag on media, so admins control exact slider order/copy).

```
sliders/{sliderId}
├─ title: string            // manually entered slide headline (used in admin list; not rendered as overlay text on the public banner)
├─ targetUrl: string        // manually entered destination — internal path ("/title/some-slug") or full external URL
├─ customTagline: string
├─ backdropUrl: string
├─ order: number
├─ active: boolean
└─ createdAt: timestamp
```

## Collection: `requests`

User-submitted "can't find this title" requests from the Navbar/Footer form.

```
requests/{requestId}
├─ movieName: string
├─ note: string                       // optional
├─ status: "pending" | "approved" | "rejected"
├─ submittedAt: timestamp
└─ resolvedAt: timestamp | null
```

## Collection: `admins`

Firestore mirror of Firebase Auth admin users, used to gate `/admin-sam8`
beyond just "is authenticated" (see security rules).

```
admins/{uid}
├─ email: string
└─ createdAt: timestamp
```

---

## Design notes

- **No `downloadLinks` / `sourceFiles` field anywhere.** The `providers`
  array only ever holds outbound links to third-party legal services. This
  is the field the "Media Sources" section on the Details Page renders.
- `viewCount` is a display-only counter (YouTube-style "1.2M views"), not
  tied to actual playback since this app doesn't play video.
- Pagination for "Load More" uses `startAfter(lastDoc)` cursors on the
  `createdAt DESC` index, fetching 8 (desktop) or 16 (mobile) at a time —
  decided client-side based on viewport, same query either way.
