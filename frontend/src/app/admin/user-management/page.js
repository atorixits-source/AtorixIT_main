"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { getAuthHeader } from '@/lib/auth';

const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MODE: 'hr_mode',
  BUSINESS_MODE: 'business_mode'
};

const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.HR_MODE]: 'HR',
  [USER_ROLES.BUSINESS_MODE]: 'Business User'
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://atorix-backend-server.onrender.com";
const ADMIN_API_URL = `${API_BASE_URL}/api`;

const EMPTY_FORM = {
  name: "", email: "", password: "", confirmPassword: "",
  role: USER_ROLES.SUPER_ADMIN, location: "", color: "#3B82F6",
};

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`${ADMIN_API_URL}/users`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...getAuthHeader() },
        credentials: 'include'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      (user.location || "").toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  });

  const closeModal = () => {
    setShowAddUserModal(false);
    setEditingUser(null);
    setUserForm(EMPTY_FORM);
    setErrors({});
    setApiError(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name, email: user.email, password: '', confirmPassword: '',
      role: user.role, location: user.location || '', color: user.color || "#3B82F6",
    });
    setApiError(null);
    setShowAddUserModal(true);
  };

  const handleCreateUser = async () => {
    setApiError(null);
    setErrors({});
    const validationErrors = {};

    if (!userForm.name.trim()) validationErrors.name = "Name is required";
    if (!userForm.email.trim()) validationErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userForm.email)) validationErrors.email = "Email is invalid";

    if (!editingUser) {
      if (!userForm.password) validationErrors.password = "Password is required";
      else if (userForm.password.length < 6) validationErrors.password = "Minimum 6 characters";
      if (userForm.password !== userForm.confirmPassword) validationErrors.confirmPassword = "Passwords do not match";
    } else if (userForm.password) {
      if (userForm.password.length < 6) validationErrors.password = "Minimum 6 characters";
      if (userForm.password !== userForm.confirmPassword) validationErrors.confirmPassword = "Passwords do not match";
    }

    if (!userForm.role) validationErrors.role = "Role is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setCreatingUser(true);

      const isEditing = !!editingUser;
      const url = isEditing ? `${ADMIN_API_URL}/users/${editingUser._id}` : `${ADMIN_API_URL}/users`;

      const userData = {
        name: userForm.name.trim(),
        email: userForm.email.trim().toLowerCase(),
        role: userForm.role,
        location: userForm.location?.trim() || '',
        color: userForm.color,
      };
      if (userForm.password) userData.password = userForm.password;

      let res;
      try {
        res = await fetch(url, {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...getAuthHeader() },
          credentials: 'include',
          body: JSON.stringify(userData),
        });
      } catch (fetchErr) {
        // True network error — server unreachable, CORS blocked, no internet
        console.error('[UserManagement] Network fetch failed:', fetchErr);
        setApiError(`Cannot reach the server. Please check your internet connection or contact support. (${fetchErr.message})`);
        return;
      }

      let data = {};
      try { data = await res.json(); } catch { data = {}; }

      if (!res.ok) {
        if (data.errors && typeof data.errors === 'object') {
          const fieldErrors = {};
          Object.entries(data.errors).forEach(([field, message]) => { fieldErrors[field] = message; });
          setErrors(fieldErrors);
          setApiError('Please correct the errors below.');
        } else if (data.missingFields) {
          const fieldErrors = {};
          data.missingFields.forEach(f => { fieldErrors[f] = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`; });
          setErrors(fieldErrors);
          setApiError(data.message || 'Please fill in all required fields.');
        } else {
          setApiError(data.message || `Server returned error ${res.status}. Please try again.`);
        }
        return;
      }

      await fetchUsers();
      toast.success(`User ${isEditing ? 'updated' : 'created'} successfully`);
      closeModal();
    } catch (err) {
      console.error('[UserManagement] Unexpected error:', err);
      setApiError(`Unexpected error: ${err.message}`);
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout title="User Management" description="Manage system users and their permissions.">
        <div className="bg-white dark:bg-gray-600 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">

            {/* Header */}
           <div className="px-4 sm:px-3 sm:px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between">
             <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] -800 text-gray-900 dark:text-white dark:text-gray-100  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button onClick={() => { setApiError(null); setShowAddUserModal(true); }} className="flex items-center gap-2 self-end sm:self-auto">
                <Plus className="w-4 h-4" /> Add User
              </Button>
            </div>

            {/* Table */}
            {loadingUsers ? (
              <div className="py-16 text-center bg-white">
                <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2 text-indigo-500" />
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <thead>
                    <tr className="bg-white dark:bg-[#1e293b] -900 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1e293b] -800">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 bg-white">No users found.</td></tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 whitespace-nowrap bg-white">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div
                                className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: user.color || '#3B82F6' }}
                              >
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 dark:text-gray-300 bg-white">{user.email}</td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 whitespace-nowrap bg-white">
                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === USER_ROLES.SUPER_ADMIN ? "bg-purple-100 text-purple-800"
                              : user.role === USER_ROLES.HR_MODE ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                            }`}>
                              {ROLE_LABELS[user.role] || user.role}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 dark:text-gray-300 bg-white">{user.location || "—"}</td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-right bg-white">
                            <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                              <Edit className="w-4 h-4 inline" />
                            </button>
                            <button onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }} className="text-red-500 hover:text-red-700 transition-colors">
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      {/* Add/Edit Modal */}
{showAddUserModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">

    <div className="
      w-full
      max-w-[95vw]
      sm:max-w-lg
      md:max-w-xl
      lg:max-w-2xl
      max-h-[90vh]
      overflow-y-auto
      rounded-xl
      shadow-2xl
      bg-white
      dark:bg-[#1e293b]
      border border-gray-200 dark:border-gray-700
    ">

      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {editingUser ? "Edit User" : "Add New User"}
          </h3>

          <button
            onClick={closeModal}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-sm">
            <p className="font-medium text-red-700">Error</p>
            <p className="text-red-600 mt-1">{apiError}</p>
          </div>
        )}

        {/* FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "John Doe", required: true },
            { label: "Email", key: "email", type: "email", placeholder: "john@example.com", required: true },
            { label: editingUser ? "New Password" : "Password", key: "password", type: "password", placeholder: editingUser ? "Leave blank to keep current" : "••••••••", required: !editingUser },
            { label: "Confirm Password", key: "confirmPassword", type: "password", placeholder: "••••••••", required: !editingUser },
          ].map(({ label, key, type, placeholder, required }) => (
            <div key={key} className="sm:col-span-1 col-span-1">

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>

              <input
                type={type}
                value={userForm[key]}
                onChange={(e) => setUserForm({ ...userForm, [key]: e.target.value })}
                placeholder={placeholder}
                className={`
                  w-full
                  px-3 py-2.5
                  text-sm
                  rounded-lg
                  border
                  ${errors[key] ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-indigo-500
                  focus:border-indigo-500
                  outline-none
                `}
              />

              {errors[key] && (
                <p className="mt-1 text-xs text-red-600">{errors[key]}</p>
              )}

            </div>
          ))}

        </div>

        {/* Role */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role <span className="text-red-500">*</span>
          </label>

          <select
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            className={`
              w-full
              px-3 py-2.5
              text-sm
              rounded-lg
              border
              ${errors.role ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-indigo-500
              outline-none
            `}
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {errors.role && (
            <p className="mt-1 text-xs text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Location */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>

          <input
            type="text"
            value={userForm.location}
            onChange={(e) => setUserForm({ ...userForm, location: e.target.value })}
            placeholder="e.g. New York, USA"
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Profile Color */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Color
          </label>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={userForm.color}
              onChange={(e) => setUserForm({ ...userForm, color: e.target.value })}
              className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
            />

            <span className="text-sm text-gray-500 dark:text-gray-300">
              {userForm.color.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">

          <button
            onClick={closeModal}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateUser}
            disabled={creatingUser}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {creatingUser ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {editingUser ? "Updating..." : "Creating..."}
              </>
            ) : editingUser ? "Update User" : "Create User"}
          </button>

        </div>

      </div>
    </div>
  </div>
)}

        {/* Delete Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1e293b] -900 rounded-lg shadow-xl gap-2 sm:gap-3w-full max-w-md sm:max-w-lg p-4 sm:p-5 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete User</h3>
              <p className="text-sm text-white mb-6">
                Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{userToDelete.name}</strong>? This cannot be undone.
              </p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 dark:text-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      setIsDeleting(true);
                      const res = await fetch(`${ADMIN_API_URL}/users/${userToDelete._id}`, {
                        method: 'DELETE',
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...getAuthHeader() },
                        credentials: 'include'
                      });
                      if (!res.ok) {
                        const d = await res.json().catch(() => ({}));
                        throw new Error(d.message || `HTTP ${res.status}`);
                      }
                      await fetchUsers();
                      toast.success('User deleted successfully');
                    } catch (err) {
                      toast.error(err.message || 'Failed to delete user');
                    } finally {
                      setIsDeleting(false);
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }
                  }}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />Deleting...</> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}