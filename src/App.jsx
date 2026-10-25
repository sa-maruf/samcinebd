// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { fetchSearchIndex } from "./services/mediaService";

import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import GenrePage from "./pages/GenrePage";
import CategoryPage from "./pages/CategoryPage";
import Details from "./pages/Details";
import DownloadPage from "./pages/DownloadPage"; // <--- Import DownloadPage
import RequestPage from "./pages/RequestPage";
import AboutPage from "./pages/AboutPage";

import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminMovies from "./admin/pages/AdminMovies";
import AdminTVSeries from "./admin/pages/AdminTVSeries";
import AdminGenres from "./admin/pages/AdminGenres";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminSliders from "./admin/pages/AdminSliders";
import AdminRequests from "./admin/pages/AdminRequests";
import AdminSocialLinks from "./admin/pages/AdminSocialLinks";

// পেজ পরিবর্তন হলে অটোমেটিক স্ক্রোল করে উপরে নিয়ে যাওয়ার হেল্পার কম্পোনেন্ট
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [searchIndex, setSearchIndex] = useState([]);

  useEffect(() => {
    fetchSearchIndex().then(setSearchIndex).catch(() => setSearchIndex([]));
  }, []);

  return (
    <BrowserRouter>
      {/* পেজ চেঞ্জ হলেই স্ক্রোল উপরে নিয়ে যাবে */}
      <ScrollToTop />

      <AdminAuthProvider>
        <SearchProvider index={searchIndex}>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-series" element={<TVSeries />} />
              <Route path="/genre/:genreSlug" element={<GenrePage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/title/:slug" element={<Details />} />
              <Route path="/download" element={<DownloadPage />} /> {/* <--- New Route Added */}
              <Route path="/request" element={<RequestPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin-sam8/login" element={<AdminLogin />} />
            <Route path="/admin-sam8" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="movies" element={<AdminMovies />} />
                <Route path="tv-series" element={<AdminTVSeries />} />
                <Route path="genres" element={<AdminGenres />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="sliders" element={<AdminSliders />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="social-links" element={<AdminSocialLinks />} />
              </Route>
            </Route>
          </Routes>
        </SearchProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}