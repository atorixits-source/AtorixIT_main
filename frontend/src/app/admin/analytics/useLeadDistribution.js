import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "@/lib/api";

/* =========================================
   DEMO REQUEST STATUS CONFIG
========================================= */

const statusConfig = {
  new: {
    label: "New",
    color: "stroke-blue-500",
    dot: "bg-blue-500",
  },
  contacted: {
    label: "Contacted",
    color: "stroke-yellow-500",
    dot: "bg-yellow-500",
  },
  reviewed: {
    label: "Reviewed",
    color: "stroke-purple-500",
    dot: "bg-purple-500",
  },
  scheduled: {
    label: "Scheduled",
    color: "stroke-indigo-500",
    dot: "bg-indigo-500",
  },
  completed: {
    label: "Completed",
    color: "stroke-green-500",
    dot: "bg-green-500",
  },
  hired: {
    label: "Hired",
    color: "stroke-emerald-500",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "stroke-red-500",
    dot: "bg-red-500",
  },
};

/* ========================================= */

export default function useLeadDistribution() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ALL DEMO REQUESTS ================= */

  const fetchLeads = async () => {
    try {
      setLoading(true);

      // 🔥 IMPORTANT: fetch ALL records (no pagination limit)
      const res = await apiRequest(
        `/api/demo-requests/all/raw`
      );

      setLeads(res?.data || []);
    } catch (err) {
      console.error("Distribution fetch error:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= DISTRIBUTION ================= */

  const distribution = useMemo(() => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    const total = leads.length;

    const counts = {};

    Object.keys(statusConfig).forEach((k) => {
      counts[k] = 0;
    });

    // Count actual demo-request statuses directly
    leads.forEach((lead) => {
      const status = (lead.status || "new").toLowerCase();

      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    let usedLength = 0;
    const segments = [];

    const keys = Object.keys(statusConfig);

    keys.forEach((status, index) => {
      const count = counts[status];

      let percent = total ? (count / total) * 100 : 0;
      let length = (percent / 100) * circumference;

      // Fix rounding gap
      if (index === keys.length - 1) {
        length = circumference - usedLength;
        percent = total ? (length / circumference) * 100 : 0;
      }

      usedLength += length;

      segments.push({
        status,
        count,
        percent,
        displayPercent: Math.round(percent),
        length,
        ...statusConfig[status],
      });
    });

    return {
      radius,
      circumference,
      segments,
      total,
    };
  }, [leads]);

  return {
    ...distribution,
    loading,
    refresh: fetchLeads,
  };
}
