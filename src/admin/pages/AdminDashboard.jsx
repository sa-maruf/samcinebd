// src/admin/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Film, Tv, Inbox, GalleryHorizontal, Tag, LayoutGrid } from "lucide-react";
import { getDashboardStats } from "../../services/adminService";
import { StatCardsSkeleton } from "../components/AdminSkeletons";

function StatCard({ icon: Icon, label, value, to, tint }) {
  return (
    <Link
      to={to}
      className="surface-card p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:border-marquee-500 border border-transparent transition-colors min-w-0"
    >
      <div className={`h-10 w-10 md:h-11 md:w-11 rounded-md flex items-center justify-center shrink-0 ${tint}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-mist-500 truncate">{label}</p>
        <p className="text-xl md:text-2xl font-semibold text-mist-100 font-mono">{value}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const cards = [
    { icon: Film, label: "Total Movies", key: "totalMovies", to: "/admin-sam8/movies", tint: "bg-marquee-500" },
    { icon: Tv, label: "Total TV Series", key: "totalSeries", to: "/admin-sam8/tv-series", tint: "bg-signal-series" },
    { icon: Inbox, label: "Pending Requests", key: "pendingRequests", to: "/admin-sam8/requests", tint: "bg-signal-mature" },
    { icon: GalleryHorizontal, label: "Total Sliders", key: "totalSliders", to: "/admin-sam8/sliders", tint: "bg-marquee-600" },
    { icon: Tag, label: "Total Genres", key: "totalGenres", to: "/admin-sam8/genres", tint: "bg-signal-series" },
    { icon: LayoutGrid, label: "Total Categories", key: "totalCategories", to: "/admin-sam8/categories", tint: "bg-mist-500" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-xl sm:text-2xl tracking-wide text-mist-100 mb-5 md:mb-6">
        Dashboard
      </h1>

      {!stats ? (
        <StatCardsSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-4">
          {cards.map((c) => (
            <StatCard
              key={c.key}
              icon={c.icon}
              label={c.label}
              value={stats[c.key]}
              to={c.to}
              tint={c.tint}
            />
          ))}
        </div>
      )}
    </div>
  );
}
