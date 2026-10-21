import { useEffect, useState } from "react";
import { getEmployees } from "../../services/employeeService";
import { Users } from "lucide-react";
import { Pagination } from "../../components/common/Pagination";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployees();

        console.log("Employee API Response:", response);

        if (response?.success) {
          setEmployees(response.data || []);
        } else {
          setEmployees([]);
          setError(response?.message || "Employee data not found");
        }
      } catch (err) {
        console.error("Employee API Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load employees",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentEmployees = employees.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* HEADER */}
        <div className="-mt-8 sm:-mt-10">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700">
              <Users size={18} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
                Employees
              </h1>

              <p className="text-[11px] text-slate-500">Employee information</p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-center">
            <p className="text-xs text-slate-500">Loading employees...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* EMPLOYEE DATA */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                {/* TABLE HEADER */}
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      ID
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Employee ID
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Employee Name
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Employee Code
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Department
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      External Employee ID
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Designation
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Active
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody className="divide-y divide-slate-100">
                  {currentEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50">
                      {/* ID */}
                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.id}
                      </td>

                      {/* EMPLOYEE ID */}
                      <td className="px-3 py-2 text-[11px] font-medium text-slate-800">
                        {employee.empid}
                      </td>

                      {/* EMPLOYEE NAME */}
                      <td className="px-3 py-2 text-[11px] font-medium text-slate-800">
                        {employee.emp_name}
                      </td>

                      {/* EMPLOYEE CODE */}
                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.emp_code ?? "NULL"}
                      </td>

                      {/* DEPARTMENT */}
                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.emp_dept ?? "NULL"}
                      </td>

                      {/* EXTERNAL EMPLOYEE ID */}
                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.external_emp_id ?? "NULL"}
                      </td>

                      {/* DESIGNATION */}
                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.designation ?? "NULL"}
                      </td>

                      {/* IS ACTIVE */}
                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.is_active}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {employees.length > 0 && (
              <div className="border-t border-slate-200 p-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {/* NO DATA */}
            {employees.length === 0 && (
              <div className="p-5 text-center">
                <p className="text-xs text-slate-500">No employees found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
