// import React, { useState, useMemo } from "react";
// import { Edit2, Trash2, Calendar, X } from "lucide-react";
// import { AssetStatusBadge } from "./AssetStatusBadge";
// import { formatDate } from "../../utils/formatters";

// export const AssetTable = ({
//   assets = [],
//   locations = [],
//   loading = false,
//   error = null,
//   onEdit,
//   onDelete,
// }) => {
//   // Date Filter States
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [dateField, setDateField] = useState("CreatedAt"); // 'CreatedAt', 'UpdatedAt', 'WarrantyExpiryDate'

//   // Date Filtering Logic
//   const filteredAssets = useMemo(() => {
//     return assets.filter((asset) => {
//       const rawDate = asset[dateField];
//       if (!startDate && !endDate) return true;
//       if (!rawDate) return false;

//       const itemDate = new Date(rawDate).toISOString().split("T")[0];

//       if (startDate && endDate) {
//         return itemDate >= startDate && itemDate <= endDate;
//       }
//       if (startDate) {
//         return itemDate >= startDate;
//       }
//       if (endDate) {
//         return itemDate <= endDate;
//       }
//       return true;
//     });
//   }, [assets, startDate, endDate, dateField]);

//   const clearDateFilter = () => {
//     setStartDate("");
//     setEndDate("");
//   };

//   // Helper to find location name by ID
//   // const getLocationName = (asset) => {
//   //   if (asset.LocationName) return asset.LocationName;
//   //   if (asset.Location) return asset.Location;
//   //   if (asset.CurrentLocationID && locations.length > 0) {
//   //     const match = locations.find(
//   //       (loc) =>
//   //         (loc.LocationID || loc.id || loc._id) === asset.CurrentLocationID,
//   //     );
//   //     if (match) return match.LocationName || match.name || match.title;
//   //   }
//   //   return asset.CurrentLocationID
//   //     ? `Location #${asset.CurrentLocationID}`
//   //     : "-";
//   // };

//   // if (loading) {
//   //   return (
//   //     <div className="p-6 text-center text-xs font-medium text-slate-500">
//   //       Loading assets...
//   //     </div>
//   //   );
//   // }

//   // Helper to find location name by ID
//   const getLocationName = (asset) => {
//     // 1. Agar backend response me pehle se naam ho
//     if (asset.LocationName) return asset.LocationName;
//     if (asset.Location) return asset.Location;
//     if (asset.locationName) return asset.locationName;

//     // 2. locations array se match karna (CurrentLocationID: 3)
//     const targetLocId =
//       asset.CurrentLocationID || asset.locationId || asset.LocationID;

//     if (targetLocId && locations && locations.length > 0) {
//       const match = locations.find((loc) => {
//         const id = loc.LocationID ?? loc.locationId ?? loc.id ?? loc._id;
//         return Number(id) === Number(targetLocId); // Number me convert karke match karega
//       });

//       if (match) {
//         return (
//           match.LocationName || match.locationName || match.name || match.title
//         );
//       }
//     }

//     // 3. Fallback agar location list load na hui ho
//     return targetLocId ? `Location #${targetLocId}` : "-";
//   };

//   if (error) {
//     return (
//       <div className="p-6 text-center text-xs font-medium text-rose-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {/* DATE FILTER SEARCH BAR */}
//       <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
//         <div className="flex flex-wrap items-center gap-2">
//           <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
//             <Calendar size={14} className="text-sky-600" />
//             <span>Date Filter:</span>
//           </div>

//           <select
//             value={dateField}
//             onChange={(e) => setDateField(e.target.value)}
//             className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-500"
//           >
//             <option value="CreatedAt">Created Date</option>
//             <option value="UpdatedAt">Updated Date</option>
//             <option value="WarrantyExpiryDate">Warranty Expiry</option>
//           </select>

//           <div className="flex items-center gap-1 text-xs text-slate-500">
//             <span>From:</span>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-500"
//             />
//           </div>

//           <div className="flex items-center gap-1 text-xs text-slate-500">
//             <span>To:</span>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-500"
//             />
//           </div>

//           {(startDate || endDate) && (
//             <button
//               type="button"
//               onClick={clearDateFilter}
//               className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
//             >
//               <X size={12} />
//               Reset
//             </button>
//           )}
//         </div>

