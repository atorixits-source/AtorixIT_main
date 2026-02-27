"use client";

import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Briefcase,
  Building,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import LeadActions from "@/components/admin/LeadActions";
import { API_BASE_URL } from "@/lib/api";

/* ---------------- Logger Helper ---------------- */

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

/* ---------------- Status Badge ---------------- */

const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    contacted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    hired: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig.new}`}>
      {status}
    </span>
  );
};

/* ---------------- Main Page ---------------- */

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

  /* ---------- PAGE VISIT LOGGER ---------- */
  useEffect(() => {
    logUIAction("PAGE_VISIT", "LEAD_MANAGEMENT");
  }, []);

  /* ---------------- Fetch Business ---------------- */

  const fetchBusiness = async () => {
    try {
      setBusinessLoading(true);

      logUIAction("REFRESH_BUSINESS_LEADS", "LEAD_MANAGEMENT");

      const res = await fetch(`${API_BASE_URL}/api/demo-requests`, {
        credentials: "include",
      });

      const data = await res.json();

      setBusinessLeads(Array.isArray(data.data) ? data.data : []);

    } catch (err) {
      console.error(err);
      setBusinessLeads([]);
    } finally {
      setBusinessLoading(false);
    }
  };

  /* ---------------- Fetch Hiring (FIXED) ---------------- */

  const fetchHiring = async () => {
    try {
      setHiringLoading(true);

      logUIAction("REFRESH_HIRING_LEADS", "LEAD_MANAGEMENT");

      const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
        credentials: "include",
      });

      const data = await res.json();

      // ✅ FIX HERE
      setHiringLeads(Array.isArray(data.items) ? data.items : []);

    } catch (err) {
      console.error(err);
      setHiringLeads([]);
    } finally {
      setHiringLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
    fetchHiring();
  }, []);

  /* ---------- TAB SWITCH LOGGER ---------- */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    logUIAction("TAB_SWITCH", "LEAD_MANAGEMENT", { tab });
  };

  /* ---------------- Filter Logic ---------------- */

  const filteredBusiness = businessLeads.filter((lead) =>
    (lead.name || "").toLowerCase().includes(businessSearch.toLowerCase())
  );

  const filteredHiring = hiringLeads.filter((lead) =>
    (lead.fullName || "").toLowerCase().includes(hiringSearch.toLowerCase())
  );

  const businessData = filteredBusiness.slice(
    (businessPage - 1) * PAGE_SIZE,
    businessPage * PAGE_SIZE
  );

  const hiringData = filteredHiring.slice(
    (hiringPage - 1) * PAGE_SIZE,
    hiringPage * PAGE_SIZE
  );

  /* ---------------- Render ---------------- */

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Lead Management"
        description="Centralized view for all incoming leads"
      >

        <div className="p-6 space-y-6">

          {/* Toggle */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => handleTabChange("business")}
              className={`px-4 py-2 rounded-md ${activeTab === "business" ? "bg-white dark:bg-gray-700 shadow text-blue-600" : ""}`}
            >
              Business Leads
            </button>

            <button
              onClick={() => handleTabChange("hiring")}
              className={`px-4 py-2 rounded-md ${activeTab === "hiring" ? "bg-white dark:bg-gray-700 shadow text-blue-600" : ""}`}
            >
              Hiring Leads
            </button>
          </div>

          {/* BUSINESS TABLE (UNCHANGED STRUCTURE) */}
          {activeTab === "business" && (
            <LeadTable
              title="Business Leads"
              icon={<Building className="w-5 h-5 text-emerald-600" />}
              data={businessData}
              loading={businessLoading}
              search={businessSearch}
              setSearch={setBusinessSearch}
              refresh={fetchBusiness}
              type="business"
            />
          )}

          {/* HIRING TABLE (NOW POPULATED) */}
          {activeTab === "hiring" && (
            <LeadTable
              title="Hiring Leads"
              icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
              data={hiringData}
              loading={hiringLoading}
              search={hiringSearch}
              setSearch={setHiringSearch}
              refresh={fetchHiring}
              type="job"
            />
          )}

        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}

/* ---------------- Shared Table Component ---------------- */

function LeadTable({ title, icon, data, loading, search, setSearch, refresh, type }) {

  return (
    <div className="bg-white rounded-xl shadow border">

      <div className="p-5 border-b flex justify-between items-center">

        <h2 className="flex items-center gap-2 font-semibold">
          {icon}
          {title}
        </h2>

        <div className="flex gap-3">

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-1.5 border rounded-md text-sm"
            />
          </div>

          <button
            onClick={refresh}
            className="p-2 border rounded-md hover:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs">Name</th>
              <th className="px-4 py-3 text-left text-xs">Status</th>
              <th className="px-4 py-3 text-left text-xs">Date</th>
              <th className="px-4 py-3 text-right text-xs">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-6 text-center">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="4" className="p-6 text-center text-gray-500">No data found</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {item.fullName || item.name}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <LeadActions lead={item} type={type} />
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}