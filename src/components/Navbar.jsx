// src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ChevronDown, X, Menu, Search as SearchIcon } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { fetchGenres, fetchCategories } from "../services/mediaService";
import SearchBar from "./SearchBar";
import logo from '../assets/cinebd.png';

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "TV Series", to: "/tv-series" },
];

/** Smooth Centered 4-Column Mega Menu Dropdown */
function Dropdown({ label, items, basePath }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm text-mist-300 hover:text-mist-100 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        /* Outer wrapper strictly handles center positioning */
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50">
          {/* Inner wrapper handles background, size, and smooth fade animation */}
          <div className="w-[520px] max-w-[90vw] bg-ink-900 border border-ink-600 rounded-card shadow-2xl p-4 animate-fade-in max-h-[75vh] overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <p className="px-3 py-2 text-xs text-mist-500">Nothing here yet</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {items.map((item) => (
                  <NavLink
                    key={item.id}
                    to={`${basePath}/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-2.5 py-1.5 text-xs text-mist-300 hover:text-marquee-400 hover:bg-ink-800 rounded-md transition-colors truncate text-center"
                    title={item.name}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Expandable accordion inside the mobile drawer, listing real Genre/Category items. */
function MobileAccordion({ label, items, basePath, onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3 text-sm text-mist-100"
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-3 pl-3 space-y-1 animate-fade-in">
          {items.length === 0 && <p className="text-xs text-mist-500 py-1">Nothing here yet</p>}
          {items.map((item) => (
            <Link
              key={item.id}
              to={`${basePath}/${item.slug}`}
              onClick={onNavigate}
              className="block py-1.5 text-sm text-mist-400 hover:text-marquee-400"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** Mobile Drawer */
function MobileDrawer({ open, onClose, genres, categories, onNavigate }) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div
        className="lg:hidden fixed inset-0 h-screen w-screen bg-black/60 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="lg:hidden fixed inset-y-0 left-0 h-screen w-3/4 max-w-xs z-50 bg-[#0B0C14] shadow-2xl overflow-y-auto p-6 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-display text-lg tracking-wide text-mist-100">
            SAM<span className="text-marquee-500">CINEBD</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-mist-400 hover:text-mist-100"
          >
            <X size={22} />
          </button>
        </div>

        <nav>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `block py-3 text-sm border-b border-white/10 ${isActive ? "text-marquee-400 font-medium" : "text-mist-100"}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <MobileAccordion label="Genres" items={genres} basePath="/genre" onNavigate={onNavigate} />
          <MobileAccordion label="Categories" items={categories} basePath="/category" onNavigate={onNavigate} />

          <NavLink
            to="/request"
            onClick={onNavigate}
            className="block py-3 text-sm text-mist-100 border-b border-white/10"
          >
            Request
          </NavLink>
          <NavLink to="/about" onClick={onNavigate} className="block py-3 text-sm text-mist-100">
            About Us
          </NavLink>
        </nav>
      </aside>
    </>,
    document.body
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { query, setQuery, resetSearch } = useSearch();

  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Helper function to filter out items with empty names
  const filterValidItems = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter((item) => {
      if (!item) return false;
      const name = typeof item === "object" ? item.name : item;
      return name && String(name).trim() !== "";
    });
  };

  useEffect(() => {
    fetchGenres()
      .then((data) => setGenres(filterValidItems(data)))
      .catch(() => setGenres([]));

    fetchCategories()
      .then((data) => setCategories(filterValidItems(data)))
      .catch(() => setCategories([]));
  }, []);

  function handleSearchSubmit(q) {
    setQuery(q);
    if (q) navigate("/search");
  }

  function handleNavigate() {
    resetSearch();
    setIsMenuOpen(false);
    setMobileSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-screen mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Mobile: hamburger */}
        <button
          type="button"
          className="lg:hidden text-mist-300 hover:text-mist-100"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <NavLink
          to="/"
          onClick={handleNavigate}
          className="font-display text-xl lg:text-2xl tracking-wide text-mist-100 shrink-0 mx-auto lg:mx-0 flex items-center gap-[6px] sm:gap-2"
        >
          <img src={logo} alt="SAMCINEBD Logo" className="w-[20px] sm:w-[24px] lg:w-[30px] xl:w-[34px] " />
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-wide text-mist-100">
            SAM<span className="text-marquee-500">CINEBD</span>
          </h3>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-6 lg:gap-3 xl:gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={handleNavigate}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? "text-marquee-400 font-medium" : "text-mist-300 hover:text-mist-100"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Dropdown label="Genres" items={genres} basePath="/genre" />
          <Dropdown label="Categories" items={categories} basePath="/category" />
          <NavLink
            to="/request"
            onClick={handleNavigate}
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? "text-marquee-400 font-medium" : "text-mist-300 hover:text-mist-100"}`
            }
          >
            Request
          </NavLink>
          <NavLink
            to="/about"
            onClick={handleNavigate}
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? "text-marquee-400 font-medium" : "text-mist-300 hover:text-mist-100"}`
            }
          >
            About Us
          </NavLink>
        </nav>

        {/* Desktop search */}
        <div className="flex-1 lg:max-w-[250px] xl:max-w-[270px] hidden lg:block">
          <SearchBar query={query} onSearch={handleSearchSubmit} onClear={resetSearch} />
        </div>

        {/* Mobile: search icon */}
        <button
          type="button"
          className="lg:hidden text-mist-300 hover:text-mist-100"
          onClick={() => setMobileSearchOpen((o) => !o)}
          aria-label={mobileSearchOpen ? "Close search" : "Open search"}
        >
          {mobileSearchOpen ? <X size={20} /> : <SearchIcon size={20} />}
        </button>
      </div>

      {mobileSearchOpen && (
        <div className="lg:hidden border-t border-ink-600 px-4 py-3 animate-fade-in">
          <SearchBar
            query={query}
            onSearch={(q) => {
              handleSearchSubmit(q);
              setMobileSearchOpen(false);
            }}
            onClear={resetSearch}
          />
        </div>
      )}

      <MobileDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        genres={genres}
        categories={categories}
        onNavigate={handleNavigate}
      />
    </header>
  );
}