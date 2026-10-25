import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, Pin, Sparkles } from "lucide-react";
import { uploadPoster, listGenres, listCategories } from "../../services/adminService";
import MultiSelectChips from "./MultiSelectChips";

const EMPTY_WATCH_PROVIDER = { name: "", type: "watch", url: "", quality: "" };
const EMPTY_DOWNLOAD_PROVIDER = { name: "", type: "download", url: "", quality: "1080p", sectionTitle: "Season 01" };

const QUALITY_OPTIONS = [
  { id: "360p", label: "360p", value: "360p" },
  { id: "480p", label: "480p", value: "480p" },
  { id: "720p", label: "720p", value: "720p" },
  { id: "1080p", label: "1080p", value: "1080p" },
  { id: "4K", label: "4K", value: "4K" },
];

function emptyForm(type) {
  const defaultSection = type === "series" ? "Season 01" : "Download Links";
  return {
    title: "",
    type,
    synopsis: "",
    posterUrl: "",
    trailerYouTubeId: "",
    screenshots: [],
    cast: "",
    genres: [],
    categoryIds: [],
    qualities: ["1080p"],
    releaseYear: String(new Date().getFullYear()),
    durationMinutes: "",
    seasons: "",
    imdbRating: "",
    ageRating: "PG-13",
    languageBadge: "English",
    status: "published",
    isPinned: false,
    providers: [{ ...EMPTY_DOWNLOAD_PROVIDER, sectionTitle: defaultSection }],
  };
}

