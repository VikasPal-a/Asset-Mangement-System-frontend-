import { apiUrl } from "./api";

/**
 * Get top dashboard metrics
 * GET /api/reports/dashboard-metrics
 */
const getDashboardMetrics = async () => {
  const response = await apiUrl.get("/reports/dashboard-metrics");
  return response.data;
};

/**
 * Get vendor-wise purchase summary
 * GET /api/reports/vendor-purchases
 */
const getVendorPurchaseSummary = async () => {
  const response = await apiUrl.get("/reports/vendor-purchases");
  return response.data;
};

/**
 * Get location-wise asset stock summary
 * GET /api/reports/location-stock
 */
const getLocationStockSummary = async () => {
  const response = await apiUrl.get("/reports/location-stock");
  return response.data;
};

/**
 * Get asset status summary
 * GET /api/reports/asset-status
 */
const getAssetStatusSummary = async () => {
  const response = await apiUrl.get("/reports/asset-status");
  return response.data;
};

/**
 * Get assets of a particular location
 * Example:
 * GET /api/locations/3/assets
 */
const getLocationAssets = async (locationId) => {
  if (!locationId) {
    return {
      success: true,
      totalAssets: 0,
      data: [],
    };
  }

  const response = await apiUrl.get(`/locations/${locationId}/assets`);
  return response.data;
};

const reportService = {
  getDashboardMetrics,
  getVendorPurchaseSummary,
  getLocationStockSummary,
  getAssetStatusSummary,
  getLocationAssets,
};

export default reportService;
