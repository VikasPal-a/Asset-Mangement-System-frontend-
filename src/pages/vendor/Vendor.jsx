import React, { useState, useMemo, useEffect } from "react";
import { vendorService } from "../../services/vendorService";

// ============================================================
// REUSABLE BUTTON
// ============================================================
const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-sky-500",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
  };
  const sizes = {
    xs: "text-[10px] px-2 py-0.5 gap-1",
    sm: "text-[11px] px-2.5 py-1 gap-1.5",
    md: "text-xs px-3 py-1.5 gap-1.5",
  };
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// ============================================================
// REUSABLE INPUT
// ============================================================
const InputField = ({ label, name, value, onChange, error, type = "text" }) => (
  <div className="flex flex-col">
    <label className="mb-0.5 text-[10px] font-medium text-slate-600 uppercase tracking-wide">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded border px-2 py-1 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${
        error
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400"
          : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
      }`}
    />
    {error && <span className="mt-0.5 text-[10px] text-rose-500">{error}</span>}
  </div>
);

// ============================================================
// MAIN VENDOR PAGE
// ============================================================
const INITIAL_FORM = {
  PartyName: "",
  GSTNo: "",
  MobileNo: "",
  Email: "",
  Address: "",
  City: "",
  State: "",
  Zipcode: "",
};

const ROWS_PER_PAGE = 6;

const Vendor = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [vendors, setVendors] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // API states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  // ============================================================
  // FETCH ALL VENDORS
  // ============================================================
  const fetchVendors = async () => {
    try {
      setLoading(true);
      setApiError("");
      const data = await vendorService.getAll();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to load vendors";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // ============================================================
  // FORM HANDLERS
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!formData.PartyName.trim()) err.PartyName = "Required";
    if (!formData.GSTNo.trim()) err.GSTNo = "Required";
    if (!/^\d{10}$/.test(formData.MobileNo)) err.MobileNo = "10-digit";
    if (formData.Email && !/\S+@\S+\.\S+/.test(formData.Email))
      err.Email = "Invalid";
    if (!formData.City.trim()) err.City = "Required";
    if (!formData.State.trim()) err.State = "Required";
    if (!/^\d{6}$/.test(formData.Zipcode)) err.Zipcode = "6-digit";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ============================================================
  // SUBMIT (CREATE only)
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setApiError("");

      // Form ke PascalCase fields ko camelCase format me pass kiya jo vendorService maang raha hai
      await vendorService.create({
        partyName: formData.PartyName,
        gstNo: formData.GSTNo,
        mobileNo: formData.MobileNo,
        email: formData.Email,
        address: formData.Address,
        city: formData.City,
        state: formData.State,
        zipcode: formData.Zipcode,
      });

      await fetchVendors();
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to create vendor";
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // FILTER + PAGINATION
  // ============================================================
  const filteredVendors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter(
      (v) =>
        (v.PartyName || v.partyName || "")?.toLowerCase().includes(q) ||
        (v.Email || v.email || "")?.toLowerCase().includes(q) ||
        (v.Address || v.address || "")?.toLowerCase().includes(q),
    );
  }, [vendors, search]);

  const totalPages = Math.ceil(filteredVendors.length / ROWS_PER_PAGE) || 1;
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredVendors.slice(start, start + ROWS_PER_PAGE);
  }, [filteredVendors, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const headers = [
    "Party Name",
    "GST No",
    "Mobile",
    "Email",
    "Address",
    "City",
    "State",
    "Pincode",
  ];

  return (
    <div className="h-screen flex flex-col p-3 bg-slate-50 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-bold text-slate-800">Vendor Creation</h1>
        <span className="text-[10px] text-slate-500">
          Total: {filteredVendors.length}
        </span>
      </div>

      {/* API ERROR BANNER */}
      {apiError && (
        <div className="mb-2 rounded border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] text-rose-700 flex items-center justify-between">
          <span>{apiError}</span>
          <button
            onClick={() => setApiError("")}
            className="text-rose-500 hover:text-rose-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-2"
      >
        <InputField
          label="Party Name"
          name="PartyName"
          value={formData.PartyName}
          onChange={handleChange}
          error={errors.PartyName}
        />
        <InputField
          label="GST No"
          name="GSTNo"
          value={formData.GSTNo}
          onChange={handleChange}
          error={errors.GSTNo}
        />
        <InputField
          label="Mobile"
          name="MobileNo"
          value={formData.MobileNo}
          onChange={handleChange}
          error={errors.MobileNo}
        />
        <InputField
          label="Email"
          name="Email"
          type="email"
          value={formData.Email}
          onChange={handleChange}
          error={errors.Email}
        />
        <InputField
          label="Address"
          name="Address"
          value={formData.Address}
          onChange={handleChange}
          error={errors.Address}
        />
        <InputField
          label="City"
          name="City"
          value={formData.City}
          onChange={handleChange}
          error={errors.City}
        />
        <InputField
          label="State"
          name="State"
          value={formData.State}
          onChange={handleChange}
          error={errors.State}
        />
        <InputField
          label="Pincode"
          name="Zipcode"
          value={formData.Zipcode}
          onChange={handleChange}
          error={errors.Zipcode}
        />

        <div className="col-span-2 md:col-span-4 flex items-center justify-end gap-2 pt-1">
          <Button type="submit" variant="primary" size="sm" isLoading={saving}>
            Add Vendor
          </Button>
        </div>
      </form>

      {/* SEARCH */}
      <div className="mb-2 max-w-xs">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search party, email, address..."
            className="w-full rounded border border-slate-300 bg-white py-1 pl-7 pr-2 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <svg
            className="w-3 h-3 absolute left-2 top-1.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="border-b border-slate-200">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="py-1.5 px-2 text-[9px] font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-8 text-[11px] text-slate-400"
                  >
                    Loading vendors...
                  </td>
                </tr>
              ) : paginatedVendors.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-8 text-[11px] text-slate-400"
                  >
                    No vendors found
                  </td>
                </tr>
              ) : (
                paginatedVendors.map((v, idx) => (
                  <tr
                    key={v.VendorID || v._id || idx}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-1 px-2 text-slate-800 truncate max-w-[120px]">
                      {v.PartyName || v.partyName}
                    </td>
                    <td className="py-1 px-2 text-slate-800">
                      {v.GSTNo || v.gstNo}
                    </td>
                    <td className="py-1 px-2 text-slate-800">
                      {v.MobileNo || v.mobileNo}
                    </td>
                    <td className="py-1 px-2 text-slate-800 truncate max-w-[140px]">
                      {v.Email || v.email}
                    </td>
                    <td className="py-1 px-2 text-slate-800 truncate max-w-[140px]">
                      {v.Address || v.address}
                    </td>
                    <td className="py-1 px-2 text-slate-800">
                      {v.City || v.city}
                    </td>
                    <td className="py-1 px-2 text-slate-800">
                      {v.State || v.state}
                    </td>
                    <td className="py-1 px-2 text-slate-800">
                      {v.Zipcode || v.zipcode}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-200 bg-white">
            <div className="text-[10px] text-slate-500">
              Page {currentPage} / {totalPages}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage <= 1}
                className="px-2 py-0.5 text-[10px] rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ◀ Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= totalPages}
                className="px-2 py-0.5 text-[10px] rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendor;
