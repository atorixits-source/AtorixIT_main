"use client";

import { useEffect, useState, useCallback } from "react";

import AdminLayout from "@/components/admin/AdminLayout";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import { Button } from "@/components/ui/button";
import LeadActions from "@/components/admin/LeadActions";
import {
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react";

import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

/* ===============================
   CONFIG
================================ */

const PAGE_SIZE = 10;

/* ===============================
   COMPONENT
================================ */

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     UI AUDIT
  =============================== */

  const logUI = async (action, target = null, details = {}) => {
    try {
      await fetch(`${API_BASE_URL}/api/audit-logs/ui`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          target,
          details
        })
      });
    } catch {
      // silent
    }
  };

  /* ===============================
     FETCH
  =============================== */

  const fetchLeads = useCallback(
    async (p = page) => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/api/business-leads?page=${p}&limit=${PAGE_SIZE}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        setLeads(data.data || []);
        setPage(data.page);
        setTotalPages(data.totalPages);

      } catch {
        toast.error("Failed to load leads");
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/business-leads/stats/summary`,
        { credentials: "include" }
      );

      const data = await res.json();

      setStats(data.data);

    } catch { }
  };

  /* ===============================
     INIT
  =============================== */

  useEffect(() => {
    fetchLeads(1);
    fetchStats();
    logUI("VIEW_LEADS_PAGE");

  }, []);

  /* ===============================
     DELETE
  =============================== */

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete lead: ${name}?`)) return;

    logUI("CLICK_DELETE_LEAD", id);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/business-leads/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Lead deleted");

      fetchLeads(page);

    } catch {
      toast.error("Delete failed");
    }
  };

  /* ===============================
     PAGINATION
  =============================== */

  const nextPage = () => {
    if (page >= totalPages) return;

    logUI("NEXT_LEADS_PAGE", page + 1);

    fetchLeads(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;

    logUI("PREV_LEADS_PAGE", page - 1);

    fetchLeads(page - 1);
  };

  /* ===============================
     UI
  =============================== */

  return (
    <RoleBasedRoute>
      <AdminLayout
        title="Business Leads"
        description="Manage contacted and active leads"
      >
        {/* HeaderToggle */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">

          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Leads
          </h2>

          <Button
            variant="outline"
            onClick={() => {
              logUI("REFRESH_LEADS");
              fetchLeads(1);
            }}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>

        </div>
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            {Object.entries(stats).map(([k, v]) => (
              k !== "total" && (
                <div
                  key={k}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl border text-center"
                >
                  <p className="text-xs text-gray-500 uppercase">{k}</p>
                  <p className="text-2xl font-bold">{v}</p>
                </div>
              )
            ))}

          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>

                {!loading && leads.map(l => (
                  <tr
                    key={l._id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition"
                  >
                    <td className="px-4 py-3 font-medium">
                      {l.name}
                    </td>

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {l.email}
                    </td>

                    <td className="px-4 py-3">
                      {l.phone}
                    </td>

                    <td className="px-4 py-3">
                      {l.company || "—"}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className="
                          px-2 py-1 text-xs rounded-full
                          bg-blue-100 text-blue-700
                          dark:bg-blue-900/30 dark:text-blue-300
                        "
                      >
                        {l.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">

                      <LeadActions
                        lead={l}
                        type="business"
                        onUpdated={() => fetchLeads(page)}
                      />

                    </td>
                  </tr>
                ))}

                {!loading && leads.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500"
                    >
                      No leads found
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10"
                    >
                      Loading...
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* Pagination - Numbered Style */}
<div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">

  <span className="text-sm text-gray-500">
    Page {page} of {totalPages}
  </span>

  <div className="flex items-center gap-1">

    <Button
      variant="outline"
      size="sm"
      disabled={page <= 1}
      onClick={prevPage}
    >
      Prev
    </Button>

    {Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i}
        size="sm"
        variant={page === i + 1 ? "default" : "outline"}
        onClick={() => setPage(i + 1)}
        className="w-9"
      >
        {i + 1}
      </Button>
    ))}

    <Button
      variant="outline"
      size="sm"
      disabled={page >= totalPages}
      onClick={nextPage}
    >
      Next
    </Button>

  </div>
</div>



      </AdminLayout>
    </RoleBasedRoute>
  );
}