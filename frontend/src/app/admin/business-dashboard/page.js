"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import RecentLeads from "@/components/admin/RecentLeads";
import { toast } from "sonner";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  TrendingUp,
  Users,
  MessageSquare,
  RefreshCw,
  Plus,
  Mail,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackPage } from "@/lib/activityTracker";
import { logUIAction } from "@/lib/uiLogger";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api";

/* ============================= */
/* Metric Card Component */
/* ============================= */
const MetricCard = ({ title, value, icon: Icon, trend, percentage, color }) => {
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
  const trendIcon =
    trend === "up" ? (
      <ArrowUpRight className="w-4 h-4" />
    ) : (
      <ArrowDownRight className="w-4 h-4" />
    );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 ">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900 ">
              {value}
            </p>
            {percentage && (
              <span
                className={`ml-2 text-sm flex items-center ${trendColor}`}
              >
                {trendIcon} {percentage}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function BusinessDashboard() {
  const [loading, setLoading] = useState(false);

  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231",
      icon: DollarSign,
      trend: "up",
      percentage: "12.5",
      color: "text-green-500",
    },
    {
      title: "Active Projects",
      value: "12",
      icon: Briefcase,
      trend: "up",
      percentage: "5.2",
      color: "text-blue-500",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      icon: TrendingUp,
      trend: "down",
      percentage: "1.1",
      color: "text-purple-500",
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: Users,
      trend: "up",
      percentage: "8.7",
      color: "text-yellow-500",
    },
  ];

  const activities = [
    {
      icon: Users,
      title: "New lead added",
      description: "John Doe from Acme Inc. requested a demo",
      time: "5 min ago",
    },
    {
      icon: Briefcase,
      title: "Project completed",
      description: "E-commerce website for RetailPro",
      time: "2 hours ago",
    },
    {
      icon: MessageSquare,
      title: "New message",
      description: "You have 3 unread messages",
      time: "1 day ago",
    },
  ];

  useEffect(() => {
    trackPage("/admin/business-dashboard", "auto");
  }, []);

  return (
    <RoleBasedRoute>
      <AdminLayout
        title="Business Dashboard"
        description="Overview of your business performance"
      >
        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* ============================= */}
        {/* Recent Leads (Full Width) */}
        {/* ============================= */}
        <div className="mb-6">
          <RecentLeads />
        </div>

        {/* ============================= */}
        {/* Recent Activity (Below Leads) */}
        {/* ============================= */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-500 ">
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 ">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>  
      </AdminLayout>
    </RoleBasedRoute>
  );
}