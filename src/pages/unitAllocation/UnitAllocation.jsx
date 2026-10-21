// import { useEffect, useState } from "react";
// import {
//   ArrowRight,
//   RefreshCw,
//   History,
//   MapPin,
//   FileText,
//   User,
//   MessageSquare,
// } from "lucide-react";

// // SERVICES IMPORT
// import { getLocations } from "../../services/locationService";
// import unitService from "../../services/unitService";

// const UnitAllocation = () => {
//   // =========================
//   // STATES
//   // =========================
//   const [assets, setAssets] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [movementHistory, setMovementHistory] = useState([]);
//   const [selectedAssetIds, setSelectedAssetIds] = useState([]);

//   const [formData, setFormData] = useState({
//     toLocationId: "",
//     transferReference: "",
//     transferredBy: "",
//     remarks: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [tableLoading, setTableLoading] = useState(false);

//   // =========================
//   // SERVICE CALLS
//   // =========================
//   const fetchLocations = async () => {
//     try {
//       const data = await getLocations();
//       setLocations(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Locations fetch error:", error);
//     }
//   };

//   const fetchAssets = async () => {
//     try {
//       setTableLoading(true);
//       const res = await unitService.getAllAssets();
//       const assetList = Array.isArray(res)
//         ? res
//         : res?.data || res?.assets || [];
//       setAssets(assetList);
//     } catch (error) {
//       console.error("Assets fetch error:", error);
//     } finally {
//       setTableLoading(false);
//     }
//   };

//   const fetchMovementHistory = async () => {
//     try {
//       const res = await unitService.getMovementHistory();
//       const historyList = Array.isArray(res)
//         ? res
//         : res?.data || res?.history || [];
//       setMovementHistory(historyList);
//     } catch (error) {
//       console.error("Movement history fetch error:", error);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchLocations();
//     fetchAssets();
//     fetchMovementHistory();
//   }, []);

//   // Form handle
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Checkbox selection handles
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const allIds = assets.map((item) => item.AssetID || item.id);
//       setSelectedAssetIds(allIds);
//     } else {
//       setSelectedAssetIds([]);
//     }
//   };

//   const handleSelectRow = (id) => {
//     setSelectedAssetIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   // Bulk Transfer Action
//   const handleTransfer = async () => {
//     if (!formData.toLocationId) {
//       alert("Please select destination location");
//       return;
//     }

//     if (!formData.transferReference.trim()) {
//       alert("Please enter transfer reference");
//       return;
//     }

//     if (!formData.transferredBy.trim()) {
//       alert("Please enter transferred by");
//       return;
//     }

//     if (selectedAssetIds.length === 0) {
//       alert("Please select at least one asset");
//       return;
//     }

//     const payload = {
//       toLocationId: Number(formData.toLocationId),
//       transferReference: formData.transferReference.trim(),
//       transferredBy: formData.transferredBy.trim(),
//       remarks: formData.remarks.trim(),
//       assetIds: selectedAssetIds,
//     };

//     try {
//       setLoading(true);

//       const res = await unitService.bulkTransfer(payload);

//       alert(res?.message || "Assets transferred successfully!");

//       // Reset form
//       setSelectedAssetIds([]);
//       setFormData({
//         toLocationId: "",
//         transferReference: "",
//         transferredBy: "",
//         remarks: "",
//       });

//       // Refresh data
//       fetchAssets();
//       fetchMovementHistory();
//     } catch (error) {
//       console.error("Bulk transfer failed:", error);
//       alert(error?.response?.data?.message || "Bulk transfer failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchLocations();
//     fetchAssets();
//     fetchMovementHistory();
//   };

//   const formatDate = (value) => {
//     if (!value) return "-";
//     const date = new Date(value);
//     if (Number.isNaN(date.getTime())) return "-";
//     return date.toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* HEADER */}
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-slate-800">Asset Transfer</h1>

//         <button
//           type="button"
//           onClick={handleRefresh}
//           className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
//         >
//           <RefreshCw size={16} />
//           Refresh
//         </button>
//       </div>

//       {/* FORM */}
//       <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 px-6 py-4">
//           <h2 className="font-semibold text-slate-800">Bulk Asset Transfer</h2>
//           <p className="text-xs text-slate-500">Enter transfer details</p>
//         </div>

//         <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
//           {/* TO LOCATION (DYNAMIC) */}
//           <div>
//             <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
//               <MapPin size={15} />
//               To Location
//             </label>

