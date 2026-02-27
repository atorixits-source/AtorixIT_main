"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users,
  Briefcase,
  UserCheck,
  Clock,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { trackPage } from "@/lib/activityTracker";
import { logUIAction } from "@/lib/uiLogger";
/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const value = status?.toLowerCase();

  const styles = {
    applied:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    interview:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    hired:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    rejected:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    reviewed:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    contacted:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
    new:
      "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all duration-200 hover:scale-105 ${styles[value] ||
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        }`}
    >
      {status || "N/A"}
    </span>
  );
};

export default function RecruitmentPage() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 6;
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/job-applications`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCandidates(data.items || []);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error(error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    trackPage("/admin/recruitment", "auto");
    logUIAction("REC_PAGE_OPEN", "Recruitment");
    fetchCandidates();
  }, []);

  /* ================= FILTER ================= */
  const filtered = candidates.filter((c) =>
    c.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const paginatedData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  /* ================= STATS ================= */
  const getCount = (status) =>
    candidates.filter((c) => c.status?.toLowerCase() === status).length;

  const stats = {
    total: candidates.length,
    applied: getCount("applied"),
    reviewed: getCount("reviewed"),
    contacted: getCount("contacted"),
    interview: getCount("interview"),
    hired: getCount("hired"),
    rejected: getCount("rejected"),
    new: getCount("new"),
  };

  return (
    <AdminLayout
      title="Recruitment"
      description="Manage hiring pipeline and candidate tracking."
    >
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total" value={stats.total} />
        <StatCard icon={Briefcase} label="Applied" value={stats.applied} />
        <StatCard icon={UserCheck} label="Reviewed" value={stats.reviewed} />
        <StatCard icon={Clock} label="Contacted" value={stats.contacted} />
        <StatCard icon={Clock} label="Interview" value={stats.interview} />
        <StatCard icon={UserCheck} label="Hired" value={stats.hired} />
        <StatCard icon={UserCheck} label="Rejected" value={stats.rejected} />
        <StatCard icon={Users} label="New" value={stats.new} />
      </div>

      {/* ================= SEARCH ================= */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center w-full sm:w-auto gap-3">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            placeholder="Search candidates..."
            className="w-full sm:w-72 outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
            value={search}
            onChange={(e) => {
              const val = e.target.value;

              setSearch(val);
              setCurrentPage(1);

              logUIAction("REC_SEARCH", "Recruitment", {
                query: val,
              });
            }}
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {/* ================= TABLE ================= */}
      <div className="w-full max-w-full px-2 sm:px-4 md:px-6">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

            <table className="min-w-[600px] sm:min-w-full text-xs sm:text-sm">

              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold whitespace-nowrap">
                    Candidate
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold whitespace-nowrap">
                    Position
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold whitespace-nowrap">
                    Applied
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((c, index) => (
                  <tr
                    key={c._id}
                    className={`border-b border-gray-200 transition-all duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-indigo-50`}
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800 whitespace-nowrap">
                      {c.fullName}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 whitespace-nowrap">
                      {c.position}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-3 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 text-center sm:text-left">

              <div className="text-xs sm:text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * rowsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * rowsPerPage, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{filtered.length}</span> results
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">

                <button
                  onClick={() => {
                    setCurrentPage((prev) => {
                      const next = Math.max(prev - 1, 1);

                      if (next !== prev) {
                        logUIAction("REC_PAGINATE", "Recruitment", {
                          from: prev,
                          to: next,
                        });
                      }

                      return next;
                    });
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-md text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  const isActive = currentPage === page;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (page !== currentPage) {
                          logUIAction("REC_PAGINATE", "Recruitment", {
                            from: currentPage,
                            to: page,
                          });
                        }

                        setCurrentPage(page);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs sm:text-sm transition ${isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    setCurrentPage((prev) => {
                      const next = Math.min(prev + 1, totalPages);

                      if (next !== prev) {
                        logUIAction("REC_PAGINATE", "Recruitment", {
                          from: prev,
                          to: next,
                        });
                      }

                      return next;
                    });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-md text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>

              </div>
            </div>
          )}

        </div>
      </div>


    </AdminLayout>
  );


}

/* ================= STAT CARD ================= */
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.03] transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <Icon className="w-6 h-6" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );
}
