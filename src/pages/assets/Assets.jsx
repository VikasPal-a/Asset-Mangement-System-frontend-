// import React, { useEffect, useState } from "react";

// import { useAssets } from "../../hooks/useAssets";

// import { PageHeader } from "../../components/layout/PageHeader";
// import { AssetFilters } from "../../components/assets/AssetFilters";
// import { AssetTable } from "../../components/assets/AssetTable";
// import { AssetModal } from "../../components/assets/AssetModal";

// import { ConfirmDialog } from "../../components/common/ConfirmDialog";
// import { Button } from "../../components/common/Button";
// import { Loader } from "../../components/common/Loader";

// import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

// import { getCategories, getTypes } from "../../services/categoryService";
// import { itemService } from "../../services/itemService";
// import { apiUrl } from "../../services/api";

// export const Assets = () => {
//   // ==========================================
//   // ASSET DATA
//   // ==========================================

//   const {
//     assets,
//     loading,
//     error,

//     searchTerm,
//     categoryFilter,
//     statusFilter,

//     onSearchChange,
//     onCategoryChange,
//     onStatusChange,

//     page,
//     totalPages,
//     totalItems,

//     nextPage,
//     prevPage,

//     refetch,
//     addAsset,
//     editAsset,
//     removeAsset,
//   } = useAssets(10);

//   // ==========================================
//   // CATEGORY + TYPE + ITEM + LOCATION DATA
//   // ==========================================

//   const [categories, setCategories] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [itemList, setItemList] = useState([]);
//   const [locationList, setLocationList] = useState([]);

//   const [dropdownLoading, setDropdownLoading] = useState(false);

//   // ==========================================
//   // MODAL
//   // ==========================================

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingAsset, setEditingAsset] = useState(null);

//   // ==========================================
//   // DELETE
//   // ==========================================

//   const [deleteTargetTag, setDeleteTargetTag] = useState(null);

//   // ==========================================
//   // GET CATEGORIES + TYPES + ITEMS + LOCATIONS
//   // ==========================================

//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         setDropdownLoading(true);

//         const [categoryResponse, typeResponse, itemResponse, locationResponse] =
//           await Promise.all([
//             getCategories(),
//             getTypes(),
//             itemService.getAlls(),
//             apiUrl.get("/locations").catch(() => ({ data: [] })),
//           ]);

//         console.log("Categories:", categoryResponse);
//         console.log("Types:", typeResponse);
//         console.log("Items:", itemResponse);
//         console.log("Locations:", locationResponse);

//         // Categories
//         setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);

//         // Types
//         setTypes(
//           typeResponse?.success && Array.isArray(typeResponse.data)
//             ? typeResponse.data
//             : Array.isArray(typeResponse)
//               ? typeResponse
//               : [],
//         );

//         // Item Master mapping (Bill No & Price auto-binding ke liye)
//         const rawItems = Array.isArray(itemResponse)
//           ? itemResponse
//           : itemResponse?.data || [];
//         setItemList(
//           rawItems.map((i) => ({
//             value: String(i.ItemID ?? i.itemId ?? i.id),
//             label: i.ItemName ?? i.itemName ?? i.name ?? "Item",
//             BillID: i.BillID ?? i.billId ?? "",
//             InvoiceNo: i.InvoiceNo ?? i.invoiceNo ?? i.BillNo ?? "",
//             Price: i.UnitPrice ?? i.unitPrice ?? i.Price ?? "",
//           })),
//         );

//         // Locations mapping
//         const rawLocations = Array.isArray(locationResponse?.data)
//           ? locationResponse.data
//           : locationResponse?.data?.data || [];
//         setLocationList(
//           rawLocations.map((loc) => ({
//             value: String(loc.LocationID ?? loc.locationId ?? loc.id),
//             label:
//               loc.LocationName ?? loc.locationName ?? loc.name ?? "Location",
//           })),
//         );
//       } catch (err) {
//         console.error("Dropdown API Error:", err);

//         setCategories([]);
//         setTypes([]);
//         setItemList([]);
//         setLocationList([]);
//       } finally {
//         setDropdownLoading(false);
//       }
//     };

//     fetchDropdowns();
//   }, []);

//   // ==========================================
//   // OPEN ADD ASSET
//   // ==========================================

//   const handleOpenAdd = () => {
//     setEditingAsset(null);
//     setIsModalOpen(true);
//   };

//   // ==========================================
//   // OPEN EDIT ASSET
//   // ==========================================

//   const handleOpenEdit = (asset) => {
//     setEditingAsset(asset);
//     setIsModalOpen(true);
//   };

