import { apiUrl } from "./api"; // ya jahan bhi api.js file hai, uska relative path

// 1. Create Purchase Bill (POST /purchase)
export const createPurchaseBill = async (payload) => {
  const response = await apiUrl.post("/purchase", payload);
  return response.data;
};

// 1. GET /purchase
export const getPurchaseBills = async () => {
  const response = await apiUrl.get("/purchase");
  return response.data;
};

// 2. GET /purchase/:id
export const getPurchaseBillById = async (id) => {
  const response = await apiUrl.get(`/purchase/${id}`);
  return response.data;
};

// // 3. POST /purchase
// export const createPurchaseBill = async (payload) => {
//   const response = await apiUrl.post("/purchase", payload);
//   return response.data;
// };

// 4. PUT /purchase/:id
export const updatePurchaseBill = async (id, payload) => {
  const response = await apiUrl.put(`/purchase/${id}`, payload);
  return response.data;
};

// 5. DELETE /purchase/:id
export const deletePurchaseBill = async (id) => {
  const response = await apiUrl.delete(`/purchase/${id}`);
  return response.data;
};
