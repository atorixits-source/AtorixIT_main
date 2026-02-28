"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

import { trackPage } from "@/lib/activityTracker";
import { logUIAction } from "@/lib/uiLogger";

export default function LeavePage() {

  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [messageType, setMessageType] = useState("auto");

  const [form, setForm] = useState({
    leaveType: "Paid Leave",
    from: "",
    to: "",
    status: "Approved",
    customMessage: ""   // ✅ NEW
  });


  //////////////////////////////////////////////////
  // FETCH EMPLOYEES
  //////////////////////////////////////////////////

  const fetchEmployees = async () => {
    const res = await fetch(`${API_BASE_URL}/api/employees`);
    const data = await res.json();
    if (data.success) setEmployees(data.items);
  };

  //////////////////////////////////////////////////
  // FETCH LEAVES
  //////////////////////////////////////////////////

  // const fetchLeaves = async () => {
  //   const res = a  wait fetch(`${API_BASE_URL}/api/leaves`);
  //   const data = await res.json();
  //   if (data.success) setLeaves(data.items || []);
  // };

  // useEffect(() => {
  //   trackPage("/admin/leave", "auto");
  //   logUIAction("LEAVE_PAGE_OPEN", "Leave_Management");
  //   fetchEmployees();
  //   fetchLeaves();
  // }, []);

  const fetchLeaves = async () => {
  try {
    const url = `${API_BASE_URL}/api/leaves`;
    console.log("Fetching leaves from:", url);

    const res = await fetch(url, {
      credentials: "include", // if using cookies
      headers: {
        "Content-Type": "application/json",
        // Uncomment below if using JWT
        // Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) {
      console.error("HTTP Error:", res.status);
      return;
    }

    const data = await res.json();

    if (data.success) {
      setLeaves(data.items || []);
    } else {
      console.error("API returned failure:", data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  //////////////////////////////////////////////////
  // SUBMIT
  //////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      alert("Please select an employee");
      return;
    }

    setLoading(true);

    const isEdit = !!editingId;

    logUIAction(
      isEdit ? "LEAVE_UPDATE" : "LEAVE_CREATE",
      "Leave",
      {
        leaveId: editingId || "new",
        employeeId: selectedEmployeeId,
        type: form.leaveType,
        status: form.status,
        from: form.from,
        to: form.to,
        messageType,
      }
    );
    let url = "/api/leaves";
    let method = "POST";

    if (editingId) {
      url = `/api/leaves/${editingId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        employeeId: selectedEmployeeId,
        messageType: messageType   // ✅ ADD THIS LINE
      }),

    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setForm({
        leaveType: "Paid Leave",
        from: "",
        to: "",
        status: "Approved",
        customMessage: ""
      });
      setMessageType("auto");  // ✅ reset radio

      setSelectedEmployeeId("");
      setEditingId(null);
      fetchLeaves();
    }
  };

  //////////////////////////////////////////////////
  // DELETE
  //////////////////////////////////////////////////

  const deleteLeave = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this leave?");
    if (!confirmDelete) return;

    const leave = leaves.find(l => l._id === id);

    logUIAction("LEAVE_DELETE", "Leave", {
      leaveId: id,
      employeeId: leave?.employeeId?._id,
      type: leave?.leaveType,
      from: leave?.from,
      to: leave?.to,
    });

    await fetch(`/api/leaves/${id}`, {
      method: "DELETE"
    });

    fetchLeaves();
  };

  //////////////////////////////////////////////////
  // EDIT
  //////////////////////////////////////////////////

  const startEditing = (leave) => {
    logUIAction("LEAVE_EDIT_OPEN", "Leave", {
      leaveId: leave._id,
      employeeId: leave.employeeId?._id,
      type: leave.leaveType,
      status: leave.status,
    });
    setForm({
      leaveType: leave.leaveType,
      from: leave.from.substring(0, 10),
      to: leave.to.substring(0, 10),
      status: leave.status,
      customMessage: leave.customMessage || ""
    });

    setMessageType(leave.messageType || "auto");  // ✅ ADD THIS

    setSelectedEmployeeId(leave.employeeId?._id);
    setEditingId(leave._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <AdminLayout title="Leave Management">

      <div className="space-y-12">


        {/* ================= FORM CARD ================= */}
        <div className="relative  rounded-3xl shadow-2xl border border-gray-200 p-8 overflow-hidden">

          {/* Decorative Gradient Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? "Update Leave" : "Add Leave"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Employees details below to {editingId ? "update" : "add"} a leave.
            </p>
          </div>

        {/* Leave Form */}
    <form onSubmit={handleSubmit} className="space-y-8">

  {/* ===== Section 1: Basic Info ===== */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Employee */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Select Employee
      </label>
      <select
        value={selectedEmployeeId}
        onChange={(e) => setSelectedEmployeeId(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   outline-none transition"
      >
        <option value="">-- Select Employee --</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.name} - {emp.email}
          </option>
        ))}
      </select>
    </div>

    {/* Leave Type */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Leave Type
      </label>
      <select
        value={form.leaveType}
        onChange={(e) =>
          setForm({ ...form, leaveType: e.target.value })
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                   focus:border-indigo-500 transition"
      >
        <option value="Paid Leave">Paid Leave</option>
        <option value="Medical Leave">Medical Leave</option>
        <option value="Other Leave">Other Leave</option>
      </select>
    </div>

    {/* From Date */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        From Date
      </label>
      <input
        type="date"
        value={form.from}
        onChange={(e) =>
          setForm({ ...form, from: e.target.value })
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   outline-none transition"
      />
    </div>

    {/* To Date */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        To Date
      </label>
      <input
        type="date"
        value={form.to}
        onChange={(e) =>
          setForm({ ...form, to: e.target.value })
        }
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   outline-none transition"
      />
    </div>

    {/* Status */}
    <div className="space-y-2 md:col-span-2">
      <label className="block text-sm font-medium text-gray-700">
        Status
      </label>
      <select
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
        className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-gray-300 text-gray-800 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   outline-none transition"
      >
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>

  </div>

  {/* ===== Section 2: Message ===== */}
  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5">

    <h3 className="text-lg font-semibold text-gray-900">
      Message Settings
    </h3>

    {/* Toggle Buttons */}
    <div className="flex flex-col sm:flex-row gap-4">

      <button
        type="button"
        onClick={() => {
          logUIAction("LEAVE_MESSAGE_MODE_CHANGE", "Leave_Form", {
            mode: "auto",
          });
          setMessageType("auto");
        }}
        className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
          messageType === "auto"
            ? "bg-blue-600 text-white shadow"
            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
        }`}
      >
        Auto Message
      </button>

      <button
        type="button"
        onClick={() => {
          logUIAction("LEAVE_MESSAGE_MODE_CHANGE", "Leave_Form", {
            mode: "custom",
          });
          setMessageType("custom");
        }}
        className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
          messageType === "custom"
            ? "bg-blue-600 text-white shadow"
            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
        }`}
      >
        Custom Message
      </button>

    </div>

    {/* Textarea */}
    <textarea
      disabled={messageType === "auto"}
      value={form.customMessage}
      onChange={(e) =>
        setForm({ ...form, customMessage: e.target.value })
      }
      rows={4}
      placeholder="Write a custom leave message..."
      className="w-full px-4 py-3 rounded-xl border border-gray-300 
                 focus:ring-2 focus:ring-blue-500 outline-none transition 
                 disabled:opacity-50"
    />

  </div>

  {/* Submit Button */}
  <div className="flex justify-end">
    <button
      type="submit"
      disabled={loading}
      className="w-full sm:w-auto px-8 py-3 rounded-xl 
                 bg-gradient-to-r from-blue-600 to-indigo-600 
                 text-white font-medium shadow-lg 
                 hover:scale-105 transition-all 
                 disabled:opacity-60"
    >
      {loading
        ? "Processing..."
        : editingId
          ? "Update Leave"
          : "Add Leave"}
    </button>
  </div>

</form>


        </div>





        {/* RESPONSIVE TABLE */}

        {/* ================= MOBILE + TABLET (0–1023px) ================= */}
        <div className="block lg:hidden space-y-4">

          {leaves.map((leave) => {
            const fromDate = new Date(leave.from);
            const toDate = new Date(leave.to);

            return (
              <div
                key={leave._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm">
                    {leave.employeeId?.name?.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {leave.employeeId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {leave.employeeId?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div>
                    <p className="font-medium text-gray-500">Type</p>
                    <p>{leave.leaveType}</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${leave.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {leave.status}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-gray-500">From</p>
                    <p>{fromDate.toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-500">To</p>
                    <p>{toDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-20 pt-2 pr-8 pl-10">
                  <button
                    onClick={() => startEditing(leave)}
                    className="flex-1 py-2 text-md font-semibold rounded-lg bg-blue-600 text-white"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => deleteLeave(leave._id)}
                    className="flex-1 py-2 text-md font-semibold rounded-lg bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>


        {/* ================= DESKTOP (1024px+) ================= */}
        <div className="hidden lg:block w-full overflow-x-auto">

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            <table className="w-full text-sm">

              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Employee</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Leave Type</th>
                  <th className="px-6 py-4 text-left">From</th>
                  <th className="px-6 py-4 text-left">To</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => {
                  const fromDate = new Date(leave.from);
                  const toDate = new Date(leave.to);

                  return (
                    <tr key={leave._id} className="border-b hover:bg-gray-50">

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
                            {leave.employeeId?.name?.charAt(0)}
                          </div>
                          <p className="font-semibold text-gray-900">
                            {leave.employeeId?.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        {leave.employeeId?.email}
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600">
                          {leave.leaveType}
                        </span>
                      </td>

                      <td className="px-6 py-5">{fromDate.toLocaleDateString()}</td>
                      <td className="px-6 py-5">{toDate.toLocaleDateString()}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${leave.status === "Approved"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                            }`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => startEditing(leave)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white"
                          >
                            Update
                          </button>

                          <button
                            onClick={() => deleteLeave(leave._id)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>





      </div>

    </AdminLayout>
  );
}
