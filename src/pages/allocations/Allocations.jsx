import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAllocations } from "../../hooks/useAllocations";
import { useAssets } from "../../hooks/useAssets";

import { AllocationTable } from "../../components/allocations/AllocationTable";
import { AllocationModal } from "../../components/allocations/AllocationModal";
import { ReturnAssetModal } from "../../components/allocations/ReturnAssetModal";

import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { AllocationFilters } from "../../components/allocations/AllocationFilters";

import { Layers, Share2 } from "lucide-react";

export const Allocations = () => {
  const navigate = useNavigate();

  const { allocations, loading, assignAsset, returnAsset } = useAllocations();

  const { assets, refetch: refetchAssets } = useAssets();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null);

  // // Available assets filter
  // const InStockAssets = assets.filter((a) => {
  //   const assetStatus = String(a.status ?? a.Status ?? "")
  //     .trim()
  //     .toLowerCase();

  //   return assetStatus === "InStock";
  // });

  // Direct check bina toLowerCase ke
  const InStockAssets = (assets || []).filter((a) => {
    const assetStatus = (a.Status ?? a.status ?? "").trim();
    return assetStatus === "InStock";
  });

  // Allocation filters
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedDateFilter, setAssignedDateFilter] = useState("");
  const [returnDateFilter, setReturnDateFilter] = useState("");

  // Filter allocation records
  const filteredAllocations = allocations.filter((alloc) => {
    const search = searchTerm.trim().toLowerCase();

    const assetName = String(
      alloc.assetName ?? alloc.AssetName ?? "",
    ).toLowerCase();

    const employeeName = String(
      alloc.emp_name ?? alloc.EmployeeName ?? alloc.employeeName ?? "",
    ).toLowerCase();

    const assignedDate = alloc.AssignedDate
      ? String(alloc.AssignedDate).substring(0, 10)
      : "";

    const returnDate = alloc.ReturnDate
      ? String(alloc.ReturnDate).substring(0, 10)
      : "";

    const matchesSearch =
      assetName.includes(search) || employeeName.includes(search);

    const matchesAssignedDate =
      !assignedDateFilter || assignedDate === assignedDateFilter;

    const matchesReturnDate =
      !returnDateFilter || returnDate === returnDateFilter;

    return matchesSearch && matchesAssignedDate && matchesReturnDate;
  });

  // Return asset
  const handleReturnSuccess = async (allocationId) => {
    try {
      await returnAsset(allocationId);

      setReturnTarget(null);

      await refetchAssets();
    } catch (error) {
      console.error("Return failed:", error);

      alert(error.response?.data?.message || "Return fail check the console");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto w-full max-w-7xl ">
        {/* HEADER */}
        <div className="-mt-8 sm:-mt-10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700">
              <Layers size={18} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
                Asset Allocation & Returns
              </h1>

              <p className="text-[11px] text-slate-500">
                Monitor deployments, equipment handovers, and device recovery
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-1.5 text-xs py-2"
          >
            <Share2 className="w-4 h-4" />
            Assign Asset
          </Button>
        </div>

        {/* FILTERS */}
        <AllocationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          assignedDateFilter={assignedDateFilter}
          onAssignedDateChange={setAssignedDateFilter}
          returnDateFilter={returnDateFilter}
          onReturnDateChange={setReturnDateFilter}
          onClear={() => {
            setSearchTerm("");
            setAssignedDateFilter("");
            setReturnDateFilter("");
          }}
        />

        {loading ? (
          <Loader message="Loading active allocations..." />
        ) : (
          <AllocationTable
            allocations={filteredAllocations}
            onReturn={(allocation) => setReturnTarget(allocation)}
            onViewHistory={(allocation) =>
              navigate(`/allocations/view-history/${allocation.AssetID}`)
            }
          />
        )}

        <AllocationModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          InStockAssets={InStockAssets}
          onSubmit={(data) => {
            assignAsset(data);
            refetchAssets();
          }}
        />

        <ReturnAssetModal
          isOpen={!!returnTarget}
          onClose={() => setReturnTarget(null)}
          allocation={returnTarget}
          onConfirm={handleReturnSuccess}
        />
      </div>
    </div>
  );
};

export default Allocations;
