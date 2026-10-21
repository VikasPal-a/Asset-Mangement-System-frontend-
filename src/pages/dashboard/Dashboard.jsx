import React, { useState, useEffect, useMemo } from "react";

import { useAssets } from "../../hooks/useAssets";
import { useAllocations } from "../../hooks/useAllocations";
import { useCategories } from "../../hooks/useCategories";

import reportService from "../../services/reportService";

import { DashboardStats } from "../../components/dashboard/DashboardStats";

import { RefreshCw, TrendingUp, BarChart3, PieChart } from "lucide-react";

export const Dashboard = () => {
  const { assets = [] } = useAssets();
  const { assignAsset } = useAllocations();
  const { categories } = useCategories();

  const [dashboardMetrics, setDashboardMetrics] = useState({
    TotalActiveAssets: 0,
    TotalLocations: 0,
    TotalVendors: 0,
    TotalExpenditure: 0,
  });

  const [reportMetrics, setReportMetrics] = useState({
    TotalActiveAssets: 0,
    TotalLocations: 0,
    TotalVendors: 0,
    TotalExpenditure: 0,
  });

  const [reportAssetStatus, setReportAssetStatus] = useState([]);
  const [vendorPurchases, setVendorPurchases] = useState([]);
  const [locationStock, setLocationStock] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // REPORT SERVICE DATA
  // ==========================================

  const fetchReports = async () => {
    try {
      setLoading(true);

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

      if (dashboardResponse?.success) {
        const metrics = dashboardResponse?.data || {
          TotalActiveAssets: 0,
          TotalLocations: 0,
          TotalVendors: 0,
          TotalExpenditure: 0,
        };
        setDashboardMetrics(metrics);
        setReportMetrics(metrics);
      }

      if (vendorResponse?.success) {
        setVendorPurchases(vendorResponse?.data || []);
      }

      if (locationResponse?.success) {
        setLocationStock(locationResponse?.data || []);
      }

      if (statusResponse?.success) {
        const statusData = statusResponse?.data || [];
        setAssetStatus(statusData);
        setReportAssetStatus(statusData);
      }
    } catch (err) {
      console.error("Reports fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // STATUS COUNTS
  // ==========================================

  const getAssetCount = (statusName) => {
    return (assets || []).filter((asset) => {
      const status = String(asset.status || asset.Status || "")
        .toLowerCase()
        .trim();
      return status === statusName.toLowerCase();
    }).length;
  };

  const getReportStatusCount = (statusName) => {
    const statusData = reportAssetStatus.find((item) => {
      const status = String(item.Status || "")
        .toLowerCase()
        .trim();
      return status === statusName.toLowerCase();
    });
    return Number(statusData?.Count || 0);
  };

  const totalAssets = assets?.length || 0;
  const InStockCount = getAssetCount("InStock");
  const assignedCount = getAssetCount("assigned");

  const reportInStock = getReportStatusCount("InStock");
  const reportAssigned = getReportStatusCount("assigned");
  const reportMaintenance = getReportStatusCount("maintenance");

  const stats = {
    total: totalAssets,
    InStock: InStockCount,
    assigned: assignedCount,
    maintenance: totalAssets - (InStockCount + assignedCount),
    categories: categories?.length || 0,
    reportTotalAssets: Number(reportMetrics.TotalActiveAssets || 0),
    locations: Number(reportMetrics.TotalLocations || 0),
    vendors: Number(reportMetrics.TotalVendors || 0),
    expenditure: Number(reportMetrics.TotalExpenditure || 0),
    reportInStock,
    reportAssigned,
    reportMaintenance,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const assetStatusTotal = useMemo(() => {
    return assetStatus.reduce(
      (total, item) => total + Number(item.Count || 0),
      0,
    );
  }, [assetStatus]);

  const maxLocationAssets = useMemo(() => {
    if (!locationStock.length) return 1;
    return Math.max(
      ...locationStock.map((item) => Number(item.TotalAssets || 0)),
    );
  }, [locationStock]);

  const maxVendorSpending = useMemo(() => {
    if (!vendorPurchases.length) return 1;
    return Math.max(
      ...vendorPurchases.map((item) => Number(item.TotalSpent || 0)),
    );
  }, [vendorPurchases]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="w-7 h-7 animate-spin text-blue-600" />
          <p className="text-xs text-gray-500 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col p-3 overflow-hidden box-border gap-2.5">
      {/* 1. TOP HEADER: DASHBOARD AT VERY TOP */}
      <div className="flex items-center justify-between shrink-0 px-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
            Dashboard
          </h1>
          <p className="text-[11px] text-gray-500 mt-1">
            Real-time operational inventory & hardware metrics
          </p>
        </div>

        <button
          onClick={fetchReports}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-100 shadow-xs transition"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* 2. ALL 9 CARDS IN PERFECT 3x3 GRID (IDENTICAL SIZE, FONT & ICONS) */}
      <div className="shrink-0 w-full">
        <DashboardStats
          stats={stats}
          metrics={dashboardMetrics}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* 3. CHARTS & ANALYTICS (FILLS REMAINING SCREEN WITHOUT OVERFLOW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 flex-1 min-h-0">
        {/* ASSET STATUS */}
        <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-xs flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <h3 className="text-xs font-semibold text-gray-900">
              Asset Status
            </h3>
            <PieChart className="w-3.5 h-3.5 text-blue-600" />
          </div>

          <div className="flex-1 min-h-0 flex items-center gap-3">
            <div
              className="relative w-24 h-24 rounded-full shrink-0 mx-auto"
              style={{
                background: createDonutGradient(assetStatus, assetStatusTotal),
              }}
            >
              <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-gray-900">
                  {assetStatusTotal}
                </span>
                <span className="text-[9px] text-gray-400">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 overflow-hidden">
              {assetStatus.slice(0, 4).map((item, index) => {
                const count = Number(item.Count || 0);
                const pct =
                  assetStatusTotal > 0
                    ? ((count / assetStatusTotal) * 100).toFixed(0)
                    : 0;
                return (
                  <div
                    key={`${item.Status}-${index}`}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: getStatusColor(index) }}
                      />
                      <span className="truncate text-gray-600">
                        {item.Status || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-semibold text-gray-900">
                        {count}
                      </span>
                      <span className="text-[10px] text-gray-400 w-6 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOCATION STOCK */}
        <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-xs flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <h3 className="text-xs font-semibold text-gray-900">
              Location Stock
            </h3>
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
          </div>

          <div className="flex-1 min-h-0 space-y-1.5 flex flex-col justify-center">
            {locationStock.slice(0, 4).map((item, index) => {
              const total = Number(item.TotalAssets || 0);
              const percentage = (total / maxLocationAssets) * 100;
              return (
                <div key={`${item.LocationName}-${index}`}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-gray-600 truncate">
                      {item.LocationName || "Unknown"}
                    </span>
                    <span className="font-semibold text-gray-900">{total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VENDOR ANALYSIS */}
        <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-xs flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <h3 className="text-xs font-semibold text-gray-900">
              Vendor Purchases
            </h3>
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left pb-1 font-medium">Vendor</th>
                  <th className="text-right pb-1 font-medium">Spent</th>
                </tr>
              </thead>
              <tbody>
                {vendorPurchases.slice(0, 4).map((vendor, index) => (
                  <tr
                    key={`${vendor.VendorName}-${index}`}
                    className="border-b border-gray-50"
                  >
                    <td className="py-1 text-gray-800 truncate max-w-[110px]">
                      {vendor.VendorName || "-"}
                    </td>
                    <td className="py-1 text-right font-semibold text-gray-900">
                      {formatCurrency(vendor.TotalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const createDonutGradient = (data, total) => {
  if (!data?.length || total === 0) return "#e5e7eb";

  const colors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#db2777",
  ];

  let currentPercentage = 0;
  const segments = data.map((item, index) => {
    const count = Number(item.Count || 0);
    const percentage = total > 0 ? (count / total) * 100 : 0;
    const start = currentPercentage;
    const end = currentPercentage + percentage;
    currentPercentage = end;
    return `${colors[index % colors.length]} ${start}% ${end}%`;
  });

  return `conic-gradient(${segments.join(", ")})`;
};

const getStatusColor = (index) => {
  const colors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#db2777",
  ];
  return colors[index % colors.length];
};

export default Dashboard;