//         <div className="text-xs text-slate-500">
//           Showing <b>{filteredAssets.length}</b> of {assets.length} Assets
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-slate-200 text-left text-[11px]">
//             <thead className="border-b border-slate-200 bg-slate-50">
//               <tr>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap text-center w-10">
//                   S.No
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Asset Tag
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Asset Name
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Serial Number
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Category
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Type
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Location Name
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Price
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Bill ID
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Warranty Exp.
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap text-center">
//                   Status
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Created Info
//                 </th>
//                 <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
//                   Updated Info
//                 </th>
//                 <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap sticky right-0 bg-slate-50">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 bg-white">
//               {filteredAssets && filteredAssets.length > 0 ? (
//                 filteredAssets.map((asset, index) => (
//                   <tr
//                     key={asset.AssetID || index}
//                     className="hover:bg-slate-50/80 transition-colors"
//                   >
//                     <td className="px-3 py-2 font-medium text-slate-500 text-center whitespace-nowrap">
//                       {index + 1}
//                     </td>
//                     <td className="px-3 py-2 font-mono font-semibold text-sky-700 whitespace-nowrap text-[10px]">
//                       {asset.AssetTag || "-"}
//                     </td>
//                     <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap">
//                       {asset.AssetName || "-"}
//                     </td>
//                     <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap text-[10px]">
//                       {asset.SerialNumber || "-"}
//                     </td>
//                     <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
//                       {asset.CategoryName || "-"}
//                     </td>
//                     <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
//                       {asset.TypeName || "-"}
//                     </td>
//                     <td className="px-3 py-2 text-slate-600 whitespace-nowrap font-medium">
//                       {getLocationName(asset)}
//                     </td>
//                     <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
//                       {asset.Price !== null && asset.Price !== undefined
//                         ? `₹${asset.Price}`
//                         : "-"}
//                     </td>
//                     <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap">
//                       {asset.BillID || "-"}
//                     </td>
//                     <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap text-[10px]">
//                       {asset.WarrantyExpiryDate
//                         ? formatDate(asset.WarrantyExpiryDate)
//                         : "-"}
//                     </td>
//                     <td className="px-3 py-2 text-center whitespace-nowrap">
//                       <AssetStatusBadge status={asset.Status} />
//                     </td>
//                     <td className="px-3 py-2 whitespace-nowrap text-slate-500">
//                       <div>{formatDate(asset.CreatedAt)}</div>
//                       <div className="text-[10px] text-slate-400">
//                         By: {asset.CreatedBy || "-"}
//                       </div>
//                     </td>
//                     <td className="px-3 py-2 whitespace-nowrap text-slate-500">
//                       {asset.UpdatedAt ? (
//                         <>
//                           <div>{formatDate(asset.UpdatedAt)}</div>
//                           <div className="text-[10px] text-slate-400">
//                             By: {asset.UpdatedBy || "-"}
//                           </div>
//                         </>
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                     <td className="px-3 py-2 text-right whitespace-nowrap sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
//                       <div className="flex items-center justify-end gap-1.5">
//                         <button
//                           type="button"
//                           onClick={() => onEdit(asset)}
//                           className="rounded p-1 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition"
//                           title="Edit Asset"
//                         >
//                           <Edit2 className="h-3.5 w-3.5" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => onDelete(asset.AssetID)}
//                           className="rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
//                           title="Decommission (Soft Delete)"
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={14}
//                     className="px-3 py-6 text-center text-slate-400"
//                   >
//                     No assets found matching the criteria.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssetTable;

import React, { useState, useMemo } from "react";
import { Edit2, Trash2, Calendar, X } from "lucide-react";
import { AssetStatusBadge } from "./AssetStatusBadge";
import { formatDate } from "../../utils/formatters";

