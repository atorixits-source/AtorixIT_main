"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import LeadActions from "@/components/admin/LeadActions";

const StatusBadge = ({ status }) => {
  const config = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    contacted:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    qualified:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    hired:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    reviewed:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    scheduled:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    completed:
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    cancelled:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    converted:
      "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        config[status] || config.new
      }`}
    >
      {status}
    </span>
  );
};

export default function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 8;

  const fetchLeads = async (pageNo = 1) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("atorix_auth_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo-requests?page=${pageNo}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
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
    <div className="mx-8 rounded-lg shadow overflow-hidden bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700">
      
      {/* HEADER */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Leads
        </h3>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => fetchLeads(page)}
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto ">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="pl-5 py-3 text-left">Company</th>
              <th className="pl-5 py-3 text-left">Contact</th>
              <th className="pl-5 py-3 text-left">Email</th>
              <th className="pl-5 py-3 text-left">Phone</th>
              <th className="pl-5 py-3 text-left">Status</th>
              <th className=" py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No data
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="pl-5 py-3 font-medium text-gray-900 dark:text-white">
                    {lead.company || "N/A"}
                  </td>

                  <td className="pl-5 py-3 text-gray-700 dark:text-gray-300">
                    {lead.name}
                  </td>

                  <td className="pl-5 py-3 text-gray-700 dark:text-gray-300">
                    {lead.email}
                  </td>

                  <td className="pl-5 py-3 text-gray-700 dark:text-gray-300">
                    {lead.phone}
                  </td>

                  <td className="pl-5 py-3">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="px-5 py-3 text-center">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
