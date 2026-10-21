// // import React, { useState, useEffect, useMemo } from "react";
// // import { Plus, Trash2, CheckCircle, FileText } from "lucide-react";
// // import { Button } from "../../components/common/Button";
// // import { Input } from "../../components/common/Input";
// // import { Select } from "../../components/common/Select";
// // import { Card } from "../../components/common/Card";

// // // Services
// // import { vendorService } from "../../services/vendorService";
// // import { itemService } from "../../services/itemService";
// // import {
// //   createPurchaseBill,
// //   getPurchaseBills,
// //   getPurchaseBillById,
// //   updatePurchaseBill,
// //   deletePurchaseBill,
// // } from "../../services/purchaseService";

// // export const PurchaseEntry = () => {
// //   const [vendors, setVendors] = useState([]);
// //   const [itemList, setItemList] = useState([]);
// //   const [bills, setBills] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isTableLoading, setIsTableLoading] = useState(false);

// //   // Search & Pagination State
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(10);

// //   // Edit Modal State
// //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// //   const [editingBillId, setEditingBillId] = useState(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [editFormData, setEditFormData] = useState({
// //     vendorId: "",
// //     invoiceNo: "",
// //     billDate: "",
// //     items: [],
// //   });

// //   // Entry Form State
// //   const [formData, setFormData] = useState({
// //     vendorId: "",
// //     invoiceNo: "",
// //     billDate: new Date().toISOString().split("T")[0],
// //     items: [{ itemId: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
// //   });

// //   // 1. Fetch Bills List with Detailed Items
// //   const loadBillsData = async () => {
// //     setIsTableLoading(true);
// //     try {
// //       const billsRes = await getPurchaseBills();
// //       const rawBills = Array.isArray(billsRes)
// //         ? billsRes
// //         : billsRes?.data || [];

// //       const billsWithItems = await Promise.all(
// //         rawBills.map(async (b) => {
// //           const bId = b.BillID ?? b.billId ?? b.id;
// //           try {
// //             const detailRes = await getPurchaseBillById(bId);
// //             return {
// //               ...b,
// //               items: detailRes?.items || b.items || [],
// //               billInfo: detailRes?.billInfo || b,
// //             };
// //           } catch (err) {
// //             return { ...b, items: b.items || [] };
// //           }
// //         }),
// //       );

// //       setBills(billsWithItems);
// //     } catch (err) {
// //       console.error("Bills data load karne me error:", err);
// //     } finally {
// //       setIsTableLoading(false);
// //     }
// //   };

// //   // 2. Initial Data Loading (Dropdowns & Table)
// //   useEffect(() => {
// //     const loadDropdownData = async () => {
// //       try {
// //         const [vendorRes, itemRes] = await Promise.all([
// //           vendorService.getAll(),
// //           itemService.getAlls(),
// //         ]);

// //         const rawVendors = Array.isArray(vendorRes)
// //           ? vendorRes
// //           : vendorRes?.data || [];
// //         setVendors(
// //           rawVendors.map((v) => ({
// //             value: String(v.VendorID ?? v.vendorId ?? v.id),
// //             label: v.PartyName ?? v.partyName ?? v.name ?? "Unknown Party",
// //           })),
// //         );

// //         let itemsArray = [];
// //         if (Array.isArray(itemRes)) {
// //           itemsArray = itemRes;
// //         } else if (Array.isArray(itemRes?.data)) {
// //           itemsArray = itemRes.data;
// //         } else if (Array.isArray(itemRes?.items)) {
// //           itemsArray = itemRes.items;
// //         } else if (Array.isArray(itemRes?.recordset)) {
// //           itemsArray = itemRes.recordset;
// //         }

// //         const formattedItems = itemsArray.map((i) => ({
// //           value: String(
// //             i.ItemID ?? i.itemId ?? i.id ?? i.Item_ID ?? i.item_id ?? "",
// //           ),
// //           label: String(
// //             i.ItemName ??
// //               i.itemName ??
// //               i.name ??
// //               i.Item_Name ??
// //               i.item_name ??
// //               "Item",
// //           ),
// //           unit: i.Unit ?? i.unit ?? "Pcs",
// //           description: i.Description ?? i.description ?? "",
// //         }));

// //         setItemList(formattedItems);
// //       } catch (err) {
// //         console.error("Dropdown data load karne me error:", err);
// //       }
// //     };

// //     loadDropdownData();
// //     loadBillsData();
// //   }, []);

// //   // Helpers
// //   const getVendorName = (vId) => {
// //     const found = vendors.find((v) => String(v.value) === String(vId));
// //     return found ? found.label : `Vendor #${vId}`;
// //   };

// //   const getItemFullDetails = (iId) => {
// //     const found = itemList.find((i) => String(i.value) === String(iId));
// //     return found || { label: `Item #${iId}`, unit: "Pcs", description: "" };
// //   };

// //   // Header change handlers
// //   const handleHeaderChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // Row Item changes handler
// //   const handleItemChange = (index, field, value) => {
// //     const updatedItems = [...formData.items];
// //     updatedItems[index][field] = value;

// //     if (field === "quantity" || field === "unitPrice") {
// //       const qty = parseInt(updatedItems[index].quantity, 10) || 0;
// //       const rate = parseFloat(updatedItems[index].unitPrice) || 0;
// //       updatedItems[index].totalPrice = Number((qty * rate).toFixed(2));
// //     }

// //     setFormData((prev) => ({ ...prev, items: updatedItems }));
// //   };

// //   const handleAddItem = () => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       items: [
// //         ...prev.items,
// //         { itemId: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
// //       ],
// //     }));
// //   };

