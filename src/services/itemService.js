import { apiUrl } from "./api";

// 1. GET ALL ITEMS (Backend: result.recordset -> res.data.data)
export const getAlls = async (params = {}) => {
  const res = await apiUrl.get("/items", { params });
  const resData = res?.data;

  if (Array.isArray(resData?.data)) {
    return resData.data;
  }
  if (Array.isArray(resData)) {
    return resData;
  }
  return [];
};

// 2. CREATE ITEM (Exact Backend Controller match: itemName, category, subcategory, unit, description)
export const create = async (payload) => {
  const body = {
    itemName: String(payload.itemName || payload.ItemName || "").trim(),
    category: String(payload.category || payload.Category || "").trim(),
    subcategory: String(
      payload.subcategory || payload.SubCategory || payload.subCategory || "",
    ).trim(),
    unit: String(payload.unit || payload.Unit || "").trim(),
    description: String(
      payload.description || payload.Description || "",
    ).trim(),
  };

  const res = await apiUrl.post("/items", body);
  return res?.data;
};

export const itemService = {
  getAlls,
  create,
};

export default itemService;
