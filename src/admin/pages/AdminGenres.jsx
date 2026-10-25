// src/admin/pages/AdminGenres.jsx
import TaxonomyListPage from "./TaxonomyListPage";
import { listGenres, createGenre, updateGenre, deleteGenre } from "../../services/adminService";

export default function AdminGenres() {
  return (
    <TaxonomyListPage
      title="Genres"
      list={listGenres}
      create={createGenre}
      update={updateGenre}
      remove={deleteGenre}
    />
  );
}
