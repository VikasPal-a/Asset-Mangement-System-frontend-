// import { useEffect, useState, useCallback } from "react";
// import { addMaintenanceService } from "../services/addMaintenanceService";
// import { getAssets } from "../services/assetService";

// export const useMaintenance = () => {
//   const [assets, setAssets] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [assetStats, setAssetStats] = useState({});

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ==============================
//   // FETCH ASSETS
//   // ==============================
//   const fetchAssets = useCallback(async () => {
//     try {
//       setError("");

//       const response = await getAssets();
//       const data = Array.isArray(response) ? response : response?.data || [];

//       setAssets(data);
//       return data;
//     } catch (err) {
//       console.error("Assets GET error:", err);

//       setError(err.response?.data?.message || "Assets load nahi ho sake.");

//       return [];
//     }
//   }, []);

//   // ==============================
//   // FETCH MAINTENANCE RECORDS
//   // ==============================
//   const fetchMaintenance = useCallback(async (assetList = []) => {
//     try {
//       setLoading(true);
//       setError("");

//       if (!Array.isArray(assetList) || assetList.length === 0) {
//         setRecords([]);
//         setAssetStats({});
//         return [];
//       }

//       const responses = await Promise.all(
//         assetList.map((asset) => {
//           const assetId =
//             asset.AssetID ?? asset.assetID ?? asset.assetId ?? asset.id;

//           if (assetId == null) {
//             return Promise.resolve(null);
//           }

//           return addMaintenanceService.getMaintenanceByAsset(assetId);
//         }),
//       );

//       const newStats = {};

//       const allRecords = responses.flatMap((response) => {
//         if (!response) return [];

//         if (response.assetId != null) {
//           newStats[String(response.assetId)] = {
//             totalRepairs: response.totalRepairs || 0,
//             totalCost: response.totalCost || 0,
//           };
//         }

//         if (Array.isArray(response.history)) {
//           return response.history.map((record) => ({
//             ...record,
//             AssetID: record.AssetID ?? record.assetID ?? response.assetId,
//           }));
//         }

//         if (Array.isArray(response.data)) {
//           return response.data;
//         }

//         if (Array.isArray(response)) {
//           return response;
//         }

//         return [];
//       });

//       allRecords.sort(
//         (a, b) =>
//           new Date(b.MaintenanceDate || b.maintenanceDate) -
//           new Date(a.MaintenanceDate || a.maintenanceDate),
//       );

//       setRecords(allRecords);
//       setAssetStats(newStats);

//       return allRecords;
//     } catch (err) {
//       console.error("Maintenance GET error:", err);

//       setError(
//         err.response?.data?.message || "Maintenance records load nahi ho sake.",
//       );

//       return [];
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ==============================
//   // CREATE MAINTENANCE - JSON
//   // ==============================
//   const addMaintenance = async (formData) => {
//     try {
//       setSaving(true);
//       setError("");
//       setSuccess("");

//       console.log("ADD MAINTENANCE - Received:", formData);

//       const selectedAssetId = Number(formData.assetId);
//       const maintenanceCost = Number(formData.cost);

//       // Validate asset
//       if (!selectedAssetId || !Number.isFinite(selectedAssetId)) {
//         setError("Please select a valid asset.");
//         return false;
//       }

//       // Validate cost
//       if (
//         formData.cost === "" ||
//         formData.cost == null ||
//         !Number.isFinite(maintenanceCost) ||
//         maintenanceCost < 0
//       ) {
//         setError("Please enter a valid maintenance cost.");
//         return false;
//       }

//       // ==========================================
//       // CREATE FORMDATA
//       // ==========================================
//       const payload = new FormData();

//       payload.append("assetId", String(selectedAssetId));
//       payload.append("maintenanceDate", formData.maintenanceDate || "");
//       payload.append("cost", String(maintenanceCost));
//       payload.append("description", formData.description || "");

//       // ==========================================
//       // Receipt File
//       // ==========================================
//       if (formData.receiptFile) {
//         payload.append("receiptFile", formData.receiptFile);
//       }

//       console.log("ADD MAINTENANCE FORMDATA:");

//       for (const [key, value] of payload.entries()) {
//         console.log(key, value instanceof File ? value.name : value);
//       }

//       const response = await addMaintenanceService.addMaintenance(payload);

