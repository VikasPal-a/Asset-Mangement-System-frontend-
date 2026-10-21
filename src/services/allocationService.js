import { apiUrl } from "./api";

export const allocationService = {
  // 1. Get All Allocations
  async getAllocations() {
    try {
      const response = await apiUrl.get("/allocations");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching allocations:", error);
      throw error;
    }
  },

  // 2. Allocate New Asset
  async createAllocation(data) {
    try {
      console.log("CREATE ALLOCATION PAYLOAD:", data);

      const response = await apiUrl.post("/allocations/assign", data);

      return response.data;
    } catch (error) {
      console.error("Allocation payload:", data);
      console.error("Backend error:", error.response?.data);
      throw error;
    }
  },

  // 3. Return Asset
  async returnAsset(allocationId, remarksData = {}) {
    try {
      const response = await apiUrl.put(
        `/allocations/return/${allocationId}`,
        remarksData,
      );

      return response.data;
    } catch (error) {
      console.error("Error returning asset:", error);
      throw error;
    }
  },

  // 4. Get Allocation History by Asset ID
  // Fetch asset history from backend
  getAssetHistory: async (assetId) => {
    // Apne API instance ka naam yahan lagana (jaise axios ya apiUrl)
    const response = await apiUrl.get(`/allocations/history/${assetId}`);
    return response.data;
  },
};
