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

  const fetchEmployees = async () => {
    try {
      logUIAction("EMP_FETCH", "Employee_Directory");

      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        headers: getAuthHeader(),  // 🔥 attach token
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
  // 🔥 UPDATE STATE LOCALLY (IMPORTANT FIX)
  ////////////////////////////////////////////////////////
  const updateEmployeeInState = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      )
    );
  };

  ////////////////////////////////////////////////////////
  // 🔥 DELETE EMPLOYEE (NEW)
  ////////////////////////////////////////////////////////
  const handleDeleteEmployee = async (employee) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmDelete) return;

    try {
      const res = await apiRequest(`${API_BASE_URL}/api/employees/${employee._id}`,
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

      // remove from UI
      setEmployees((prev) =>
        prev.filter((emp) => emp._id !== employee._id)
      );

      console.log("Employee deleted successfully");

    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete employee");
    }
  };

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
    </AdminLayout>
  );
}