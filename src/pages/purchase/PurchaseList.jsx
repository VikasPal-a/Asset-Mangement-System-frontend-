import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Edit,
  Trash2,
  Plus,
  X,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Card } from "../../components/common/Card";

import {
  getPurchaseBills,
  getPurchaseBillById,
  updatePurchaseBill,
  deletePurchaseBill,
} from "../../services/purchaseService";
import { vendorService } from "../../services/vendorService";
import { itemService } from "../../services/itemService";

export const PurchaseList = () => {
  const [bills, setBills] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Edit/View Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    vendorId: "",
    invoiceNo: "",
    billDate: "",
    items: [],
  });

  // 1. Data Fetching
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [billsRes, vendorRes, itemRes] = await Promise.all([
        getPurchaseBills(),
        vendorService.getAll(),
        itemService.getAlls(),
      ]);

      const rawBills = Array.isArray(billsRes)
        ? billsRes
        : billsRes?.data || [];

      const billsWithItems = await Promise.all(
        rawBills.map(async (b) => {
          const bId = b.BillID ?? b.billId ?? b.id;
          try {
            const detailRes = await getPurchaseBillById(bId);
            return {
              ...b,
              items: detailRes?.items || b.items || [],
              billInfo: detailRes?.billInfo || b,
            };
          } catch (err) {
            console.error(`Error loading items for bill #${bId}:`, err);
            return { ...b, items: b.items || [] };
          }
        }),
      );

      setBills(billsWithItems);

      const rawVendors = Array.isArray(vendorRes)
        ? vendorRes
        : vendorRes?.data || [];
      setVendors(
        rawVendors.map((v) => ({
          value: String(v.VendorID ?? v.vendorId ?? v.id),
          label: v.PartyName ?? v.partyName ?? v.name ?? "Unknown Party",
        })),
      );

      const rawItems = Array.isArray(itemRes) ? itemRes : itemRes?.data || [];
      setItemList(
        rawItems.map((i) => ({
          value: String(i.ItemID ?? i.itemId ?? i.id),
          label: i.ItemName ?? i.itemName ?? i.name ?? "Unknown Item",
          unit: i.Unit ?? i.unit ?? "Pcs",
          description: i.Description ?? i.description ?? "",
        })),
      );
    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helpers
  const getVendorName = (vId) => {
    const found = vendors.find((v) => String(v.value) === String(vId));
    return found ? found.label : `Vendor #${vId}`;
  };

  const getItemFullDetails = (iId) => {
    const found = itemList.find((i) => String(i.value) === String(iId));
    return found || { label: `Item #${iId}`, unit: "Pcs", description: "" };
  };

  // 2. Open Edit Modal
  const handleEditClick = async (bill) => {
    const bId = bill.BillID ?? bill.billId ?? bill.id;
    setEditingBillId(bId);

    try {
      const res = await getPurchaseBillById(bId);
      const billInfo = res?.billInfo || res?.data || bill;
      const billItems = res?.items || billInfo?.items || bill.items || [];

      setEditFormData({
        vendorId: String(billInfo.VendorID ?? billInfo.vendorId ?? ""),
        invoiceNo: billInfo.InvoiceNo ?? billInfo.invoiceNo ?? "",
        billDate: billInfo.BillDate
          ? billInfo.BillDate.split("T")[0]
          : billInfo.billDate || "",
        items: billItems.map((i) => ({
          itemId: String(i.ItemID ?? i.itemId ?? ""),
          quantity: i.Quantity ?? i.quantity ?? 1,
          unitPrice: i.UnitPrice ?? i.unitPrice ?? 0,
          totalPrice: i.TotalPrice ?? i.totalPrice ?? 0,
        })),
      });

      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Load single bill details error:", err);
      setEditFormData({
        vendorId: String(bill.vendorId ?? bill.VendorID ?? ""),
        invoiceNo: bill.invoiceNo ?? bill.InvoiceNo ?? "",
        billDate: bill.billDate ?? bill.BillDate?.split("T")[0] ?? "",
        items: (bill.items || []).map((i) => ({
          itemId: String(i.itemId ?? i.ItemID ?? ""),
          quantity: i.quantity ?? i.Quantity ?? 1,
          unitPrice: i.unitPrice ?? i.UnitPrice ?? 0,
          totalPrice: i.totalPrice ?? i.TotalPrice ?? 0,
        })),
      });
      setIsEditModalOpen(true);
    }
  };

  // 3. Delete Bill
  const handleDelete = async (billId) => {
    if (
      !window.confirm(`Kya aap Bill ID #${billId} ko delete karna chahte hain?`)
    )
      return;

    try {
      const res = await deletePurchaseBill(billId);
      if (res?.success || res?.status === 200) {
        alert("Purchase Bill successfully deleted!");
        setBills((prev) =>
          prev.filter((b) => (b.BillID ?? b.billId ?? b.id) !== billId),
        );
      } else {
        alert(res?.message || "Delete failed !");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert(err.response?.data?.message || "Delete failed!");
    }
  };

  // Edit Handlers
  const handleEditItemChange = (index, field, value) => {
    const updated = [...editFormData.items];
    updated[index][field] = value;

    if (field === "quantity" || field === "unitPrice") {
      const qty = parseInt(updated[index].quantity, 10) || 0;
      const rate = parseFloat(updated[index].unitPrice) || 0;
      updated[index].totalPrice = Number((qty * rate).toFixed(2));
    }

    setEditFormData((prev) => ({ ...prev, items: updated }));
  };

  const handleAddEditItem = () => {
    setEditFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { itemId: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
      ],
    }));
  };

  const handleRemoveEditItem = (index) => {
    if (editFormData.items.length === 1) return;
    setEditFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const editGrandTotal = Number(
    editFormData.items
      .reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
      .toFixed(2),
  );

  // 4. Update Handler
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.vendorId || !editFormData.invoiceNo.trim()) {
      alert("Vendor and Invoice Number mandatory!");
      return;
    }

    const payload = {
      vendorId: parseInt(editFormData.vendorId, 10),
      invoiceNo: editFormData.invoiceNo.trim(),
      billDate: editFormData.billDate,
      totalAmount: parseFloat(editGrandTotal),
      items: editFormData.items.map((i) => ({
        itemId: parseInt(i.itemId, 10),
        quantity: parseInt(i.quantity, 10),
        unitPrice: parseFloat(Number(i.unitPrice).toFixed(2)),
        totalPrice: parseFloat(Number(i.totalPrice).toFixed(2)),
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await updatePurchaseBill(editingBillId, payload);
      if (res?.success) {
        alert("Purchase Bill successfully updated");
        setIsEditModalOpen(false);
        fetchData();
      } else {
        alert(res?.message || "Update failed!");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.message || "Update failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flatten Bills & Items into single row array
  const flattenedRows = useMemo(() => {
    const list = [];
    bills.forEach((bill) => {
      const billId = bill.BillID ?? bill.billId ?? bill.id;
      const vId = bill.vendorId ?? bill.VendorID;
      const invoice = bill.invoiceNo ?? bill.InvoiceNo ?? "N/A";
      const rawDate = bill.billDate ?? bill.BillDate;
      const formattedDate = rawDate ? rawDate.split("T")[0] : "-";
      const grandTotal = Number(bill.totalAmount ?? bill.TotalAmount ?? 0);
      const vendorName =
        bill.VendorName ?? bill.billInfo?.PartyName ?? getVendorName(vId);

      const itemsArray = bill.items || [];

      if (itemsArray.length === 0) {
        list.push({
          billId,
          bill,
          invoice,
          formattedDate,
          vendorName,
          vId,
          itemName: "-",
          unit: "-",
          description: "-",
          qty: 0,
          unitPrice: 0,
          totalPrice: 0,
          grandTotal,
        });
      } else {
        itemsArray.forEach((item) => {
          const iId = item.ItemID ?? item.itemId;
          const itemMaster = getItemFullDetails(iId);

          list.push({
            billId,
            bill,
            invoice,
            formattedDate,
            vendorName,
            vId,
            itemName: item.ItemName || item.itemName || itemMaster.label,
            unit: item.Unit || item.unit || itemMaster.unit || "Pcs",
            description:
              item.Description ||
              item.description ||
              itemMaster.description ||
              "-",
            qty: item.Quantity ?? item.quantity ?? 0,
            unitPrice: item.UnitPrice ?? item.unitPrice ?? 0,
            totalPrice: item.TotalPrice ?? item.totalPrice ?? 0,
            grandTotal,
          });
        });
      }
    });
    return list;
  }, [bills, vendors, itemList]);

  // Filtering
  const filteredRows = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return flattenedRows;

    return flattenedRows.filter((row) => {
      return (
        row.invoice.toLowerCase().includes(s) ||
        row.vendorName.toLowerCase().includes(s) ||
        row.itemName.toLowerCase().includes(s) ||
        row.formattedDate.toLowerCase().includes(s) ||
        String(row.vId).toLowerCase().includes(s)
      );
    });
  }, [flattenedRows, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-[98%] mx-auto py-5 px-2 sm:px-3 space-y-4 text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-600" /> Purchase Bills
            Registry
          </h1>
          <p className="text-[11px] text-slate-500">
            Single unified table view with Invoice, Date, Vendor, and Detailed
            Item specs.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Invoice, Vendor, Item, Date..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
            />
          </div>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-200 rounded-md px-2 py-1.5 text-xs bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Main Single Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-2.5 w-10 text-center">S.No.</th>
                <th className="py-2.5 px-2.5 min-w-[90px]">Bill Date</th>
                <th className="py-2.5 px-2.5 min-w-[110px]">Invoice No</th>
                <th className="py-2.5 px-2.5 min-w-[130px]">Vendor / Party</th>
                <th className="py-2.5 px-2.5 min-w-[140px]">Item Name</th>
                <th className="py-2.5 px-2.5 min-w-[140px]">Description</th>
                <th className="py-2.5 px-2.5 w-12 text-center">Unit</th>
                <th className="py-2.5 px-2.5 w-12 text-center">Qty</th>
                <th className="py-2.5 px-2.5 text-right min-w-[85px]">
                  Rate (₹)
                </th>
                <th className="py-2.5 px-2.5 text-right min-w-[95px]">
                  Item Total (₹)
                </th>
                <th className="py-2.5 px-2.5 text-right min-w-[105px]">
                  Bill Total (₹)
                </th>
                <th className="py-2.5 px-2.5 text-center w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {isLoading ? (
                <tr>
                  <td colSpan="12" className="py-8 text-center text-slate-400">
                    Loading Purchase Bills & Items...
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan="12" className="py-8 text-center text-slate-400">
                    No Record Found
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, index) => {
                  const serialNo = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <tr
                      key={`${row.billId}-${index}`}
                      className="hover:bg-slate-50/75 transition-colors"
                    >
                      <td className="py-2 px-2.5 text-center font-medium text-slate-500">
                        {serialNo}
                      </td>
                      <td className="py-2 px-2.5 text-slate-600 font-mono">
                        {row.formattedDate}
                      </td>
                      <td className="py-2 px-2.5">
                        <span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-mono font-medium text-[10px]">
                          {row.invoice}
                        </span>
                      </td>
                      <td className="py-2 px-2.5">
                        <div className="font-medium text-slate-800">
                          {row.vendorName}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          ID: #{row.vId}
                        </div>
                      </td>
                      <td className="py-2 px-2.5 font-medium text-slate-700">
                        {row.itemName}
                      </td>
                      <td
                        className="py-2 px-2.5 text-slate-500 max-w-[160px] truncate"
                        title={row.description}
                      >
                        {row.description}
                      </td>
                      <td className="py-2 px-2.5 text-center text-slate-600">
                        <span className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">
                          {row.unit}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-center font-semibold text-slate-800">
                        {row.qty}
                      </td>
                      <td className="py-2 px-2.5 text-right text-slate-600">
                        ₹{" "}
                        {Number(row.unitPrice).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 px-2.5 text-right font-medium text-slate-800">
                        ₹{" "}
                        {Number(row.totalPrice).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 px-2.5 text-right font-bold text-sky-700 bg-sky-50/30">
                        ₹{" "}
                        {Number(row.grandTotal).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditClick(row.bill)}
                            className="p-1 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"
                            title="Edit Bill"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row.billId)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                            title="Delete Bill"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-3 py-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredRows.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * itemsPerPage, filteredRows.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {filteredRows.length}
            </span>{" "}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`min-w-[26px] h-6 px-1.5 text-[10px] font-semibold rounded border transition ${
                  currentPage === page
                    ? "bg-sky-600 text-white border-sky-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Update Purchase Bill #{editingBillId}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Update supplier, invoice number, and line item details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateSubmit}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                  label={<span className="text-[11px]">Select Vendor</span>}
                  value={editFormData.vendorId}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, vendorId: e.target.value }))
                  }
                  options={vendors}
                  className="text-xs py-1.5"
                  required
                />
                <Input
                  label={<span className="text-[11px]">Invoice Number</span>}
                  value={editFormData.invoiceNo}
                  onChange={(e) =>
                    setEditFormData((p) => ({
                      ...p,
                      invoiceNo: e.target.value,
                    }))
                  }
                  className="text-xs py-1.5"
                  required
                />
                <Input
                  label={<span className="text-[11px]">Bill Date</span>}
                  type="date"
                  value={editFormData.billDate}
                  onChange={(e) =>
                    setEditFormData((p) => ({
                      ...p,
                      billDate: e.target.value,
                    }))
                  }
                  className="text-xs py-1.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
                    Bill Line Items
                  </h4>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddEditItem}
                    className="text-xs py-0.5 px-2 h-6"
                  >
                    <Plus className="w-3 h-3 mr-1 text-slate-600" /> Add Row
                  </Button>
                </div>

                <div className="border border-slate-200 rounded-md overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-semibold uppercase">
                      <tr>
                        <th className="py-2 px-2 min-w-[160px]">Item Name</th>
                        <th className="py-2 px-2 w-24">Quantity</th>
                        <th className="py-2 px-2 w-28">Unit Price (₹)</th>
                        <th className="py-2 px-2 w-28">Total Price (₹)</th>
                        <th className="py-2 px-2 w-10 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editFormData.items.map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-1.5">
                            <Select
                              value={row.itemId}
                              onChange={(e) =>
                                handleEditItemChange(
                                  idx,
                                  "itemId",
                                  e.target.value,
                                )
                              }
                              options={itemList}
                              className="text-xs py-1"
                              required
                            />
                          </td>
                          <td className="p-1.5">
                            <Input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={(e) =>
                                handleEditItemChange(
                                  idx,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className="text-xs py-1"
                              required
                            />
                          </td>
                          <td className="p-1.5">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={row.unitPrice}
                              onChange={(e) =>
                                handleEditItemChange(
                                  idx,
                                  "unitPrice",
                                  e.target.value,
                                )
                              }
                              className="text-xs py-1"
                              required
                            />
                          </td>
                          <td className="p-1.5">
                            <Input
                              type="number"
                              disabled
                              value={row.totalPrice}
                              className="bg-slate-50 font-medium text-xs py-1"
                            />
                          </td>
                          <td className="p-1.5 text-center">
                            <button
                              type="button"
                              disabled={editFormData.items.length === 1}
                              onClick={() => handleRemoveEditItem(idx)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Updated Grand Total:
                  </span>
                  <span className="text-base font-bold text-sky-700">
                    ₹{" "}
                    {editGrandTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
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
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Update Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseList;
