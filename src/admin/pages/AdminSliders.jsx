// src/admin/pages/AdminSliders.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { listSliders, createSlider, updateSlider, deleteSlider } from "../../services/adminService";
import Modal from "../components/Modal";
import { ListRowSkeleton } from "../components/AdminSkeletons";

const emptyForm = { title: "", targetUrl: "", backdropUrl: "", order: 0, active: true };

export default function AdminSliders() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | slider
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    setLoading(true);
    setSliders(await listSliders());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openModal(item) {
    setModal(item);
    setForm(
      item === "add"
        ? { ...emptyForm, order: sliders.length }
        : {
            title: item.title || "",
            targetUrl: item.targetUrl || "",
            backdropUrl: item.backdropUrl || "",
            order: item.order ?? 0,
            active: item.active ?? true,
          }
    );
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "add") {
        await createSlider({ ...form, order: Number(form.order) });
      } else {
        await updateSlider(modal.id, { ...form, order: Number(form.order) });
      }
      setModal(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await deleteSlider(id);
    setDeleting(null);
    load();
  }

  const inputClass = "w-full bg-ink-900 border border-ink-600 rounded-md px-3 py-2 text-sm text-mist-100 focus:border-marquee-500";

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
        <h1 className="font-display text-xl sm:text-2xl tracking-wide text-mist-100">Sliders</h1>
        <button
          onClick={() => openModal("add")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 transition-colors shrink-0"
        >
          <Plus size={15} /> Add New Slider
        </button>
      </div>

      <div className="surface-card divide-y divide-ink-700">
        {loading && <ListRowSkeleton count={3} />}
        {!loading && sliders.length === 0 && (
          <p className="p-4 text-sm text-mist-500">No sliders yet.</p>
        )}
        {sliders.map((s) => (
          <div key={s.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-4">
            <GripVertical size={16} className="text-mist-700 shrink-0 hidden sm:block" />
            <img src={s.backdropUrl} alt="" className="h-12 w-20 object-cover rounded-md shrink-0" />
            <div className="flex-1 min-w-[120px]">
              <p className="text-sm text-mist-100 truncate">{s.title}</p>
              <p className="text-xs text-mist-500 truncate">{s.targetUrl}</p>
            </div>
            <span className={`badge shrink-0 ${s.active ? "bg-marquee-500/15 text-marquee-400" : "bg-ink-700 text-mist-500"}`}>
              {s.active ? "Active" : "Inactive"}
            </span>
            <button onClick={() => openModal(s)} className="text-mist-500 hover:text-marquee-400">
              <Pencil size={15} />
            </button>
            <button onClick={() => setDeleting(s)} className="text-mist-500 hover:text-signal-mature">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add New Slider" : "Edit Slider"} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-mist-500 mb-1.5">Slide Title</label>
              <input value={form.title} onChange={(e) => update("title", e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-mist-500 mb-1.5">
                Destination Link (paste any internal path or full URL)
              </label>
              <input
                value={form.targetUrl}
                onChange={(e) => update("targetUrl", e.target.value)}
                placeholder="/title/dune-part-two or https://example.com"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-mist-500 mb-1.5">Backdrop URL</label>
              <input value={form.backdropUrl} onChange={(e) => update("backdropUrl", e.target.value)} required className={inputClass} />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-xs text-mist-500 mb-1.5">Order</label>
                <input type="number" value={form.order} onChange={(e) => update("order", e.target.value)} className={`${inputClass} w-24`} />
              </div>
              <label className="flex items-center gap-2 text-sm text-mist-300 pt-5">
                <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} className="accent-marquee-500" />
                Active
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-pill bg-ink-800 border border-ink-600 text-sm text-mist-300">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title="Remove slider?" onClose={() => setDeleting(null)}>
          <p className="text-sm text-mist-300 mb-5">This removes the slide from the homepage banner.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => handleDelete(deleting.id)} className="px-5 py-2.5 rounded-pill bg-signal-mature text-white text-sm font-medium hover:opacity-90">
              Remove
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