//       console.log("ADD API response:", response);

//       setSuccess("Maintenance added successfully!");

//       await fetchMaintenance(assets);

//       return true;
//     } catch (err) {
//       console.error("Maintenance POST error:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Maintenance add nahi ho saka.",
//       );

//       return false;
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==============================
//   // UPDATE MAINTENANCE - JSON
//   // ==============================
//   const updateMaintenance = async (formData) => {
//     try {
//       setSaving(true);
//       setError("");
//       setSuccess("");

//       console.log("UPDATE MAINTENANCE - Received:", formData);

//       const maintenanceId =
//         formData.MaintenanceID ?? formData.maintenanceId ?? formData.id;

//       const selectedAssetId = Number(formData.AssetID ?? formData.assetId);

//       const costValue = formData.Cost ?? formData.cost;

//       const maintenanceCost = Number(costValue);

//       const maintenanceDate =
//         formData.MaintenanceDate ?? formData.maintenanceDate ?? "";

//       const description = formData.Description ?? formData.description ?? "";

//       const receiptPath = formData.ReceiptPath ?? formData.receiptPath ?? "";

//       // Validate maintenance ID
//       if (!maintenanceId) {
//         setError("Maintenance ID not found.");
//         return false;
//       }

//       // Validate asset
//       if (!selectedAssetId || !Number.isFinite(selectedAssetId)) {
//         setError("Please select a valid asset.");
//         return false;
//       }

//       // Validate cost
//       if (
//         costValue === "" ||
//         costValue == null ||
//         !Number.isFinite(maintenanceCost) ||
//         maintenanceCost < 0
//       ) {
//         setError("Please enter a valid maintenance cost.");
//         return false;
//       }

//       // Hook prepares API payload
//       const payload = {
//         maintenanceId: Number(maintenanceId),
//         assetId: selectedAssetId,
//         maintenanceDate,
//         cost: maintenanceCost,
//         description,
//         receiptPath,
//       };

//       console.log("UPDATE JSON Payload:", payload);

//       const response = await addMaintenanceService.updateMaintenance(
//         maintenanceId,
//         payload,
//       );

//       console.log("UPDATE API response:", response);

//       setSuccess("Maintenance updated successfully!");

//       await fetchMaintenance(assets);

//       return true;
//     } catch (err) {
//       console.error("Maintenance PUT error:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Maintenance update nahi ho saka.",
//       );

//       return false;
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==============================
//   // INITIAL LOAD
//   // ==============================
//   useEffect(() => {
//     const loadData = async () => {
//       const assetList = await fetchAssets();
//       await fetchMaintenance(assetList);
//     };

//     loadData();
//   }, [fetchAssets, fetchMaintenance]);

//   // ==============================
//   // CLEAR MESSAGES
//   // ==============================
//   const clearMessages = useCallback(() => {
//     setError("");
//     setSuccess("");
//   }, []);

//   // ==============================
//   // RETURN
//   // ==============================
//   return {
//     assets,
//     records,
//     assetStats,
//     loading,
//     saving,
//     error,
//     success,
//     fetchAssets,
//     fetchMaintenance,
//     addMaintenance,
//     updateMaintenance,
//     clearMessages,
//   };
// };

import { useEffect, useState, useCallback } from "react";
import { addMaintenanceService } from "../services/addMaintenanceService";
import { getAssets } from "../services/assetService";