//             <select
//               name="toLocationId"
//               value={formData.toLocationId}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             >
//               <option value="">Select destination</option>
//               {locations.map((loc) => {
//                 const locId =
//                   loc.LocationID || loc.locationId || loc.id || loc._id;
//                 const locName =
//                   loc.LocationName || loc.locationName || loc.name || loc.title;
//                 return (
//                   <option key={locId} value={locId}>
//                     {locName}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>

//           {/* TRANSFER REFERENCE */}
//           <div>
//             <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
//               <FileText size={15} />
//               Transfer Reference
//             </label>

//             <input
//               type="text"
//               name="transferReference"
//               value={formData.transferReference}
//               onChange={handleChange}
//               placeholder="e.g. CHALLAN-001"
//               className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           {/* TRANSFERRED BY */}
//           <div>
//             <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
//               <User size={15} />
//               Transferred By
//             </label>

//             <input
//               type="text"
//               name="transferredBy"
//               value={formData.transferredBy}
//               onChange={handleChange}
//               placeholder="e.g. Shiva Singh"
//               className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           {/* REMARKS */}
//           <div>
//             <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
//               <MessageSquare size={15} />
//               Remarks
//             </label>

//             <input
//               type="text"
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleChange}
//               placeholder="e.g. Dispatching initial stock..."
//               className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>
//         </div>
//       </div>

//       {/* SELECT ASSETS TABLE */}
//       <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
//           <div>
//             <h2 className="font-semibold text-slate-800">Select Assets</h2>
//             <p className="mt-1 text-xs text-slate-500">
//               Select assets that you want to transfer
//             </p>
//           </div>

//           <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
//             {selectedAssetIds.length} Selected
//           </span>
//         </div>

//         <div className="overflow-x-auto p-4">
//           <table className="w-full text-left text-sm text-slate-600">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-700">
//               <tr>
//                 <th className="p-3">
//                   <input
//                     type="checkbox"
//                     checked={
//                       assets.length > 0 &&
//                       selectedAssetIds.length === assets.length
//                     }
//                     onChange={handleSelectAll}
//                     className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                   />
//                 </th>
//                 <th className="p-3">Asset Tag</th>
//                 <th className="p-3">Asset Name</th>
//                 <th className="p-3">Category</th>
//                 <th className="p-3">Current Location</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {tableLoading ? (
//                 <tr>
//                   <td colSpan="5" className="py-6 text-center text-slate-400">
//                     Loading assets...
//                   </td>
//                 </tr>
//               ) : assets.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="py-6 text-center text-slate-400">
//                     No assets found
//                   </td>
//                 </tr>
//               ) : (
//                 assets.map((item) => {
//                   const id = item.AssetID || item.id;
//                   const isChecked = selectedAssetIds.includes(id);

//                   return (
//                     <tr
//                       key={id}
//                       className={`hover:bg-slate-50 ${
//                         isChecked ? "bg-blue-50/50" : ""
//                       }`}
//                     >
//                       <td className="p-3">
//                         <input
//                           type="checkbox"
//                           checked={isChecked}
//                           onChange={() => handleSelectRow(id)}
//                           className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="p-3 font-medium text-slate-800">
//                         {item.AssetTag || item.assetTag || "-"}
//                       </td>
//                       <td className="p-3">
//                         {item.AssetName || item.assetName || "-"}
//                       </td>
//                       <td className="p-3">
//                         {item.CategoryName ||
//                           (typeof item.category === "object"
//                             ? item.category?.name
//                             : item.category) ||
//                           "-"}
//                       </td>
//                       <td className="p-3">
//                         {item.CurrentLocation ||
//                           (typeof item.location === "object"
//                             ? item.location?.name
//                             : item.location) ||
//                           "-"}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* SUBMIT BUTTON */}
//         <div className="flex justify-end border-t border-slate-200 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleTransfer}
//             disabled={loading || selectedAssetIds.length === 0}
//             className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <ArrowRight size={17} />
//             {loading
//               ? "Transferring..."
//               : `Transfer ${selectedAssetIds.length} Assets`}
//           </button>
//         </div>
//       </div>

//       {/* MOVEMENT HISTORY TABLE */}
//       <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
//               <History size={19} />
//             </div>

//             <div>
//               <h2 className="font-semibold text-slate-800">Movement History</h2>
//               <p className="text-xs text-slate-500">
//                 Complete asset transfer history
//               </p>
//             </div>
//           </div>

//           <span className="text-sm text-slate-500">
//             {movementHistory.length} Records
//           </span>
//         </div>