//   // ==========================================
//   // CLOSE MODAL
//   // ==========================================

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingAsset(null);
//   };

//   // ==========================================
//   // SUBMIT ASSET
//   // ==========================================

//   const handleFormSubmit = async (formData, assetId) => {
//     try {
//       if (assetId) {
//         await editAsset?.(assetId, formData);
//       } else {
//         await addAsset?.(formData);
//       }

//       handleCloseModal();
//     } catch (err) {
//       console.error("Asset Save Error:", err);
//     }
//   };

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <div className="space-y-3 -mt-4 text-1xl">
//       {/* PAGE HEADER */}

//       <PageHeader
//         title="Asset Inventory"
//         subtitle="Manage hardware catalogs, purchases, and operational status"
//         actions={
//           <Button size="sm" onClick={handleOpenAdd}>
//             <Plus className="h-4 w-4" />
//             Item Creation
//           </Button>
//         }
//       />

//       {/* FILTERS */}

//       <AssetFilters
//         searchTerm={searchTerm}
//         onSearchChange={onSearchChange}
//         categoryFilter={categoryFilter}
//         onCategoryChange={onCategoryChange}
//         statusFilter={statusFilter}
//         onStatusChange={onStatusChange}
//         categories={categories}
//       />

//       {/* ERROR */}

//       {error && (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
//           <p className="text-xs text-red-700">{error}</p>
//         </div>
//       )}

//       {/* TABLE */}

//       {loading ? (
//         <Loader message="Loading hardware repository..." />
//       ) : (
//         <div className="space-y-3">
//           {/* <AssetTable
//             assets={assets}
//             onEdit={handleOpenEdit}
//             onDelete={(tag) => setDeleteTargetTag(tag)}
//           /> */}
//           // Parent component me:
//           <AssetTable
//             assets={assets}
//             locations={locations} // <--- YEH PASS HONA ZAROORI HAI
//             loading={loading}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//           {/* PAGINATION */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
//               <span className="text-xs text-slate-500">
//                 Page{" "}
//                 <span className="font-semibold text-slate-800">{page}</span> of{" "}
//                 <span className="font-semibold text-slate-800">
//                   {totalPages}
//                 </span>{" "}
//                 ({totalItems} total)
//               </span>

//               <div className="flex items-center gap-2">
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   size="sm"
//                   onClick={prevPage}
//                   disabled={page <= 1}
//                 >
//                   <ChevronLeft className="h-3.5 w-3.5" />
//                   Previous
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="secondary"
//                   size="sm"
//                   onClick={nextPage}
//                   disabled={page >= totalPages}
//                 >
//                   Next
//                   <ChevronRight className="h-3.5 w-3.5" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ADD / EDIT ASSET MODAL */}

//       <AssetModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={handleFormSubmit}
//         assetToEdit={editingAsset}
//         types={types}
//         items={itemList}
//         locations={locationList}
//       />

//       {/* DELETE CONFIRMATION */}

//       <ConfirmDialog
//         isOpen={!!deleteTargetTag}
//         onClose={() => setDeleteTargetTag(null)}
//         onConfirm={async () => {
//           try {
//             await removeAsset?.(deleteTargetTag);
//             setDeleteTargetTag(null);
//           } catch (err) {
//             console.error("Delete Asset Error:", err);
//           }
//         }}
//         title="Confirm Asset Deletion"
//         message={`Are you certain you wish to delete asset ${deleteTargetTag}? This record will be permanently detached.`}
//         confirmLabel="Delete Asset"
//         isDestructive
//       />
//     </div>
//   );
// };

// export default Assets;
import React, { useEffect, useState } from "react";

import { useAssets } from "../../hooks/useAssets";

import { PageHeader } from "../../components/layout/PageHeader";
import { AssetFilters } from "../../components/assets/AssetFilters";
import { AssetTable } from "../../components/assets/AssetTable";
import { AssetModal } from "../../components/assets/AssetModal";

import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { getCategories, getTypes } from "../../services/categoryService";
import { itemService } from "../../services/itemService";
import { getLocations } from "../../services/locationService"; // <--- LOCATION SERVICE IMPORT

