import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  MapPin,
  Activity,
  Search,
  RefreshCw,
  Eye,
} from "lucide-react";

import reportService from "../../services/reportService";

export default function ReportSummary() {
  const [dashboard, setDashboard] = useState(null);
  const [vendorPurchases, setVendorPurchases] = useState([]);
  const [locationStock, setLocationStock] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);

  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [locationAssets, setLocationAssets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        dashboardResponse,
        vendorResponse,
        locationResponse,
        statusResponse,
      ] = await Promise.all([
        reportService.getDashboardMetrics(),
        reportService.getVendorPurchaseSummary(),
        reportService.getLocationStockSummary(),
        reportService.getAssetStatusSummary(),
      ]);

      setDashboard(dashboardResponse?.data || dashboardResponse);
      setVendorPurchases(vendorResponse?.data || vendorResponse?.vendors || []);
      setLocationStock(
        locationResponse?.data || locationResponse?.locations || [],
      );
      setAssetStatus(statusResponse?.data || statusResponse?.statuses || []);
    } catch (err) {
      console.error("Report API Error:", err);
      setError(err?.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = async (locationId) => {
    setSelectedLocationId(locationId);

    if (!locationId) {
      setLocationAssets([]);
      return;
    }

    try {
      setLocationLoading(true);

      const response = await reportService.getLocationAssets(locationId);

      setLocationAssets(response?.data || []);
    } catch (err) {
      console.error("Location Asset Error:", err);

      setLocationAssets([]);
    } finally {
      setLocationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Reports</h1>

          <p className="text-sm text-gray-500 mt-1">
            View asset, purchase, location and status reports
          </p>
        </div>

        <button
          onClick={loadReports}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* DASHBOARD METRICS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Assets"
          value={dashboard?.totalAssets ?? dashboard?.TotalAssets ?? 0}
          icon={Package}
        />

        <MetricCard
          title="Total Purchases"
          value={dashboard?.totalPurchases ?? dashboard?.TotalPurchases ?? 0}
          icon={ShoppingCart}
        />

        <MetricCard
          title="Total Locations"
          value={dashboard?.totalLocations ?? dashboard?.TotalLocations ?? 0}
          icon={MapPin}
        />

        <MetricCard
          title="Active Assets"
          value={dashboard?.activeAssets ?? dashboard?.ActiveAssets ?? 0}
          icon={Activity}
        />
      </div>

      {/* VENDOR PURCHASE REPORT */}

      <ReportCard
        title="Vendor-wise Purchase Report"
        subtitle="Asset purchases grouped by vendor"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold">#</th>

                <th className="text-left px-5 py-3 font-semibold">Vendor</th>

                <th className="text-right px-5 py-3 font-semibold">
                  Total Assets
                </th>

                <th className="text-right px-5 py-3 font-semibold">
                  Total Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {vendorPurchases.length > 0 ? (
                vendorPurchases.map((vendor, index) => (
                  <tr
                    key={vendor.VendorID || vendor.vendorId || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-5 py-3">{index + 1}</td>

                    <td className="px-5 py-3 font-medium">
                      {vendor.VendorName ||
                        vendor.vendorName ||
                        vendor.Name ||
                        "-"}
                    </td>

                    <td className="px-5 py-3 text-right">
                      {vendor.TotalAssets ??
                        vendor.totalAssets ??
                        vendor.AssetCount ??
                        0}
                    </td>

                    <td className="px-5 py-3 text-right font-medium">
                      ₹
                      {Number(
                        vendor.TotalAmount ??
                          vendor.totalAmount ??
                          vendor.PurchaseAmount ??
                          0,
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={4} />
              )}
            </tbody>
          </table>
        </div>
      </ReportCard>

      {/* LOCATION STOCK REPORT */}

      <ReportCard
        title="Location-wise Asset Stock"
        subtitle="Assets available at each location"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold">#</th>

                <th className="text-left px-5 py-3 font-semibold">Location</th>

                <th className="text-right px-5 py-3 font-semibold">
                  Total Assets
                </th>

                <th className="text-right px-5 py-3 font-semibold">
                  Available
                </th>

                <th className="text-right px-5 py-3 font-semibold">
                  Allocated
                </th>
              </tr>
            </thead>

            <tbody>
              {locationStock.length > 0 ? (
                locationStock.map((location, index) => (
                  <tr
                    key={location.LocationID || location.locationId || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-5 py-3">{index + 1}</td>

                    <td className="px-5 py-3 font-medium">
                      {location.LocationName ||
                        location.locationName ||
                        location.Name ||
                        "-"}
                    </td>

                    <td className="px-5 py-3 text-right">
                      {location.TotalAssets ?? location.totalAssets ?? 0}
                    </td>

                    <td className="px-5 py-3 text-right">
                      {location.Available ??
                        location.available ??
                        location.InStock ??
                        0}
                    </td>

                    <td className="px-5 py-3 text-right">
                      {location.Allocated ?? location.allocated ?? 0}
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={5} />
              )}
            </tbody>
          </table>
        </div>
      </ReportCard>

      {/* ASSET STATUS REPORT */}

      <ReportCard
        title="Asset Status Report"
        subtitle="Asset count according to current status"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold">#</th>

                <th className="text-left px-5 py-3 font-semibold">Status</th>

                <th className="text-right px-5 py-3 font-semibold">
                  Asset Count
                </th>
              </tr>
            </thead>

            <tbody>
              {assetStatus.length > 0 ? (
                assetStatus.map((status, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-5 py-3">{index + 1}</td>

                    <td className="px-5 py-3">
                      <StatusBadge
                        status={
                          status.StatusName ||
                          status.statusName ||
                          status.Status ||
                          status.status ||
                          "-"
                        }
                      />
                    </td>

                    <td className="px-5 py-3 text-right font-semibold">
                      {status.TotalAssets ??
                        status.totalAssets ??
                        status.AssetCount ??
                        status.assetCount ??
                        0}
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={3} />
              )}
            </tbody>
          </table>
        </div>
      </ReportCard>

      {/* LOCATION ASSET DETAIL */}

      <ReportCard
        title="Location Asset Details"
        subtitle="View assets belonging to a selected location"
      >
        {/* LOCATION SELECT */}

        <div className="p-5 border-b bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Location
          </label>

          <select
            value={selectedLocationId}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Location</option>

            {locationStock.map((location, index) => (
              <option
                key={location.LocationID || location.locationId || index}
                value={location.LocationID || location.locationId}
              >
                {location.LocationName ||
                  location.locationName ||
                  location.Name}
              </option>
            ))}
          </select>
        </div>

        {/* ASSET TABLE */}

        {locationLoading ? (
          <div className="p-8 text-center text-gray-500">Loading assets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold">#</th>

                  <th className="text-left px-5 py-3 font-semibold">
                    Asset Code
                  </th>

                  <th className="text-left px-5 py-3 font-semibold">
                    Asset Name
                  </th>

                  <th className="text-left px-5 py-3 font-semibold">
                    Category
                  </th>

                  <th className="text-left px-5 py-3 font-semibold">Status</th>

                  <th className="text-left px-5 py-3 font-semibold">
                    Serial Number
                  </th>

                  <th className="text-center px-5 py-3 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {locationAssets.length > 0 ? (
                  locationAssets.map((asset, index) => (
                    <tr
                      key={asset.AssetID || asset.assetId || index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-5 py-3">{index + 1}</td>

                      <td className="px-5 py-3 font-medium">
                        {asset.AssetCode || asset.assetCode || "-"}
                      </td>

                      <td className="px-5 py-3">
                        {asset.AssetName ||
                          asset.assetName ||
                          asset.Name ||
                          "-"}
                      </td>

                      <td className="px-5 py-3">
                        {asset.CategoryName || asset.categoryName || "-"}
                      </td>

                      <td className="px-5 py-3">
                        <StatusBadge
                          status={
                            asset.StatusName ||
                            asset.statusName ||
                            asset.Status ||
                            asset.status ||
                            "-"
                          }
                        />
                      </td>

                      <td className="px-5 py-3">
                        {asset.SerialNumber || asset.serialNumber || "-"}
                      </td>

                      <td className="px-5 py-3 text-center">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100"
                          title="View Asset"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={7} />
                )}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
    </div>
  );
}

/* =========================
   METRIC CARD
========================= */

function MetricCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">{value}</h2>
        </div>

        <div className="p-3 bg-gray-100 rounded-lg">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );
}

/* =========================
   REPORT CARD
========================= */

function ReportCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({ status }) {
  const value = String(status).toUpperCase();

  let classes = "bg-gray-100 text-gray-700";

  if (
    value.includes("ACTIVE") ||
    value.includes("AVAILABLE") ||
    value.includes("IN STOCK")
  ) {
    classes = "bg-green-100 text-green-700";
  }

  if (value.includes("ALLOCATED") || value.includes("ASSIGNED")) {
    classes = "bg-blue-100 text-blue-700";
  }

  if (value.includes("MAINTENANCE") || value.includes("PENDING")) {
    classes = "bg-yellow-100 text-yellow-700";
  }

  if (value.includes("INACTIVE") || value.includes("DAMAGED")) {
    classes = "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
}

/* =========================
   EMPTY ROW
========================= */

function EmptyRow({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-gray-500">
        No report data found
      </td>
    </tr>
  );
}
