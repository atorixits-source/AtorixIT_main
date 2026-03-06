"use client";

import { API_BASE_URL } from "@/lib/api";
import LeadsToolbar from "@/components/admin/LeadsToolbar";
import LeadActions from "@/components/admin/LeadActions";
import { trackPage } from "@/lib/activityTracker";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import { logUIAction } from "@/lib/uiLogger";
import {
  Users, TrendingUp, Calendar,
  X, FileText, Download, ExternalLink
} from "lucide-react";

const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');
const isDocx = (url) => url?.toLowerCase().endsWith('.docx') || url?.toLowerCase().endsWith('.doc');

// ─── Resume Preview Modal ─────────────────────────────────────────────────────
const ResumePreviewModal = ({ url, name, onClose }) => {

  if (!url) return null;

  const pdf = isPdf(url);
  const docx = isDocx(url);

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >

      <div className="rounded-xl shadow-2xl w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl flex flex-col bg-white dark:bg-[#1e293b]" style={{ height: "90vh" }}>

        {/* Header */}

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">

          <div className="flex items-center gap-2 min-w-0">

            <FileText className="h-5 w-5 text-blue-600" />

            <span className="font-semibold text-sm truncate max-w-xs text-gray-900 dark:text-white">
              {name ? `${name}'s Resume` : "Resume Preview"}
            </span>

            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                pdf
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {pdf ? "PDF" : "DOCX"}
            </span>

          </div>

          <div className="flex items-center gap-2 min-w-0">

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open
            </a>

            <a
              href={url}
              download
              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-blue-600 text-white"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </a>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

          </div>

        </div>

        {/* Body */}
        {/* Body */}
<div className="flex-1 overflow-hidden rounded-b-xl flex items-center justify-center bg-gray-100 dark:bg-[#0f172a]">
  {pdf && (
            <iframe src={url} className="w-full h-full border-0 rounded-b-xl" title="Resume Preview" />
          )}
          {docx && (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
              <FileText className="h-10 w-10 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Word Document</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">DOCX files can't be previewed in the browser.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Open in Google Docs or download to view.</p>
              </div>
              <div className="flex gap-3 mt-2">
                <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200" >
                  <ExternalLink className="h-4 w-4" /> Open in Google Docs
                </a>
                <a href={url} download
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            </div>
          )}
          {!pdf && !docx && (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="font-medium text-gray-600 dark:text-gray-300">Cannot preview this file type</p>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                Open File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

function AdminDashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('business');
  const [leads, setLeads] = useState({ business: [], hiring: [] });
  const [leadsLoading, setLeadsLoading] = useState({ business: true, hiring: true });
  const [error, setError] = useState({ business: null, hiring: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [resumeModal, setResumeModal] = useState({ open: false, url: null, name: null });

  const [stats, setStats] = useState({
    business: { totalLeads: 0, lastWeek: 0, lastMonth: 0, newLeads: 0 },
    hiring: { totalLeads: 0, lastWeek: 0, lastMonth: 0, newLeads: 0 },
  });

  const fetchLeads = async (type, page = 1) => {
    try {
      setLeadsLoading(prev => ({ ...prev, [type]: true }));
      setError(prev => ({ ...prev, [type]: null }));

      const endpoint = type === "business"
        ? `${API_BASE_URL}/api/business-leads?page=${page}&limit=${itemsPerPage}`
        : `${API_BASE_URL}/api/job-applications?page=${page}&pageSize=${itemsPerPage}`;

      const token = localStorage.getItem("atorix_auth_token");

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "Failed to fetch leads");

      let leadsData = [];
      let total = 0;

      if (type === "business" && result?.success) {
        leadsData = result.data || [];
        total = result.total || leadsData.length;
        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 86400000);
        const oneMonthAgo = new Date(now - 30 * 86400000);
        setStats(prev => ({
          ...prev,
          business: {
            totalLeads: total,
            lastWeek: leadsData.filter(l => new Date(l.createdAt) >= oneWeekAgo).length,
            lastMonth: leadsData.filter(l => new Date(l.createdAt) >= oneMonthAgo).length,
            newLeads: leadsData.filter(l => l.status === "new").length,
          }
        }));
      }

      if (type === "hiring" && result?.success) {
        leadsData = (result.items || []).map(app => ({
          _id: app._id,
          name: app.fullName,
          company: app.currentCompany || "",
          position: app.position,
          email: app.email,
          phone: app.phone,
          skills: app.skills || [],
          status: app.status || "new",
          createdAt: app.createdAt,
          resumePath: app.resumePath,
          __raw: app,
        }));
        total = result.total || 0;
        setStats(prev => ({ ...prev, hiring: { ...prev.hiring, totalLeads: total } }));
      }

      setLeads(prev => ({ ...prev, [type]: leadsData }));
      return leadsData;

    } catch (err) {
      console.error(`Error fetching ${type} leads:`, err);
      setError(prev => ({ ...prev, [type]: err.message || "Failed to load leads" }));
      return [];
    } finally {
      setLeadsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/admin/login"); return; }
    trackPage("/admin/dashboard", "auto");
    fetchLeads('business');
    fetchLeads('hiring', 1);
  }, [router]);

  useEffect(() => {
    setCurrentPage(1);
    if (activeTab === "hiring") fetchLeads("hiring", 1);
    if (activeTab === "business") fetchLeads("business");
  }, [searchTerm, statusFilter, activeTab]);

  const getFilteredLeads = (type) => {
    if (!leads[type]) return [];
    return leads[type].filter(lead => {
      if (!lead) return false;
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        lead.name?.toLowerCase().includes(s) ||
        lead.email?.toLowerCase().includes(s) ||
        lead.company?.toLowerCase().includes(s) ||
        lead.position?.toLowerCase().includes(s) ||
        (Array.isArray(lead.skills) && lead.skills.some(sk => sk?.toLowerCase().includes(s)));
      return matchesSearch && (statusFilter === 'all' || lead.status === statusFilter);
    });
  };

  const filteredLeads = getFilteredLeads(activeTab) || [];
  const currentStats = stats[activeTab] || {};
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredLeads.length);
  const currentLeads = filteredLeads.slice(startItem - 1, endItem);

  const paginate = (n) => {
    setCurrentPage(n);
    logUIAction("PAGINATE", "Dashboard", { page: n, tab: activeTab });
    if (activeTab === "hiring") fetchLeads("hiring", n);
  };

  const statsCards = [
    { title: "Total Leads", value: currentStats.totalLeads, icon: <Users className="h-6 w-6 text-blue-500" />, change: 12, changeType: "increase" },
    { title: "New This Week", value: currentStats.lastWeek, icon: <TrendingUp className="h-6 w-6 text-green-500" />, change: 5, changeType: "increase" },
    { title: "New This Month", value: currentStats.lastMonth, icon: <Calendar className="h-6 w-6 text-purple-500" />, change: 8, changeType: "increase" },
    { title: "New Leads", value: currentStats.newLeads, icon: <FileText className="h-6 w-6 text-yellow-500" />, change: 3, changeType: "decrease" },
  ];

      const tabSwitcher = (size) => (
        <div
          className={`rounded-2xl p-2 flex gap-2 bg-gray-200/80 dark:bg-[#334155] ${size === 'sm' ? 'flex-1' : ''}`}
        >
      {['business', 'hiring'].map(tab => (
        <button
          key={tab}
          onClick={() => { setActiveTab(tab); logUIAction("SWITCH_TAB", "Dashboard", { to: tab }); }}
          className={`${size === 'sm' ? 'flex-1 px-3 py-2 text-xs' : 'px-4 py-2 text-sm'}
            font-medium rounded-xl transition-all
            ${
              activeTab === tab
                ? "bg-white dark:bg-[#1e293b] text-blue-600 shadow"
                : "text-gray-600 dark:text-gray-300"
            }`}
        >
          {size === 'sm'
            ? (tab === 'business' ? 'Business' : 'Hiring')
            : (tab === 'business' ? 'Business Leads' : 'Hiring Leads')}
        </button>
      ))}
    </div>
  );

  return (
     <div className="min-h-screen">

      {resumeModal.open && (
        <ResumePreviewModal
          url={resumeModal.url}
          name={resumeModal.name}
          onClose={() => setResumeModal({ open: false, url: null, name: null })}
        />
      )}

      <AdminLayout>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statsCards.map((stat, i) => (
              <div key={i} className="rounded-lg shadow p-6 flex items-start justify-between bg-white dark:bg-[#1e293b]">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{(stat.value || 0).toLocaleString()}</p>
                  <p className="text-sm mt-2" style={{ color: stat.changeType === "increase" ? '#16a34a' : '#dc2626' }}>
                    {stat.changeType === "increase" ? "↑" : "↓"} {stat.change}% from last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* Leads Section */}
          <div className="rounded-lg shadow overflow-hidden bg-white dark:bg-[#1e293b]">
             <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6">

              {/* Header / Tabs */}
              <div className="mb-6">
                <div className="flex flex-col gap-4">

                  {/* ≥770px */}
                  <div className="hidden lg:flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 w-full">
                    <div>
                      <h2 className="text-sm mt-1 text-gray-500 dark:text-gray-400">Leads Overview</h2>
                      <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                        Manage and track all your {activeTab === 'business' ? 'business' : 'hiring'} leads
                      </p>
                    </div>
                    {tabSwitcher('lg')}
                    <LeadsToolbar
                      searchTerm={searchTerm}
                      onSearchChange={(v) => { setSearchTerm(v); logUIAction("SEARCH_LEADS", "Dashboard", { query: v, tab: activeTab }); }}
                      statusFilter={statusFilter}
                      onStatusChange={(v) => { setStatusFilter(v); logUIAction("FILTER_STATUS", "Dashboard", { status: v, tab: activeTab }); }}
                      activeTab={activeTab}
                      loading={leadsLoading[activeTab]}
                      onRefresh={() => { logUIAction("REFRESH_LEADS", "Dashboard", { tab: activeTab }); fetchLeads(activeTab); }}
                    />
                  </div>

                  {/* 600–769px */}
                  <div className="hidden md:flex lg:hidden flex-col gap-4 w-full">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-lg mt-1 text-gray-500 dark:text-gray-400">Leads Overview</h2>
                      <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                        Manage and track all your {activeTab === 'business' ? 'business' : 'hiring'} leads
                      </p>
                      {tabSwitcher('lg')}
                    </div>
                    <LeadsToolbar
                      searchTerm={searchTerm}
                      onSearchChange={(v) => { setSearchTerm(v); logUIAction("SEARCH_LEADS", "Dashboard", { query: v, tab: activeTab }); }}
                      statusFilter={statusFilter}
                      onStatusChange={(v) => { setStatusFilter(v); logUIAction("FILTER_STATUS", "Dashboard", { status: v, tab: activeTab }); }}
                      activeTab={activeTab}
                      loading={leadsLoading[activeTab]}
                      onRefresh={() => fetchLeads(activeTab)}
                    />
                  </div>

                  {/* <600px */}
                  <div className="flex flex-col gap-4 md:hidden">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leads Overview</h2>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                        Manage and track all your {activeTab === 'business' ? 'business' : 'hiring'} leads
                      </p>
                    {tabSwitcher('sm')}
                    <LeadsToolbar
                      searchTerm={searchTerm}
                      onSearchChange={(v) => setSearchTerm(v)}
                      statusFilter={statusFilter}
                      onStatusChange={(v) => setStatusFilter(v)}
                      activeTab={activeTab}
                      loading={leadsLoading[activeTab]}
                    />
                  </div>

                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto w-full">
                <table className="min-w-[720px] md:min-w-full w-full divide-y text-[11px] min-[375px]:text-xs min-[768px]:text-sm border-t border-gray-200 dark:border-gray-700">
                   <thead className="bg-gray-50 dark:bg-[#0f172a]">
                    <tr>
                      {[
                        activeTab === 'hiring' ? 'Candidate' : 'Name',
                        activeTab === 'business' ? 'Company' : 'Position',
                        'Email', 'Phone', 'Date', 'Status', 'Actions'
                      ].map(col => (
                        <th
                          key={col}
                          className="px-3 min-[768px]:px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                         
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                 <tbody className="divide-y bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700">
                   {leadsLoading[activeTab] ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading {activeTab} leads...</td></tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No {activeTab} leads found.</td></tr>
                    ) : (
                      currentLeads.map((lead, i) => (
                        <tr
                              key={lead?._id || i}
                              className="hover:bg-gray-50 dark:hover:bg-[#334155]"
                            >
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{lead?.name || 'N/A'}</td>
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap   text-gray-700 dark:text-gray-300">
                            {activeTab === 'business' ? (lead?.company || 'N/A') : (lead?.position || 'N/A')}
                          </td>
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap   text-gray-700 dark:text-gray-300">{lead?.email || 'N/A'}</td>
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap   text-gray-700 dark:text-gray-300">{lead?.phone || 'N/A'}</td>
                            <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                        {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                                                      </td> 
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                              lead?.status === 'new' ? 'bg-green-100 text-green-800'
                              : lead?.status === 'contacted' ? 'bg-blue-100 text-blue-800'
                              : lead?.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800'
                              : lead?.status === 'hired' ? 'bg-purple-100 text-purple-800'
                              : lead?.status === 'rejected' ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                              {lead?.status || 'unknown'}
                            </span>
                          </td>

                          

                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap">
                            <LeadActions
                              lead={lead}
                              type={activeTab === "business" ? "business" : "job"}
                              onUpdated={() => {
                                logUIAction("UPDATE_LEAD", "Dashboard", { leadId: lead._id, type: activeTab });
                                activeTab === "hiring" ? fetchLeads("hiring", currentPage) : fetchLeads("business");
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
             <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700">

  {/* Results Count */}
  <p className="text-sm text-gray-600 dark:text-gray-300">
    Showing{" "}
    <span className="font-semibold">{startItem}</span> to{" "}
    <span className="font-semibold">{endItem}</span> of{" "}
    <span className="font-semibold">{filteredLeads.length}</span> results
  </p>

  {/* Pagination */}
  <div className="flex flex-wrap items-center gap-1">

    {/* Prev */}
    <button
      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="
      px-3 py-1.5
      text-sm
      rounded-md
      border border-gray-300 dark:border-gray-600
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-[#334155]
      disabled:opacity-50
      transition
      "
    >
      Prev
    </button>

    {/* Page Numbers */}
    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      let p;

      if (totalPages <= 5) p = i + 1;
      else if (currentPage <= 3) p = i + 1;
      else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
      else p = currentPage - 2 + i;

      return (
        <button
          key={p}
          onClick={() => paginate(p)}
          className={`
          px-3 py-1.5
          text-sm
          rounded-md
          border
          transition
          ${
            currentPage === p
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155]"
          }
          `}
        >
          {p}
        </button>
      );
    })}

    {/* Next */}
    <button
      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="
      px-3 py-1.5
      text-sm
      rounded-md
      border border-gray-300 dark:border-gray-600
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-[#334155]
      disabled:opacity-50
      transition
      "
    >
      Next
    </button>

  </div>

</div>

            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <RoleBasedRoute allowedRoles={['super_admin', 'admin']}>
      <AdminDashboardContent />
    </RoleBasedRoute>
  );
}