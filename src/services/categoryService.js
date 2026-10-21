import { apiUrl } from "./api";

// Get all categories
export const getCategories = async () => {
  const response = await apiUrl.get("/categories");

  return response.data.data.map((category) => ({
    categoryId: category.CategoryID,
    categoryName: category.CategoryName,
  }));
};

// Add category
export const addCategory = async (categoryName) => {
  const response = await apiUrl.post("/categories", {
    categoryName: categoryName.trim(),
  });

  return response.data;
};

// Get all types
export const getTypes = async () => {
  const response = await apiUrl.get("/types");

  return response.data;
};

// Add type
// Add type
export const addType = async (typeName, categoryId) => {
  const response = await apiUrl.post("/types", {
    TypeName: typeName.trim(),
    CategoryID: Number(categoryId),
  });

  return response.data;
};

// PUT - Update type
export const updateType = async (id, typeData) => {
  const response = await apiUrl.put(`/types/${id}`, typeData);
  return response.data;
};

// DELETE - Delete type
export const deleteType = async (id) => {
  const response = await apiUrl.delete(`/types/${id}`);
  return response.data;
};
// categoryService.js ke bilkul aakhiri me yeh line paste kar do:
export const categoryService = {
  getCategories,
  addCategory,
  getTypes,
  addType,
  updateType,
  deleteType,
};
export default categoryService;
