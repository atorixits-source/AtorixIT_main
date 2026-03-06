"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { trackPage } from "@/lib/activityTracker";

/* ============================= */
/* Metric Card Component */
/* ============================= */

const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  percentage,
  color,
}) => {

  const trendColor =
    trend === "up"
      ? "text-green-500"
      : "text-red-500";

  const trendIcon =
    trend === "up"
      ? <ArrowUpRight className="w-4 h-4" />
      : <ArrowDownRight className="w-4 h-4" />;

  return (

    <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <div className="flex items-baseline mt-1">

            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>

            {percentage && (
              <span
                className={`ml-2 text-xs sm:text-sm flex items-center ${trendColor}`}
              >
                {trendIcon} {percentage}%
              </span>
            )}

          </div>

        </div>

        <div className={`p-2 sm:p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
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

        {/* ============================= */}
        {/* Metrics Grid */}
        {/* ============================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}

        </div>

        {/* ============================= */}
        {/* Recent Leads */}
        {/* ============================= */}

        <div className="mb-4">
          <RecentLeads />
        </div>

        {/* ============================= */}
        {/* Recent Activity */}
        {/* ============================= */}

        <div className="mx-0 sm:mx-4 lg:mx-8 bg-white dark:bg-[#1e293b] rounded-lg shadow mb-6 border border-gray-100 dark:border-gray-700">

          <div className="p-4 sm:p-5 md:p-6">

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>

            <div className="space-y-3 sm:space-y-4">

              {activities.map((activity, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >

                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500">
                    <activity.icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>

                  </div>

                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
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