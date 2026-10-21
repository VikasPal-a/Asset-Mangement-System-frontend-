import React, { useState, useMemo, useEffect } from "react";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { Pagination } from "../../components/common/Pagination";
import { SearchBar } from "../../components/common/SearchBar";
import { getLocations, createLocation } from "../../services/locationService";

const INITIAL_FORM = {
  locationName: "",
  mobileNo: "",
  address: "",
  locationType: "Warehouse",
  status: "Active",
};

const LOCATION_TYPES = ["Warehouse", "WholeSale", "Retail", "Office"];
const STATUS_OPTIONS = ["Active", "InActive"];
const ROWS_PER_PAGE = 6;

const Location = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [locations, setLocations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------- Fetch ----------
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getLocations();

      // 🔄 Backend → Frontend mapping
      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
        id: item.LocationID ?? item.id ?? item._id,
        locationName: item.LocationName ?? item.locationName ?? "",
        mobileNo: item.MobileNo ?? item.mobileNo ?? "",
        address: item.Address ?? item.address ?? "",
        locationType:
          item.location_type ?? item.locationType ?? item.LocationType ?? "",
        status: item.status ?? item.Status ?? "Active",
      }));

      setLocations(mapped);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // ---------- Input Change ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---------- Validation ----------
  const validate = () => {
    const err = {};
    if (!formData.locationName.trim()) err.locationName = "Required";
    if (!/^\d{10}$/.test(formData.mobileNo)) err.mobileNo = "10-digit";
    if (!formData.address.trim()) err.address = "Required";
    if (!formData.locationType) err.locationType = "Required";
    if (!formData.status) err.status = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (editId !== null) {
        await updateLocation(editId, formData);
      } else {
        await createLocation(formData);
      }
      setFormData(INITIAL_FORM);
      setEditId(null);
      await fetchLocations();
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Edit ----------
  const handleEdit = (location) => {
    setFormData({
      locationName: location.locationName || "",
      mobileNo: location.mobileNo || "",
      address: location.address || "",
      locationType: location.locationType || "Warehouse",
      status: location.status || "Active",
    });
    setEditId(location.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    try {
      await deleteLocation(id);
      if (editId === id) {
        setFormData(INITIAL_FORM);
        setEditId(null);
      }
      await fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("Failed to delete location");
    }
  };

  // ---------- Cancel ----------
  const handleCancel = () => {
    setFormData(INITIAL_FORM);
    setEditId(null);
    setErrors({});
  };

  // ---------- Filter ----------
  const filteredLocations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(
      (l) =>
        l.locationName?.toLowerCase().includes(q) ||
        l.mobileNo?.toLowerCase().includes(q) ||
        l.address?.toLowerCase().includes(q),
    );
  }, [locations, search]);

  // ---------- Pagination ----------
  const totalPages = Math.ceil(filteredLocations.length / ROWS_PER_PAGE) || 1;
  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredLocations.slice(start, start + ROWS_PER_PAGE);
  }, [filteredLocations, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const headers = [
    "Location Name",
    "Mobile No",
    "Address",
    "Location Type",
    "Status",
    "Action",
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-base font-bold text-slate-800 mb-3">
        {editId !== null ? "Update Location" : "Location Creation"}
      </h1>

      {/* ---------- FORM ---------- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4"
      >
        <InputField
          label="Location Name"
          name="locationName"
          value={formData.locationName}
          onChange={handleChange}
          error={errors.locationName}
        />
        <InputField
          label="Mobile No"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          error={errors.mobileNo}
        />
        <SelectField
          label="Location Type"
          name="locationType"
          value={formData.locationType}
          onChange={handleChange}
          options={LOCATION_TYPES}
          error={errors.locationType}
        />
        <SelectField
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
          error={errors.status}
        />
        <div className="md:col-span-4">
          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />
        </div>

        <div className="md:col-span-4 flex items-center justify-end gap-2 pt-1">
          <Button type="submit" variant="primary" size="sm" isLoading={saving}>
            {editId !== null ? "Update" : "Add"}
          </Button>
          {editId !== null && (
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* ---------- SEARCH ---------- */}
      <div className="mb-3 max-w-xs">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, mobile, address..."
        />
      </div>

      {/* ---------- TABLE ---------- */}
      {loading ? (
        <div className="py-10 text-center text-xs text-slate-500">
          Loading locations...
        </div>
      ) : (
        <Table
          headers={headers}
          count={filteredLocations.length}
          emptyMessage="No locations found"
        >
          {paginatedLocations.map((l) => (
            <tr key={l.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-2 px-3 text-slate-800">{l.locationName}</td>
              <td className="py-2 px-3 text-slate-800">{l.mobileNo}</td>
              <td className="py-2 px-3 text-slate-800 truncate max-w-[220px]">
                {l.address}
              </td>
              <td className="py-2 px-3 text-slate-800">{l.locationType}</td>
              <td className="py-2 px-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    l.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {l.status}
                </span>
              </td>
              <td className="py-2 px-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(l)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(l.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* ---------- PAGINATION ---------- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

// ---------- Reusable Input ----------
const InputField = ({ label, name, value, onChange, error, type = "text" }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-[10px] font-medium text-slate-600 uppercase tracking-wide">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded border px-2 py-1.5 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${
        error
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400"
          : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
      }`}
    />
    {error && <span className="mt-0.5 text-[10px] text-rose-500">{error}</span>}
  </div>
);

// ---------- Reusable Select ----------
const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-[10px] font-medium text-slate-600 uppercase tracking-wide">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded border px-2 py-1.5 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${
        error
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400"
          : "border-slate-300 focus:border-sky-500 focus:ring-sky-500"
      }`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <span className="mt-0.5 text-[10px] text-rose-500">{error}</span>}
  </div>
);

export default Location;
