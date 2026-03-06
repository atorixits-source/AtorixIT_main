"use client";

import { useEffect, useState } from "react";
import { Search, RefreshCw, Briefcase, Building } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import LeadActions from "@/components/admin/LeadActions";
import { API_BASE_URL } from "@/lib/api";

/* Logger */

const logUIAction = async (action, target, details = {}) => {
  try {
    await fetch(`${API_BASE_URL}/api/activity/log`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, target, details }),
    });
  } catch (err) {
    console.error("Log failed:", err);
  }
};

/* Status Badge */

const StatusBadge = ({ status }) => {
  const config = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    contacted:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    qualified:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    hired: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        config[status] || config.new
      }`}
    >
      {status}
    </span>
  );
};

/* Main Page */

export default function LeadManagementPage() {
  const PAGE_SIZE = 10;

  const [activeTab, setActiveTab] = useState("business");

  const [businessLeads, setBusinessLeads] = useState([]);
  const [hiringLeads, setHiringLeads] = useState([]);

  const [businessLoading, setBusinessLoading] = useState(true);
  const [hiringLoading, setHiringLoading] = useState(true);

  const [businessSearch, setBusinessSearch] = useState("");
  const [hiringSearch, setHiringSearch] = useState("");

  const [businessPage, setBusinessPage] = useState(1);
  const [hiringPage, setHiringPage] = useState(1);

  useEffect(() => {
    logUIAction("PAGE_VISIT", "LEAD_MANAGEMENT");
  }, []);

  const fetchBusiness = async () => {
    try {
      setBusinessLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/demo-requests`, {
        credentials: "include",
      });

      const data = await res.json();

      setBusinessLeads(Array.isArray(data.data) ? data.data : []);
    } finally {
      setBusinessLoading(false);
    }
  };

  const fetchHiring = async () => {
    try {
      setHiringLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
        credentials: "include",
      });

      const data = await res.json();

      setHiringLeads(Array.isArray(data.items) ? data.items : []);
    } finally {
      setHiringLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
    fetchHiring();
  }, []);

  const filteredBusiness = businessLeads.filter((lead) =>
    (lead.name || "").toLowerCase().includes(businessSearch.toLowerCase())
  );

  const filteredHiring = hiringLeads.filter((lead) =>
    (lead.fullName || "").toLowerCase().includes(hiringSearch.toLowerCase())
  );

  const businessTotalPages = Math.ceil(filteredBusiness.length / PAGE_SIZE);
  const hiringTotalPages = Math.ceil(filteredHiring.length / PAGE_SIZE);

  const businessData = filteredBusiness.slice(
    (businessPage - 1) * PAGE_SIZE,
    businessPage * PAGE_SIZE
  );

  const hiringData = filteredHiring.slice(
    (hiringPage - 1) * PAGE_SIZE,
    hiringPage * PAGE_SIZE
  );

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Lead Management"
        description="Centralized view for all incoming leads"
      >
     <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-6">

  {/* Tabs */}

  <div className="w-full flex justify-left">

    <div className="grid grid-cols-2 w-full max-w-xs bg-gray-100 dark:bg-[#1e293b] p-1 rounded-lg">

      <button
        onClick={() => setActiveTab("business")}
        className={`w-full py-2 text-sm sm:text-base font-medium rounded-md transition ${
          activeTab === "business"
            ? "bg-white dark:bg-[#0f172a] shadow text-blue-600"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        Business Leads
      </button>

      <button
        onClick={() => setActiveTab("hiring")}
        className={`w-full py-2 text-sm sm:text-base font-medium rounded-md transition ${
          activeTab === "hiring"
            ? "bg-white dark:bg-[#0f172a] shadow text-blue-600"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        Hiring Leads
      </button>

    </div>

  </div>

  {activeTab === "business" && (
    <LeadTable
      title="Business Leads"
      icon={<Building className="w-5 h-5 text-emerald-600" />}
      data={businessData}
      loading={businessLoading}
      search={businessSearch}
      setSearch={setBusinessSearch}
      refresh={fetchBusiness}
      page={businessPage}
      setPage={setBusinessPage}
      totalPages={businessTotalPages}
      type="demo"
    />
  )}

  {activeTab === "hiring" && (
    <LeadTable
      title="Hiring Leads"
      icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
      data={hiringData}
      loading={hiringLoading}
      search={hiringSearch}
      setSearch={setHiringSearch}
      refresh={fetchHiring}
      page={hiringPage}
      setPage={setHiringPage}
      totalPages={hiringTotalPages}
      type="job"
    />
  )}

</div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

/* Table Component */

function LeadTable({
  title,
  icon,
  data,
  loading,
  search,
  setSearch,
  refresh,
  page,
  setPage,
  totalPages,
  type,
}) {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-xl shadow border border-gray-200 dark:border-gray-700">

      {/* Header */}

      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
          {icon}
          {title}
        </h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">

          <div className="relative flex-1 sm:flex-none">

            <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-7 pr-2 py-1.5 w-full sm:w-48 md:w-56 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
            />

          </div>

          <button
            onClick={refresh}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="w-full overflow-x-auto">

        <table className="min-w-[600px] w-full text-sm">

          <thead className="bg-gray-50 dark:bg-[#0f172a]">

            <tr>
              <th className="px-3 py-3 text-left text-md">Name</th>
              <th className="px-3 py-3 text-left text-md">Date</th>
              <th className="px-3 py-3 text-left text-md">Status</th>
              <th className="px-3 py-3 text-left text-md">Actions</th>
            </tr>

          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No data
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {item.fullName || item.name}
                  </td>

                  <td className="px-3 py-3 text-gray-500 dark:text-gray-300 whitespace-nowrap">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="">
                    <LeadActions lead={item} type={type} onUpdated={refresh} />
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm">

        <p className="text-gray-600 dark:text-gray-300">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}