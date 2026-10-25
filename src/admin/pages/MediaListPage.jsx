// src/admin/pages/MediaListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, Pin } from "lucide-react";
import { listAllMedia, createMedia, updateMedia, deleteMedia } from "../../services/adminService";
import { invalidateMediaCache } from "../../services/mediaService";
import Modal from "../components/Modal";
import MediaForm from "../components/MediaForm";
import SearchBar from "../../components/SearchBar";
import { TableSkeleton } from "../components/AdminSkeletons";

const PAGE_SIZE = 20;

export default function MediaListPage({ type, title }) {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") || "");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  async function load() {
    setLoading(true);
    const data = await listAllMedia(type);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [type]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => m.title?.toLowerCase().includes(q));
  }, [items, searchTerm]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  async function handleSubmit(payload) {
    if (modal && modal !== "add") {
      await updateMedia(modal.id, payload);
    } else {
      await createMedia(payload);
    }
    invalidateMediaCache();
    setModal(null);
    load();
  }

  async function handleDelete(id) {
    await deleteMedia(id);
    invalidateMediaCache();
    setDeleting(null);
    load();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
        <h1 className="font-display text-xl sm:text-2xl tracking-wide text-mist-100">{title}</h1>
        <button
          onClick={() => setModal("add")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 transition-colors shrink-0"
        >
          <Plus size={15} /> Add New {type === "movie" ? "Movie" : "Series"}
        </button>
      </div>

      <SearchBar
        query={searchTerm}
        onSearch={setSearchTerm}
        onClear={() => setSearchTerm("")}
        className="mb-4 max-w-full"
      />

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-mist-500 border-b border-ink-600">
                <th className="px-4 py-3 font-medium">Poster</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Pinned</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <TableSkeleton rows={6} cols={6} />}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-mist-500">
                    {searchTerm ? "No titles match your search." : "No titles yet — add your first one."}
                  </td>
                </tr>
              )}
              {visible.map((m) => (
                <tr key={m.id} className="border-b border-ink-700 last:border-0">
                  <td className="px-4 py-3">
                    <img src={m.posterUrl} alt="" className="h-14 w-10 object-cover rounded-md" />
                  </td>
                  <td className="px-4 py-3 text-mist-100">
                    <div className="line-clamp-1 max-w-[220px] sm:max-w-xs">{m.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    {m.isPinned ? (
                      <span className="badge bg-marquee-500/20 text-marquee-400 border border-marquee-500/30 flex items-center gap-1 w-max">
                        <Pin size={10} className="fill-current" /> Pinned
                      </span>
                    ) : (
                      <span className="text-mist-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-mist-500 font-mono">{m.releaseYear}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        m.status === "published"
                          ? "bg-marquee-500/15 text-marquee-400"
                          : "bg-ink-700 text-mist-500"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/title/${m.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 flex items-center justify-center rounded-md bg-ink-800 border border-ink-600 text-mist-300 hover:text-marquee-400"
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => setModal(m)}
                        className="h-8 w-8 flex items-center justify-center rounded-md bg-ink-800 border border-ink-600 text-mist-300 hover:text-marquee-400"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleting(m)}
                        className="h-8 w-8 flex items-center justify-center rounded-md bg-ink-800 border border-ink-600 text-mist-300 hover:text-signal-mature"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-mist-500 mt-3">
          Showing {visible.length} of {filtered.length}
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-pill bg-ink-800 border border-ink-600 text-sm font-medium text-mist-100 hover:border-marquee-500 hover:text-marquee-400 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {modal && (
        <Modal
          title={modal === "add" ? `Add New ${type === "movie" ? "Movie" : "Series"}` : `Edit ${modal.title}`}
          onClose={() => setModal(null)}
          wide
        >
          <MediaForm
            type={type}
            initialData={modal === "add" ? null : modal}
            onSubmit={handleSubmit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete title?" onClose={() => setDeleting(null)}>
          <p className="text-sm text-mist-300 mb-5">
            This will permanently remove <span className="text-mist-100">{deleting.title}</span> from the catalog.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleDelete(deleting.id)}
              className="px-5 py-2.5 rounded-pill bg-signal-mature text-white text-sm font-medium hover:opacity-90"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleting(null)}
              className="px-5 py-2.5 rounded-pill bg-ink-800 border border-ink-600 text-sm text-mist-300"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}