// src/services/vendorService.js
import { apiUrl } from "./api";

/**
 * GET all vendors
 */
export const getAll = async (params = {}) => {
  const { data } = await apiUrl.get("/vendors", { params });
  return Array.isArray(data) ? data : (data?.data ?? []);
};

/**
 * CREATE vendor
 */
export const create = async (payload) => {
  const body = {
    partyName: payload.partyName?.trim() || "",
    gstNo: payload.gstNo?.trim() || "",
    mobileNo: payload.mobileNo?.trim() || "",
    email: payload.email?.trim() || "",
    address: payload.address?.trim() || "",
    city: payload.city?.trim() || "",
    state: payload.state?.trim() || "",
    zipcode: payload.zipcode?.trim() || "",
  };
  const { data } = await apiUrl.post("/vendors", body);
  return data?.data ?? data;
};

// Object format support agar kisi dusri file me vendorService.getAll() use ho raha ho
export const vendorService = {
  getAll,
  create,
};

export default vendorService;
