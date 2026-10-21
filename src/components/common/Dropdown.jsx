import React from "react";

export const Dropdown = ({ categories = [], value = "", onChange }) => {
  return (
    <div className="flex w-full flex-col">
      <label className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        Category
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-900 shadow-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
};