export const useMaintenance = () => {
  const [assets, setAssets] = useState([]);
  const [records, setRecords] = useState([]);
  const [assetStats, setAssetStats] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // FETCH ASSETS
  // =========================================================
  const fetchAssets = useCallback(async () => {
    try {
      setError("");

      const response = await getAssets();

      const data = Array.isArray(response) ? response : response?.data || [];

      setAssets(data);

      return data;
    } catch (err) {
      console.error("Assets GET error:", err);

      setError(err.response?.data?.message || "Assets load nahi ho sake.");

      return [];
    }
  }, []);

  // =========================================================
  // FETCH MAINTENANCE RECORDS
  // =========================================================
  const fetchMaintenance = useCallback(async (assetList = []) => {
    try {
      setLoading(true);
      setError("");

      if (!Array.isArray(assetList) || assetList.length === 0) {
        setRecords([]);
        setAssetStats({});
        return [];
      }

      const responses = await Promise.all(
        assetList.map((asset) => {
          const assetId =
            asset.AssetID ?? asset.assetID ?? asset.assetId ?? asset.id;

          if (assetId == null) {
            return Promise.resolve(null);
          }

          return addMaintenanceService.getMaintenanceByAsset(assetId);
        }),
      );

      const newStats = {};

      const allRecords = responses.flatMap((response) => {
        if (!response) {
          return [];
        }

        // =================================================
        // ASSET STATS
        // =================================================
        if (response.assetId != null) {
          newStats[String(response.assetId)] = {
            totalRepairs: response.totalRepairs || 0,
            totalCost: response.totalCost || 0,
          };
        }

        // =================================================
        // HISTORY RESPONSE
        // =================================================
        if (Array.isArray(response.history)) {
          return response.history.map((record) => ({
            ...record,

            AssetID:
              record.AssetID ??
              record.assetID ??
              record.assetId ??
              response.assetId,

            // Backend response name
            ReceiptFilePath:
              record.ReceiptFilePath ??
              record.receiptFilePath ??
              record.receiptPath ??
              "",
          }));
        }

        // =================================================
        // DATA RESPONSE
        // =================================================
        if (Array.isArray(response.data)) {
          return response.data.map((record) => ({
            ...record,

            ReceiptFilePath:
              record.ReceiptFilePath ??
              record.receiptFilePath ??
              record.receiptPath ??
              "",
          }));
        }

        // =================================================
        // DIRECT ARRAY RESPONSE
        // =================================================
        if (Array.isArray(response)) {
          return response.map((record) => ({
            ...record,

            ReceiptFilePath:
              record.ReceiptFilePath ??
              record.receiptFilePath ??
              record.receiptPath ??
              "",
          }));
        }

        return [];
      });

      // =====================================================
      // SORT BY MAINTENANCE DATE
      // =====================================================
      allRecords.sort(
        (a, b) =>
          new Date(b.MaintenanceDate || b.maintenanceDate) -
          new Date(a.MaintenanceDate || a.maintenanceDate),
      );

      setRecords(allRecords);
      setAssetStats(newStats);

      return allRecords;
    } catch (err) {
      console.error("Maintenance GET error:", err);

      setError(
        err.response?.data?.message || "Maintenance records load nahi ho sake.",
      );

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // CREATE MAINTENANCE
  // =========================================================
  const addMaintenance = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      console.log("ADD MAINTENANCE - Received:", formData);

      // =====================================================
      // ASSET ID
      // =====================================================
      const selectedAssetId = Number(formData.assetId);

      // =====================================================
      // COST
      // =====================================================
      const maintenanceCost = Number(formData.cost);

      // =====================================================
      // VALIDATE ASSET
      // =====================================================
      if (!selectedAssetId || !Number.isFinite(selectedAssetId)) {
        setError("Please select a valid asset.");

        return false;
      }

      // =====================================================
      // VALIDATE COST
      // =====================================================
      if (
        formData.cost === "" ||
        formData.cost == null ||
        !Number.isFinite(maintenanceCost) ||
        maintenanceCost < 0
      ) {
        setError("Please enter a valid maintenance cost.");

        return false;
      }

      // =====================================================
      // CREATE FORMDATA
      // =====================================================
      // const payload = new FormData();

      // payload.append("assetId", String(selectedAssetId));

      // payload.append("maintenanceDate", formData.maintenanceDate || "");

      // payload.append("cost", String(maintenanceCost));

      // payload.append("description", formData.description || "");

      const payload = new FormData();

      payload.append("assetID", String(formData.assetId));
      payload.append("maintenanceDate", formData.maintenanceDate);
      payload.append("cost", String(formData.cost));
      payload.append("description", formData.description || "");

      if (formData.receiptFile) {
        payload.append("receiptFile", formData.receiptFile);
      }

      // =====================================================
      // RECEIPT FILE
      //
      // Actual uploaded file from frontend
      // remains: receiptFile
      //
      // Backend saves the generated path as:
      // ReceiptFilePath
      // =====================================================
      // if (formData.receiptFile) {
      //   payload.append("receiptFile", formData.receiptFile);
      // }

      // =====================================================
      // DEBUG FORMDATA
      // =====================================================
      console.log("========== ADD MAINTENANCE FORMDATA ==========");

      for (const [key, value] of payload.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      console.log("==============================================");

      // =====================================================
      // API CALL
      // =====================================================
      const response = await addMaintenanceService.addMaintenance(payload);

      console.log("ADD API response:", response);

      // =====================================================
      // SUCCESS
      // =====================================================
      setSuccess("Maintenance added successfully!");

      // =====================================================
      // REFRESH RECORDS
      // =====================================================
      await fetchMaintenance(assets);

      return true;
    } catch (err) {
      console.error("Maintenance POST error:", err);

      console.error("Maintenance POST response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Maintenance add nahi ho saka.",
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPDATE MAINTENANCE
  // =========================================================
  const updateMaintenance = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      console.log("UPDATE MAINTENANCE - Received:", formData);

      // =====================================================
      // MAINTENANCE ID
      // =====================================================
      const maintenanceId =
        formData.MaintenanceID ?? formData.maintenanceId ?? formData.id;

      // =====================================================
      // ASSET ID
      // =====================================================
      const selectedAssetId = Number(formData.AssetID ?? formData.assetId);

      // =====================================================
      // COST
      // =====================================================
      const costValue = formData.Cost ?? formData.cost;

      const maintenanceCost = Number(costValue);

      // =====================================================
      // DATE
      // =====================================================
      const maintenanceDate =
        formData.MaintenanceDate ?? formData.maintenanceDate ?? "";

      // =====================================================
      // DESCRIPTION
      // =====================================================
      const description = formData.Description ?? formData.description ?? "";

      // =====================================================
      // RECEIPT FILE PATH
      //
      // Backend response:
      // ReceiptFilePath
      // =====================================================
      const ReceiptFilePath =
        formData.ReceiptFilePath ??
        formData.receiptFilePath ??
        formData.receiptPath ??
        "";

      // =====================================================
      // RECEIPT FILE
      // =====================================================
      const receiptFile = formData.receiptFile || null;

      // =====================================================
      // VALIDATE MAINTENANCE ID
      // =====================================================
      if (!maintenanceId) {
        setError("Maintenance ID not found.");

        return false;
      }

      // =====================================================
      // VALIDATE ASSET
      // =====================================================
      if (!selectedAssetId || !Number.isFinite(selectedAssetId)) {
        setError("Please select a valid asset.");

        return false;
      }

      // =====================================================
      // VALIDATE COST
      // =====================================================
      if (
        costValue === "" ||
        costValue == null ||
        !Number.isFinite(maintenanceCost) ||
        maintenanceCost < 0
      ) {
        setError("Please enter a valid maintenance cost.");

        return false;
      }

      // =====================================================
      // UPDATE PAYLOAD
      // =====================================================
      const payload = {
        maintenanceId: Number(maintenanceId),

        assetId: selectedAssetId,

        maintenanceDate,

        cost: maintenanceCost,

        description,

        // Backend naming
        ReceiptFilePath,
      };

      // =====================================================
      // IF NEW FILE IS SELECTED
      // =====================================================
      if (receiptFile) {
        payload.receiptFile = receiptFile;
      }

      console.log("UPDATE MAINTENANCE PAYLOAD:", payload);

      // =====================================================
      // API CALL
      // =====================================================
      const response = await addMaintenanceService.updateMaintenance(
        maintenanceId,
        payload,
      );

      console.log("UPDATE API response:", response);

      // =====================================================
      // SUCCESS
      // =====================================================
      setSuccess("Maintenance updated successfully!");

      // =====================================================
      // REFRESH
      // =====================================================
      await fetchMaintenance(assets);

      return true;
    } catch (err) {
      console.error("Maintenance PUT error:", err);

      console.error("Maintenance PUT response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Maintenance update nahi ho saka.",
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    const loadData = async () => {
      const assetList = await fetchAssets();

      await fetchMaintenance(assetList);
    };

    loadData();
  }, [fetchAssets, fetchMaintenance]);

  // =========================================================
  // CLEAR MESSAGES
  // =========================================================
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  // =========================================================
  // RETURN
  // =========================================================
  return {
    assets,
    records,
    assetStats,

    loading,
    saving,

    error,
    success,

    fetchAssets,
    fetchMaintenance,

    addMaintenance,
    updateMaintenance,

    clearMessages,
  };
};
