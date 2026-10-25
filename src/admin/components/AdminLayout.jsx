// src/admin/components/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Tv,
  Tag,
  LayoutGrid,
  GalleryHorizontal,
  Inbox,
  Share2,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const MENU = [
  { label: "Dashboard", to: "/admin-sam8", icon: LayoutDashboard, end: true },
  { label: "Movies", to: "/admin-sam8/movies", icon: Film },
  { label: "TV Series", to: "/admin-sam8/tv-series", icon: Tv },
  { label: "Genres", to: "/admin-sam8/genres", icon: Tag },
  { label: "Categories", to: "/admin-sam8/categories", icon: LayoutGrid },
  { label: "Sliders", to: "/admin-sam8/sliders", icon: GalleryHorizontal },
  { label: "Movie Requests", to: "/admin-sam8/requests", icon: Inbox },
  { label: "Social Links", to: "/admin-sam8/social-links", icon: Share2 },
];

function SidebarContent({ onNavigate }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin-sam8/login", { replace: true });
  }

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {MENU.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-marquee-500/15 text-marquee-400 font-medium"
                  : "text-mist-300 hover:bg-ink-800 hover:text-mist-100"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-ink-600 space-y-1 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-mist-300 hover:bg-ink-800 hover:text-mist-100 transition-colors"
        >
          <ExternalLink size={16} />
          Visit Website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-mist-300 hover:bg-ink-800 hover:text-signal-mature transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-ink-900 border-r border-ink-600 flex-col">
        <div className="h-16 flex items-center px-5 border-b border-ink-600 shrink-0">
          <span className="font-display text-xl tracking-wide text-mist-100">
            SAM<span className="text-marquee-500">CINEBD</span>
          </span>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-ink-900 border-r border-ink-600 flex flex-col animate-fade-in">
            <div className="h-16 flex items-center justify-between px-4 border-b border-ink-600 shrink-0">
              <span className="font-display text-lg tracking-wide text-mist-100">
                SAM<span className="text-marquee-500">CINEBD</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-mist-400 hover:text-mist-100">
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar: hamburger | brand */}
        <div className="lg:hidden h-14 flex items-center justify-between gap-3 px-4 border-b border-ink-600 bg-ink-900 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-mist-300 hover:text-mist-100" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-display text-2xl tracking-widest text-mist-100">
            SAM<span className="text-marquee-500">CINEBD</span>
          </span>
          {/* Spacer to keep title centered */}
          <div className="w-[22px]" />
        </div>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}