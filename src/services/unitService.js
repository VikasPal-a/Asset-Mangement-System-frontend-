import { apiUrl } from "./api"; // { apiUrl } named import use karna hai

const unitService = {
  // 1. Get all assets
  getAllAssets: async () => {
    const response = await apiUrl.get("/assets");
    return response.data;
  },

  // 2. Get movement history (GET: /assets/movement-history)
  getMovementHistory: async () => {
    const response = await apiUrl.get("/assets/movement-history");
    return response.data;
  },

  // 3. Bulk transfer assets (POST: /assets/bulk_transfer)
  bulkTransfer: async (payload) => {
    const response = await apiUrl.post("/assets/bulk-transfer", payload);
    return response.data;
  },
};

export default unitService;
