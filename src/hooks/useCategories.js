import { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  getTypes,
  updateType,
  deleteType,
} from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // GET Categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getCategories();

      const list = Array.isArray(res)
        ? res
        : res?.categories || res?.data || [];

      setCategories(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET Types
  const fetchTypes = useCallback(async () => {
    try {
      const res = await getTypes();

      const list = Array.isArray(res) ? res : res?.data || res?.types || [];

      setTypes(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  // PUT - Update Type
  const handleUpdateType = async (id, typeData) => {
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const response = await updateType(id, typeData);

      setSuccess("Type updated successfully");
      await fetchTypes();

      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Delete Type
  const handleDeleteType = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const response = await deleteType(id);

      setSuccess("Type deleted successfully");
      await fetchTypes();

      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, [fetchCategories, fetchTypes]);

  return {
    categories,
    types,
    loading,
    error,
    success,
    refetchCategories: fetchCategories,
    refetchTypes: fetchTypes,
    handleUpdateType,
    handleDeleteType,
  };
};
