//Navbar 01
// src/components/SearchBar.jsx 01
// import { useState, useEffect } from "react";
// import { X, Search } from "lucide-react";

// /**
//  * Controlled draft input + committed `query` (from SearchContext, passed in
//  * via props). Nothing is searched until Enter is pressed or the Search
//  * button is clicked — no live-as-you-type filtering.
//  */
// export default function SearchBar({ query, onSearch, onClear, className = "", inputClassName = "" }) {
//   const [draft, setDraft] = useState(query);

//   // Keep the input in sync if the committed query is cleared elsewhere (e.g. nav reset).
//   useEffect(() => {
//     setDraft(query);
//   }, [query]);

//   function commit() {
//     onSearch(draft.trim());
//   }

//   function handleKeyDown(e) {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       commit();
//     }
//   }

//   function handleClear() {
//     setDraft("");
//     onClear();
//   }

//   return (
//     <div className={`relative flex items-stretch ${className}`}>
//       <input
//         value={draft}
//         onChange={(e) => setDraft(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Search titles..."
//         className={`w-full bg-ink-800 border border-ink-600 focus:outline-none focus:ring-0 rounded-l-md pl-4 ${
//           draft ? "pr-8" : "pr-3"
//         } py-2 text-sm text-mist-100 placeholder:text-mist-700   ${inputClassName}`}
//       />
//       {draft && (
//         <button
//           type="button"
//           onClick={handleClear}
//           aria-label="Clear search"
//           className="absolute right-[52px] top-1/2 -translate-y-1/2 text-mist-500 hover:text-mist-100"
//         >
//           <X size={14} />
//         </button>
//       )}
//       <button
//         type="button"
//         onClick={commit}
//         aria-label="Search"
//         className="shrink-0 inline-flex items-center gap-1.5 px-3 rounded-r-md bg-[#F38A0C] text-white text-sm font-medium hover:bg-marquee-400 transition-colors"
//       >
//         <Search size={14} />
//         {/* <span className="hidden sm:inline">Search</span> */}
//       </button>
//     </div>
//   );
// }


// Navbar 02
// src/components/SearchBar.jsx 
// import { useState, useEffect } from "react";
// import { X, Search } from "lucide-react";

// export default function SearchBar({
//   query,
//   onSearch,
//   onClear,
//   className = "",
//   inputClassName = "",
// }) {
//   const [draft, setDraft] = useState(query);

  
//   useEffect(() => {
//     setDraft(query);
//   }, [query]);

//   function commit() {
//     onSearch(draft.trim());
//   }

//   function handleKeyDown(e) {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       commit();
//     }
//   }

//   function handleClear() {
//     setDraft("");
//     onClear();
//   }

//   return (
//     <div
//       className={`group relative flex items-center rounded-md border border-ink-600/80 bg-ink-900/90 focus-within:border-[#F17A08] focus-within:ring-1 focus-within:ring-[#F17A08]/50 transition-all duration-200 overflow-hidden ${className}`}
//     >
//       <input
//         value={draft}
//         onChange={(e) => setDraft(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Search titles..."
//         className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 pl-2 pr-2 py-2 text-sm text-mist-100 placeholder:text-mist-500/70 ${inputClassName}`}
//       />

//       {draft && (
//         <button
//           type="button"
//           onClick={handleClear}
//           aria-label="Clear search"
//           className="shrink-0 p-1 mr-1.5 text-mist-500 hover:text-mist-100 hover:bg-ink-700/60 rounded-full transition-colors"
//         >
//           <X size={14} />
//         </button>
//       )}

//       <button
//         type="button"
//         onClick={commit}
//         aria-label="Search"
//         className="self-stretch shrink-0 px-3.5 bg-[#F17A08] text-white hover:bg-[#d86800] active:bg-[#bd5a00] transition-colors flex items-center justify-center focus:outline-none border-l border-ink-600/40"
//       >
//         <Search size={15} />
//       </button>
//     </div>
//   );
// }


//Navbar 03
// src/components/SearchBar.jsx
import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  query,
  onSearch,
  onClear,
  className = "",
  inputClassName = "",
}) {
  const [draft, setDraft] = useState(query);
  const navigate = useNavigate();


  useEffect(() => {
    setDraft(query);
  }, [query]);

  function commit() {
    onSearch(draft.trim());
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
  }

  function handleClear() {
    setDraft("");
    onClear();
    navigate("/"); // X এ ক্লিক করলে সরাসরি হোম পেজে রিডাইরেক্ট করবে
  }

  return (
    <div
      className={`group relative flex items-center rounded-md border border-ink-600/80 bg-ink-900/90 focus-within:border-[#F17A08] focus-within:ring-1 focus-within:ring-[#F17A08]/50 transition-all duration-200 overflow-hidden ${className}`}
    >
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search titles..."
        className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 pl-2 pr-2 py-2 text-sm text-mist-100 placeholder:text-mist-500/70 ${inputClassName}`}
      />

      {draft && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="shrink-0 p-1 mr-1.5 text-mist-500 hover:text-mist-100 hover:bg-ink-700/60 rounded-full transition-colors"
        >
          <X size={14} />
        </button>
      )}

      <button
        type="button"
        onClick={commit}
        aria-label="Search"
        className="self-stretch shrink-0 px-3.5 bg-[#F17A08] text-white hover:bg-[#d86800] active:bg-[#bd5a00] transition-colors flex items-center justify-center focus:outline-none border-l border-ink-600/40"
      >
        <Search size={15} />
      </button>
    </div>
  );
}