// //   const handleRemoveItem = (index) => {
// //     if (formData.items.length === 1) return;
// //     setFormData((prev) => ({
// //       ...prev,
// //       items: prev.items.filter((_, i) => i !== index),
// //     }));
// //   };

// //   const grandTotal = Number(
// //     formData.items
// //       .reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
// //       .toFixed(2),
// //   );

// //   // Submit Handler for New Bill
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!formData.vendorId) {
// //       alert("Select Vendor Name !");
// //       return;
// //     }
// //     if (!formData.invoiceNo.trim()) {
// //       alert("required Invoice Number!");
// //       return;
// //     }
// //     if (!formData.items || formData.items.length === 0) {
// //       alert("required to select min one item");
// //       return;
// //     }

// //     const hasEmptyItem = formData.items.some(
// //       (item) => !item.itemId || Number(item.quantity) <= 0,
// //     );
// //     if (hasEmptyItem) {
// //       alert("Select the all row data and quantity!");
// //       return;
// //     }

// //     const payload = {
// //       vendorId: parseInt(formData.vendorId, 10),
// //       invoiceNo: formData.invoiceNo.trim(),
// //       billDate: formData.billDate,
// //       totalAmount: parseFloat(grandTotal),
// //       items: formData.items.map((i) => ({
// //         itemId: parseInt(i.itemId, 10),
// //         quantity: parseInt(i.quantity, 10),
// //         unitPrice: parseFloat(Number(i.unitPrice).toFixed(2)),
// //         totalPrice: parseFloat(Number(i.totalPrice).toFixed(2)),
// //       })),
// //     };

// //     setIsLoading(true);

// //     try {
// //       const res = await createPurchaseBill(payload);

// //       if (res?.success) {
// //         alert(
// //           `${res.message || "Purchase bill saved successfully!"} (Bill ID: ${res.billId})`,
// //         );
// //         setFormData({
// //           vendorId: "",
// //           invoiceNo: "",
// //           billDate: new Date().toISOString().split("T")[0],
// //           items: [{ itemId: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
// //         });
// //         loadBillsData();
// //       } else {
// //         alert(res?.message || "Bill does not save !");
// //       }
// //     } catch (err) {
// //       console.error("Save Purchase Bill Error:", err);
// //       const backendMessage =
// //         err.response?.data?.message ||
// //         err.response?.data?.error ||
// //         err.message ||
// //         "Server Connection Error";
// //       alert(`Error (${err.response?.status || 500}): ${backendMessage}`);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-6xl mx-auto py-5 px-3 space-y-4 text-xs">
// //       {/* Header */}
// //       <div className="flex items-center gap-2">
// //         <div className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
// //           <FileText className="w-4 h-4" />
// //         </div>
// //         <div>
// //           <h1 className="text-base font-bold text-slate-800 tracking-tight">
// //             Purchase Bill Entry
// //           </h1>
// //           <p className="text-[11px] text-slate-500">
// //             Record supplier bills and individual line items into inventory.
// //           </p>
// //         </div>
// //       </div>

// //       {/* Entry Form */}
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         {/* Bill Master Section */}
// //         <Card
// //           title={
// //             <span className="text-xs font-semibold">Invoice Information</span>
// //           }
// //           description={
// //             <span className="text-[11px] text-slate-400">
// //               Supplier details and invoice reference
// //             </span>
// //           }
// //         >
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
// //             <Select
// //               label={<span className="text-[11px]">Select Vendor</span>}
// //               name="vendorId"
// //               value={formData.vendorId}
// //               onChange={handleHeaderChange}
// //               options={vendors}
// //               placeholder="-- Choose Party Name --"
// //               className="text-xs py-1.5"
// //               required
// //             />
// //             <Input
// //               label={<span className="text-[11px]">Invoice Number</span>}
// //               name="invoiceNo"
// //               value={formData.invoiceNo}
// //               onChange={handleHeaderChange}
// //               placeholder="e.g. INV-2026-991"
// //               className="text-xs py-1.5"
// //               required
// //             />
// //             <Input
// //               label={<span className="text-[11px]">Purchase Date</span>}
// //               name="billDate"
// //               type="date"
// //               value={formData.billDate}
// //               onChange={handleHeaderChange}
// //               className="text-xs py-1.5"
// //               required
// //             />
// //           </div>
// //         </Card>

// //         {/* Dynamic Items Table Section */}
// //         <Card
// //           title={<span className="text-xs font-semibold">Bill Items</span>}
// //           description={
// //             <span className="text-[11px] text-slate-400">
// //               Items associated with this purchase bill
// //             </span>
// //           }
// //           headerAction={
// //             <Button
// //               type="button"
// //               variant="secondary"
// //               size="sm"
// //               onClick={handleAddItem}
// //               className="text-xs py-1 px-2.5 h-7"
// //             >
// //               <Plus className="w-3.5 h-3.5 mr-1 text-slate-600" /> Add Item
// //             </Button>
// //           }
// //         >
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-left border-collapse">
// //               <thead>
// //                 <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500">
// //                   <th className="pb-2 px-1.5 min-w-[200px]">Item Name</th>
// //                   <th className="pb-2 px-1.5 w-28">Quantity</th>
// //                   <th className="pb-2 px-1.5 w-32">Unit Price (₹)</th>
// //                   <th className="pb-2 px-1.5 w-36">Total Price (₹)</th>
// //                   <th className="pb-2 px-1.5 w-12 text-center">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-100 text-xs">
// //                 {formData.items.map((row, index) => (
// //                   <tr key={index} className="hover:bg-slate-50/50">
// //                     <td className="py-2 px-1.5">
// //                       <Select
// //                         name={`itemId-${index}`}
// //                         value={row.itemId}
// //                         onChange={(e) =>
// //                           handleItemChange(index, "itemId", e.target.value)
// //                         }
// //                         options={itemList}
// //                         placeholder="-- Choose Item Name --"
// //                         className="text-xs py-1"
// //                         required
// //                       />
// //                     </td>
// //                     <td className="py-2 px-1.5">
// //                       <Input
// //                         type="number"
// //                         min="1"
// //                         value={row.quantity}
// //                         onChange={(e) =>
// //                           handleItemChange(index, "quantity", e.target.value)
// //                         }
// //                         className="text-xs py-1"
// //                         required
// //                       />
// //                     </td>
// //                     <td className="py-2 px-1.5">
// //                       <Input
// //                         type="number"
// //                         step="0.01"
// //                         min="0"
// //                         value={row.unitPrice}
// //                         onChange={(e) =>
// //                           handleItemChange(index, "unitPrice", e.target.value)
// //                         }
// //                         className="text-xs py-1"
// //                         required
// //                       />
// //                     </td>
// //                     <td className="py-2 px-1.5">
// //                       <Input
// //                         type="number"
// //                         disabled
// //                         value={row.totalPrice}
// //                         className="bg-slate-50 font-semibold text-slate-700 text-xs py-1"
// //                       />
// //                     </td>
// //                     <td className="py-2 px-1.5 text-center align-middle">
// //                       <Button
// //                         type="button"
// //                         variant="ghost"
// //                         size="sm"
// //                         disabled={formData.items.length === 1}
// //                         onClick={() => handleRemoveItem(index)}
// //                         className="text-rose-500 hover:bg-rose-50 hover:text-rose-700 p-1 h-7 w-7"
// //                       >
// //                         <Trash2 className="w-3.5 h-3.5" />
// //                       </Button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Grand Total Bar */}
// //           <div className="mt-4 flex flex-col sm:flex-row items-center justify-between rounded-lg bg-slate-50 p-3 border border-slate-200">
// //             <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
// //               Total Amount Payable:
// //             </span>
// //             <span className="text-lg font-bold text-sky-700 tracking-tight">
// //               ₹{" "}
// //               {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
// //             </span>
// //           </div>
// //         </Card>

// //         {/* Submit Actions */}
// //         <div className="flex justify-end gap-2">
// //           <Button
// //             type="submit"
// //             variant="primary"
// //             size="sm"
// //             isLoading={isLoading}
// //             className="text-xs py-1.5 px-3 h-8"
// //           >
// //             <CheckCircle className="w-4 h-4 mr-1" /> Save Purchase Bill
// //           </Button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default PurchaseEntry;

// import React, { useState, useEffect, useMemo } from "react";
// import { Plus, Trash2, CheckCircle, FileText } from "lucide-react";
// import { Button } from "../../components/common/Button";
// import { Input } from "../../components/common/Input";
// import { Select } from "../../components/common/Select";
// import { Card } from "../../components/common/Card";

// // Services
// import { vendorService } from "../../services/vendorService";
// import { itemService } from "../../services/itemService";
// import {
//   createPurchaseBill,
//   getPurchaseBills,
//   getPurchaseBillById,
// } from "../../services/purchaseService";

// const GST_OPTIONS = [
//   { value: "0", label: "0%" },
//   { value: "5", label: "5%" },
//   { value: "12", label: "12%" },
//   { value: "18", label: "18%" },
//   { value: "28", label: "28%" },
// ];

// export const PurchaseEntry = () => {
//   const [vendors, setVendors] = useState([]);
//   const [itemList, setItemList] = useState([]);
//   const [bills, setBills] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isTableLoading, setIsTableLoading] = useState(false);

//   // Form State matching the exact UI design
//   const [formData, setFormData] = useState({
//     vendorId: "",
//     invoiceNo: "",
//     billDate: new Date().toISOString().split("T")[0],
//     remarks: "",
//     items: [
//       {
//         itemId: "",
//         hsnSac: "",
//         quantity: 1,
//         unitPrice: 0,
//         gstRate: 18,
//         taxableAmount: 0,
//         taxAmount: 0,
//         totalPrice: 0,
//       },
//     ],
//   });

//   // 1. Fetch Bills List
//   const loadBillsData = async () => {
//     setIsTableLoading(true);
//     try {
//       const billsRes = await getPurchaseBills();
//       const rawBills = Array.isArray(billsRes)
//         ? billsRes
//         : billsRes?.data || [];

//       const billsWithItems = await Promise.all(
//         rawBills.map(async (b) => {
//           const bId = b.BillID ?? b.billId ?? b.id;
//           try {
//             const detailRes = await getPurchaseBillById(bId);
//             return {
//               ...b,
//               items: detailRes?.items || b.items || [],
//               billInfo: detailRes?.billInfo || b,
//             };
//           } catch (err) {
//             return { ...b, items: b.items || [] };
//           }
//         }),
//       );
//       setBills(billsWithItems);
//     } catch (err) {
//       console.error("Bills data load karne me error:", err);
//     } finally {
//       setIsTableLoading(false);
//     }
//   };

//   // 2. Load Vendors & Items
//   useEffect(() => {
//     const loadDropdownData = async () => {
//       try {
//         const [vendorRes, itemRes] = await Promise.all([
//           vendorService.getAll(),
//           itemService.getAlls(),
//         ]);

//         const rawVendors = Array.isArray(vendorRes)
//           ? vendorRes
//           : vendorRes?.data || [];
//         setVendors(
//           rawVendors.map((v) => ({
//             value: String(v.VendorID ?? v.vendorId ?? v.id),
//             label: v.PartyName ?? v.partyName ?? v.name ?? "Unknown Party",
//           })),
//         );

//         let itemsArray = [];
//         if (Array.isArray(itemRes)) {
//           itemsArray = itemRes;
//         } else if (Array.isArray(itemRes?.data)) {
//           itemsArray = itemRes.data;
//         } else if (Array.isArray(itemRes?.items)) {
//           itemsArray = itemRes.items;
//         } else if (Array.isArray(itemRes?.recordset)) {
//           itemsArray = itemRes.recordset;
//         }

//         const formattedItems = itemsArray.map((i) => ({
//           value: String(
//             i.ItemID ?? i.itemId ?? i.id ?? i.Item_ID ?? i.item_id ?? "",
//           ),
//           label: String(
//             i.ItemName ??
//               i.itemName ??
//               i.name ??
//               i.Item_Name ??
//               i.item_name ??
//               "Item",
//           ),
//           hsnSac: i.HsnSac ?? i.hsnSac ?? i.hsn ?? "",
//           unit: i.Unit ?? i.unit ?? "Pcs",
//           unitPrice: Number(i.Price ?? i.unitPrice ?? i.Rate ?? 0),
//           gstRate: Number(i.GSTRate ?? i.gstRate ?? 18),
//         }));

//         setItemList(formattedItems);
//       } catch (err) {
//         console.error("Dropdown data load karne me error:", err);
//       }
//     };

//     loadDropdownData();
//     loadBillsData();
//   }, []);

//   // Invoice level header inputs
//   const handleHeaderChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Row item change with Auto Calculation
//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...formData.items];
//     const currentRow = { ...updatedItems[index], [field]: value };

//     // Auto populate item info if itemId changes
//     if (field === "itemId") {
//       const selectedItem = itemList.find(
//         (i) => String(i.value) === String(value),
//       );
//       if (selectedItem) {
//         if (selectedItem.hsnSac) currentRow.hsnSac = selectedItem.hsnSac;
//         if (selectedItem.unitPrice)
//           currentRow.unitPrice = selectedItem.unitPrice;
//         if (selectedItem.gstRate !== undefined)
//           currentRow.gstRate = selectedItem.gstRate;
//       }
//     }

//     const qty = parseFloat(currentRow.quantity) || 0;
//     const rate = parseFloat(currentRow.unitPrice) || 0;
//     const gst = parseFloat(currentRow.gstRate) || 0;

//     const taxable = Number((qty * rate).toFixed(2));
//     const tax = Number(((taxable * gst) / 100).toFixed(2));
//     const total = Number((taxable + tax).toFixed(2));

//     currentRow.taxableAmount = taxable;
//     currentRow.taxAmount = tax;
//     currentRow.totalPrice = total;

//     updatedItems[index] = currentRow;
//     setFormData((prev) => ({ ...prev, items: updatedItems }));
//   };

//   const handleAddItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           itemId: "",
//           hsnSac: "",
//           quantity: 1,
//           unitPrice: 0,
//           gstRate: 18,
//           taxableAmount: 0,
//           taxAmount: 0,
//           totalPrice: 0,
//         },
//       ],
//     }));
//   };

//   const handleRemoveItem = (index) => {
//     if (formData.items.length === 1) return;
//     setFormData((prev) => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   };

//   // Summary calculations
//   const summary = useMemo(() => {
//     const totalTaxable = formData.items.reduce(
//       (sum, item) => sum + (Number(item.taxableAmount) || 0),
//       0,
//     );
//     const totalTax = formData.items.reduce(
//       (sum, item) => sum + (Number(item.taxAmount) || 0),
//       0,
//     );
//     const exactTotal = totalTaxable + totalTax;
//     const roundedGrandTotal = Math.round(exactTotal);
//     const roundOff = Number((roundedGrandTotal - exactTotal).toFixed(2));

//     return {
//       totalTaxable: totalTaxable.toFixed(2),
//       totalTax: totalTax.toFixed(2),
//       exactTotal: exactTotal.toFixed(2),
//       roundOff:
//         roundOff >= 0 ? `+${roundOff.toFixed(2)}` : `${roundOff.toFixed(2)}`,
//       grandTotal: roundedGrandTotal.toFixed(2),
//     };
//   }, [formData.items]);

//   // Submit Handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.vendorId) {
//       alert("Please select Vendor!");
//       return;
//     }
//     if (!formData.invoiceNo.trim()) {
//       alert("Invoice Number is required!");
//       return;
//     }
//     if (formData.items.some((i) => !i.itemId || Number(i.quantity) <= 0)) {
//       alert("Please choose items and valid quantities for all rows!");
//       return;
//     }

//     const payload = {
//       vendorId: parseInt(formData.vendorId, 10),
//       invoiceNo: formData.invoiceNo.trim(),
//       billDate: formData.billDate,
//       remarks: formData.remarks.trim(),
//       totalTaxableAmount: parseFloat(summary.totalTaxable),
//       totalTaxAmount: parseFloat(summary.totalTax),
//       totalAmount: parseFloat(summary.grandTotal),
//       items: formData.items.map((i) => ({
//         itemId: parseInt(i.itemId, 10),
//         hsnSac: i.hsnSac || "",
//         quantity: parseInt(i.quantity, 10),
//         unitPrice: parseFloat(Number(i.unitPrice).toFixed(2)),
//         gstRate: parseFloat(Number(i.gstRate).toFixed(2)),
//         taxableAmount: parseFloat(Number(i.taxableAmount).toFixed(2)),
//         taxAmount: parseFloat(Number(i.taxAmount).toFixed(2)),
//         totalPrice: parseFloat(Number(i.totalPrice).toFixed(2)),
//       })),
//     };

//     setIsLoading(true);
//     try {
//       const res = await createPurchaseBill(payload);
//       if (res?.success) {
//         alert(
//           `${res.message || "Purchase bill saved successfully!"} (Bill ID: ${res.billId || ""})`,
//         );
//         setFormData({
//           vendorId: "",
//           invoiceNo: "",
//           billDate: new Date().toISOString().split("T")[0],
//           remarks: "",
//           items: [
//             {
//               itemId: "",
//               hsnSac: "",
//               quantity: 1,
//               unitPrice: 0,
//               gstRate: 18,
//               taxableAmount: 0,
//               taxAmount: 0,
//               totalPrice: 0,
//             },
//           ],
//         });
//         loadBillsData();
//       } else {
//         alert(res?.message || "Failed to save purchase bill!");
//       }
//     } catch (err) {
//       console.error("Save Purchase Bill Error:", err);
//       const backendMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Server Connection Error";
//       alert(`Error: ${backendMessage}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto py-6 px-4 space-y-5 text-slate-800">
//       {/* Title Header */}
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
//           <FileText className="w-5 h-5" />
//         </div>
//         <div>
//           <h1 className="text-xl font-bold text-slate-900 tracking-tight">
//             Purchase Bill Entry
//           </h1>
//           <p className="text-xs text-slate-500">
//             Record supplier bills and individual line items into inventory.
//           </p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Card 1: Invoice Information */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
//           <h2 className="text-sm font-semibold text-slate-900">
//             Invoice Information
//           </h2>
//           <p className="text-[11px] text-slate-400 mb-4">
//             Supplier details and invoice reference
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Select
//               label={
//                 <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600">
//                   Select Vendor <span className="text-rose-500">*</span>
//                 </span>
//               }
//               name="vendorId"
//               value={formData.vendorId}
//               onChange={handleHeaderChange}
//               options={vendors}
//               placeholder="-- Select Vendor --"
//               className="text-xs py-2"
//               required
//             />
//             <Input
//               label={
//                 <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600">
//                   Invoice Number <span className="text-rose-500">*</span>
//                 </span>
//               }
//               name="invoiceNo"
//               value={formData.invoiceNo}
//               onChange={handleHeaderChange}
//               placeholder="INV-2026-991"
//               className="text-xs py-2"
//               required
//             />
//             <Input
//               label={
//                 <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600">
//                   Bill Date <span className="text-rose-500">*</span>
//                 </span>
//               }
//               name="billDate"
//               type="date"
//               value={formData.billDate}
//               onChange={handleHeaderChange}
//               className="text-xs py-2"
//               required
//             />
//           </div>
//         </div>

//         {/* Card 2: Bill Items */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-sm font-semibold text-slate-900">
//                 Bill Items
//               </h2>
//               <p className="text-[11px] text-slate-400">
//                 Add multiple items to this purchase bill. GST will be calculated
//                 automatically.
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
//             >
//               <Plus className="w-3.5 h-3.5" /> Add Item
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
//                   <th className="py-2.5 px-2 w-10 text-center">#</th>
//                   <th className="py-2.5 px-2 min-w-[200px]">
//                     Item Name <span className="text-rose-500">*</span>
//                   </th>
//                   <th className="py-2.5 px-2 w-28">HSN/SAC</th>
//                   <th className="py-2.5 px-2 w-24">
//                     Qty <span className="text-rose-500">*</span>
//                   </th>
//                   <th className="py-2.5 px-2 w-32">
//                     Unit Price (₹) <span className="text-rose-500">*</span>
//                   </th>
//                   <th className="py-2.5 px-2 w-28">
//                     GST % <span className="text-rose-500">*</span>
//                   </th>
//                   <th className="py-2.5 px-2 w-32">Taxable Amount (₹)</th>
//                   <th className="py-2.5 px-2 w-32">Tax Amount (₹)</th>
//                   <th className="py-2.5 px-2 w-32">Total Price (₹)</th>
//                   <th className="py-2.5 px-2 w-16 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-xs">
//                 {formData.items.map((row, index) => (
//                   <tr
//                     key={index}
//                     className="hover:bg-slate-50/60 transition-colors"
//                   >
//                     <td className="py-2.5 px-2 text-center text-slate-500 font-medium">
//                       {index + 1}
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <Select
//                         name={`itemId-${index}`}
//                         value={row.itemId}
//                         onChange={(e) =>
//                           handleItemChange(index, "itemId", e.target.value)
//                         }
//                         options={itemList}
//                         placeholder="Select Item"
//                         className="text-xs py-1"
//                         required
//                       />
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <input
//                         type="text"
//                         placeholder="HSN/SAC"
//                         value={row.hsnSac}
//                         onChange={(e) =>
//                           handleItemChange(index, "hsnSac", e.target.value)
//                         }
//                         className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
//                       />
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <input
//                         type="number"
//                         min="1"
//                         value={row.quantity}
//                         onChange={(e) =>
//                           handleItemChange(index, "quantity", e.target.value)
//                         }
//                         className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
//                         required
//                       />
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={row.unitPrice}
//                         onChange={(e) =>
//                           handleItemChange(index, "unitPrice", e.target.value)
//                         }
//                         className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
//                         required
//                       />
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <select
//                         value={String(row.gstRate)}
//                         onChange={(e) =>
//                           handleItemChange(index, "gstRate", e.target.value)
//                         }
//                         className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
//                       >
//                         {GST_OPTIONS.map((g) => (
//                           <option key={g.value} value={g.value}>
//                             {g.label}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <input
//                         type="text"
//                         readOnly
//                         value={Number(row.taxableAmount).toLocaleString(
//                           "en-IN",
//                           {
//                             minimumFractionDigits: 2,
//                           },
//                         )}
//                         className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 font-medium"
//                       />
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <input
//                         type="text"
//                         readOnly
//                         value={Number(row.taxAmount).toLocaleString("en-IN", {
//                           minimumFractionDigits: 2,
//                         })}
//                         className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 font-medium"
//                       />
//                     </td>
//                     <td className="py-2.5 px-2">
//                       <input
//                         type="text"
//                         readOnly
//                         value={Number(row.totalPrice).toLocaleString("en-IN", {
//                           minimumFractionDigits: 2,
//                         })}
//                         className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-900 font-semibold"
//                       />
//                     </td>
//                     <td className="py-2.5 px-2 text-center align-middle">
//                       <button
//                         type="button"
//                         disabled={formData.items.length === 1}
//                         onClick={() => handleRemoveItem(index)}
//                         className="p-1 rounded text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Table Summary Bar */}
//           <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
//             <span className="font-semibold text-slate-700">
//               Total Items: {formData.items.length}
//             </span>
//             <div className="flex items-center gap-6">
//               <div>
//                 <span className="text-[11px] text-slate-400 mr-2">
//                   Total Taxable Amount
//                 </span>
//                 <span className="font-bold text-slate-800">
//                   ₹{" "}
//                   {Number(summary.totalTaxable).toLocaleString("en-IN", {
//                     minimumFractionDigits: 2,
//                   })}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[11px] text-slate-400 mr-2">
//                   Total Tax Amount
//                 </span>
//                 <span className="font-bold text-slate-800">
//                   ₹{" "}
//                   {Number(summary.totalTax).toLocaleString("en-IN", {
//                     minimumFractionDigits: 2,
//                   })}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[11px] text-slate-400 mr-2">
//                   Total (Incl. GST)
//                 </span>
//                 <span className="font-bold text-sky-700">
//                   ₹{" "}
//                   {Number(summary.exactTotal).toLocaleString("en-IN", {
//                     minimumFractionDigits: 2,
//                   })}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 3: Bill Summary (Auto Calculated) & Remarks */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
//           <div>
//             <h2 className="text-sm font-semibold text-slate-900">
//               Bill Summary (Auto Calculated)
//             </h2>
//             <p className="text-[11px] text-slate-400">
//               These values are calculated based on the items and GST.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
//             {/* 3 summary inputs */}
//             <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div>
//                 <label className="block text-[11px] font-semibold text-slate-600 mb-1">
//                   Total Taxable Amount
//                 </label>
//                 <input
//                   type="text"
//                   readOnly
//                   value={summary.totalTaxable}
//                   className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold text-slate-600 mb-1">
//                   Total Tax Amount (GST)
//                 </label>
//                 <input
//                   type="text"
//                   readOnly
//                   value={summary.totalTax}
//                   className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold text-slate-600 mb-1">
//                   Rounded Off
//                 </label>
//                 <input
//                   type="text"
//                   readOnly
//                   value={summary.roundOff}
//                   className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium"
//                 />
//               </div>
//             </div>

//             {/* Grand Total Box (Blue Highlight as in Screenshot) */}
//             <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-center">
//               <span className="block text-[11px] font-semibold text-sky-800 uppercase tracking-wider mb-1">
//                 Grand Total (₹)
//               </span>
//               <span className="text-2xl font-black text-sky-700 tracking-tight">
//                 {Number(summary.grandTotal).toLocaleString("en-IN", {
//                   minimumFractionDigits: 2,
//                 })}
//               </span>
//             </div>
//           </div>

//           {/* Remarks */}
//           <div className="pt-2">
//             <label className="block text-[11px] font-semibold text-slate-600 mb-1">
//               Remarks{" "}
//               <span className="text-slate-400 font-normal">(Optional)</span>
//             </label>
//             <textarea
//               name="remarks"
//               rows={2}
//               value={formData.remarks}
//               onChange={handleHeaderChange}
//               placeholder="Enter any additional notes..."
//               className="w-full rounded border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm transition-colors disabled:opacity-60"
//           >
//             <CheckCircle className="w-4 h-4" />
//             {isLoading ? "Saving..." : "Save Purchase Bill"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PurchaseEntry;

//=======
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, CheckCircle, FileText } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Card } from "../../components/common/Card";

