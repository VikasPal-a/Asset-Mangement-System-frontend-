import { apiUrl } from "./api";

export const addMaintenanceService = {
  // GET: specific asset ka maintenance
  getMaintenanceByAsset: async (assetId) => {
    const response = await apiUrl.get(`/assets/${assetId}/maintenance`);
    return response.data;
  },

  // POST: Add maintenance with receipt file
  // addMaintenance: async (formData) => {
  //   const response = await apiUrl.post("/maintenance", formData);

  //   return response.data;
  // },

  addMaintenance: async (formData) => {
    const response = await apiUrl.post("/maintenance", formData);

    return response.data;
  },

  // PUT: Update maintenance (File ke sath)
  updateMaintenance: async (maintenanceId, payload) => {
    const response = await apiUrl.put(`/maintenance/${maintenanceId}`, payload);

    return response.data;
  },
};
