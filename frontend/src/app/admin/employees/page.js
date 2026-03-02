"use client";

import { useEffect, useState } from "react";
import EmployeesGrid from "./components/EmployeesGrid";
import AdminLayout from "@/components/admin/AdminLayout";
import { trackPage } from "@/lib/activityTracker";
import { logUIAction } from "@/lib/uiLogger";
import { API_BASE_URL } from "@/lib/api";
import { getAuthHeader } from "@/lib/api";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  ////////////////////////////////////////////////////////
  // FETCH EMPLOYEES
  ////////////////////////////////////////////////////////
  const fetchEmployees = async () => {
    try {
      logUIAction("EMP_FETCH", "Employee_Directory");

      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        headers: getAuthHeader(),
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setEmployees(data.items || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    trackPage("/admin/employees", "auto");
    logUIAction("EMP_PAGE_OPEN", "Employee_Directory");
    fetchEmployees();
  }, []);

  ////////////////////////////////////////////////////////
  // UPDATE STATE LOCALLY
  ////////////////////////////////////////////////////////
  const updateEmployeeInState = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      )
    );
  };

  ////////////////////////////////////////////////////////
  // OPEN DELETE MODAL
  ////////////////////////////////////////////////////////
  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  ////////////////////////////////////////////////////////
  // CONFIRM DELETE
  ////////////////////////////////////////////////////////
  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/employees/${employeeToDelete._id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      // Remove from UI
      setEmployees((prev) =>
        prev.filter((emp) => emp._id !== employeeToDelete._id)
      );

      setShowDeleteModal(false);
      setEmployeeToDelete(null);

      console.log("Employee deleted successfully");

    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete employee");
    }
  };

  ////////////////////////////////////////////////////////
  // RETURN
  ////////////////////////////////////////////////////////
  return (
    <AdminLayout
      title="Employee Directory"
      description="Manage company employees and records."
    >
      <EmployeesGrid
        employees={employees}
        fetchEmployees={fetchEmployees}
        updateEmployeeInState={updateEmployeeInState}
        onDeleteEmployee={handleDeleteEmployee}
      />

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Delete {employeeToDelete?.name}?
            </h3>

            {/* <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p> */}
             <p className="text-sm mb-4 text-left">
              Are you sure you want to delete ? 
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEmployeeToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteEmployee}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}