export default function MediaForm({ type, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    if (!initialData) return emptyForm(type);

    let initialQualities = initialData.qualities || [];
    if (!initialQualities.length && initialData.qualityBadge) {
      initialQualities = [initialData.qualityBadge];
    }

    const defaultSection = type === "series" ? "Season 01" : "Download Links";

    return {
      ...emptyForm(type),
      ...initialData,
      screenshots: initialData.screenshots || [],
      isPinned: initialData.isPinned || false,
      releaseYear: initialData.releaseYear ? String(initialData.releaseYear) : "",
      cast: (initialData.cast || []).join(", "),
      genres: initialData.genres || [],
      categoryIds: initialData.categoryIds || [],
      qualities: initialQualities,
      providers: initialData.providers?.length
        ? initialData.providers.map((p) => ({
            ...(p.type === "watch" ? EMPTY_WATCH_PROVIDER : EMPTY_DOWNLOAD_PROVIDER),
            sectionTitle: p.sectionTitle || (p.type !== "watch" ? defaultSection : null),
            ...p,
          }))
        : [{ ...EMPTY_DOWNLOAD_PROVIDER, sectionTitle: defaultSection }],
    };
  });

  const [tmdbId, setTmdbId] = useState("");
  const [fetchingTmdb, setFetchingTmdb] = useState(false);

  const [genreOptions, setGenreOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listGenres().then(setGenreOptions).catch(() => setGenreOptions([]));
    listCategories().then(setCategoryOptions).catch(() => setCategoryOptions([]));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleTmdbFetch() {
    if (!tmdbId.trim()) return;
    setFetchingTmdb(true);
    setError("");

    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY || "3b6d3da78ca085df6861bde1fa3f7fbd";
      const endpoint = type === "series" ? "tv" : "movie";
      const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${tmdbId.trim()}?api_key=${apiKey}&append_to_response=credits,videos,images`
      );

      if (!res.ok) {
        throw new Error("TMDB ID পাওয়া যায়নি! সঠিক ID দিন।");
      }

      const data = await res.json();

      const trailer = data.videos?.results?.find(
        (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
      );

      const screenshots = data.images?.backdrops
        ? data.images.backdrops.slice(0, 6).map((img) => `https://image.tmdb.org/t/p/w780${img.file_path}`)
        : [];

      const tmdbGenreNames = (data.genres || []).map((g) => g.name.toLowerCase());
      const matchedGenres = genreOptions
        .filter((g) => tmdbGenreNames.includes(g.name.toLowerCase()))
        .map((g) => g.name);

      const castNames = data.credits?.cast
        ? data.credits.cast.slice(0, 12).map((c) => c.name).join(", ")
        : "";

      setForm((f) => ({
        ...f,
        title: data.title || data.name || f.title,
        synopsis: data.overview || f.synopsis,
        posterUrl: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : f.posterUrl,
        screenshots: screenshots.length ? screenshots : f.screenshots,
        trailerYouTubeId: trailer?.key || f.trailerYouTubeId || "",
        cast: castNames || f.cast,
        releaseYear: data.release_date
          ? data.release_date.split("-")[0]
          : data.first_air_date
          ? data.first_air_date.split("-")[0]
          : f.releaseYear,
        durationMinutes: data.runtime ? String(data.runtime) : f.durationMinutes,
        seasons: data.number_of_seasons ? String(data.number_of_seasons) : f.seasons,
        imdbRating: data.vote_average ? data.vote_average.toFixed(1) : f.imdbRating,
        genres: matchedGenres.length ? matchedGenres : f.genres,
      }));
    } catch (err) {
      setError(err.message || "TMDB ডাটা লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setFetchingTmdb(false);
    }
  }

  function toggleGenre(name) {
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(name) ? f.genres.filter((g) => g !== name) : [...f.genres, name],
    }));
  }

  function toggleCategory(id) {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));
  }

  function toggleQuality(val) {
    setForm((f) => ({
      ...f,
      qualities: f.qualities.includes(val)
        ? f.qualities.filter((q) => q !== val)
        : [...f.qualities, val],
    }));
  }

  function updateProvider(index, field, value) {
    setForm((f) => {
      const providers = [...f.providers];
      providers[index] = { ...providers[index], [field]: value };
      return { ...f, providers };
    });
  }

  function addWatchProvider() {
    setForm((f) => ({ ...f, providers: [...f.providers, { ...EMPTY_WATCH_PROVIDER }] }));
  }

  function updateSectionTitle(oldTitle, newTitle) {
    const defaultSec = type === "series" ? "Season 01" : "Download Links";
    setForm((f) => ({
      ...f,
      providers: f.providers.map((p) =>
        p.type !== "watch" && (p.sectionTitle || defaultSec) === oldTitle
          ? { ...p, sectionTitle: newTitle }
          : p
      ),
    }));
  }

  function addDownloadLinkToSection(sectionTitle) {
    setForm((f) => ({
      ...f,
      providers: [
        ...f.providers,
        {
          ...EMPTY_DOWNLOAD_PROVIDER,
          sectionTitle: sectionTitle,
        },
      ],
    }));
  }

  function addDownloadSection() {
    const defaultSec = type === "series" ? "Season 01" : "Download Links";
    const existingTitles = Array.from(
      new Set(
        form.providers
          .filter((p) => p.type !== "watch")
          .map((p) => p.sectionTitle || defaultSec)
      )
    );

    let nextNum = existingTitles.length + 1;
    let newTitle = type === "series" ? `Season 0${nextNum}` : `Download Links ${nextNum}`;
    while (existingTitles.includes(newTitle)) {
      nextNum++;
      newTitle = type === "series" ? `Season 0${nextNum}` : `Download Links ${nextNum}`;
    }

    addDownloadLinkToSection(newTitle);
  }

  function removeDownloadSection(sectionTitle) {
    const defaultSec = type === "series" ? "Season 01" : "Download Links";
    setForm((f) => ({
      ...f,
      providers: f.providers.filter(
        (p) => p.type === "watch" || (p.sectionTitle || defaultSec) !== sectionTitle
      ),
    }));
  }

  function removeProvider(index) {
    setForm((f) => ({ ...f, providers: f.providers.filter((_, i) => i !== index) }));
  }

  async function handlePosterUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPoster(true);
    try {
      const url = await uploadPoster(file);
      update("posterUrl", url);
    } catch {
      setError("Couldn't upload poster.");
    } finally {
      setUploadingPoster(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const cleanProviders = form.providers
        .filter((p) => p.name && p.url)
        .map((p) => {
          const cleaned = { ...p };
          Object.keys(cleaned).forEach((k) => {
            if (cleaned[k] === undefined) cleaned[k] = null;
          });
          return cleaned;
        });

      const payload = {
        ...form,
        backdropUrl: form.posterUrl || "",
        trailerYouTubeId: form.trailerYouTubeId || "",
        screenshots: Array.isArray(form.screenshots)
          ? form.screenshots
          : String(form.screenshots || "").split("\n").map((s) => s.trim()).filter(Boolean),
        releaseYear: form.releaseYear ? String(form.releaseYear).trim() : null,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
        seasons: form.seasons ? String(form.seasons).trim() : null,
        imdbRating: form.imdbRating ? Number(form.imdbRating) : null,
        cast: typeof form.cast === "string" ? form.cast.split(",").map((s) => s.trim()).filter(Boolean) : form.cast,
        providers: cleanProviders,
      };

      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          payload[key] = null;
        }
      });

      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Couldn't save this title.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-ink-900 border border-ink-600 rounded-md px-3 py-2 text-sm text-mist-100 focus:border-marquee-500 transition-colors";
  const labelClass = "block text-xs text-mist-500 mb-1.5";

  const downloadProvidersWithIndices = form.providers
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter((p) => p.type !== "watch");

  const defaultSecTitle = type === "series" ? "Season 01" : "Download Links";
  const downloadSections = Array.from(
    new Set(
      downloadProvidersWithIndices.map((p) => p.sectionTitle || defaultSecTitle)
    )
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!initialData && (
        <div className="bg-ink-900/80 border border-marquee-500/30 p-3 rounded-md">
          <label className="text-xs text-marquee-400 font-medium mb-1.5 flex items-center gap-1.5">
            <Sparkles size={14} /> Import Data from TMDB
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tmdbId}
              onChange={(e) => setTmdbId(e.target.value)}
              placeholder="Enter TMDB ID (e.g. 550 or 93405)"
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleTmdbFetch}
              disabled={fetchingTmdb}
              className="shrink-0 px-4 py-2 rounded-md bg-marquee-500 text-ink-950 font-semibold text-xs hover:bg-marquee-400 transition-colors disabled:opacity-50"
            >
              {fetchingTmdb ? "Fetching..." : "Fetch TMDB"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 bg-ink-900 border border-ink-600 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pin size={16} className="text-marquee-400" />
            <div>
              <p className="text-sm font-medium text-mist-100">Pin to Home Page</p>
              <p className="text-xs text-mist-500">Show this title at the top of the Home feed.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => update("isPinned", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-ink-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-marquee-500"></div>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Title</label>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Synopsis</label>
          <textarea
            required
            rows={3}
            value={form.synopsis}
            onChange={(e) => update("synopsis", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Poster</label>
          <div className="flex items-center gap-2">
            <input value={form.posterUrl} onChange={(e) => update("posterUrl", e.target.value)} placeholder="Image URL" className={inputClass} />
            <label className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md bg-ink-800 border border-ink-600 text-mist-300 hover:text-marquee-400 cursor-pointer">
              <Upload size={15} />
              <input type="file" accept="image/*" className="hidden" onChange={handlePosterUpload} />
            </label>
          </div>
          {uploadingPoster && <p className="text-xs text-mist-500 mt-1">Uploading...</p>}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Screenshots (One image URL per line)</label>
          <textarea
            rows={3}
            value={Array.isArray(form.screenshots) ? form.screenshots.join("\n") : form.screenshots}
            onChange={(e) => update("screenshots", e.target.value.split("\n"))}
            placeholder="https://image.tmdb.org/t/p/w780/example1.jpg&#10;https://image.tmdb.org/t/p/w780/example2.jpg"
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Trailer / Video URL (Full Link or ID)</label>
          <input 
            value={form.trailerYouTubeId || ""} 
            onChange={(e) => update("trailerYouTubeId", e.target.value)} 
            placeholder="e.g. https://youtu.be/... or .mp4 link" 
            className={inputClass} 
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Cast (comma separated)</label>
          <input value={form.cast || ""} onChange={(e) => update("cast", e.target.value)} className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Genres</label>
          <MultiSelectChips
            options={genreOptions.map((g) => ({ id: g.id, label: g.name, value: g.name }))}
            selected={form.genres}
            onToggle={toggleGenre}
            emptyLabel="No genres yet."
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Categories</label>
          <MultiSelectChips
            options={categoryOptions.map((c) => ({ id: c.id, label: c.name, value: c.id }))}
            selected={form.categoryIds}
            onToggle={toggleCategory}
            emptyLabel="No categories yet."
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Available Qualities</label>
          <MultiSelectChips
            options={QUALITY_OPTIONS}
            selected={form.qualities}
            onToggle={toggleQuality}
          />
        </div>

        <div>
          <label className={labelClass}>Release Year</label>
          <input
            type="text"
            value={form.releaseYear}
            onChange={(e) => update("releaseYear", e.target.value)}
            placeholder="e.g. 2024"
            className={inputClass}
          />
        </div>

        {type === "movie" ? (
          <div>
            <label className={labelClass}>Duration (minutes)</label>
            <input type="number" value={form.durationMinutes} onChange={(e) => update("durationMinutes", e.target.value)} className={inputClass} />
          </div>
        ) : (
          <div>
            <label className={labelClass}>Seasons</label>
            <input
              type="text"
              value={form.seasons}
              onChange={(e) => update("seasons", e.target.value)}
              placeholder="e.g. 3"
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className={labelClass}>IMDb Rating</label>
          <input type="number" step="0.1" min="0" max="10" value={form.imdbRating} onChange={(e) => update("imdbRating", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Age Rating</label>
          <input value={form.ageRating} onChange={(e) => update("ageRating", e.target.value)} placeholder="PG-13, 18+..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Language Badge</label>
          <input value={form.languageBadge} onChange={(e) => update("languageBadge", e.target.value)} placeholder="English, Dual Audio..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <label className={`${labelClass} font-semibold text-mist-300`}>Watch Links (Streaming)</label>
          <button type="button" onClick={addWatchProvider} className="text-xs text-marquee-400 hover:text-marquee-300 inline-flex items-center gap-1">
            <Plus size={13} /> Add Watch Link
          </button>
        </div>
        <div className="space-y-2.5">
          {form.providers
            .map((p, i) => ({ ...p, originalIndex: i }))
            .filter((p) => p.type === "watch")
            .map((p) => (
              <div key={p.originalIndex} className="bg-ink-900 border border-ink-700/80 p-3 rounded-md grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                <input
                  placeholder="Server / Name (e.g. Player 01)"
                  value={p.name}
                  onChange={(e) => updateProvider(p.originalIndex, "name", e.target.value)}
                  className={`${inputClass} sm:col-span-4`}
                />
                <input
                  placeholder="Quality (e.g. 1080p)"
                  value={p.quality || ""}
                  onChange={(e) => updateProvider(p.originalIndex, "quality", e.target.value)}
                  className={`${inputClass} sm:col-span-2`}
                />
                <input
                  placeholder="Watch URL (https://...)"
                  value={p.url}
                  onChange={(e) => updateProvider(p.originalIndex, "url", e.target.value)}
                  className={`${inputClass} sm:col-span-5`}
                />
                <button
                  type="button"
                  onClick={() => removeProvider(p.originalIndex)}
                  className="sm:col-span-1 flex items-center justify-center text-mist-500 hover:text-signal-mature h-9"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-ink-800 pb-2">
          <label className={`${labelClass} font-semibold text-mist-300 text-sm`}>
            Download Links (Dynamic Sections / Seasons)
          </label>
          <button
            type="button"
            onClick={addDownloadSection}
            className="text-xs text-marquee-400 hover:text-marquee-300 inline-flex items-center gap-1 font-medium bg-ink-800 border border-ink-600 px-2.5 py-1 rounded-md"
          >
            <Plus size={13} /> Add Download Section
          </button>
        </div>

        {downloadSections.length === 0 ? (
          <p className="text-xs text-mist-500 italic">No download sections added yet. Click "Add Download Section" above.</p>
        ) : (
          downloadSections.map((secTitle, sectionIndex) => {
            const sectionItems = downloadProvidersWithIndices.filter(
              (p) => (p.sectionTitle || defaultSecTitle) === secTitle
            );

            return (
              <div key={sectionIndex} className="bg-ink-900/90 border border-ink-700/80 p-3.5 rounded-lg space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <span className="text-xs text-mist-400 font-medium shrink-0">Section Title:</span>
                    <input
                      type="text"
                      value={secTitle}
                      onChange={(e) => updateSectionTitle(secTitle, e.target.value)}
                      placeholder="e.g. Season 01, Season 02..."
                      className={`${inputClass} py-1 text-xs font-semibold text-marquee-400`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addDownloadLinkToSection(secTitle)}
                      className="text-xs text-marquee-400 hover:text-marquee-300 inline-flex items-center gap-1 font-medium"
                    >
                      <Plus size={13} /> Add Link
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDownloadSection(secTitle)}
                      className="text-xs text-signal-mature hover:text-red-400 inline-flex items-center gap-1 ml-2"
                      title="Delete Section"
                    >
                      <Trash2 size={13} /> Delete Section
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {sectionItems.map((p) => (
                    <div key={p.originalIndex} className="bg-ink-950/80 border border-ink-800 p-2.5 rounded-md grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                      <input
                        placeholder="Server / Name (e.g. Drive Link 01)"
                        value={p.name}
                        onChange={(e) => updateProvider(p.originalIndex, "name", e.target.value)}
                        className={`${inputClass} sm:col-span-4`}
                      />
                      <input
                        placeholder="Quality (e.g. 1080p)"
                        value={p.quality || ""}
                        onChange={(e) => updateProvider(p.originalIndex, "quality", e.target.value)}
                        className={`${inputClass} sm:col-span-2`}
                      />
                      <input
                        placeholder="Download URL (https://...)"
                        value={p.url}
                        onChange={(e) => updateProvider(p.originalIndex, "url", e.target.value)}
                        className={`${inputClass} sm:col-span-5`}
                      />
                      <button
                        type="button"
                        onClick={() => removeProvider(p.originalIndex)}
                        className="sm:col-span-1 flex items-center justify-center text-mist-500 hover:text-signal-mature h-9"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && <p className="text-xs text-signal-mature">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : initialData ? "Save Changes" : "Add Title"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-pill bg-ink-800 border border-ink-600 text-sm text-mist-300 hover:text-mist-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}