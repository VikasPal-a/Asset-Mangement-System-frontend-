import React from "react";
import { SearchBar } from "../common/SearchBar";
import { Select } from "../common/Select";
import { ASSET_STATUS } from "../../utils/constants";

export const AssetFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  categories = [],
}) => {
  // ==============================
  // STATUS OPTIONS
  // ==============================

  const statusOptions = [
    {
      label: "All Status",
      value: "",
    },
    {
      label: ASSET_STATUS?.INSTOCK || "InStock",
      value: ASSET_STATUS?.INSTOCK || "InStock",
    },
    {
      label: ASSET_STATUS?.ASSIGNED || "ASSIGNED",
      value: ASSET_STATUS?.ASSIGNED || "ASSIGNED",
    },
    {
      label: ASSET_STATUS?.MAINTENANCE || "MAINTENANCE",
      value: ASSET_STATUS?.MAINTENANCE || "MAINTENANCE",
    },
  ];

  // ==============================
  // CATEGORY OPTIONS
  // ==============================

  // const categoryOptions = [
  //   {
  //     label: "All Categories",
  //     value: "",
  //   },

  //   ...categories.map((category) => ({
  //     key: category.categoryId ?? category.CategoryID,
  //     label: category.categoryName ?? category.CategoryName,
  //     value: String(category.categoryId ?? category.CategoryID),
  //   })),

  // ==============================
  // UI
  // ==============================

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm sm:grid-cols-3">
      {/* SEARCH */}

      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by name or asset tag..."
      />

      {/* CATEGORY */}
      {/* 
      <Select
        placeholder="Filter by Category"
        options={categoryOptions}
        value={categoryFilter}
        onChange={(e) => {
          const categoryId = e.target.value;

          console.log("Selected Category ID:", categoryId);

          onCategoryChange(categoryId);
        }}
      /> */}

      {/* <Select
        placeholder="Filter by Category"
        options={categoryOptions}
        value={categoryFilter}
        onChange={(categoryId) => {
          console.log("Selected Category ID:", categoryId);
          onCategoryChange(categoryId);
        }}
      /> */}

      {/* STATUS */}

      <Select
        placeholder="Filter by Status"
        options={statusOptions}
        value={statusFilter}
        onChange={(e) => {
          onStatusChange(e.target.value);
        }}
      />
    </div>
  );
};
