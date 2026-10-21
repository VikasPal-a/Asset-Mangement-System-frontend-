import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import {
  getAssets as apiGetAssets,
  addAsset as apiAddAsset,
  updateAsset as apiUpdateAsset,
  deleteAsset as apiDeleteAsset,
} from "../services/assetService";

export const useAssets = (pageSize = 10, params = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [assets, setAssets] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGetAssets({
        searchTerm: debouncedSearchTerm,
        categoryFilter,
        statusFilter,
        page,
        pageSize,
        ...params,
      });

      const list = response?.data || (Array.isArray(response) ? response : []);
      setAssets(list);
      setTotalItems(response?.totalRecords ?? list.length);
      setTotalPages(response?.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch assets",
      );
      setAssets([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, categoryFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleCategoryChange = (categoryID) => {
    setCategoryFilter(String(categoryID ?? ""));
    setPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const addAsset = async (assetData) => {
    const res = await apiAddAsset(assetData);
    await fetchAssets();
    return res;
  };

  const editAsset = async (assetId, assetData) => {
    const res = await apiUpdateAsset(assetId, assetData);
    await fetchAssets();
    return res;
  };

  const removeAsset = async (assetId) => {
    const res = await apiDeleteAsset(assetId);
    await fetchAssets();
    return res;
  };

  return {
    assets,
    totalItems,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    refetch: fetchAssets,
    searchTerm,
    categoryFilter,
    statusFilter,
    onSearchChange: handleSearchChange,
    onCategoryChange: handleCategoryChange,
    onStatusChange: handleStatusChange,
    addAsset,
    editAsset,
    removeAsset,
  };
};

export default useAssets;
