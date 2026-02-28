"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import LeadActions from "@/components/admin/LeadActions";

const StatusBadge = ({ status }) => {
  const config = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-purple-100 text-purple-800",
    qualified: "bg-green-100 text-green-800",
    hired: "bg-emerald-100 text-emerald-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    scheduled: "bg-indigo-100 text-indigo-800",
    completed: "bg-teal-100 text-teal-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    converted: "bg-green-200 text-green-900",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config[status] || config.new}`}>
      {status}
    </span>
  );
};

export default function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 15;

  const fetchLeads = async (pageNo = 1) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("atorix_auth_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo-requests?page=${pageNo}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        }
      );

      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();

      setLeads(data.data || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);

    } catch (err) {
      toast.error("Failed to load leads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(page);
  }, [page]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">

      {/* HEADER */}
      <div className="p-5 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Leads</h3>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => fetchLeads(page)}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No data
                </td>
              </tr>
            ) : (

              leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">

                  <td className="px-4 py-3 font-medium">
                    {lead.company || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {lead.name}
                  </td>

                  <td className="px-4 py-3">
                    {lead.email}
                  </td>

                  <td className="px-4 py-3">
                    {lead.phone}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <LeadActions
                      lead={lead}
                      type="demo"
                      onUpdated={() => fetchLeads(page)}
                    />
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center p-4 border-t text-sm">

        <span>
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">

          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight size={16} />
          </Button>

        </div>
      </div>

    </div>
  );
}