export const Assets = () => {
  // ==========================================
  // ASSET DATA
  // ==========================================

  const {
    assets,
    loading,
    error,

    searchTerm,
    categoryFilter,
    statusFilter,

    onSearchChange,
    onCategoryChange,
    onStatusChange,

    page,
    totalPages,
    totalItems,

    nextPage,
    prevPage,

    refetch,
    addAsset,
    editAsset,
    removeAsset,
  } = useAssets(10);

  // ==========================================
  // CATEGORY + TYPE + ITEM + LOCATION DATA
  // ==========================================

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const [dropdownLoading, setDropdownLoading] = useState(false);

  // ==========================================
  // MODAL
  // ==========================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // ==========================================
  // DELETE
  // ==========================================

  const [deleteTargetTag, setDeleteTargetTag] = useState(null);

  // ==========================================
  // GET CATEGORIES + TYPES + ITEMS + LOCATIONS
  // ==========================================

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setDropdownLoading(true);

        const [categoryResponse, typeResponse, itemResponse, locationResponse] =
          await Promise.all([
            getCategories(),
            getTypes(),
            itemService.getAlls(),
            getLocations(), // <--- SERVICE FUNCTION CALL
          ]);

        console.log("Categories:", categoryResponse);
        console.log("Types:", typeResponse);
        console.log("Items:", itemResponse);
        console.log("Locations:", locationResponse);

        // Categories
        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);

        // Types
        setTypes(
          typeResponse?.success && Array.isArray(typeResponse.data)
            ? typeResponse.data
            : Array.isArray(typeResponse)
              ? typeResponse
              : [],
        );

        // Item Master mapping
        const rawItems = Array.isArray(itemResponse)
          ? itemResponse
          : itemResponse?.data || [];
        setItemList(
          rawItems.map((i) => ({
            value: String(i.ItemID ?? i.itemId ?? i.id),
            label: i.ItemName ?? i.itemName ?? i.name ?? "Item",
            BillID: i.BillID ?? i.billId ?? "",
            InvoiceNo: i.InvoiceNo ?? i.invoiceNo ?? i.BillNo ?? "",
            Price: i.UnitPrice ?? i.unitPrice ?? i.Price ?? "",
          })),
        );

        // Locations mapping
        const rawLocations = Array.isArray(locationResponse)
          ? locationResponse
          : locationResponse?.data || [];
        setLocationList(
          rawLocations.map((loc) => ({
            value: String(loc.LocationID ?? loc.locationId ?? loc.id),
            label:
              loc.LocationName ?? loc.locationName ?? loc.name ?? "Location",
            LocationID: loc.LocationID ?? loc.locationId ?? loc.id,
            LocationName:
              loc.LocationName ?? loc.locationName ?? loc.name ?? "Location",
          })),
        );
      } catch (err) {
        console.error("Dropdown API Error:", err);

        setCategories([]);
        setTypes([]);
        setItemList([]);
        setLocationList([]);
      } finally {
        setDropdownLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  // ==========================================
  // OPEN ADD ASSET
  // ==========================================

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT ASSET
  // ==========================================

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  // ==========================================
  // SUBMIT ASSET
  // ==========================================

  const handleFormSubmit = async (formData, assetId) => {
    try {
      if (assetId) {
        await editAsset?.(assetId, formData);
      } else {
        await addAsset?.(formData);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Asset Save Error:", err);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-3 -mt-4 text-1xl">
      {/* PAGE HEADER */}

      <PageHeader
        title="Asset Inventory"
        subtitle="Manage hardware catalogs, purchases, and operational status"
        actions={
          <Button size="sm" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" />
            Item Creation
          </Button>
        }
      />

      {/* FILTERS */}

      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={onCategoryChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        categories={categories}
      />

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* TABLE */}

      {loading ? (
        <Loader message="Loading hardware repository..." />
      ) : (
        <div className="space-y-3">
          <AssetTable
            assets={assets}
            locations={locationList}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={(tag) => setDeleteTargetTag(tag)}
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="text-xs text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-800">{page}</span> of{" "}
                <span className="font-semibold text-slate-800">
                  {totalPages}
                </span>{" "}
                ({totalItems} total)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={prevPage}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={nextPage}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT ASSET MODAL */}

      <AssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        assetToEdit={editingAsset}
        types={types}
        items={itemList}
        locations={locationList}
      />

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        isOpen={!!deleteTargetTag}
        onClose={() => setDeleteTargetTag(null)}
        onConfirm={async () => {
          try {
            await removeAsset?.(deleteTargetTag);
            setDeleteTargetTag(null);
          } catch (err) {
            console.error("Delete Asset Error:", err);
          }
        }}
        title="Confirm Asset Deletion"
        message={`Are you certain you wish to delete asset ${deleteTargetTag}? This record will be permanently detached.`}
        confirmLabel="Delete Asset"
        isDestructive
      />
    </div>
  );
};

export default Assets;
