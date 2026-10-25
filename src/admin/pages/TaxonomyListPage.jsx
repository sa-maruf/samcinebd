// src/admin/pages/TaxonomyListPage.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { ChipGridSkeleton } from "../components/AdminSkeletons";

/**
 * @param {string} title - "Genres" | "Categories"
 * @param {() => Promise<Array>} list
 * @param {(name, iconUrl) => Promise} create
 * @param {(id, data) => Promise} update
 * @param {(id) => Promise} remove
 */
export default function TaxonomyListPage({ title, list, create, update, remove }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | item
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    setLoading(true);
    setItems(await list());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openModal(item) {
    setModal(item);
    setName(item === "add" ? "" : item.name);
    setIconUrl(item === "add" ? "" : item.iconUrl || "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "add") {
        await create(name.trim(), iconUrl.trim());
      } else {
        await update(modal.id, { name: name.trim(), iconUrl: iconUrl.trim() });
      }
      setModal(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await remove(id);
    setDeleting(null);
    load();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl tracking-wide text-mist-100">{title}</h1>
        <button
          onClick={() => openModal("add")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 transition-colors"
        >
          <Plus size={15} /> Add New
        </button>
      </div>

      {loading ? (
        <ChipGridSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.length === 0 && (
            <p className="text-mist-500 text-sm">Nothing here yet — add your first one.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="surface-card p-4 flex items-center justify-between gap-2">
              <span className="text-sm text-mist-100 truncate">{item.name}</span>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openModal(item)} className="text-mist-500 hover:text-marquee-400">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleting(item)} className="text-mist-500 hover:text-signal-mature">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === "add" ? "Add New" : `Edit ${modal.name}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-mist-500 mb-1.5">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ink-900 border border-ink-600 rounded-md px-3 py-2 text-sm text-mist-100 focus:border-marquee-500"
              />
            </div>
            <div>
              <label className="block text-xs text-mist-500 mb-1.5">Icon URL (optional)</label>
              <input
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                className="w-full bg-ink-900 border border-ink-600 rounded-md px-3 py-2 text-sm text-mist-100 focus:border-marquee-500"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-5 py-2.5 rounded-pill bg-ink-800 border border-ink-600 text-sm text-mist-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete?" onClose={() => setDeleting(null)}>
          <p className="text-sm text-mist-300 mb-5">
            Remove <span className="text-mist-100">{deleting.name}</span>? Titles already tagged with it keep the tag as text.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDelete(deleting.id)}
              className="px-5 py-2.5 rounded-pill bg-signal-mature text-white text-sm font-medium hover:opacity-90"
            >
              Delete
            </button>
            <button onClick={() => setDeleting(null)} className="px-5 py-2.5 rounded-pill bg-ink-800 border border-ink-600 text-sm text-mist-300">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
