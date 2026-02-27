'use client';

import { useState } from 'react';
import { Save, RefreshCw, ChevronDown } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

const initialPermissions = {
  SuperAdmin: {
    users: { create: true, read: true, update: true, delete: true, view: true },
    leads: { create: true, read: true, update: true, delete: true, view: true },
    admins: { create: true, read: true, update: true, delete: true, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: true, update: false, delete: false, view: true },
    settings: { create: true, read: true, update: true, delete: true, view: true },
  },
  Admin: {
    users: { create: true, read: true, update: true, delete: false, view: true },
    leads: { create: true, read: true, update: true, delete: true, view: true },
    admins: { create: false, read: true, update: false, delete: false, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: true, update: false, delete: false, view: true },
    settings: { create: false, read: true, update: false, delete: false, view: true },
  },
  EditMode: {
    users: { create: true, read: true, update: true, delete: false, view: true },
    leads: { create: true, read: true, update: true, delete: false, view: true },
    admins: { create: false, read: true, update: false, delete: false, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: false, update: false, delete: false, view: false },
    settings: { create: false, read: false, update: false, delete: false, view: false },
  },
  ViewMode: {
    users: { create: false, read: true, update: false, delete: false, view: true },
    leads: { create: false, read: true, update: false, delete: false, view: true },
    admins: { create: false, read: true, update: false, delete: false, view: true },
    analytics: { create: false, read: true, update: false, delete: false, view: true },
    auditLogs: { create: false, read: false, update: false, delete: false, view: false },
    settings: { create: false, read: false, update: false, delete: false, view: false },
  },
};

const permissionLabels = {
  users: 'Users',
  leads: 'Leads',
  admins: 'Admins',
  analytics: 'Analytics',
  auditLogs: 'Audit Logs',
  settings: 'Settings',
};

export default function RolePermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePermissionChange = (feature, permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [feature]: {
          ...prev[selectedRole][feature],
          [permission]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    console.log('Saving permissions:', permissions[selectedRole]);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleReset = () => {
    setPermissions(JSON.parse(JSON.stringify(initialPermissions)));
  };

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Role Permissions"
        description="Manage permissions for different user roles"
      >
        <div className="space-y-6">

    {/* Role Selection */}
<div className="flex items-center justify-between gap-2 sm:flex-row sm:justify-between sm:items-center">

  {/* Dropdown */}
  <div className="relative w-[38%] sm:w-64">
    <button
      type="button"
      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm shadow-sm focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <span className="truncate">{selectedRole}</span>
      <ChevronDown
        className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isDropdownOpen && (
      <div className="absolute z-20 mt-2 w-full bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
        {Object.keys(permissions).map((role) => (
          <div
            key={role}
            className="cursor-pointer px-4 py-3 text-sm hover:bg-gray-100"
            onClick={() => {
              setSelectedRole(role);
              setIsDropdownOpen(false);
            }}
          >
            {role}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Reset Button */}
  <button
    onClick={handleReset}
    className="w-[28%] sm:w-auto flex items-center justify-center gap-1 px-2 py-2 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-medium hover:bg-gray-50 transition whitespace-nowrap"
  >
    <RefreshCw className="h-4 w-4" />
    Reset
  </button>

  {/* Save Button */}
  <button
    onClick={handleSave}
    disabled={isSaving}
    className="w-[34%] sm:w-auto flex items-center justify-center gap-1 px-2 py-2 rounded-lg sm:rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap"
  >
    <Save className="h-4 w-4" />
    {isSaving ? "Saving..." : "Save Changes"}
  </button>

</div>
          {/* MOBILE VIEW */}
          <div className="block md:hidden space-y-4">
            {Object.entries(permissionLabels).map(([feature, label]) => (
              <div key={feature} className="bg-white rounded-xl shadow p-4 border">
                <h3 className="text-sm font-semibold mb-3">{label}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['create','read','update','delete','view'].map(permission => (
                    <label key={permission} className="flex justify-between text-xs">
                      {permission}
                      <input
                        type="checkbox"
                        checked={permissions[selectedRole][feature][permission]}
                        onChange={(e) =>
                          handlePermissionChange(feature, permission, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:block bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase">Features</th>
                  {['Create','Read','Update','Delete','View'].map(head => (
                    <th key={head} className="px-6 py-3 text-center text-xs uppercase">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionLabels).map(([feature,label]) => (
                  <tr key={feature} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{label}</td>
                    {['create','read','update','delete','view'].map(permission => (
                      <td key={permission} className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={permissions[selectedRole][feature][permission]}
                          onChange={(e)=>
                            handlePermissionChange(feature,permission,e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}