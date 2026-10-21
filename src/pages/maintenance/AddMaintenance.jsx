import React, { useEffect, useMemo, useState, useRef } from "react";
import { useMaintenance } from "../../hooks/useMaintenance";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Wrench,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Wrench as WrenchIcon,
  IndianRupee,
  ChevronDown,
  ClipboardList,
} from "lucide-react";

const initialForm = {
  assetId: "",
  maintenanceDate: new Date().toISOString().split("T")[0],
  cost: "",
  description: "",
  receiptPath: "",
  receiptFile: null,
};

// Searchable Dropdown
const SearchableAssetSelect = ({
  assets,
  value,
  onChange,
  placeholder,
  required,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedAsset = assets.find(
    (a) =>
      String(a.AssetID || a.assetID || a.assetId || a.id) === String(value),
  );

  const displayValue = selectedAsset
    ? `${selectedAsset.AssetName || selectedAsset.assetName || "Unknown"} ${
        selectedAsset.AssetTag || selectedAsset.assetTag
          ? `(${selectedAsset.AssetTag || selectedAsset.assetTag})`
          : ""
      }`
    : "";

  const filtered = assets.filter((a) => {
    const n = (a.AssetName || a.assetName || "").toLowerCase();
    const t = (a.AssetTag || a.assetTag || "").toLowerCase();
    const s = search.toLowerCase();

    return n.includes(s) || t.includes(s);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex w-full cursor-text items-center justify-between rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          className="w-full bg-transparent text-xs outline-none"
          placeholder={
            displayValue || placeholder || "Search asset name or tag..."
          }
          value={isOpen ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          required={required && !value}
        />

        <ChevronDown size={14} className="ml-2 shrink-0 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500">
              No assets found
            </div>
          ) : (
            filtered.map((asset, i) => {
              const astId =
                asset.AssetID || asset.assetID || asset.assetId || asset.id;

              const astName =
                asset.AssetName || asset.assetName || `Asset ${i + 1}`;

              const astTag = asset.AssetTag || asset.assetTag || "";

              return (
                <div
                  key={astId}
                  className={`cursor-pointer px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-700 ${
                    String(astId) === String(value)
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-slate-700"
                  }`}
                  onClick={() => {
                    onChange(astId);
                    setSearch("");
                    setIsOpen(false);
                  }}
                >
                  {astName} {astTag ? `(${astTag})` : ""}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export const AddMaintenance = () => {
  const {
    assets,
    records,
    assetStats,
    loading,
    saving,
    error: hookError,
    success: hookSuccess,
    addMaintenance: saveMaintenance,
    updateMaintenance,
    fetchMaintenance,
    clearMessages,
  } = useMaintenance();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [insightAssetId, setInsightAssetId] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeTab, setActiveTab] = useState("add");

  useEffect(() => {
    if (hookError) setError(hookError);
  }, [hookError]);

  useEffect(() => {
    if (hookSuccess) setSuccess(hookSuccess);
  }, [hookSuccess]);

  const getAssetName = (record) => {
    const recordId = String(
      record.AssetID || record.assetId || record.assetID || "",
    );

    const assetMatch = assets.find(
      (a) => String(a.AssetID || a.assetId || a.assetID || a.id) === recordId,
    );

    return (
      record.AssetName ||
      record.assetName ||
      assetMatch?.AssetName ||
      assetMatch?.assetName ||
      "—"
    );
  };

  const getAssetTag = (record) => {
    const recordId = String(
      record.AssetID || record.assetId || record.assetID || "",
    );

    const assetMatch = assets.find(
      (a) => String(a.AssetID || a.assetId || a.assetID || a.id) === recordId,
    );

    return (
      record.AssetTag ||
      record.assetTag ||
      assetMatch?.AssetTag ||
      assetMatch?.assetTag ||
      "—"
    );
  };

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return records;

    return records.filter(
      (record) =>
        getAssetName(record).toLowerCase().includes(query) ||
        getAssetTag(record).toLowerCase().includes(query),
    );
  }, [records, search, assets]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    clearMessages();

    // Validation
    if (!formData.assetId) {
      setError("Please select an asset.");
      alert("❌ Please select an asset.");
      return;
    }

    if (
      formData.cost === "" ||
      !Number.isFinite(Number(formData.cost)) ||
      Number(formData.cost) < 0
    ) {
      setError("Please enter a valid cost.");
      alert("❌ Please enter a valid cost.");
      return;
    }

    if (editingId && typeof updateMaintenance !== "function") {
      setError("Update function is missing.");
      alert("❌ Update function is missing.");
      return;
    }

    if (!editingId && typeof saveMaintenance !== "function") {
      setError("Save function is missing.");
      alert("❌ Save function is missing.");
      return;
    }

    // Confirm action — component mein API payload nahi banega
    const action = editingId ? "update" : "add";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this maintenance record?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      let saved;

      if (editingId) {
        // Hook receives form data and maintenance ID
        saved = await updateMaintenance({
          ...formData,
          maintenanceId: editingId,
        });
      } else {
        // Hook receives form data
        saved = await saveMaintenance(formData);
      }

      if (saved) {
        alert(
          `✅ Maintenance ${editingId ? "updated" : "added"} successfully!`,
        );

        setFormData(initialForm);
        setEditingId(null);
        setCurrentPage(1);

        const fileInput = document.getElementById("receiptFile");

        if (fileInput) {
          fileInput.value = "";
        }

        setActiveTab("records");
      } else {
        alert("❌ Maintenance save/update does not.");
      }
    } catch (err) {
      console.error("❌ Maintenance Save/Update Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to save maintenance record.";

      setError(message);
      alert(`❌ API Error:\n\n${message}`);
    }
  };

  const handleEdit = (record) => {
    const maintenanceId =
      record.MaintenanceID ?? record.maintenanceId ?? record.id;

    if (!maintenanceId) {
      setError("Maintenance ID not found.");
      return;
    }

    setEditingId(maintenanceId);

    setFormData({
      assetId: String(record.AssetID ?? record.assetId ?? record.assetID ?? ""),

      maintenanceDate: record.MaintenanceDate
        ? String(record.MaintenanceDate).slice(0, 10)
        : record.maintenanceDate
          ? String(record.maintenanceDate).slice(0, 10)
          : "",

      cost: String(record.Cost ?? record.cost ?? ""),

      description: record.Description ?? record.description ?? "",

      receiptPath:
        record.ReceiptFilePath ??
        record.receiptFilePath ??
        record.receiptPath ??
        "",

      receiptFile: null,
    });

    setError("");
    setSuccess("");
    clearMessages();

    setActiveTab("add");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (record) => {
    if (window.confirm("Remove this record from the current view?")) {
      fetchMaintenance();
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
    clearMessages();

    const fileInput = document.getElementById("receiptFile");

    if (fileInput) fileInput.value = "";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString("en-IN");
  };

  const getReceiptName = (record) => {
    const path = record.ReceiptFilePath || record.receiptFilePath || "";

    return path ? path.split(/[\\/]/).pop() : "";
  };

  const selectedInsight = insightAssetId ? assetStats[insightAssetId] : null;

  return (
    <div className="min-h-screen w-full min-w-0 bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto w-full min-w-0 max-w-[1400px] space-y-4">
        {/* HEADER */}
        <div className="-mt-8 sm:-mt-10">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700">
              <Wrench size={18} />
            </div>

            <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
              Maintenance Tracker
            </h1>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "add"
                ? "bg-blue-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Plus size={16} />
            Add Maintenance
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("records")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "records"
                ? "bg-blue-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={16} />
            Maintenance Records
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("insights")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "insights"
                ? "bg-blue-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Activity size={16} />
            Asset Health Insights
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-700">
            {success}
          </div>
        )}

        {/* TAB 1: ADD / EDIT MAINTENANCE */}
        {activeTab === "add" && (
          <section className="relative z-20 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Plus size={16} className="text-blue-600" />
                {editingId ? "Edit Maintenance" : "Add Maintenance"}
              </h2>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {/* Asset */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Asset *
                </label>

                <SearchableAssetSelect
                  assets={assets}
                  value={formData.assetId}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      assetId: val,
                    }))
                  }
                  placeholder="Select or search asset..."
                  required={true}
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="maintenanceDate"
                  className="mb-1 block text-xs font-semibold text-slate-700"
                >
                  Date *
                </label>

                <input
                  id="maintenanceDate"
                  name="maintenanceDate"
                  type="date"
                  value={formData.maintenanceDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Cost */}
              <div>
                <label
                  htmlFor="cost"
                  className="mb-1 block text-xs font-semibold text-slate-700"
                >
                  Cost (₹) *
                </label>

                <input
                  id="cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="Enter maintenance cost"
                  required
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-xs font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Details..."
                  className="w-full resize-y rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Receipt */}
              <div className="md:col-span-2">
                <label
                  htmlFor="receiptFile"
                  className="mb-1 block text-xs font-semibold text-slate-700"
                >
                  Receipt File
                </label>

                <input
                  id="receiptFile"
                  name="receiptFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-dashed border-slate-300 p-1.5 text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-blue-50 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-blue-700"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  onClick={() => {
                    console.log("🟢 ADD MAINTENANCE BUTTON CLICKED");
                    console.log("Current formData:", formData);
                    console.log("Saving status:", saving);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={15} />

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Maintenance"
                      : "Add Maintenance"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 2: MAINTENANCE RECORDS */}
        {activeTab === "records" && (
          <section className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* TABLE HEADER + SEARCH */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Maintenance Records
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {filteredRecords.length} records found
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search asset name or tag..."
                  className="w-full rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Loading maintenance records...
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-xs">
                    <thead className="bg-slate-50 uppercase text-slate-500">
                      <tr>
                        <th className="px-3.5 py-2.5">S.No</th>
                        <th className="px-3.5 py-2.5">Asset Tag</th>
                        <th className="px-3.5 py-2.5">Asset Name</th>
                        <th className="px-3.5 py-2.5">Date</th>
                        <th className="px-3.5 py-2.5">Cost</th>
                        <th className="px-3.5 py-2.5">Description</th>
                        <th className="px-3.5 py-2.5">Receipt</th>
                        <th className="px-3.5 py-2.5">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedRecords.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 py-8 text-center text-xs text-slate-500"
                          >
                            No maintenance records found.
                          </td>
                        </tr>
                      ) : (
                        paginatedRecords.map((record, index) => {
                          const receiptName = getReceiptName(record);

                          const receiptPath =
                            record.ReceiptFilePath ||
                            record.receiptFilePath ||
                            "";

                          return (
                            <tr
                              key={
                                record.MaintenanceID ??
                                record.maintenanceId ??
                                index
                              }
                              className="hover:bg-slate-50"
                            >
                              <td className="whitespace-nowrap px-3.5 py-2.5 text-slate-500">
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>

                              <td className="whitespace-nowrap px-3.5 py-2.5 font-medium text-blue-700">
                                {getAssetTag(record)}
                              </td>

                              <td className="px-3.5 py-2.5 font-medium text-slate-700">
                                {getAssetName(record)}
                              </td>

                              <td className="whitespace-nowrap px-3.5 py-2.5 text-slate-600">
                                {formatDate(
                                  record.MaintenanceDate ||
                                    record.maintenanceDate,
                                )}
                              </td>

                              <td className="whitespace-nowrap px-3.5 py-2.5 font-medium text-slate-700">
                                ₹
                                {Number(
                                  record.Cost || record.cost || 0,
                                ).toLocaleString("en-IN")}
                              </td>

                              <td
                                className="max-w-[180px] truncate px-3.5 py-2.5 text-slate-600"
                                title={record.Description || record.description}
                              >
                                {record.Description ||
                                  record.description ||
                                  "—"}
                              </td>

                              <td className="px-3.5 py-2.5">
                                {receiptName ? (
                                  <a
                                    href={`http://192.168.1.17:5000/${receiptPath}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex max-w-[130px] items-center gap-1 truncate text-xs text-blue-700 hover:underline"
                                    title={receiptName}
                                  >
                                    <FileText size={14} />
                                    {receiptName}
                                  </a>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>

                              <td className="px-3.5 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(record)}
                                    title="Edit"
                                    className="rounded-md border border-blue-200 p-1.5 text-blue-700 hover:bg-blue-50"
                                  >
                                    <Pencil size={14} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(record)}
                                    title="Delete"
                                    className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
                  <span className="text-xs text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="rounded-md border p-1.5 disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="rounded-md border p-1.5 disabled:opacity-40"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* TAB 3: ASSET HEALTH INSIGHTS */}
        {activeTab === "insights" && (
          <section className="relative z-10 w-full rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="rounded-t-xl border-b border-slate-100 bg-slate-50/50 px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Activity size={16} className="text-indigo-600" />
                Asset Health Insights
              </h2>
            </div>

            <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-start">
              <div className="w-full sm:max-w-[280px]">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Select Asset to Check Stats
                </label>

                <SearchableAssetSelect
                  assets={assets}
                  value={insightAssetId}
                  onChange={(val) => setInsightAssetId(val)}
                  placeholder="Search asset name or tag..."
                />
              </div>

              {selectedInsight && selectedInsight.totalRepairs > 0 ? (
                <div className="flex flex-1 flex-wrap gap-3">
                  {/* TOTAL REPAIRS */}
                  <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-orange-100 bg-orange-50 p-3 text-center shadow-sm">
                    <WrenchIcon size={18} className="mb-1 text-orange-600" />

                    <p className="text-[11px] font-semibold uppercase text-orange-600">
                      Total Repairs
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-orange-900">
                      {selectedInsight.totalRepairs}
                    </p>
                  </div>

                  {/* TOTAL MAINTENANCE COST */}
                  <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center shadow-sm">
                    <IndianRupee size={18} className="mb-1 text-emerald-600" />

                    <p className="text-[11px] font-semibold uppercase text-emerald-600">
                      Total Maintenance
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-emerald-900">
                      ₹
                      {Number(selectedInsight.totalCost).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
              ) : insightAssetId ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                  No maintenance records found for this asset.
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                  Search & select an asset to view its maintenance metrics.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AddMaintenance;