// Services
import { vendorService } from "../../services/vendorService";
import { itemService } from "../../services/itemService";
import {
  createPurchaseBill,
  getPurchaseBills,
  getPurchaseBillById,
} from "../../services/purchaseService";

export const PurchaseEntry = () => {
  const [vendors, setVendors] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Form State matching the exact UI design
  const [formData, setFormData] = useState({
    vendorId: "",
    invoiceNo: "",
    billDate: new Date().toISOString().split("T")[0],
    remarks: "",
    items: [
      {
        itemId: "",
        hsnSac: "",
        quantity: 1,
        unitPrice: 0,
        gstRate: 18,
        taxableAmount: 0,
        taxAmount: 0,
        totalPrice: 0,
      },
    ],
  });

  // 1. Fetch Bills List
  const loadBillsData = async () => {
    setIsTableLoading(true);
    try {
      const billsRes = await getPurchaseBills();
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
            return { ...b, items: b.items || [] };
          }
        }),
      );
      setBills(billsWithItems);
    } catch (err) {
      console.error("Bills data load karne me error:", err);
    } finally {
      setIsTableLoading(false);
    }
  };

  // 2. Load Vendors & Items
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [vendorRes, itemRes] = await Promise.all([
          vendorService.getAll(),
          itemService.getAlls(),
        ]);

        const rawVendors = Array.isArray(vendorRes)
          ? vendorRes
          : vendorRes?.data || [];
        setVendors(
          rawVendors.map((v) => ({
            value: String(v.VendorID ?? v.vendorId ?? v.id),
            label: v.PartyName ?? v.partyName ?? v.name ?? "Unknown Party",
          })),
        );

        let itemsArray = [];
        if (Array.isArray(itemRes)) {
          itemsArray = itemRes;
        } else if (Array.isArray(itemRes?.data)) {
          itemsArray = itemRes.data;
        } else if (Array.isArray(itemRes?.items)) {
          itemsArray = itemRes.items;
        } else if (Array.isArray(itemRes?.recordset)) {
          itemsArray = itemRes.recordset;
        }

        const formattedItems = itemsArray.map((i) => ({
          value: String(
            i.ItemID ?? i.itemId ?? i.id ?? i.Item_ID ?? i.item_id ?? "",
          ),
          label: String(
            i.ItemName ??
              i.itemName ??
              i.name ??
              i.Item_Name ??
              i.item_name ??
              "Item",
          ),
          hsnSac: i.HsnSac ?? i.hsnSac ?? i.hsn ?? "",
          unit: i.Unit ?? i.unit ?? "Pcs",
          unitPrice: Number(i.Price ?? i.unitPrice ?? i.Rate ?? 0),
          gstRate: Number(i.GSTRate ?? i.gstRate ?? 18),
        }));

        setItemList(formattedItems);
      } catch (err) {
        console.error("Dropdown data load karne me error:", err);
      }
    };

    loadDropdownData();
    loadBillsData();
  }, []);

  // Invoice level header inputs
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Row item change with Auto Calculation
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const currentRow = { ...updatedItems[index], [field]: value };

    // Auto populate item info if itemId changes
    if (field === "itemId") {
      const selectedItem = itemList.find(
        (i) => String(i.value) === String(value),
      );
      if (selectedItem) {
        if (selectedItem.hsnSac) currentRow.hsnSac = selectedItem.hsnSac;
        if (selectedItem.unitPrice)
          currentRow.unitPrice = selectedItem.unitPrice;
        if (selectedItem.gstRate !== undefined)
          currentRow.gstRate = selectedItem.gstRate;
      }
    }

    const qty = parseFloat(currentRow.quantity) || 0;
    const rate = parseFloat(currentRow.unitPrice) || 0;
    const gst = parseFloat(currentRow.gstRate) || 0;

    const taxable = Number((qty * rate).toFixed(2));
    const tax = Number(((taxable * gst) / 100).toFixed(2));
    const total = Number((taxable + tax).toFixed(2));

    currentRow.taxableAmount = taxable;
    currentRow.taxAmount = tax;
    currentRow.totalPrice = total;

    updatedItems[index] = currentRow;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: "",
          hsnSac: "",
          quantity: 1,
          unitPrice: 0,
          gstRate: 18,
          taxableAmount: 0,
          taxAmount: 0,
          totalPrice: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Summary calculations
  const summary = useMemo(() => {
    const totalTaxable = formData.items.reduce(
      (sum, item) => sum + (Number(item.taxableAmount) || 0),
      0,
    );
    const totalTax = formData.items.reduce(
      (sum, item) => sum + (Number(item.taxAmount) || 0),
      0,
    );
    const exactTotal = totalTaxable + totalTax;
    const roundedGrandTotal = Math.round(exactTotal);
    const roundOff = Number((roundedGrandTotal - exactTotal).toFixed(2));

    return {
      totalTaxable: totalTaxable.toFixed(2),
      totalTax: totalTax.toFixed(2),
      exactTotal: exactTotal.toFixed(2),
      roundOff:
        roundOff >= 0 ? `+${roundOff.toFixed(2)}` : `${roundOff.toFixed(2)}`,
      grandTotal: roundedGrandTotal.toFixed(2),
    };
  }, [formData.items]);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendorId) {
      alert("Please select Vendor!");
      return;
    }
    if (!formData.invoiceNo.trim()) {
      alert("Invoice Number is required!");
      return;
    }
    if (formData.items.some((i) => !i.itemId || Number(i.quantity) <= 0)) {
      alert("Please choose items and valid quantities for all rows!");
      return;
    }

    const payload = {
      vendorId: parseInt(formData.vendorId, 10),
      invoiceNo: formData.invoiceNo.trim(),
      billDate: formData.billDate,
      remarks: formData.remarks.trim(),
      totalTaxableAmount: parseFloat(summary.totalTaxable),
      totalTaxAmount: parseFloat(summary.totalTax),
      totalAmount: parseFloat(summary.grandTotal),
      items: formData.items.map((i) => ({
        itemId: parseInt(i.itemId, 10),
        hsnSac: i.hsnSac || "",
        quantity: parseInt(i.quantity, 10),
        unitPrice: parseFloat(Number(i.unitPrice).toFixed(2)),
        gstRate: parseFloat(Number(i.gstRate).toFixed(2)),
        taxableAmount: parseFloat(Number(i.taxableAmount).toFixed(2)),
        taxAmount: parseFloat(Number(i.taxAmount).toFixed(2)),
        totalPrice: parseFloat(Number(i.totalPrice).toFixed(2)),
      })),
    };

    setIsLoading(true);
    try {
      const res = await createPurchaseBill(payload);
      if (res?.success) {
        alert(
          `${res.message || "Purchase bill saved successfully!"} (Bill ID: ${res.billId || ""})`,
        );
        setFormData({
          vendorId: "",
          invoiceNo: "",
          billDate: new Date().toISOString().split("T")[0],
          remarks: "",
          items: [
            {
              itemId: "",
              hsnSac: "",
              quantity: 1,
              unitPrice: 0,
              gstRate: 18,
              taxableAmount: 0,
              taxAmount: 0,
              totalPrice: 0,
            },
          ],
        });
        loadBillsData();
      } else {
        alert(res?.message || "Failed to save purchase bill!");
      }
    } catch (err) {
      console.error("Save Purchase Bill Error:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Server Connection Error";
      alert(`Error: ${backendMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-5 text-slate-800">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Purchase Bill Entry
          </h1>
          <p className="text-xs text-slate-500">
            Record supplier bills and individual line items into inventory.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Card 1: Invoice Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Invoice Information
          </h2>
          <p className="text-[11px] text-slate-400 mb-4">
            Supplier details and invoice reference
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label={
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600">
                  Select Vendor <span className="text-rose-500">*</span>
                </span>
              }
              name="vendorId"
              value={formData.vendorId}
              onChange={handleHeaderChange}
              options={vendors}
              placeholder="-- Select Vendor --"
              className="text-xs py-2"
              required
            />
            <Input
              label={
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600">
                  Invoice Number <span className="text-rose-500">*</span>
                </span>
              }
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleHeaderChange}
              placeholder="INV-2026-991"
              className="text-xs py-2"
              required
            />
            <Input
              label={
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600">
                  Bill Date <span className="text-rose-500">*</span>
                </span>
              }
              name="billDate"
              type="date"
              value={formData.billDate}
              onChange={handleHeaderChange}
              className="text-xs py-2"
              required
            />
          </div>
        </div>

        {/* Card 2: Bill Items */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Bill Items
              </h2>
              <p className="text-[11px] text-slate-400">
                Add multiple items to this purchase bill. GST will be calculated
                automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="py-2.5 px-2 w-10 text-center">#</th>
                  <th className="py-2.5 px-2 min-w-[200px]">
                    Item Name <span className="text-rose-500">*</span>
                  </th>
                  <th className="py-2.5 px-2 w-28">HSN/SAC</th>
                  <th className="py-2.5 px-2 w-24">
                    Qty <span className="text-rose-500">*</span>
                  </th>
                  <th className="py-2.5 px-2 w-32">
                    Unit Price (₹) <span className="text-rose-500">*</span>
                  </th>
                  <th className="py-2.5 px-2 w-28">
                    GST % <span className="text-rose-500">*</span>
                  </th>
                  <th className="py-2.5 px-2 w-32">Taxable Amount (₹)</th>
                  <th className="py-2.5 px-2 w-32">Tax Amount (₹)</th>
                  <th className="py-2.5 px-2 w-32">Total Price (₹)</th>
                  <th className="py-2.5 px-2 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {formData.items.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-2.5 px-2 text-center text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-2">
                      <Select
                        name={`itemId-${index}`}
                        value={row.itemId}
                        onChange={(e) =>
                          handleItemChange(index, "itemId", e.target.value)
                        }
                        options={itemList}
                        placeholder="Select Item"
                        className="text-xs py-1"
                        required
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        placeholder="HSN/SAC"
                        value={row.hsnSac}
                        onChange={(e) =>
                          handleItemChange(index, "hsnSac", e.target.value)
                        }
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        required
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={row.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", e.target.value)
                        }
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        required
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="18"
                          value={row.gstRate}
                          onChange={(e) =>
                            handleItemChange(index, "gstRate", e.target.value)
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1 pr-6 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          required
                        />
                        <span className="absolute right-2 text-slate-400 font-semibold text-[11px] pointer-events-none">
                          %
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        readOnly
                        value={Number(row.taxableAmount).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 font-medium"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        readOnly
                        value={Number(row.taxAmount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 font-medium"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        readOnly
                        value={Number(row.totalPrice).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-900 font-semibold"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center align-middle">
                      <button
                        type="button"
                        disabled={formData.items.length === 1}
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Summary Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
            <span className="font-semibold text-slate-700">
              Total Items: {formData.items.length}
            </span>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-slate-400 mr-2">
                  Total Taxable Amount
                </span>
                <span className="font-bold text-slate-800">
                  ₹{" "}
                  {Number(summary.totalTaxable).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 mr-2">
                  Total Tax Amount
                </span>
                <span className="font-bold text-slate-800">
                  ₹{" "}
                  {Number(summary.totalTax).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 mr-2">
                  Total (Incl. GST)
                </span>
                <span className="font-bold text-sky-700">
                  ₹{" "}
                  {Number(summary.exactTotal).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Bill Summary (Auto Calculated) & Remarks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Bill Summary (Auto Calculated)
            </h2>
            <p className="text-[11px] text-slate-400">
              These values are calculated based on the items and GST.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            {/* 3 summary inputs */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Total Taxable Amount
                </label>
                <input
                  type="text"
                  readOnly
                  value={summary.totalTaxable}
                  className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Total Tax Amount (GST)
                </label>
                <input
                  type="text"
                  readOnly
                  value={summary.totalTax}
                  className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Rounded Off
                </label>
                <input
                  type="text"
                  readOnly
                  value={summary.roundOff}
                  className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Grand Total Box */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-center">
              <span className="block text-[11px] font-semibold text-sky-800 uppercase tracking-wider mb-1">
                Grand Total (₹)
              </span>
              <span className="text-2xl font-black text-sky-700 tracking-tight">
                {Number(summary.grandTotal).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Remarks */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Remarks{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              name="remarks"
              rows={2}
              value={formData.remarks}
              onChange={handleHeaderChange}
              placeholder="Enter any additional notes..."
              className="w-full rounded border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm transition-colors disabled:opacity-60"
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Purchase Bill"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseEntry;