export const AssetTable = ({
  assets = [],
  locations = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
}) => {
  // Date Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateField, setDateField] = useState("createdAt"); // 'createdAt', 'updatedAt', 'warrantyexpirydate'

  // Date Filtering Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const rawDate =
        asset[dateField] ||
        asset[dateField.charAt(0).toUpperCase() + dateField.slice(1)];
      if (!startDate && !endDate) return true;
      if (!rawDate) return false;

      const itemDate = new Date(rawDate).toISOString().split("T")[0];

      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      }
      if (startDate) {
        return itemDate >= startDate;
      }
      if (endDate) {
        return itemDate <= endDate;
      }
      return true;
    });
  }, [assets, startDate, endDate, dateField]);

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  // Helper to find location name by ID
  const getLocationName = (asset) => {
    if (asset.LocationName || asset.locationName) {
      return asset.LocationName || asset.locationName;
    }
    if (asset.Location || asset.location) {
      return asset.Location || asset.location;
    }

    const targetLocId =
      asset.currentLocationID ??
      asset.CurrentLocationID ??
      asset.locationId ??
      asset.LocationID;

    if (targetLocId && locations && locations.length > 0) {
      const match = locations.find((loc) => {
        const id =
          loc.locationID ??
          loc.LocationID ??
          loc.locationId ??
          loc.id ??
          loc._id;
        return Number(id) === Number(targetLocId);
      });

      if (match) {
        return (
          match.locationName || match.LocationName || match.name || match.title
        );
      }
    }

    return targetLocId ? `Location #${targetLocId}` : "-";
  };

  if (error) {
    return (
      <div className="p-6 text-center text-xs font-medium text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* DATE FILTER SEARCH BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
            <Calendar size={14} className="text-sky-600" />
            <span>Date Filter:</span>
          </div>

          <select
            value={dateField}
            onChange={(e) => setDateField(e.target.value)}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-500"
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="warrantyexpirydate">Warranty Expiry</option>
          </select>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-500"
            />
          </div>

          {(startDate || endDate) && (
            <button
              type="button"
              onClick={clearDateFilter}
              className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
            >
              <X size={12} />
              Reset
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500">
          Showing <b>{filteredAssets.length}</b> of {assets.length} Assets
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-[11px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap text-center w-10">
                  S.No
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Asset Tag
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Asset Name
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Serial Number
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Category
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Type
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Location Name
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Price
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Bill ID
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Warranty Exp.
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap text-center">
                  Status
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Created Info
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap">
                  Updated Info
                </th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap sticky right-0 bg-slate-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredAssets && filteredAssets.length > 0 ? (
                filteredAssets.map((asset, index) => {
                  const assetId = asset.assetID ?? asset.AssetID;
                  const priceVal = asset.price ?? asset.Price;
                  const billVal = asset.billID ?? asset.BillID;
                  const warrantyVal =
                    asset.warrantyexpirydate ?? asset.WarrantyExpiryDate;
                  const createdDate = asset.createdAt ?? asset.CreatedAt;
                  const createdBy = asset.createdBy ?? asset.CreatedBy;
                  const updatedDate = asset.updatedAt ?? asset.UpdatedAt;
                  const updatedBy = asset.updatedBy ?? asset.UpdatedBy;

                  return (
                    <tr
                      key={assetId || index}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-3 py-2 font-medium text-slate-500 text-center whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 font-mono font-semibold text-sky-700 whitespace-nowrap text-[10px]">
                        {asset.assetTag || asset.AssetTag || "-"}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap">
                        {asset.assetName || asset.AssetName || "-"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap text-[10px]">
                        {asset.serialNumber || asset.SerialNumber || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                        {asset.categoryName || asset.CategoryName || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                        {asset.typeName || asset.TypeName || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-600 whitespace-nowrap font-medium">
                        {getLocationName(asset)}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
                        {priceVal !== null && priceVal !== undefined
                          ? `₹${priceVal}`
                          : "-"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap">
                        {billVal || "-"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap text-[10px]">
                        {warrantyVal ? formatDate(warrantyVal) : "-"}
                      </td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        <AssetStatusBadge
                          status={asset.status || asset.Status}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                        <div>{createdDate ? formatDate(createdDate) : "-"}</div>
                        <div className="text-[10px] text-slate-400">
                          By: {createdBy || "-"}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                        {updatedDate ? (
                          <>
                            <div>{formatDate(updatedDate)}</div>
                            <div className="text-[10px] text-slate-400">
                              By: {updatedBy || "-"}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit(asset)}
                            className="rounded p-1 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition"
                            title="Edit Asset"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(assetId)}
                            className="rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                            title="Decommission (Soft Delete)"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={14}
                    className="px-3 py-6 text-center text-slate-400"
                  >
                    No assets found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;
