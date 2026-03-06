"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettings() {

  const [settings, setSettings] = useState({
    sessionTimeout: 13,
    warningDuration: 1,
    maxLeads: 300,
    restrictCounselorView: true,
    restrictLeadEditing: true,
    totalLeads: 844
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNumberInput = (e, key, min, max) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = min;
    if (value < min) value = min;
    if (value > max) value = max;
    handleSettingChange(key, value);
  };

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Settings"
        description="Configure system settings and preferences."
      >

        <div className="space-y-6 max-w-4xl mx-auto w-full">

          {/* Session Inactivity Timeout */}
          <div className="rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">

              <div className="mb-2 sm:mb-0">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Session Inactivity Timeout
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically log out users after {settings.sessionTimeout} minutes of inactivity
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">

                <div className="w-24">
                  <input
                    type="range"
                    min="2"
                    max="120"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange('sessionTimeout', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div className="w-20">
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleNumberInput(e, 'sessionTimeout', 2, 120)
                    }
                    className="w-full px-2 py-1 border rounded-md text-center bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  min
                </span>

              </div>

            </div>

          </div>


          {/* Inactivity Warning Duration */}
          <div className="rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">

              <div className="mb-2 sm:mb-0">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Inactivity Warning Duration
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Show warning {settings.warningDuration} minute
                  {settings.warningDuration !== 1 ? "s" : ""} before session timeout
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">

                <div className="w-24">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={settings.warningDuration}
                    onChange={(e) =>
                      handleSettingChange('warningDuration', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.warningDuration}
                    onChange={(e) =>
                      handleNumberInput(e, 'warningDuration', 1, 30)
                    }
                    className="w-full px-2 py-1 border rounded-md text-center bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  min
                </span>

              </div>

            </div>

          </div>


          {/* Maximum Leads */}
          <div className="rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">

              <div className="mb-2 sm:mb-0">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Maximum Leads to Display
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Currently showing {settings.maxLeads} out of {settings.totalLeads} total leads
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">

                <div className="w-24">
                  <input
                    type="range"
                    min="1"
                    max={settings.totalLeads}
                    value={settings.maxLeads}
                    onChange={(e) =>
                      handleSettingChange('maxLeads', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    max={settings.totalLeads}
                    value={settings.maxLeads}
                    onChange={(e) =>
                      handleNumberInput(e, 'maxLeads', 1, settings.totalLeads)
                    }
                    className="w-full px-2 py-1 border rounded-md text-center bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  leads
                </span>

              </div>

            </div>

          </div>


          {/* Toggle Settings */}

          <div className="space-y-4">


            {/* Restrict Counselor View */}

            <div className="rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    Restrict Counselor View
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Counselors can only see leads assigned to them
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">

                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.restrictCounselorView}
                    onChange={() =>
                      handleSettingChange(
                        'restrictCounselorView',
                        !settings.restrictCounselorView
                      )
                    }
                  />

                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>

                </label>

              </div>

            </div>


            {/* Restrict Lead Editing */}

            <div className="rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    Restrict Lead Editing
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only admins or assigned users can edit lead status and contacted fields in dashboard page
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">

                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.restrictLeadEditing}
                    onChange={() =>
                      handleSettingChange(
                        'restrictLeadEditing',
                        !settings.restrictLeadEditing
                      )
                    }
                  />

                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>

                </label>

              </div>

            </div>

          </div>

        </div>


        {/* Save Button */}

        <div className="mt-6 flex justify-end">

          <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <Save size={16} />
            Save Changes
          </Button>

        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}