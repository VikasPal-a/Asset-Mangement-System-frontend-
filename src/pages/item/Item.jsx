import React, { useState, useMemo, useEffect } from "react";

// Reusable Components
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { Pagination } from "../../components/common/Pagination";
import { Dropdown } from "../../components/common/Dropdown";

// Services
import { getCategories, getTypes } from "../../services/categoryService";
import itemService from "../../services/itemService";

// Compact Input Field
const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder = "",
}) => (
  <div className="flex flex-col">
    <label className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`rounded border px-2 py-1 text-[11px] text-slate-900 shadow-xs focus:outline-none focus:ring-1 ${
        error
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400"
          : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
      }`}
    />
    {error && (
      <span className="mt-0.5 text-[9px] text-rose-500 font-medium">
        {error}
      </span>
    )}
  </div>
);

const INITIAL_ITEM_STATE = {
  itemName: "",
  category: "",
  subcategory: "",
  unit: "",
  description: "",
};

const ROWS_PER_PAGE = 7;

const Item = () => {
  const [itemJson, setItemJson] = useState(INITIAL_ITEM_STATE);
  const [itemsList, setItemsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategory] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  // 1. Categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : (data?.data ?? []));
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  };

  // 1.5 SubCategories
  const fetchSubCategories = async () => {
    try {
      const res = await getTypes();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setSubCategory(list);
    } catch (err) {
      console.error("SubCategory fetch error :", err);
    }
  };

  // 2. Get Items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setApiError("");
      const data = await itemService.getAlls();
      setItemsList(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(
        err.response?.data?.message || err.message || "Failed to load items",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Text Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemJson((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Category Change
  const handleCategoryChange = (selectedVal) => {
    const matched = categories.find(
      (c) => String(c.categoryId || c.CategoryID) === String(selectedVal),
    );
    const catName =
      matched?.categoryName || matched?.CategoryName || selectedVal;

    setItemJson((prev) => ({ ...prev, category: catName }));
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  // SubCategory Change (Direct Name selection)
  const handleSubCategoryChange = (e) => {
    const { value } = e.target;
    setItemJson((prev) => ({ ...prev, subcategory: value }));
    setErrors((prev) => ({ ...prev, subcategory: "" }));
  };

  // Validation
  const validate = () => {
    const err = {};
    if (!itemJson.itemName.trim()) err.itemName = "Item Name required";
    if (!itemJson.category.trim()) err.category = "Select Category";
    if (!itemJson.unit.trim()) err.unit = "Unit required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // POST Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setApiError("");

      const matchedCategory = categories.find(
        (c) =>
          String(c.categoryId || c.CategoryID) === String(itemJson.category) ||
          String(c.categoryId || c.CategoryID) ===
            String(selectedCategoryValue),
      );
      const catName =
        matchedCategory?.categoryName ||
        matchedCategory?.CategoryName ||
        itemJson.category;

      const payload = {
        itemName: itemJson.itemName.trim(),
        category: catName.trim(),
        subcategory: itemJson.subcategory.trim(),
        unit: itemJson.unit.trim(),
        description: itemJson.description.trim(),
      };

      await itemService.create(payload);

      await fetchItems();
      setItemJson(INITIAL_ITEM_STATE);
      setErrors({});
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to save item";
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Search Filter
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return itemsList;
    return itemsList.filter(
      (item) =>
        (item.ItemName || item.itemName)?.toLowerCase().includes(q) ||
        (item.Category || item.category)?.toLowerCase().includes(q) ||
        (item.SubCategory || item.subcategory)?.toLowerCase().includes(q) ||
        (item.Description || item.description)?.toLowerCase().includes(q),
    );
  }, [itemsList, search]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ROWS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredItems.slice(start, start + ROWS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Table Headers
  const headers = [
    "S.No",
    "Item Name",
    "Category",
    "Sub Category",
    "Unit",
    "Description",
  ];

  const selectedCategoryValue = useMemo(() => {
    const matched = categories.find(
      (c) =>
        (c.categoryName || c.CategoryName)?.toLowerCase() ===
        itemJson.category?.toLowerCase(),
    );
    return matched?.categoryId || matched?.CategoryID || itemJson.category;
  }, [categories, itemJson.category]);

  return (
    <div className="h-screen flex flex-col p-3 bg-slate-50 overflow-hidden text-[11px]">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-bold text-slate-800">Item Management</h1>
        <span className="text-[10px] text-slate-500">
          Total Items: {filteredItems.length}
        </span>
      </div>

      {/* ERROR BANNER */}
      {apiError && (
        <div className="mb-2 rounded border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 flex items-center justify-between">
          <span>{apiError}</span>
          <button
            onClick={() => setApiError("")}
            className="text-rose-500 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* CREATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-white p-2.5 rounded-lg shadow-xs border border-slate-200 mb-2 items-end"
      >
        <InputField
          label="Item Name"
          name="itemName"
          placeholder="Dell Latitude 5420 Laptop"
          value={itemJson.itemName}
          onChange={handleChange}
          error={errors.itemName}
        />

        {/* CATEGORY */}
        <div className="flex flex-col">
          <Dropdown
            categories={categories}
            value={selectedCategoryValue}
            onChange={handleCategoryChange}
          />
          {errors.category && (
            <span className="mt-0.5 text-[9px] text-rose-500 font-medium">
              {errors.category}
            </span>
          )}
        </div>

        {/* SUBCATEGORY (Dropdown open with SubCategory Name) */}
        <div className="flex flex-col">
          <label className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Sub Category
          </label>
          <select
            name="subcategory"
            value={itemJson.subcategory}
            onChange={handleSubCategoryChange}
            className={`rounded border px-2 py-1 text-[11px] text-slate-900 bg-white shadow-xs focus:outline-none focus:ring-1 ${
              errors.subcategory
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400"
                : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
            }`}
          >
            <option value="">Select Sub Category</option>
            {subcategories.map((sub, idx) => {
              const name =
                sub.TypeName || sub.typeName || sub.name || sub.SubCategoryName;
              const id = sub.TypeID || sub.typeId || sub.id || idx;
              return (
                <option key={id} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
          {errors.subcategory && (
            <span className="mt-0.5 text-[9px] text-rose-500 font-medium">
              {errors.subcategory}
            </span>
          )}
        </div>

        <InputField
          label="Unit"
          name="unit"
          placeholder="Pcs"
          value={itemJson.unit}
          onChange={handleChange}
          error={errors.unit}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="16GB RAM, 512GB SSD..."
          value={itemJson.description}
          onChange={handleChange}
          error={errors.description}
        />

        <div className="col-span-2 md:col-span-5 flex items-center justify-end gap-1.5 pt-0.5">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={saving}
            className="!py-1 !px-3 !text-xs"
          >
            Add Item
          </Button>
        </div>
      </form>

      {/* SEARCH BAR */}
      <div className="mb-2 max-w-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items, category..."
          className="w-full rounded border border-slate-300 bg-white py-1 px-2 text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {/* TABLE */}
      <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-auto bg-white rounded-t-lg border border-slate-200">
          <Table
            headers={headers}
            count={filteredItems.length}
            emptyMessage="No items found"
          >
            {loading ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-6 text-slate-400 text-xs"
                >
                  Loading items...
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, idx) => (
                <tr
                  key={item.ItemID || item.id || idx}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-1 px-2.5 text-slate-500 font-medium text-center w-12 text-[11px]">
                    {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                  </td>
                  <td className="py-1 px-2.5 font-medium text-slate-800 text-[11px]">
                    {item.ItemName || item.itemName}
                  </td>
                  <td className="py-1 px-2.5 text-slate-700 text-[11px]">
                    {item.Category || item.category}
                  </td>
                  <td className="py-1 px-2.5 text-slate-700 text-[11px]">
                    {item.SubCategory ||
                      item.subcategory ||
                      item.TypeName ||
                      "-"}
                  </td>
                  <td className="py-1 px-2.5 text-slate-700 text-[11px]">
                    {item.Unit || item.unit}
                  </td>
                  <td className="py-1 px-2.5 text-slate-500 truncate max-w-[250px] text-[11px]">
                    {item.Description || item.description || "-"}
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Item;
