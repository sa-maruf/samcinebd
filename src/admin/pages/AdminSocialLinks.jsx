// src/admin/pages/AdminSocialLinks.jsx
import { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Save } from "lucide-react";
import { getSocialLinks, updateSocialLinks } from "../../services/adminService";

const FIELDS = [
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourpage" },
  { key: "twitter", label: "Twitter", icon: Twitter, placeholder: "https://twitter.com/yourhandle" },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourhandle" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@yourchannel" },
];

export default function AdminSocialLinks() {
  const [links, setLinks] = useState({ facebook: "", twitter: "", instagram: "", youtube: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSocialLinks()
      .then(setLinks)
      .finally(() => setLoading(false));
  }, []);

  function update(key, value) {
    setLinks((l) => ({ ...l, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSocialLinks(links);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-xl sm:text-2xl tracking-wide text-mist-100 mb-2">
        Social Links
      </h1>
      <p className="text-sm text-mist-500 mb-6">
        These URLs populate the social icons in the website footer.
      </p>

      <form onSubmit={handleSubmit} className="surface-card p-5 sm:p-6 max-w-xl space-y-4">
        {loading ? (
          <div className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="skeleton h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-xs text-mist-500 mb-1.5">
                <Icon size={14} /> {label}
              </label>
              <input
                type="url"
                value={links[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-ink-900 border border-ink-600 rounded-md px-3 py-2 text-sm text-mist-100 placeholder:text-mist-700 focus:border-marquee-500 transition-colors"
              />
            </div>
          ))
        )}

        {!loading && (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 transition-colors disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Links"}
            </button>
            {saved && <span className="text-xs text-marquee-400">Saved.</span>}
          </div>
        )}
      </form>
    </div>
  );
}
