"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  Download,
  Search,
  Eye,
  X,
  ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/lib/axios";

const PAGE_SIZE = 15;

export default function AuditLogs() {

  const [activeTab, setActiveTab] = useState("audit");
  const [showFilters, setShowFilters] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: ""
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/audit-logs", {
        params: {
          page,
          limit: PAGE_SIZE,
          search,
          type: activeTab,
          action: filters.action || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined
        }
      });

      setLogs(res.data.data || []);
      setTotal(res.data.total || 0);

    } catch (err) {
      console.error("Audit log fetch failed:", err);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, activeTab, search]);

  const applyFilters = () => {
    setPage(1);
    fetchLogs();
  };

  const resetFilters = () => {
    setFilters({
      action: "",
      startDate: "",
      endDate: ""
    });
    setPage(1);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString();

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Audit Logs"
        description="Track all actions and login attempts in the system."
      >
        <div className="bg-white rounded-xl shadow">

          {/* ================= Tabs ================= */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-wrap">
              {["audit", "login"].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-300"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {tab === "audit" ? "Audit Logs" : "Login History"}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6 space-y-6">

          {/* ================= Header Row ================= */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

  {/* Left Side */}
  <div className="flex items-center gap-3 flex-wrap">

    <Filter className="w-5 h-5 text-gray-500" />

    <h3 className="text-base sm:text-lg font-medium">
      Filter Audit Logs
    </h3>

    <button
      onClick={() => setShowFilters(!showFilters)}
      className="text-sm text-blue-600 hover:underline"
    >
      {showFilters ? "Hide" : "Show"}
    </button>

    {/* Mobile Export Button */}
    <Button
      variant="outline"
      className="gap-2 sm:hidden sm:items-right"
    >
      <Download size={16} />
      Export Logs
    </Button>

  </div>

  {/* Desktop Export Button */}
  <Button
    variant="outline"
    className="gap-2 hidden sm:flex"
  >
    <Download size={16} />
    Export Logs
  </Button>

</div>

            {/* ================= Filters ================= */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">

                <div>
                  <label className="text-sm font-medium mb-1 block">Action</label>
                  <div className="relative">
                    <select
                      value={filters.action}
                      onChange={(e) =>
                        setFilters({ ...filters, action: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded border "
                    >
                      <option value="">All Actions</option>
                      <option value="LOGIN">LOGIN</option>
                      <option value="LOGOUT">LOGOUT</option>
                      <option value="CREATE_LEAD">CREATE_LEAD</option>
                      <option value="UPDATE_LEAD">UPDATE_LEAD</option>
                      <option value="DELETE_LEAD">DELETE_LEAD</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded border "
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded border "
                  />
                </div>

                <div className="flex gap-2 items-end">
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    Reset
                  </Button>
                  <Button onClick={applyFilters} className="flex-1">
                    Apply
                  </Button>
                </div>
              </div>
            )}

            {/* ================= Search ================= */}
            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 w-full border rounded "
              />
            </div>

            {/* ================= Responsive Table ================= */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 ">
                  <tr>
                    {["ADMIN", "ROLE", "ACTION", "TARGET", "VIEW", "TIME"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y ">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center">
                        Loading...
                      </td>
                    </tr>
                  )}

                  {!loading && logs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500">
                        No logs found
                      </td>
                    </tr>
                  )}

                  {!loading && logs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">{log.userEmail}</td>
                      <td className="px-4 py-3">{log.role}</td>
                      <td className="px-4 py-3">{log.action}</td>
                      <td className="px-4 py-3 truncate max-w-xs">{log.target}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= Pagination ================= */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t pt-4">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <Button size="sm" variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Prev
                </Button>
                <Button size="sm" variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* ================= Modal ================= */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative">
              <button
                onClick={() => setSelectedLog(null)}
                className="absolute tonsole.errorop-4 right-4"
              >
                <X />
              </button>
              <h3 className="text-lg font-semibold mb-4">Log Details</h3>
              <pre className="text-xs bg-gray-100  p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </AdminLayout>
    </ProtectedRoute>
  );
}