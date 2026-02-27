"use client";

import { useState } from "react";
import EmployeeCard from "./EmployeeCard";
import EditEmployeeModal from "./EditEmployeeModal";
import ViewEmployeeModal from "./ViewEmployeeModal";
import { logUIAction } from "@/lib/uiLogger";

export default function EmployeesGrid({ employees, fetchEmployees, onDeleteEmployee }) {

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  if (!Array.isArray(employees) || employees.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No employees found
      </p>
    );
  }

  return (
    <>
      {/* ===== Responsive Grid ===== */}
      <div
        className="
          grid
          gap-5 sm:gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-4
        "
      >
        {employees.map((emp) => (
          <div key={emp._id} className="h-full">
            <EmployeeCard
              emp={emp}
              onEdit={(employee) => {
                logUIAction("EMP_OPEN_EDIT", "Employee", {
                  employeeId: employee._id,
                  name: employee.name,
                });

                setSelectedEmployee(employee);
                setIsEditOpen(true);
              }}
              onView={(employee) => {
                logUIAction("EMP_VIEW_PROFILE", "Employee", {
                  employeeId: employee._id,
                  name: employee.name,
                });

                setSelectedEmployee(employee);
                setIsViewOpen(true);
              }}

              // ✅ DELETE PROP ADDED
              onDelete={(employee) => {
                logUIAction("EMP_DELETE_CLICK_FORWARD", "Employee", {
                  employeeId: employee._id,
                  name: employee.name,
                });

                if (onDeleteEmployee) {
                  onDeleteEmployee(employee);
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* ===== EDIT MODAL ===== */}
      <EditEmployeeModal
        employee={selectedEmployee}
        isOpen={isEditOpen}
        onClose={() => {
          logUIAction("EMP_CLOSE_EDIT", "Employee");
          setIsEditOpen(false);
        }}
        onUpdated={fetchEmployees}
      />

      {/* ===== VIEW MODAL ===== */}
      <ViewEmployeeModal
        employee={selectedEmployee}
        isOpen={isViewOpen}
        onClose={() => {
          logUIAction("EMP_VIEW_MODAL_CLOSE", "Employee");
          setIsViewOpen(false);
        }}
      />
    </>
  );
}