"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Download,
  Calendar as CalendarIcon,
  RefreshCw,
} from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { API_ENDPOINTS, apiRequest } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useLeadDistribution from "./useLeadDistribution";

/* ---------------- Lead Distribution Card ---------------- */

function LeadStatusDistribution() {
  const { segments, total, radius, circumference, loading, refresh } =
    useLeadDistribution();

  let offset = 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Business Leads
        </h2>

        <button
          onClick={refresh}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RefreshCw
            className={`w-5 h-5 ${
              loading
                ? "animate-spin text-blue-500"
                : "text-gray-600 dark:text-gray-300"
            }`}
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex gap-8 items-center justify-center">

        {/* Donut */}
        <div className="relative w-44 h-44">
          <svg width="176" height="176" viewBox="0 0 176 176">
            <g transform="translate(88,88) rotate(-90)">
              {segments.map((item, i) => {
                const circle = (
                  <circle
                    key={i}
                    r={radius}
                    cx="0"
                    cy="0"
                    fill="transparent"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${item.length} ${circumference}`}
                    strokeDashoffset={-offset}
                    className={item.color}
                  />
                );
                offset += item.length;
                return circle;
              })}
            </g>
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {total}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4">
          {segments.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${item.dot}`}
                ></span>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </div>

              <div className="text-gray-600 dark:text-gray-400">
                {item.count} ({item.displayPercent}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */

export default function Analytics() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sapData, setSapData] = useState([]);
  const [activities, setActivities] = useState([]);

  /* Fetch Business Leads (unchanged) */
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await apiRequest(
          API_ENDPOINTS.BUSINESS_LEADS
        );
        const leadsData = Array.isArray(response)
          ? response
          : response?.data || [];
        setLeads(leadsData);
      } catch (err) {
        setError("Failed to load lead data");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  /* Fetch SAP Interest Data (NO backend change needed) */
  useEffect(() => {
    const fetchSAPData = async () => {
      try {
        const res = await apiRequest(
          API_ENDPOINTS.DEMO_REQUESTS
        );

        const demoRequests = res?.data || [];

        const counts = {
          "SAP Implementation": 0,
          "SAP Support": 0,
          "SAP Migration": 0,
          "SAP Integration": 0,
        };

        demoRequests.forEach((item) => {
          if (Array.isArray(item.interests)) {
            item.interests.forEach((interest) => {
              if (counts[interest] !== undefined) {
                counts[interest]++;
              }
            });
          }
        });

        const formatted = Object.keys(counts).map((key) => ({
          name: key,
          count: counts[key],
        }));

        setSapData(formatted);
      } catch (err) {
        console.error("SAP chart error:", err);
      }
    };

    fetchSAPData();
  }, []);

  /* Fetch Recent Admin Activities */
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiRequest("/api/activity/recent");
        setActivities(res?.data || []);
      } catch (err) {
        console.error("Activity error:", err);
      }
    };

    fetchActivities();
  }, []);

  /* Metrics */
  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l?.status === "new").length;
    const contactedLeads = leads.filter(
      (l) => l?.status === "contacted"
    ).length;
    const qualifiedLeads = leads.filter(
      (l) => l?.status === "qualified"
    ).length;

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      conversionRate:
        totalLeads > 0
          ? Math.round((qualifiedLeads / totalLeads) * 100)
          : 0,
    };
  }, [leads]);

  if (loading) return null;
  if (error) return <div>{error}</div>;

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Analytics"
        description="View detailed analytics and insights."
      >

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Leads"
            value={metrics.totalLeads}
            change="+12%"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="New Leads"
            value={metrics.newLeads}
            change="+5%"
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard
            title="Contacted"
            value={metrics.contactedLeads}
            change="+8%"
            icon={<Clock className="w-6 h-6" />}
            color="green"
          />
          <MetricCard
            title="Qualified"
            value={metrics.qualifiedLeads}
            change={`${metrics.conversionRate}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            color="indigo"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <LeadStatusDistribution />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              SAP Interests Distribution
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activities
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {[
                      "Action",
                      "Target",
                      "User",
                      "Type",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">

                  {activities.map((log, index) => (
                    <tr key={index}>

                      <td className="px-6 py-4">
                        {log.action}
                      </td>

                      <td className="px-6 py-4">
                        {log.target}
                      </td>

                      <td className="px-6 py-4">
                        {log.details?.performedBy?.name ||
                          log.userEmail}
                      </td>

                      <td className="px-6 py-4">
                        {log.target === "JobApplication"
                          ? "Job Application"
                          : "Business"}
                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          log.createdAt
                        ).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>
          </div>
        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}

/* ---------------- Metric Card ---------------- */

function MetricCard({ title, value, change, icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    indigo:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>

          <div className="flex items-center mt-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs ml-1 text-green-600 dark:text-green-400">
              {change} from last period
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}