//         <div className="overflow-x-auto p-4">
//           <table className="w-full text-left text-sm text-slate-600">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-700">
//               <tr>
//                 <th className="p-3">ID</th>
//                 <th className="p-3">Reference</th>
//                 <th className="p-3">Asset Tag</th>
//                 <th className="p-3">Asset Name</th>
//                 <th className="p-3">From Location</th>
//                 <th className="p-3">To Location</th>
//                 <th className="p-3">Transferred By</th>
//                 <th className="p-3">Transfer Date</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {movementHistory.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="py-6 text-center text-slate-400">
//                     No movement records found
//                   </td>
//                 </tr>
//               ) : (
//                 movementHistory.map((row) => {
//                   const id = row.MovementID || row.id;
//                   return (
//                     <tr key={id} className="hover:bg-slate-50">
//                       <td className="p-3 font-medium text-slate-800">{id}</td>
//                       <td className="p-3">
//                         {row.TransferReference || row.reference || "-"}
//                       </td>
//                       <td className="p-3 font-medium text-slate-800">
//                         {row.AssetTag || row.assetTag || "-"}
//                       </td>
//                       <td className="p-3">
//                         {row.AssetName || row.assetName || "-"}
//                       </td>
//                       <td className="p-3">
//                         {row.FromLocation ||
//                           (typeof row.fromLocation === "object"
//                             ? row.fromLocation?.name
//                             : row.fromLocation) ||
//                           "-"}
//                       </td>
//                       <td className="p-3">
//                         {row.ToLocation ||
//                           (typeof row.toLocation === "object"
//                             ? row.toLocation?.name
//                             : row.toLocation) ||
//                           "-"}
//                       </td>
//                       <td className="p-3">
//                         {row.TransferredBy || row.transferredBy || "-"}
//                       </td>
//                       <td className="p-3">
//                         {formatDate(row.TransferDate || row.transferDate)}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnitAllocation;
//=====================================================================================================

import React, { useState, useEffect } from "react";
import unitService from "../../services/unitService";
import { getLocations } from "../../services/locationService";
import { getAssets } from "../../services/assetService";

