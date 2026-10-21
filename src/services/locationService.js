// src/services/locationService.js
import { apiUrl } from "./api";

const BASE = "/locations";

// ---------- GET ALL ----------
export const getLocations = async () => {
  const res = await apiUrl.get(BASE);

  // 🔍 Debug
  console.log("Locations API response:", res.data);

  // Backend shape: { success: true, data: [...] }
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;

  console.warn("Unexpected response shape:", res.data);
  return [];
};

// ---------- CREATE (POST) ----------
export const createLocation = async (payload) => {
  const res = await apiUrl.post(BASE, payload);
  return res.data;
};
