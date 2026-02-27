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

// ─── Resume URL helpers ───────────────────────────────────────────────────────
// Your jobApplications.js uploads:
//   PDF   → resource_type: 'image' → URL: .../image/upload/...resume.pdf
//   DOCX  → resource_type: 'raw'   → URL: .../raw/upload/...resume.docx
//
// PDFs stored as Cloudinary 'image' can be opened directly in an <iframe>.
// DOCX can't render in browser → show download + Google Docs button instead.
const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');
const isDocx = (url) => url?.toLowerCase().endsWith('.docx') || url?.toLowerCase().endsWith('.doc');

// ─── Resume Preview Modal ─────────────────────────────────────────────────────
const ResumePreviewModal = ({ url, name, onClose }) => {
  if (!url) return null;
  const pdf = isPdf(url);
  const docx = isDocx(url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col" style={{ height: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-800 text-sm truncate max-w-xs">
              {name ? `${name}'s Resume` : 'Resume Preview'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pdf ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {pdf ? 'PDF' : 'DOCX'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1.5 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Open
            </a>
            <a href={url} download
              className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 transition-colors">
              <Download className="h-3.5 w-3.5" /> Download
            </a>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden rounded-b-xl bg-gray-100 flex items-center justify-center">
          {pdf && (
            // ✅ PDF uploaded as Cloudinary 'image' → direct URL works in iframe, no proxy needed
            <iframe src={url} className="w-full h-full border-0 rounded-b-xl" title="Resume Preview" />
          )}
          {docx && (
            // DOCX can't render in browser natively → show options
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                <FileText className="h-10 w-10 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg mb-1">Word Document</p>
                <p className="text-sm text-gray-500">DOCX files can't be previewed in the browser.</p>
                <p className="text-sm text-gray-500">Open in Google Docs or download to view.</p>
              </div>
              <div className="flex gap-3 mt-2">
                <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 text-sm transition-colors">
                  <ExternalLink className="h-4 w-4" /> Open in Google Docs
                </a>
                <a href={url} download
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm transition-colors">
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            </div>
          )}
          {!pdf && !docx && (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400" />
              <p className="text-gray-600 font-medium">Cannot preview this file type</p>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Open File</a>
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

  // ✅ Simple modal — just url + name, no proxy, no applicationId needed
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

      const response = await fetch(endpoint, {
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
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

  return (
    <div className="min-h-screen">

      {/* ✅ Resume modal — direct Cloudinary URL, no proxy */}
      {resumeModal.open && (
        <ResumePreviewModal
          url={resumeModal.url}
          name={resumeModal.name}
          onClose={() => setResumeModal({ open: false, url: null, name: null })}
        />
      )}

      <AdminLayout>
        <div className="p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{(stat.value || 0).toLocaleString()}</p>
                  <p className={`text-sm mt-2 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                    {stat.changeType === "increase" ? "↑" : "↓"} {stat.change}% from last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* Leads Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">

              {/* Header / Tabs */}
              <div className="mb-6">
                <div className="flex flex-col gap-4">

                  {/* ≥770px */}
                  <div className="hidden min-[770px]:flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Leads Overview</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage and track all your {activeTab === 'business' ? 'business' : 'hiring'} leads
                      </p>
                    </div>
                    <div className="flex bg-gray-200/80 dark:bg-gray-700 rounded-2xl p-2 gap-2">
                      {['business', 'hiring'].map(tab => (
                        <button key={tab}
                          onClick={() => { setActiveTab(tab); logUIAction("SWITCH_TAB", "Dashboard", { to: tab }); }}
                          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === tab ? "bg-white shadow text-blue-600" : "text-gray-800 dark:text-gray-200"}`}>
                          {tab === 'business' ? 'Business Leads' : 'Hiring Leads'}
                        </button>
                      ))}
                    </div>
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
                  <div className="hidden min-[600px]:flex min-[600px]:flex-col min-[600px]:gap-4 min-[770px]:hidden">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-lg font-semibold text-gray-900">Leads Overview</h2>
                      <div className="flex bg-gray-200/80 dark:bg-gray-700 rounded-2xl p-2 gap-2">
                        {['business', 'hiring'].map(tab => (
                          <button key={tab}
                            onClick={() => { setActiveTab(tab); logUIAction("SWITCH_TAB", "Dashboard", { to: tab }); }}
                            className={`px-4 py-2 text-sm font-medium rounded-xl ${activeTab === tab ? "bg-white shadow text-blue-600" : "text-gray-800 dark:text-gray-200"}`}>
                            {tab === 'business' ? 'Business Leads' : 'Hiring Leads'}
                          </button>
                        ))}
                      </div>
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
                  <div className="flex flex-col gap-4 min-[600px]:hidden">
                    <h2 className="text-base font-semibold text-gray-900">Leads Overview</h2>
                    <div className="bg-gray-200/80 dark:bg-gray-700 rounded-2xl p-2 flex gap-2">
                      {['business', 'hiring'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded-xl transition-all ${activeTab === tab ? "bg-white shadow text-blue-600" : "text-gray-800 dark:text-gray-200"}`}>
                          {tab === 'business' ? 'Business' : 'Hiring'}
                        </button>
                      ))}
                    </div>
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
                <table className="min-w-[750px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-[11px] min-[375px]:text-xs min-[768px]:text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {[
                        activeTab === 'hiring' ? 'Candidate' : 'Name',
                        activeTab === 'business' ? 'Company' : 'Position',
                        'Email',
                        'Phone',
                        'Status',
                        'Date',
                        'Actions'
                      ].map(col => (
                        <th
                          key={col}
                          className="px-3 min-[768px]:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {leadsLoading[activeTab] ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading {activeTab} leads...</td></tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No {activeTab} leads found.</td></tr>
                    ) : (
                      currentLeads.map((lead, i) => (
                        <tr key={lead?._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{lead?.name || 'N/A'}</td>
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                            {activeTab === 'business' ? (lead?.company || 'N/A') : (lead?.position || 'N/A')}
                          </td>
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{lead?.email || 'N/A'}</td>
                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{lead?.phone || 'N/A'}</td>

                          

                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${lead?.status === 'new' ? 'bg-green-100 text-green-800'
                                : lead?.status === 'contacted' ? 'bg-blue-100 text-blue-800'
                                  : lead?.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800'
                                    : lead?.status === 'hired' ? 'bg-purple-100 text-purple-800'
                                      : lead?.status === 'rejected' ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'}`}>
                              {lead?.status || 'unknown'}
                            </span>
                          </td>

                          <td className="px-3 min-[768px]:px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
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
              <div className="px-4 min-[768px]:px-6 py-4 flex flex-col min-[768px]:flex-row items-center justify-between gap-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex w-full justify-between min-[768px]:hidden">
                  <button onClick={() => currentPage > 1 && paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50">Previous</button>
                  <button onClick={() => currentPage < totalPages && paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50">Next</button>
                </div>
                <div className="hidden min-[768px]:flex w-full items-center justify-between">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{filteredLeads.length}</span> results
                  </p>
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                    <button onClick={() => currentPage > 1 && paginate(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-2 border rounded-l-md text-sm disabled:opacity-50">Prev</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p;
                      if (totalPages <= 5) p = i + 1;
                      else if (currentPage <= 3) p = i + 1;
                      else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                      else p = currentPage - 2 + i;
                      return <button key={p} onClick={() => paginate(p)} className={`px-4 py-2 border text-sm ${currentPage === p ? 'bg-blue-50 border-blue-500 text-blue-600' : ''}`}>{p}</button>;
                    })}
                    <button onClick={() => currentPage < totalPages && paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-2 border rounded-r-md text-sm disabled:opacity-50">Next</button>
                  </nav>
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