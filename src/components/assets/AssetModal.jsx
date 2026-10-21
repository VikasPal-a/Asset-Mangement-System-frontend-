import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";

export const AssetModal = ({
  isOpen,
  onClose,
  onSubmit,
  assetToEdit,
  types = [],
  items = [],
  locations = [],
}) => {
  const [formData, setFormData] = useState({
    ItemID: "",
    AssetName: "",
    TypeID: "",
    SerialNumber: "",
    Price: "",
    WarrantyExpiryDate: "",
    Status: "InStock",
    BillID: "",
    InvoiceNo: "",
    CurrentLocationID: "",
    CreatedBy: "Admin",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assetToEdit) {
      setFormData({
        ItemID: String(assetToEdit.ItemID ?? assetToEdit.itemID ?? ""),
        AssetName: assetToEdit.AssetName ?? assetToEdit.assetName ?? "",
        SerialNumber:
          assetToEdit.SerialNumber ?? assetToEdit.serialNumber ?? "",
        TypeID: String(assetToEdit.TypeID ?? assetToEdit.typeID ?? ""),
        Price: assetToEdit.Price ?? assetToEdit.price ?? "",
        WarrantyExpiryDate:
          (assetToEdit.WarrantyExpiryDate ?? assetToEdit.warrantyexpirydate)
            ? (
                assetToEdit.WarrantyExpiryDate ?? assetToEdit.warrantyexpirydate
              ).split("T")[0]
            : "",
        Status: assetToEdit.Status ?? assetToEdit.status ?? "InStock",
        BillID: String(assetToEdit.BillID ?? assetToEdit.billID ?? ""),
        InvoiceNo:
          assetToEdit.InvoiceNo ??
          assetToEdit.BillNo ??
          assetToEdit.billNo ??
          "",
        CurrentLocationID: String(
          assetToEdit.CurrentLocationID ?? assetToEdit.currentLocationID ?? "",
        ),
        CreatedBy: "Admin",
        UpdatedBy: "Admin",
      });
    } else {
      setFormData({
        ItemID: "",
        AssetName: "",
        SerialNumber: "",
        TypeID: "",
        Price: "",
        WarrantyExpiryDate: "",
        Status: "InStock",
        BillID: "",
        InvoiceNo: "",
        CurrentLocationID: "",
        CreatedBy: "Admin",
      });
    }
  }, [assetToEdit, isOpen]);

  if (!isOpen) return null;

  // Item select hone par AssetName, Price, aur Bill details automatically bind honge
  const handleItemSelectChange = (e) => {
    const selectedItemId = e.target.value;
    const selectedItemObj = items.find(
      (item) =>
        String(item.value ?? item.ItemID ?? item.itemID) ===
        String(selectedItemId),
    );

    const assetName = selectedItemObj
      ? (selectedItemObj.label ??
        selectedItemObj.ItemName ??
        selectedItemObj.itemName)
      : "";

    const autoBillId =
      selectedItemObj?.BillID ??
      selectedItemObj?.billID ??
      selectedItemObj?.billId ??
      "";

    const autoBillNo =
      selectedItemObj?.InvoiceNo ??
      selectedItemObj?.invoiceNo ??
      selectedItemObj?.BillNo ??
      (autoBillId ? `BILL-#${autoBillId}` : "");

    const autoPrice =
      selectedItemObj?.Price ??
      selectedItemObj?.price ??
      selectedItemObj?.UnitPrice ??
      selectedItemObj?.unitPrice ??
      "";

    setFormData((prev) => ({
      ...prev,
      ItemID: selectedItemId,
      AssetName: assetName || prev.AssetName,
      BillID: autoBillId ? String(autoBillId) : prev.BillID,
      InvoiceNo: autoBillNo || prev.InvoiceNo,
      Price: autoPrice ? String(autoPrice) : prev.Price,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.AssetName) {
      alert("Select the Asset Name");
      return;
    }
    if (!formData.TypeID) {
      alert("Select Asset Type");
      return;
    }

    setIsSubmitting(true);
    try {
      // Backend Int aur Decimal fields ko blank string ki jagah number/null bhejte hain
      const payload = {
        ...formData,
        Price: formData.Price ? Number(formData.Price) : null,
        BillID: formData.BillID ? Number(formData.BillID) : null,
        ItemID: formData.ItemID ? Number(formData.ItemID) : null,
        TypeID: Number(formData.TypeID),
        CurrentLocationID: formData.CurrentLocationID
          ? Number(formData.CurrentLocationID)
          : null,
      };

      await onSubmit(
        payload,
        assetToEdit ? (assetToEdit.AssetID ?? assetToEdit.assetID) : null,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {assetToEdit
                ? `Edit Asset #${assetToEdit.AssetID ?? assetToEdit.assetID}`
                : "Add New Asset"}
            </h3>
            <p className="text-[10px] text-slate-500">
              {assetToEdit
                ? `Tag: ${assetToEdit.AssetTag ?? assetToEdit.assetTag}`
                : "Select item from Item Master"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. ITEM MASTER DROPDOWN */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Select Item (from Item Master) *
              </label>
              <select
                name="ItemID"
                value={formData.ItemID}
                onChange={handleItemSelectChange}
                required
                className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">-- Choose Item from Item Master --</option>
                {items.map((i) => (
                  <option
                    key={i.value ?? i.ItemID ?? i.itemID}
                    value={i.value ?? i.ItemID ?? i.itemID}
                  >
                    {i.label ?? i.ItemName ?? i.itemName}
                  </option>
                ))}
              </select>
              {formData.AssetName && (
                <p className="text-[10px] text-sky-600 font-medium mt-1">
                  Selected Asset: {formData.AssetName}
                </p>
              )}
            </div>

            {/* 2. PRICE (ADDED) */}
            <Input
              label={<span className="text-[11px]">Price (₹)</span>}
              type="number"
              step="0.01"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
              placeholder="e.g. 45000"
              className="text-xs py-1.5"
            />

            {/* 3. BILL ID (ADDED) */}
            <Input
              label={<span className="text-[11px]">Bill ID / Invoice ID</span>}
              type="number"
              name="BillID"
              value={formData.BillID}
              onChange={handleChange}
              placeholder="e.g. 102"
              className="text-xs py-1.5"
            />

            {/* 4. CURRENT LOCATION */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Current Location
              </label>
              <select
                name="CurrentLocationID"
                value={formData.CurrentLocationID}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">-- Choose Location --</option>
                {locations.map((loc) => (
                  <option
                    key={loc.value ?? loc.LocationID ?? loc.id}
                    value={loc.value ?? loc.LocationID ?? loc.id}
                  >
                    {loc.label ?? loc.LocationName ?? loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. ASSET TYPE */}
            <Select
              label={<span className="text-[11px]">Asset Type *</span>}
              name="TypeID"
              value={formData.TypeID}
              onChange={handleChange}
              options={types.map((t) => ({
                value: String(t.TypeID ?? t.typeID ?? t.id),
                label: `${t.TypeName ?? t.typeName ?? t.name} (${
                  t.CategoryName || t.categoryName || "N/A"
                })`,
              }))}
              placeholder="-- Choose Type --"
              className="text-xs py-1.5"
              required
            />

            {/* 6. SERIAL NUMBER */}
            <Input
              label={<span className="text-[11px]"> Item Serial Number</span>}
              name="SerialNumber"
              value={formData.SerialNumber}
              onChange={handleChange}
              placeholder="e.g. DL-SN-998877"
              className="text-xs py-1.5"
            />

            {/* 7. WARRANTY EXPIRY */}
            <Input
              label={<span className="text-[11px]">Warranty Date</span>}
              type="date"
              name="WarrantyExpiryDate"
              value={formData.WarrantyExpiryDate}
              onChange={handleChange}
              className="text-xs py-1.5"
            />

            {/* 8. STATUS */}
            <Select
              label={<span className="text-[11px]">Status</span>}
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              options={[
                { value: "InStock", label: "InStock" },
                { value: "Assigned", label: "Assigned" },
                { value: "In Maintenance", label: "In Maintenance" },
                { value: "Decommissioned", label: "Decommissioned" },
              ]}
              className="text-xs py-1.5"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs py-1 px-2.5 h-7"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="text-xs py-1 px-3 h-7"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              {assetToEdit ? "Update Asset" : "Save Asset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;
