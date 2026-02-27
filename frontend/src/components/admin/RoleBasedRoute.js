// src/components/admin/RoleBasedRoute.js
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

/**
 * Dashboards per role
 */
const ROLE_DASHBOARDS = {
  hr_mode: "/admin/hr-dashboard",
  business_mode: "/admin/business-dashboard",
  super_admin: "/admin/dashboard",
};

/**
 * Allowed routes per role
 * Must stay in sync with AdminLayout + Sidebar
 */
const ROLE_ALLOWED_ROUTES = {
  super_admin: [
    "/admin",
  ],

  hr_mode: [
    "/admin/hr-dashboard",
    "/admin/employees",
    "/admin/recruitment",
    "/admin/leave",
    "/admin/chat",
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
 * Public paths
 */
const PUBLIC_PATHS = ["/admin/login", "/admin/unauthorized"];

/**
 * Normalize role name
 */
const normalizeRole = (rawRole) => {
  if (!rawRole) return null;

  const role = rawRole.toLowerCase();

  if (role === "admin") return "super_admin";
  if (role === "business") return "business_mode";
  if (role === "hr") return "hr_mode";

  return role;
};

export default function RoleBasedRoute({
  children,
  allowedRoles = ["super_admin", "hr_mode", "business_mode"],
  redirectPath = "/admin/unauthorized",
}) {
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const [apiError, setApiError] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthAndAccess = async () => {
      try {
        /* Allow public */
        if (PUBLIC_PATHS.includes(pathname)) {
          setAccessGranted(true);
          setLoading(false);
          return;
        }

        /* Auth check */
        if (!isAuthenticated()) {
          router.replace("/admin/login");
          return;
        }

        const user = getCurrentUser();

        if (!user || !user.role) {
          router.replace("/admin/login");
          return;
        }

        /* Normalize role */
        const role = normalizeRole(user.role);

        if (!role) {
          router.replace("/admin/login");
          return;
        }

        /* Super admin = full access */
        if (role === "super_admin") {
          setAccessGranted(true);
          setLoading(false);
          return;
        }

        /* Role permission check */
        if (!allowedRoles.includes(role)) {
          router.replace(ROLE_DASHBOARDS[role] || redirectPath);
          return;
        }

        /* Path normalization */
        const cleanPath = pathname.replace(/\/$/, "");

        const allowedRoutes = ROLE_ALLOWED_ROUTES[role] || [];

        const isAllowed = allowedRoutes.some((route) => {
          const cleanRoute = route.replace(/\/$/, "");

          return (
            cleanPath === cleanRoute ||
            cleanPath.startsWith(cleanRoute + "/")
          );
        });

        /* Not allowed → redirect */
        if (!isAllowed) {
          router.replace(ROLE_DASHBOARDS[role] || redirectPath);
          return;
        }

        /* Access granted */
        setAccessGranted(true);
        setLoading(false);

      } catch (err) {
        console.error("RoleBasedRoute error:", err);
        setApiError("Permission check failed");
        setLoading(false);
      }
    };

    checkAuthAndAccess();
  }, [pathname, router, allowedRoles, redirectPath]);

  /* Error UI */
  if (apiError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  /* Loading UI */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return accessGranted ? children : null;
}
