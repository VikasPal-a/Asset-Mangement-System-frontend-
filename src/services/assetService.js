import { apiUrl } from "./api";

// 1. GET ALL ASSETS (GET /assets?search=&category=&status=&page=&limit=)
export const getAssets = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  const mappedParams = {
    search: cleanParams.searchTerm || cleanParams.search,
    category: cleanParams.categoryFilter || cleanParams.category,
    status: cleanParams.statusFilter || cleanParams.status,
    page: cleanParams.page || 1,
    limit: cleanParams.pageSize || cleanParams.limit || 10,
  };

  const finalParams = Object.fromEntries(
    Object.entries(mappedParams).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  const response = await apiUrl.get("/assets", { params: finalParams });
  return response.data;
};

// 2. GET ASSET BY ID
export const getAssetById = async (id) => {
  const response = await apiUrl.get(`/assets/${id}`);
  return response.data;
};

// 3. CREATE ASSET (POST /assets)
export const addAsset = async (assetData) => {
  const response = await apiUrl.post("/assets", assetData);
  return response.data;
};

// 4. UPDATE ASSET (PUT /assets/:id)
export const updateAsset = async (id, assetData) => {
  const response = await apiUrl.put(`/assets/${id}`, assetData);
  return response.data;
};

// 5. DELETE ASSET (DELETE /assets/:id)
export const deleteAsset = async (id) => {
  const response = await apiUrl.delete(`/assets/${id}`);
  return response.data;
};
