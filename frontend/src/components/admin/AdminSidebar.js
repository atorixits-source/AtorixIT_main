"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";

import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Activity,
  History,
  Shield,
  Settings,
  LogOut,
  Briefcase,
  Building,
  UserCheck,
  DollarSign,
  Home,
  Menu,
  X,
} from "lucide-react";

import { MessageCircle } from "lucide-react";

/* ================= NAVIGATION ================= */

const NAVIGATION_ITEMS = {
  super_admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "HR Dashboard", href: "/admin/hr-dashboard", icon: UserCheck },
    { name: "Business Dashboard", href: "/admin/business-dashboard", icon: DollarSign },
    { name: "User Management", href: "/admin/user-management", icon: Users },
    { name: "Lead Management", href: "/admin/lead-management", icon: FileText },
    { name: "Customers", href: "/admin/customers/", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Chat", href: "/admin/chat", icon: MessageCircle },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
    { name: "Role Permissions", href: "/admin/role-permissions", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],

  hr_mode: [
    { name: "HR Dashboard", href: "/admin/hr-dashboard", icon: UserCheck },
    { name: "Employee Directory", href: "/admin/employees", icon: Users },
    { name: "Recruitment", href: "/admin/recruitment", icon: Users },
    { name: "Leave Management", href: "/admin/leave", icon: FileText },
    { name: "Chat", href: "/admin/chat", icon: MessageCircle },
  ],

  business_mode: [
    { name: "Business Dashboard", href: "/admin/business-dashboard", icon: DollarSign },
    { name: "Leads", href: "/admin/leads", icon: FileText },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Chat", href: "/admin/chat", icon: MessageCircle },
  ],
};

export default function AdminSidebar() {
  const pathname = usePathname();

  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* ================= AUTH ================= */

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setUserRole(user?.role || null);
    }
    setLoading(false);
  }, []);

  /* ================= EXPAND HANDLING ================= */

  useEffect(() => {
    if (
      pathname.includes("/lead-management/") &&
      !expandedItems.includes("Lead Management")
    ) {
      setExpandedItems((prev) => [...prev, "Lead Management"]);
    }
  }, [pathname, expandedItems]);

  /* ================= LOGOUT ================= */

  const handleLogout = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (isLoggingOut) return;

      setIsLoggingOut(true);

      try {
        setMenuOpen(false);

        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }

        const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

        await fetch(`${BASE}/api/admin/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        window.location.href = "/admin/login";
      }
    },
    [isLoggingOut]
  );

  if (loading) {
    return <div className="h-full bg-white w-64 flex-shrink-0" />;
  }

  const navigationItems = NAVIGATION_ITEMS[userRole] || [];

  return (
    <>
      {/* ================= MOBILE BUTTON ================= */}

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-12 h-12 flex items-center justify-center 
          bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="fixed top-0 left-0 w-[280px] h-full bg-white z-50 shadow-xl">
            <div className="p-6 flex flex-col h-full">

              <div className="flex justify-between items-center mb-8">
                <Image
                  src="/atorix-logo.png"
                  alt="Logo"
                  width={100}
                  height={40}
                />
                <button onClick={() => setMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </a>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-6 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}

      <div className="hidden lg:flex w-64 min-h-screen bg-white border-r border-gray-200">
        <div className="p-6 flex flex-col w-full">

          <div className="mb-10">
            <Image
              src="/atorix-logo.png"
              alt="Logo"
              width={130}
              height={45}
            />
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}