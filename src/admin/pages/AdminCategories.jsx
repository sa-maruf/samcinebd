// src/admin/pages/AdminCategories.jsx
import TaxonomyListPage from "./TaxonomyListPage";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminService";

export default function AdminCategories() {
  return (
    <TaxonomyListPage
      title="Categories"
      list={listCategories}
      create={createCategory}
      update={updateCategory}
      remove={deleteCategory}
    />
  );
}
