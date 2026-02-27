"use client";

import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { trackPage } from "@/lib/activityTracker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

/**
 * Role → Allowed Routes Map
 * IMPORTANT: Must match sidebar routes
 */
const ROLE_ALLOWED_ROUTES = {
  super_admin: [
    "/admin/dashboard",
    "/admin/hr-dashboard",
    "/admin/recruitment",
    "/admin/leave",
    "/admin/business-dashboard",
    "/admin/customers",
    "/admin/user-management",
    "/admin/role-permissions",
    "/admin/settings",
    "/admin/chat",

    "/admin/analytics",
    "/admin/admin-activity",
    "/admin/audit-logs",

    "/admin/lead-management",
  ],

  hr_mode: [
    "/admin/hr-dashboard",
    "/admin/employees",
    "/admin/recruitment",
    "/admin/chat",
    "/admin/leave",
  ],

  business_mode: [
    "/admin/business-dashboard",
    "/admin/analytics",
    "/admin/chat",
    "/admin/customers",
    "/admin/leads",

  ],
};

/**
 * Public routes (no auth needed)
 */
const PUBLIC_ROUTES = ["/admin/login"];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Allow public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      setLoading(false);
      return;
    }

    // ✅ Check authentication
    if (!isAuthenticated()) {
      router.replace("/admin/login"); // safer than push
      return;
    }

    const user = getCurrentUser();

    if (!user || !user.role) {
      router.replace("/admin/login");
      return;
    }

    /**
     * 🔥 Normalize role (VERY IMPORTANT)
     */
    // Normalize role properly
    const rawRole = user.role?.toLowerCase();
      
    let role = rawRole;
      
    if (rawRole === "business") role = "business_mode";
    if (rawRole === "hr") role = "hr_mode";
    if (rawRole === "admin") role = "super_admin";
      
    const allowedRoutes = ROLE_ALLOWED_ROUTES[role] || [];

    /**
     * ✅ Track page AFTER auth check
     */
    trackPage(pathname, "router");

    /**
     * ✅ Super admin full access
     */
    if (role === "super_admin") {
      setLoading(false);
      return;
    }

    /**
     * ✅ Check if route allowed
     */
    const cleanPath = pathname.replace(/\/$/, "");

    const isAllowed = allowedRoutes.some((route) => {
      const cleanRoute = route.replace(/\/$/, "");
      return (
        cleanPath === cleanRoute ||
        cleanPath.startsWith(cleanRoute + "/")
      );
    });
    
    if (!isAllowed) {
      const defaultRoutes = {
        hr_mode: "/admin/hr-dashboard",
        business_mode: "/admin/business-dashboard",
      };

      router.replace(defaultRoutes[role] || "/admin/login");
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  /**
   * Loader while checking permissions
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${inter.className}`}>
      {children}
    </div>
  );
}