import {
  ArrowRightLeft,
  History,
  CheckSquare,
  Square,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export const UnitAllocation = () => {
  const [activeTab, setActiveTab] = useState("transfer"); // 'transfer' | 'history'

  const [availableAssets, setAvailableAssets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    toLocationId: "",
    transferReference: "",
    transferredBy: "",
    remarks: "",
  });

  // Assets aur Locations ko direct service files se fetch karna
  const fetchTransferData = async () => {
    try {
      setDataLoading(true);
      const [assetsRes, locationsRes] = await Promise.all([
        getAssets ? getAssets() : unitService.getAllAssets(),
        getLocations(),
      ]);

      // Handle Assets response
      const assetsList =
        assetsRes?.data || (Array.isArray(assetsRes) ? assetsRes : []);
      setAvailableAssets(assetsList);

      // Handle Locations response
      const locationsList =
        locationsRes?.data || (Array.isArray(locationsRes) ? locationsRes : []);
      setLocations(locationsList);
    } catch (err) {
      console.error("Data Fetch Error:", err);
      setMessage({
        type: "error",
        text: "Assets ya Locations load will not load.",
      });
    } finally {
      setDataLoading(false);
    }
  };

  // Movement history fetch karna
  const fetchMovementHistory = async () => {
    try {
      setDataLoading(true);
      const res = await unitService.getMovementHistory();
      setHistoryData(res?.data || (Array.isArray(res) ? res : []));
    } catch (err) {
      console.error("History Fetch Error:", err);
      setMessage({
        type: "error",
        text: "Movement history will not load",
      });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "transfer") {
      fetchTransferData();
    } else {
      fetchMovementHistory();
    }
  }, [activeTab]);

  // Checkbox selection logic
  const handleSelectAsset = (id) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedAssetIds.length === availableAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(
        availableAssets.map((asset) => asset.AssetID || asset.id),
      );
    }
  };

  // Bulk Transfer API submit
  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    if (!formData.toLocationId || selectedAssetIds.length === 0) return;

    setLoading(true);
    setMessage(null);

    const payload = {
      toLocationId: Number(formData.toLocationId),
      transferReference: formData.transferReference,
      transferredBy: formData.transferredBy || "Admin",
      remarks: formData.remarks,
      assetIds: selectedAssetIds,
    };

    try {
      const res = await unitService.bulkTransfer(payload);

      if (res?.success) {
        setMessage({
          type: "success",
          text: res.message || "Assets  taransfer successful.",
        });
        setIsModalOpen(false);
        setSelectedAssetIds([]);
        setFormData({
          toLocationId: "",
          transferReference: "",
          transferredBy: "",
          remarks: "",
        });
        fetchTransferData(); // List refresh
      } else {
        setMessage({
          type: "error",
          text: res?.message || "Transfer failed.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Transfer will not execute.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Asset Movement & Location Transfer
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Move single or multiple assets across sites with tracking
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 border border-gray-200 rounded-lg shadow-xs">
          <button
            onClick={() => setActiveTab("transfer")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "transfer"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Transfer Assets
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Movement History
          </button>
        </div>
      </div>

      {/* ALERT MESSAGE */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {message.text}
        </div>
      )}

      {/* TAB 1: ASSET SELECTION TABLE */}
      {activeTab === "transfer" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="text-xs font-medium text-gray-700">
              Selected:{" "}
              <span className="font-bold text-blue-600">
                {selectedAssetIds.length}
              </span>{" "}
              / {availableAssets.length} Assets
            </div>

            <button
              disabled={selectedAssetIds.length === 0}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Transfer Selected Assets
            </button>
          </div>

          {dataLoading ? (
            <div className="p-8 flex items-center justify-center text-xs text-gray-500 gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              Loading assets...
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 w-10">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="flex items-center"
                    >
                      {selectedAssetIds.length > 0 &&
                      selectedAssetIds.length === availableAssets.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-3">Asset Tag</th>
                  <th className="p-3">Asset Name</th>
                  <th className="p-3">Current Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {availableAssets.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">
                      No assets found.
                    </td>
                  </tr>
                ) : (
                  availableAssets.map((asset) => {
                    const id = asset.AssetID || asset.id;
                    const isSelected = selectedAssetIds.includes(id);
                    return (
                      <tr
                        key={id}
                        onClick={() => handleSelectAsset(id)}
                        className={`cursor-pointer transition ${isSelected ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                      >
                        <td className="p-3">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </td>
                        <td className="p-3 font-semibold text-gray-900">
                          {asset.AssetTag}
                        </td>
                        <td className="p-3 text-gray-700">{asset.AssetName}</td>
                        <td className="p-3 text-gray-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {asset.LocationName || asset.CurrentLocation || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: MOVEMENT HISTORY TABLE */}
      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          {dataLoading ? (
            <div className="p-8 flex items-center justify-center text-xs text-gray-500 gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              Loading history...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Challan Ref</th>
                    <th className="p-3">Asset Tag</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">From Location</th>
                    <th className="p-3">To Location</th>
                    <th className="p-3">Transferred By</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-400">
                        No movement history recorded.
                      </td>
                    </tr>
                  ) : (
                    historyData.map((item) => (
                      <tr key={item.MovementID} className="hover:bg-gray-50">
                        <td className="p-3 font-semibold text-blue-600">
                          {item.TransferReference || "-"}
                        </td>
                        <td className="p-3 font-medium text-gray-900">
                          {item.AssetTag}
                        </td>
                        <td className="p-3 text-gray-700">{item.AssetName}</td>
                        <td className="p-3 text-gray-600">
                          {item.FromLocation || "N/A"}
                        </td>
                        <td className="p-3 font-medium text-emerald-700">
                          {item.ToLocation}
                        </td>
                        <td className="p-3 text-gray-700">
                          {item.TransferredBy}
                        </td>
                        <td className="p-3 text-gray-500">
                          {item.TransferDate
                            ? new Date(item.TransferDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td className="p-3 text-gray-500 max-w-[200px] truncate">
                          {item.Remarks || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TRANSFER MODAL WITH LOCATIONS DROPDOWN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-5 overflow-hidden">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              Transfer {selectedAssetIds.length} Assets
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Specify destination location and transfer challan details.
            </p>

            <form onSubmit={handleSubmitTransfer} className="mt-4 space-y-3.5">
              {/* Destination Location Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Destination Location *
                </label>
                <select
                  required
                  value={formData.toLocationId}
                  onChange={(e) =>
                    setFormData({ ...formData, toLocationId: e.target.value })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Destination Location</option>
                  {locations.map((loc) => {
                    const locId = loc.LocationID || loc.LocationId || loc.id;
                    const locName =
                      loc.LocationName || loc.locationName || loc.name;
                    return (
                      <option key={locId} value={locId}>
                        {locName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Transfer Reference */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Transfer Reference / Challan No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. CHALLAN-001"
                  value={formData.transferReference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transferReference: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Transferred By */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Transferred By
                </label>
                <input
                  type="text"
                  placeholder="Name of person transferring"
                  value={formData.transferredBy}
                  onChange={(e) =>
                    setFormData({ ...formData, transferredBy: e.target.value })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Add dispatch or handover notes..."
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Transferring..." : "Confirm & Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitAllocation;
