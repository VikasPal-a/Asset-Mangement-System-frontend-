import { useState, useEffect, useCallback } from "react";
import { allocationService } from "../services/allocationService";

export const useAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Made this async to wait for the API response
  const fetchAllocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await allocationService.getAllocations();
      // Ensure we only set an array
      setAllocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error in useAllocations hook:", error);
      setAllocations([]); // Crash se bachane ke liye khali array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  // 2. Added async/await here as well
  const assignAsset = async (data) => {
    try {
      await allocationService.createAllocation(data);
      await fetchAllocations(); // Naya data aane ke baad list update karo
    } catch (error) {
      console.error("Failed to assign asset:", error);
    }
  };

  // 3. Added async/await for return logic
  const returnAsset = async (allocationId, assetTag) => {
    try {
      await allocationService.returnAsset(allocationId, assetTag);
      await fetchAllocations(); // Return hone ke baad list update karo
    } catch (error) {
      console.error("Failed to return asset:", error);
    }
  };

  return {
    allocations,

    loading,

    assignAsset,
    returnAsset,
    refetch: fetchAllocations,
  };
};
