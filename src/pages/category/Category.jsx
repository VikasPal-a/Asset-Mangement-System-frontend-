import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Save, X, FolderTree } from "lucide-react";

import {
  getCategories,
  addCategory,
  getTypes,
  addType,
} from "../../services/categoryService";

import { Button } from "../../components/common/Button";
import { SearchBar } from "../../components/common/SearchBar";
import { Dropdown } from "../../components/common/Dropdown";
import { Pagination } from "../../components/common/Pagination";
import { useCategories } from "../../hooks/useCategories";

function Category() {
  const { handleUpdateType, handleDeleteType } = useCategories();
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = 10;

  // =========================
  // GET CATEGORIES
  // =========================

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      console.log("Categories:", response);

      setCategories(response);
    } catch (error) {
      console.error("Get Categories Error:", error);

      setError(error.response?.data?.message || "Failed to load categories");
    }
  };

  // =========================
  // GET TYPES
  // =========================

  const loadTypes = async () => {
    try {
      const response = await getTypes();

      console.log("Types API Response:", response);

      const typeData = response?.data || response;

      if (Array.isArray(typeData)) {
        const formattedTypes = typeData.map((type) => ({
          id: type.TypeID,
          name: type.TypeName,
          categoryId: type.CategoryID,
          category: type.CategoryName,
        }));

        setRows(formattedTypes);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Get Types Error:", error);

      setError(
        error.response?.data?.message || "Failed to load sub categories",
      );
    }
  };

  // =========================
  // ADD CATEGORY
  // =========================

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await addCategory(categoryName.trim());

      setCategoryName("");

      await loadCategories();

      showToast("Category added successfully.");
    } catch (error) {
      console.error("Add Category Error:", error);

      setError(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD SUB CATEGORY / TYPE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!formName.trim()) {
      setFormError("Sub Category Name is required.");
      return;
    }

    if (!formCategory) {
      setFormError("Please select Category.");
      return;
    }

    try {
      setLoading(true);

      await addType(formName.trim(), formCategory);

      setFormName("");
      setFormCategory("");

      await loadTypes();

      showToast("Sub Category added successfully.");
    } catch (error) {
      console.error("Add Type Error:", error);

      setFormError(
        error.response?.data?.message || "Failed to add sub category",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadCategories();
    loadTypes();
  }, []);

  // =========================
  // TOAST
  // =========================

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const searchMatch = row.name.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        filterCategory === "All" || row.category === filterCategory;

      return searchMatch && categoryMatch;
    });
  }, [rows, search, filterCategory]);

  // =========================
  // PAGINATED ROWS
  // =========================

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedRows = filteredRows.slice(startIndex, startIndex + pageSize);

  // =========================
  // EDIT
  // =========================

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditName(row.name || "");
    setEditCategory(String(row.categoryId ?? ""));
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      showToast("Sub Category Name is required.");
      return;
    }

    if (!editCategory) {
      showToast("Please select Category.");
      return;
    }

    try {
      await handleUpdateType(id, {
        TypeName: editName.trim(),
        CategoryID: Number(editCategory),
      });

      await loadTypes();

      setEditingId(null);
      setEditName("");
      setEditCategory("");

      showToast("Sub Category updated.");
    } catch (err) {
      console.error("Update Error:", err);

      showToast(
        err.response?.data?.message || "Unable to update Sub Category.",
      );
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteRow = async (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await handleDeleteType(deleteId);
      await loadTypes();

      setShowDeleteModal(false);
      setDeleteId(null);

      showToast("Sub Category deleted.");
    } catch (err) {
      console.error("Delete Error:", err);

      showToast(
        err.response?.data?.message || "Unable to delete Sub Category.",
      );
    }
  };
  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* PAGE HEADER */}
        <div className="-mt-8 sm:-mt-10">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700">
              <FolderTree size={18} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
                Category Management
              </h1>

              <p className="text-[11px] text-slate-500">
                Manage categories and sub categories
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            ADD CATEGORY
        ========================= */}

        <section className="mb-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="mb-2 text-xs font-bold text-slate-800">
            Add Category
          </h2>

          <form
            onSubmit={handleCategorySubmit}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <label className="mb-1 block text-[11px] font-medium text-slate-600">
                Category Name
              </label>

              <input
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setError("");
                }}
                placeholder="Enter category name"
                disabled={loading}
                className="h-8 w-full rounded-md border border-slate-300 px-2.5 text-xs outline-none focus:border-green-600 focus:ring-1 focus:ring-green-100"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="h-8 rounded-md bg-green-600 px-3 text-xs hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </form>
        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            ADD SUB CATEGORY
        ========================= */}

        <section className="mb-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="mb-2 text-xs font-bold text-slate-800">
            Add Sub Category
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-2">
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="h-8 w-36 rounded-md border border-slate-300 bg-white px-2 text-[11px] outline-none focus:border-green-600"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {/* SUB CATEGORY NAME */}

              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-slate-600">
                  Sub Category Name
                </label>

                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    setFormError("");
                  }}
                  placeholder="Enter Sub Category Name"
                  disabled={loading}
                  className="h-8 w-full rounded-md border border-slate-300 px-2.5 text-xs outline-none focus:border-green-600 focus:ring-1 focus:ring-green-100"
                />
              </div>

              {/* CATEGORY */}

              {/* <div className="w-48">
                <Dropdown
                  categories={categories}
                  value={formCategory}
                  onChange={setFormCategory}
                />
              </div> */}

              {/* ADD */}

              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="h-8 rounded-md bg-green-600 px-3 text-xs hover:bg-green-700"
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>

            {formError && (
              <p className="mt-1 text-[11px] text-red-600">{formError}</p>
            )}
          </form>
        </section>

        {/* =========================
            SEARCH + FILTER
        ========================= */}

        <section className="mb-3 flex items-center gap-2">
          <div className="w-56">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search..."
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-8 w-36 rounded-md border border-slate-300 bg-white px-2 text-[11px] outline-none focus:border-green-600"
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </section>

        {/* =========================
            TABLE
        ========================= */}

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {/* S.No. */}
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">
                    S.No.
                  </th>

                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">
                    Sub Category
                  </th>

                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">
                    Category
                  </th>

                  <th className="px-3 py-2 text-right text-[11px] font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    {/* Automatic S.No. */}
                    <td className="px-3 py-2 text-[11px] text-slate-600">
                      {startIndex + index + 1}
                    </td>

                    <td className="px-3 py-2 text-xs text-slate-800">
                      {editingId === row.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-7 rounded border px-2 text-[11px]"
                        />
                      ) : (
                        row.name
                      )}
                    </td>

                    <td className="px-3 py-2">
                      {editingId === row.id ? (
                        <Dropdown
                          categories={categories}
                          value={editCategory}
                          onChange={setEditCategory}
                        />
                      ) : (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-medium text-purple-700">
                          {row.category}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        {editingId === row.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(row.id)}
                              className="rounded bg-green-600 p-1.5 text-white"
                            >
                              <Save size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditName("");
                                setEditCategory("");
                              }}
                              className="rounded border border-slate-300 p-1.5"
                            >
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              className="rounded border border-slate-300 p-1.5 hover:bg-slate-100"
                            >
                              <Pencil size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteRow(row.id)}
                              className="rounded bg-red-50 p-1.5 text-red-600"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-3 py-5 text-center text-[11px] text-slate-500"
                    >
                      No sub category found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* REUSABLE PAGINATION */}

        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-bold text-slate-800">
              Delete Sub Category?
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this Sub Category?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2 text-[11px] text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Category;
