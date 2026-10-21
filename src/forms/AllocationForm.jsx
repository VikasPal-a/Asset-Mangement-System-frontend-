// import React, { useEffect, useState } from "react";
// import { Select } from "../components/common/Select";
// import { Input } from "../components/common/Input";
// import { Textarea } from "../components/common/Textarea";
// import { Button } from "../components/common/Button";
// import ReactSelect from "react-select";
// import { getEmployees } from "../services/employeeService";

// export const AllocationForm = ({ InStockAssets = [], onSubmit, onCancel }) => {
//   const [values, setValues] = useState({
//     assetId: "",
//     employeeId: "",
//     assignedDate: new Date().toISOString().split("T")[0],
//     remarks: "",
//   });

//   const [errors, setErrors] = useState({});

//   // Employee API states
//   const [employees, setEmployees] = useState([]);
//   const [loadingEmployees, setLoadingEmployees] = useState(true);

//   // ==============================
//   // Fetch Employees
//   // ==============================
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         setLoadingEmployees(true);

//         const response = await getEmployees();

//         console.log("Employee API Response:", response);

//         if (Array.isArray(response?.data)) {
//           setEmployees(response.data);
//         } else if (Array.isArray(response)) {
//           setEmployees(response);
//         } else if (Array.isArray(response?.data?.data)) {
//           setEmployees(response.data.data);
//         } else {
//           setEmployees([]);
//         }
//       } catch (error) {
//         console.error("Failed to load employees:", error);
//         setEmployees([]);
//       } finally {
//         setLoadingEmployees(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: null,
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!values.assetId || !values.employeeId) {
//       setErrors({
//         assetId: !values.assetId ? "Required" : null,
//         employeeId: !values.employeeId ? "Required" : null,
//       });
//       return;
//     }

//     const payload = {
//       assetID: parseInt(values.assetId, 10),
//       employeeID: parseInt(values.employeeId, 10),
//       assignedDate: values.assignedDate,
//       remarks: values.remarks || "",
//     };

//     onSubmit(payload);
//   };

//   // ==============================
//   // Asset Options
//   // ==============================
//   const assetOptions = Array.isArray(InStockAssets)
//     ? InStockAssets.map((a) => ({
//         value: a.AssetID ?? a.assetID ?? a.assetId ?? a.id,

//         label: `${a.AssetTag ?? a.assetTag ?? ""} — ${
//           a.AssetName ?? a.assetName ?? ""
//         }`,
//       }))
//     : [];

//   // ==============================
//   // Employee Options
//   // ==============================
//   const employeeOptions = Array.isArray(employees)
//     ? employees.map((e) => ({
//         value: e.id ?? e.EmployeeID ?? e.emp_id,

//         label: `${e.emp_name ?? e.name ?? e.FullName ?? "Employee"} (${
//           e.emp_dept ?? e.department ?? "Staff"
//         })`,
//       }))
//     : [];

//   // ==============================
//   // React Select Styles
//   // ==============================
//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: "34px",
//       fontSize: "13px",
//       borderColor: errors.assetId ? "#ef4444" : "#cbd5e1",
//       boxShadow: "none",
//       "&:hover": {
//         borderColor: "#94a3b8",
//       },
//     }),

//     valueContainer: (provided) => ({
//       ...provided,
//       padding: "0px 6px",
//     }),

//     input: (provided) => ({
//       ...provided,
//       margin: "0px",
//       fontSize: "13px",
//     }),

//     singleValue: (provided) => ({
//       ...provided,
//       fontSize: "13px",
//       color: "#1e293b",
//     }),

//     placeholder: (provided) => ({
//       ...provided,
//       fontSize: "13px",
//       color: "#94a3b8",
//     }),

//     indicatorSeparator: () => ({
//       display: "none",
//     }),

//     dropdownIndicator: (provided) => ({
//       ...provided,
//       padding: "4px",
//     }),

//     menuList: (provided) => ({
//       ...provided,
//       padding: "4px",
//     }),

//     option: (provided, state) => ({
//       ...provided,
//       padding: "4px 8px",
//       fontSize: "12px",
//       lineHeight: "1.2",
//       backgroundColor: state.isSelected
//         ? "#e2e8f0"
//         : state.isFocused
//           ? "#f1f5f9"
//           : "transparent",
//       color: "#1e293b",
//     }),
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       {/* ==============================
//           Asset Dropdown
//       ============================== */}
//       <div className="flex flex-col space-y-1">
//         <label className="text-xs font-semibold text-slate-700">
//           InStock Device <span className="text-red-500">*</span>
//         </label>

//         <ReactSelect
//           options={assetOptions}
//           styles={customStyles}
//           isSearchable={true}
//           placeholder={
//             assetOptions.length === 0
//               ? "No available devices"
//               : "Type to search asset (e.g. ASUS)..."
//           }
//           value={
//             assetOptions.find(
//               (opt) => String(opt.value) === String(values.assetId),
//             ) || null
//           }
//           onChange={(selectedOption) => {
//             setValues((prev) => ({
//               ...prev,
//               assetId: selectedOption ? selectedOption.value : "",
//             }));

//             if (errors.assetId) {
//               setErrors((prev) => ({
//                 ...prev,
//                 assetId: null,
//               }));
//             }
//           }}
//           noOptionsMessage={() => "No available devices found"}
//           isDisabled={assetOptions.length === 0}
//         />

//         {errors.assetId && (
//           <span className="text-red-500 text-xs">{errors.assetId}</span>
//         )}
//       </div>

//       {/* ==============================
//           Employee Dropdown
//       ============================== */}
//       <div className="[&_select]:py-1.5 [&_select]:text-xs [&_input]:py-1.5 [&_input]:text-xs">
//         <Select
//           label="Assign To Employee *"
//           name="employeeId"
//           options={employeeOptions}
//           placeholder={
//             loadingEmployees
//               ? "Loading employees..."
//               : employeeOptions.length === 0
//                 ? "No employees found"
//                 : "Select corporate assignee"
//           }
//           value={values.employeeId}
//           onChange={handleChange}
//           error={errors.employeeId}
//           disabled={loadingEmployees || employeeOptions.length === 0}
//           required
//         />
//       </div>

//       {/* ==============================
//           Assignment Date
//       ============================== */}
//       <div className="[&_input]:py-1.5 [&_input]:text-xs">
//         <Input
//           label="Assignment Date *"
//           name="assignedDate"
//           type="date"
//           value={values.assignedDate}
//           onChange={handleChange}
//           error={errors.assignedDate}
//           required
//         />
//       </div>

//       {/* ==============================
//           Remarks
//       ============================== */}
//       <div className="[&_textarea]:py-1.5 [&_textarea]:text-xs">
//         <Textarea
//           label="Remarks / Assignment Purpose"
//           name="remarks"
//           rows={2}
//           value={values.remarks}
//           onChange={handleChange}
//           placeholder="Specify deployment details or special configurations..."
//         />
//       </div>

//       {/* ==============================
//           Buttons
//       ============================== */}
//       <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
//         <Button
//           variant="secondary"
//           onClick={onCancel}
//           type="button"
//           className="text-xs py-1.5"
//         >
//           Cancel
//         </Button>

//         <Button
//           type="submit"
//           className="text-xs py-1.5"
//           disabled={
//             assetOptions.length === 0 ||
//             loadingEmployees ||
//             employeeOptions.length === 0
//           }
//         >
//           Assign Assets
//         </Button>
//       </div>
//     </form>
//   );
// };

//==============================================
// import React, { useEffect, useState } from "react";
// import { Select } from "../components/common/Select";
// import { Input } from "../components/common/Input";
// import { Textarea } from "../components/common/Textarea";
// import { Button } from "../components/common/Button";
// import ReactSelect from "react-select";
// import { getEmployees } from "../services/employeeService";

// export const AllocationForm = ({ InStockAssets = [], onSubmit, onCancel }) => {
//   const [values, setValues] = useState({
//     assetId: "",
//     employeeId: "",
//     empCode: "",
//     assignedDate: new Date().toISOString().split("T")[0],
//     remarks: "",
//   });

//   const [errors, setErrors] = useState({});

//   // ==============================
//   // Employee API states
//   // ==============================
//   const [employees, setEmployees] = useState([]);
//   const [loadingEmployees, setLoadingEmployees] = useState(true);

//   // ==============================
//   // Employee Status
//   // Only Active employees allowed
//   // ==============================
//   const [employeeStatus, setEmployeeStatus] = useState("1");

//   // ==============================
//   // Fetch Employees
//   // ==============================
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         setLoadingEmployees(true);

//         const response = await getEmployees();

//         console.log("Employee API Response:", response);

//         let employeeData = [];

//         if (Array.isArray(response?.data)) {
//           employeeData = response.data;
//         } else if (Array.isArray(response?.data?.data)) {
//           employeeData = response.data.data;
//         } else if (Array.isArray(response)) {
//           employeeData = response;
//         }

//         // ==========================================
//         // ONLY ACTIVE EMPLOYEES
//         // is_active === 1
//         // ==========================================
//         const activeEmployees = employeeData.filter(
//           (employee) => Number(employee?.is_active) === 1,
//         );

//         console.log("Active Employees:", activeEmployees);

//         setEmployees(activeEmployees);
//       } catch (error) {
//         console.error("Failed to load employees:", error);
//         setEmployees([]);
//       } finally {
//         setLoadingEmployees(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // ==============================
//   // Handle normal input change
//   // ==============================
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: null,
//       }));
//     }
//   };

//   // ==============================
//   // Handle Employee Status
//   // ==============================
//   const handleEmployeeStatusChange = (e) => {
//     const value = e.target.value;

//     setEmployeeStatus(value);

//     // Employee reset
//     setValues((prev) => ({
//       ...prev,
//       employeeId: "",
//       empCode: "",
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       employeeId: null,
//     }));
//   };

//   // ==============================
//   // Handle Submit
//   // ==============================
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!values.assetId || !values.employeeId) {
//       setErrors({
//         assetId: !values.assetId ? "Required" : null,
//         employeeId: !values.employeeId ? "Required" : null,
//       });

//       return;
//     }

//     const payload = {
//       assetID: parseInt(values.assetId, 10),

//       employeeID: parseInt(values.employeeId, 10),

//       // Employee code bhi available rahega
//       empCode: values.empCode || "",

//       assignedDate: values.assignedDate,

//       remarks: values.remarks || "",
//     };

//     console.log("Allocation Payload:", payload);

//     onSubmit(payload);
//   };

//   // ==============================
//   // Asset Options
//   // ==============================
//   const assetOptions = Array.isArray(InStockAssets)
//     ? InStockAssets.map((a) => ({
//         value: a.AssetID ?? a.assetID ?? a.assetId ?? a.id,

//         label: `${a.AssetTag ?? a.assetTag ?? ""} — ${
//           a.AssetName ?? a.assetName ?? ""
//         }`,
//       }))
//     : [];

//   // ==============================
//   // Employee Options
//   // ONLY is_active === 1
//   // ==============================
//   const employeeOptions = Array.isArray(employees)
//     ? employees
//         .filter((e) => Number(e?.is_active) === 1)
//         .map((e) => ({
//           value: e.id ?? e.EmployeeID ?? e.emp_id,

//           label: `${
//             e.username ??
//             e.emp_name ??
//             e.name ??
//             e.FullName ??
//             `${e.agent_first_name ?? ""} ${e.agent_last_name ?? ""}`.trim() ??
//             "Employee"
//           } — ${e.department ?? e.emp_dept ?? e.Department ?? "Staff"}`,

//           // Extra data for search
//           employeeName:
//             e.username ??
//             e.emp_name ??
//             e.name ??
//             e.FullName ??
//             `${e.agent_first_name ?? ""} ${e.agent_last_name ?? ""}`.trim(),

//           department: e.department ?? e.emp_dept ?? e.Department ?? "",

//           empCode: e.emp_code ?? "",

//           employeeId: e.id ?? e.EmployeeID ?? e.emp_id,

//           originalEmployee: e,
//         }))
//     : [];

//   // ==============================
//   // Selected Employee
//   // ==============================
//   const selectedEmployee = employees.find(
//     (employee) =>
//       String(employee?.id ?? employee?.EmployeeID ?? employee?.emp_id) ===
//       String(values.employeeId),
//   );

//   // ==============================
//   // React Select Styles
//   // ==============================
//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       minHeight: "34px",
//       fontSize: "13px",

//       borderColor: errors.assetId ? "#ef4444" : "#cbd5e1",

//       boxShadow: "none",

//       "&:hover": {
//         borderColor: "#94a3b8",
//       },
//     }),

//     valueContainer: (provided) => ({
//       ...provided,
//       padding: "0px 6px",
//     }),

//     input: (provided) => ({
//       ...provided,
//       margin: "0px",
//       fontSize: "13px",
//     }),

//     singleValue: (provided) => ({
//       ...provided,
//       fontSize: "13px",
//       color: "#1e293b",
//     }),

//     placeholder: (provided) => ({
//       ...provided,
//       fontSize: "13px",
//       color: "#94a3b8",
//     }),

//     indicatorSeparator: () => ({
//       display: "none",
//     }),

//     dropdownIndicator: (provided) => ({
//       ...provided,
//       padding: "4px",
//     }),

//     menuList: (provided) => ({
//       ...provided,
//       padding: "4px",
//     }),

//     option: (provided, state) => ({
//       ...provided,
//       padding: "7px 8px",
//       fontSize: "12px",
//       lineHeight: "1.2",

//       backgroundColor: state.isSelected
//         ? "#e2e8f0"
//         : state.isFocused
//           ? "#f1f5f9"
//           : "transparent",

//       color: "#1e293b",
//     }),
//   };

//   // ==============================
//   // Employee Search
//   // Name + Department + Code + ID
//   // ==============================
//   const employeeFilterOption = (candidate, input) => {
//     const search = input.trim().toLowerCase();

//     if (!search) {
//       return true;
//     }

//     const name = String(candidate.data.employeeName || "").toLowerCase();

//     const department = String(candidate.data.department || "").toLowerCase();

//     const empCode = String(candidate.data.empCode || "").toLowerCase();

//     const employeeId = String(candidate.data.employeeId || "").toLowerCase();

//     return (
//       name.includes(search) ||
//       department.includes(search) ||
//       empCode.includes(search) ||
//       employeeId.includes(search)
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       {/* ==============================
//           STEP 1
//           Asset Dropdown
//       ============================== */}
//       <div className="flex flex-col space-y-1">
//         <label className="text-xs font-semibold text-slate-700">
//           InStock Device <span className="text-red-500">*</span>
//         </label>

//         <ReactSelect
//           options={assetOptions}
//           styles={customStyles}
//           isSearchable={true}
//           placeholder={
//             assetOptions.length === 0
//               ? "No available devices"
//               : "Type to search asset (e.g. ASUS)..."
//           }
//           value={
//             assetOptions.find(
//               (opt) => String(opt.value) === String(values.assetId),
//             ) || null
//           }
//           onChange={(selectedOption) => {
//             setValues((prev) => ({
//               ...prev,
//               assetId: selectedOption ? selectedOption.value : "",
//             }));

//             if (errors.assetId) {
//               setErrors((prev) => ({
//                 ...prev,
//                 assetId: null,
//               }));
//             }
//           }}
//           noOptionsMessage={() => "No available devices found"}
//           isDisabled={assetOptions.length === 0}
//         />

//         {errors.assetId && (
//           <span className="text-red-500 text-xs">{errors.assetId}</span>
//         )}
//       </div>

//       {/* ==============================
//           STEP 2
//           Employee Active Status
//       ============================== */}
//       <div className="[&_select]:py-1.5 [&_select]:text-xs">
//         <Select
//           label="Employee Status *"
//           name="employeeStatus"
//           options={[
//             {
//               value: "1",
//               label: "Active Employees",
//             },
//           ]}
//           value={employeeStatus}
//           onChange={handleEmployeeStatusChange}
//           disabled={loadingEmployees || employees.length === 0}
//           required
//         />
//       </div>

//       {/* ==============================
//           STEP 2
//           Employee Search Dropdown
//       ============================== */}
//       <div>
//         <label className="text-xs font-semibold text-slate-700 block mb-1">
//           Assign To Employee <span className="text-red-500">*</span>
//         </label>

//         <ReactSelect
//           options={employeeOptions}
//           styles={customStyles}
//           isSearchable={true}
//           isClearable={true}
//           isDisabled={
//             loadingEmployees ||
//             employeeOptions.length === 0 ||
//             employeeStatus !== "1"
//           }
//           isLoading={loadingEmployees}
//           placeholder={
//             loadingEmployees
//               ? "Loading employees..."
//               : employeeOptions.length === 0
//                 ? "No active employees found"
//                 : "Search employee name or department..."
//           }
//           value={
//             employeeOptions.find(
//               (option) => String(option.value) === String(values.employeeId),
//             ) || null
//           }
//           filterOption={employeeFilterOption}
//           onChange={(selectedOption) => {
//             const employee = selectedOption?.originalEmployee;

//             setValues((prev) => ({
//               ...prev,

//               employeeId: selectedOption?.value ?? "",

//               empCode: employee?.emp_code ?? "",
//             }));

//             if (errors.employeeId) {
//               setErrors((prev) => ({
//                 ...prev,
//                 employeeId: null,
//               }));
//             }
//           }}
//           formatOptionLabel={(option) => (
//             <div>
//               <div className="text-xs font-medium text-slate-800">
//                 {option.employeeName}
//               </div>

//               <div className="text-[11px] text-slate-500">
//                 {option.department || "Staff"}

//                 {option.empCode ? ` • ${option.empCode}` : ""}

//                 {option.employeeId ? ` • ID: ${option.employeeId}` : ""}
//               </div>
//             </div>
//           )}
//           noOptionsMessage={() => "No active employee found"}
//         />

//         {errors.employeeId && (
//           <span className="text-red-500 text-xs">{errors.employeeId}</span>
//         )}
//       </div>

//       {/* ==============================
//           STEP 3
//           Selected Employee Details
//       ============================== */}
//       {selectedEmployee && (
//         <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
//           <div className="mb-3">
//             <p className="text-xs font-semibold text-slate-700">
//               Selected Employee Details
//             </p>

//             <p className="text-[11px] text-slate-500">Employee information</p>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             {/* Employee ID */}
//             <div>
//               <label className="block text-[11px] font-medium text-slate-500 mb-1">
//                 Employee ID
//               </label>

//               <Input
//                 value={
//                   selectedEmployee?.id ??
//                   selectedEmployee?.EmployeeID ??
//                   selectedEmployee?.emp_id ??
//                   ""
//                 }
//                 readOnly
//               />
//             </div>

//             {/* Employee Code */}
//             <div>
//               <label className="block text-[11px] font-medium text-slate-500 mb-1">
//                 Employee Code
//               </label>

//               <Input value={selectedEmployee?.emp_code ?? ""} readOnly />
//             </div>

//             {/* Employee Name */}
//             <div>
//               <label className="block text-[11px] font-medium text-slate-500 mb-1">
//                 Employee Name
//               </label>

//               <Input
//                 value={
//                   selectedEmployee?.username ??
//                   selectedEmployee?.emp_name ??
//                   selectedEmployee?.name ??
//                   selectedEmployee?.FullName ??
//                   `${selectedEmployee?.agent_first_name ?? ""} ${
//                     selectedEmployee?.agent_last_name ?? ""
//                   }`.trim()
//                 }
//                 readOnly
//               />
//             </div>

//             {/* Department */}
//             <div>
//               <label className="block text-[11px] font-medium text-slate-500 mb-1">
//                 Department
//               </label>

//               <Input
//                 value={
//                   selectedEmployee?.department ??
//                   selectedEmployee?.emp_dept ??
//                   selectedEmployee?.Department ??
//                   ""
//                 }
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==============================
//           Assignment Date
//       ============================== */}
//       <div className="[&_input]:py-1.5 [&_input]:text-xs">
//         <Input
//           label="Assignment Date *"
//           name="assignedDate"
//           type="date"
//           value={values.assignedDate}
//           onChange={handleChange}
//           error={errors.assignedDate}
//           required
//         />
//       </div>

//       {/* ==============================
//           Remarks
//       ============================== */}
//       <div className="[&_textarea]:py-1.5 [&_textarea]:text-xs">
//         <Textarea
//           label="Remarks / Assignment Purpose"
//           name="remarks"
//           rows={2}
//           value={values.remarks}
//           onChange={handleChange}
//           placeholder="Specify deployment details or special configurations..."
//         />
//       </div>

//       {/* ==============================
//           Buttons
//       ============================== */}
//       <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
//         <Button
//           variant="secondary"
//           onClick={onCancel}
//           type="button"
//           className="text-xs py-1.5"
//         >
//           Cancel
//         </Button>

//         <Button
//           type="submit"
//           className="text-xs py-1.5"
//           disabled={
//             assetOptions.length === 0 ||
//             loadingEmployees ||
//             employeeOptions.length === 0 ||
//             !values.employeeId
//           }
//         >
//           Assign Assets
//         </Button>
//       </div>
//     </form>
//   );
// };
//=================================================

import React, { useEffect, useState } from "react";
import { Select } from "../components/common/Select";
import { Input } from "../components/common/Input";
import { Textarea } from "../components/common/Textarea";
import { Button } from "../components/common/Button";
import ReactSelect from "react-select";
import { getEmployees } from "../services/employeeService";

export const AllocationForm = ({ InStockAssets = [], onSubmit, onCancel }) => {
  const [values, setValues] = useState({
    assetId: "",
    employeeId: "",
    empCode: "",
    assignedDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  // ==============================
  // Employee API states
  // ==============================
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // ==============================
  // Employee Status
  // Only Active employees allowed
  // ==============================
  const [employeeStatus, setEmployeeStatus] = useState("1");

  // ==============================
  // Fetch Employees
  // ==============================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);

        const response = await getEmployees();

        console.log("Employee API Response:", response);

        let employeeData = [];

        if (Array.isArray(response?.data)) {
          employeeData = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          employeeData = response.data.data;
        } else if (Array.isArray(response)) {
          employeeData = response;
        }

        // ==========================================
        // ONLY ACTIVE EMPLOYEES
        // is_active === 1
        // ==========================================
        const activeEmployees = employeeData.filter(
          (employee) => Number(employee?.is_active) === 1,
        );

        console.log("Active Employees:", activeEmployees);

        setEmployees(activeEmployees);
      } catch (error) {
        console.error("Failed to load employees:", error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // ==============================
  // Handle normal input change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // ==============================
  // Handle Employee Status
  // ==============================
  const handleEmployeeStatusChange = (e) => {
    const value = e.target.value;

    setEmployeeStatus(value);

    // Employee reset
    setValues((prev) => ({
      ...prev,
      employeeId: "",
      empCode: "",
    }));

    setErrors((prev) => ({
      ...prev,
      employeeId: null,
    }));
  };

  // ==============================
  // Handle Submit
  // ==============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.assetId || !values.employeeId) {
      setErrors({
        assetId: !values.assetId ? "Required" : null,
        employeeId: !values.employeeId ? "Required" : null,
      });

      return;
    }

    const payload = {
      assetID: parseInt(values.assetId, 10),

      employeeID: parseInt(values.employeeId, 10),

      // Employee code bhi available rahega
      empCode: values.empCode || "",

      assignedDate: values.assignedDate,

      remarks: values.remarks || "",
    };

    console.log("Allocation Payload:", payload);

    onSubmit(payload);
  };

  // ==============================
  // Asset Options (Safely formatted & logged)
  // ==============================
  console.log("Raw InStockAssets:", InStockAssets);

  const rawList = Array.isArray(InStockAssets)
    ? InStockAssets
    : Array.isArray(InStockAssets?.data)
      ? InStockAssets.data
      : [];

  const assetOptions = rawList.map((a) => ({
    value: a.AssetID ?? a.assetID ?? a.assetId ?? a.id,
    label: `${a.AssetTag ?? a.assetTag ?? "No Tag"} — ${
      a.AssetName ?? a.assetName ?? "Unnamed"
    }`,
  }));

  console.log("Final assetOptions:", assetOptions);

  // ==============================
  // Employee Options
  // ONLY is_active === 1
  // ==============================
  const employeeOptions = Array.isArray(employees)
    ? employees
        .filter((e) => Number(e?.is_active) === 1)
        .map((e) => ({
          value: e.id ?? e.EmployeeID ?? e.emp_id,

          label: `${
            e.username ??
            e.emp_name ??
            e.name ??
            e.FullName ??
            `${e.agent_first_name ?? ""} ${e.agent_last_name ?? ""}`.trim() ??
            "Employee"
          } — ${e.department ?? e.emp_dept ?? e.Department ?? "Staff"}`,

          // Extra data for search
          employeeName:
            e.username ??
            e.emp_name ??
            e.name ??
            e.FullName ??
            `${e.agent_first_name ?? ""} ${e.agent_last_name ?? ""}`.trim(),

          department: e.department ?? e.emp_dept ?? e.Department ?? "",

          empCode: e.emp_code ?? "",

          employeeId: e.id ?? e.EmployeeID ?? e.emp_id,

          originalEmployee: e,
        }))
    : [];

  // ==============================
  // Selected Employee
  // ==============================
  const selectedEmployee = employees.find(
    (employee) =>
      String(employee?.id ?? employee?.EmployeeID ?? employee?.emp_id) ===
      String(values.employeeId),
  );

  // ==============================
  // React Select Styles
  // ==============================
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "34px",
      fontSize: "13px",

      borderColor: errors.assetId ? "#ef4444" : "#cbd5e1",

      boxShadow: "none",

      "&:hover": {
        borderColor: "#94a3b8",
      },
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 99999, // Dropdown ko modal layer ke upar render karega
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
    }),

    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 6px",
    }),

    input: (provided) => ({
      ...provided,
      margin: "0px",
      fontSize: "13px",
    }),

    singleValue: (provided) => ({
      ...provided,
      fontSize: "13px",
      color: "#1e293b",
    }),

    placeholder: (provided) => ({
      ...provided,
      fontSize: "13px",
      color: "#94a3b8",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),

    menuList: (provided) => ({
      ...provided,
      padding: "4px",
    }),

    option: (provided, state) => ({
      ...provided,
      padding: "7px 8px",
      fontSize: "12px",
      lineHeight: "1.2",

      backgroundColor: state.isSelected
        ? "#e2e8f0"
        : state.isFocused
          ? "#f1f5f9"
          : "transparent",

      color: "#1e293b",
    }),
  };

  // ==============================
  // Employee Search
  // Name + Department + Code + ID
  // ==============================
  const employeeFilterOption = (candidate, input) => {
    const search = input.trim().toLowerCase();

    if (!search) {
      return true;
    }

    const name = String(candidate.data.employeeName || "").toLowerCase();

    const department = String(candidate.data.department || "").toLowerCase();

    const empCode = String(candidate.data.empCode || "").toLowerCase();

    const employeeId = String(candidate.data.employeeId || "").toLowerCase();

    return (
      name.includes(search) ||
      department.includes(search) ||
      empCode.includes(search) ||
      employeeId.includes(search)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* ==============================
          STEP 1
          Asset Dropdown
      ============================== */}
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          InStock Device <span className="text-red-500">*</span>
        </label>

        <ReactSelect
          options={assetOptions}
          styles={customStyles}
          menuPortalTarget={
            typeof document !== "undefined" ? document.body : null
          }
          menuPosition="fixed"
          isSearchable={true}
          placeholder={
            assetOptions.length === 0
              ? "No available devices"
              : "Type to search asset (e.g. ASUS)..."
          }
          value={
            assetOptions.find(
              (opt) => String(opt.value) === String(values.assetId),
            ) || null
          }
          onChange={(selectedOption) => {
            setValues((prev) => ({
              ...prev,
              assetId: selectedOption ? selectedOption.value : "",
            }));

            if (errors.assetId) {
              setErrors((prev) => ({
                ...prev,
                assetId: null,
              }));
            }
          }}
          noOptionsMessage={() => "No available devices found"}
          isDisabled={assetOptions.length === 0}
        />

        {errors.assetId && (
          <span className="text-red-500 text-xs">{errors.assetId}</span>
        )}
      </div>

      {/* ==============================
          STEP 2
          Employee Active Status
      ============================== */}
      <div className="[&_select]:py-1.5 [&_select]:text-xs">
        <Select
          label="Employee Status *"
          name="employeeStatus"
          options={[
            {
              value: "1",
              label: "Active Employees",
            },
          ]}
          value={employeeStatus}
          onChange={handleEmployeeStatusChange}
          disabled={loadingEmployees || employees.length === 0}
          required
        />
      </div>

      {/* ==============================
          STEP 2
          Employee Search Dropdown
      ============================== */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">
          Assign To Employee <span className="text-red-500">*</span>
        </label>

        <ReactSelect
          options={employeeOptions}
          styles={customStyles}
          menuPortalTarget={
            typeof document !== "undefined" ? document.body : null
          }
          menuPosition="fixed"
          isSearchable={true}
          isClearable={true}
          isDisabled={
            loadingEmployees ||
            employeeOptions.length === 0 ||
            employeeStatus !== "1"
          }
          isLoading={loadingEmployees}
          placeholder={
            loadingEmployees
              ? "Loading employees..."
              : employeeOptions.length === 0
                ? "No active employees found"
                : "Search employee name or department..."
          }
          value={
            employeeOptions.find(
              (option) => String(option.value) === String(values.employeeId),
            ) || null
          }
          filterOption={employeeFilterOption}
          onChange={(selectedOption) => {
            const employee = selectedOption?.originalEmployee;

            setValues((prev) => ({
              ...prev,

              employeeId: selectedOption?.value ?? "",

              empCode: employee?.emp_code ?? "",
            }));

            if (errors.employeeId) {
              setErrors((prev) => ({
                ...prev,
                employeeId: null,
              }));
            }
          }}
          formatOptionLabel={(option) => (
            <div>
              <div className="text-xs font-medium text-slate-800">
                {option.employeeName}
              </div>

              <div className="text-[11px] text-slate-500">
                {option.department || "Staff"}

                {option.empCode ? ` • ${option.empCode}` : ""}

                {option.employeeId ? ` • ID: ${option.employeeId}` : ""}
              </div>
            </div>
          )}
          noOptionsMessage={() => "No active employee found"}
        />

        {errors.employeeId && (
          <span className="text-red-500 text-xs">{errors.employeeId}</span>
        )}
      </div>

      {/* ==============================
          STEP 3
          Selected Employee Details
      ============================== */}
      {selectedEmployee && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-700">
              Selected Employee Details
            </p>

            <p className="text-[11px] text-slate-500">Employee information</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Employee ID */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Employee ID
              </label>

              <Input
                value={
                  selectedEmployee?.id ??
                  selectedEmployee?.EmployeeID ??
                  selectedEmployee?.emp_id ??
                  ""
                }
                readOnly
              />
            </div>

            {/* Employee Code */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Employee Code
              </label>

              <Input value={selectedEmployee?.emp_code ?? ""} readOnly />
            </div>

            {/* Employee Name */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Employee Name
              </label>

              <Input
                value={
                  selectedEmployee?.username ??
                  selectedEmployee?.emp_name ??
                  selectedEmployee?.name ??
                  selectedEmployee?.FullName ??
                  `${selectedEmployee?.agent_first_name ?? ""} ${
                    selectedEmployee?.agent_last_name ?? ""
                  }`.trim()
                }
                readOnly
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Department
              </label>

              <Input
                value={
                  selectedEmployee?.department ??
                  selectedEmployee?.emp_dept ??
                  selectedEmployee?.Department ??
                  ""
                }
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* ==============================
          Assignment Date
      ============================== */}
      <div className="[&_input]:py-1.5 [&_input]:text-xs">
        <Input
          label="Assignment Date *"
          name="assignedDate"
          type="date"
          value={values.assignedDate}
          onChange={handleChange}
          error={errors.assignedDate}
          required
        />
      </div>

      {/* ==============================
          Remarks
      ============================== */}
      <div className="[&_textarea]:py-1.5 [&_textarea]:text-xs">
        <Textarea
          label="Remarks / Assignment Purpose"
          name="remarks"
          rows={2}
          value={values.remarks}
          onChange={handleChange}
          placeholder="Specify deployment details or special configurations..."
        />
      </div>

      {/* ==============================
          Buttons
      ============================== */}
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <Button
          variant="secondary"
          onClick={onCancel}
          type="button"
          className="text-xs py-1.5"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="text-xs py-1.5"
          disabled={
            assetOptions.length === 0 ||
            loadingEmployees ||
            employeeOptions.length === 0 ||
            !values.employeeId
          }
        >
          Assign Assets
        </Button>
      </div>
    </form>
  );
};

export default AllocationForm;
