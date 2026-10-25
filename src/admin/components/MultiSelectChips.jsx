// src/admin/components/MultiSelectChips.jsx

/**
 * A toggleable chip picker — used for Genres and Categories in MediaForm.
 * `options` is [{ id, label }]. `selected` is an array of the currently
 * chosen values (names for genres, ids for categories — caller decides).
 */
export default function MultiSelectChips({ options, selected, onToggle, emptyLabel }) {
  if (options.length === 0) {
    return <p className="text-xs text-mist-700">{emptyLabel || "Nothing available yet."}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`text-xs px-3 py-1.5 rounded-pill border transition-colors ${
              isSelected
                ? "bg-marquee-500 border-marquee-500 text-ink-950 font-medium"
                : "bg-ink-900 border-ink-600 text-mist-300 hover:border-marquee-500 hover:text-marquee-400"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
