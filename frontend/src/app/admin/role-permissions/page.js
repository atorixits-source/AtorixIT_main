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

        <div className="space-y-6 mx-14">

          {/* Role Selection */}
          <div className="flex items-center justify-between">

  {/* LEFT SIDE */}
  <div className="relative w-[40%] sm:w-64">

    <button
      type="button"
      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm shadow-sm flex items-center justify-between bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <span className="truncate">{selectedRole}</span>

      <ChevronDown
        className={`h-4 w-4 transition-transform ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isDropdownOpen && (
      <div className="absolute z-20 mt-2 w-full shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1e293b]">

        {Object.keys(permissions).map((role) => (
          <div
            key={role}
            className="cursor-pointer px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
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

  {/* RIGHT SIDE BUTTONS */}
  <div className="flex items-center gap-3">

    {/* Reset Button */}
    <button
      onClick={handleReset}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200"
    >
      <RefreshCw className="h-4 w-4" />
      Reset
    </button>

    {/* Save Button */}
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 bg-blue-600 text-white"
    >
      <Save className="h-4 w-4" />
      {isSaving ? "Saving..." : "Save Changes"}
    </button>

  </div>

</div>

          {/* MOBILE VIEW */}
          <div className="block md:hidden space-y-4">

            {Object.entries(permissionLabels).map(([feature, label]) => (

              <div
                key={feature}
                className="rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]"
              >

                <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                  {label}
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  {['create', 'read', 'update', 'delete', 'view'].map(permission => (

                    <label
                      key={permission}
                      className="flex justify-between text-xs text-gray-700 dark:text-gray-300"
                    >

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
          <div className="hidden md:block shadow rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">

            <table className="w-full table-fixed">

              <thead className="bg-gray-100 dark:bg-gray-800">

                <tr>

                  <th className="px-6 py-3 text-left text-xs uppercase font-medium text-gray-600 dark:text-gray-300">
                    Features
                  </th>

                  {['Create', 'Read', 'Update', 'Delete', 'View'].map(head => (

                    <th
                      key={head}
                      className="px-6 py-3 text-center text-xs uppercase font-medium text-gray-600 dark:text-gray-300"
                    >
                      {head}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {Object.entries(permissionLabels).map(([feature, label]) => (

                  <tr
                    key={feature}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >

                    <td className="px-6 py-4 font-medium text-sm text-gray-900 dark:text-white">
                      {label}
                    </td>

                    {['create', 'read', 'update', 'delete', 'view'].map(permission => (

                      <td key={permission} className="px-6 py-4 text-center">

                        <input
                          type="checkbox"
                          checked={permissions[selectedRole][feature][permission]}
                          onChange={(e) =>
                            handlePermissionChange(feature, permission, e.target.checked)
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