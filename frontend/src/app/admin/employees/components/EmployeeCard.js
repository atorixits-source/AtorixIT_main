"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { logUIAction } from "@/lib/uiLogger";

const EmployeeCard = ({ emp, onEdit, onView, onDelete }) => {

  const imageUrl = emp?.profilePhoto
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${emp.profilePhoto}`
    : null;

  return (
    <div
      className="
      relative 
      bg-white dark:bg-[#1e293b]
      rounded-3xl 
      shadow-md hover:shadow-xl 
      transition-all duration-300 
      overflow-hidden
      
      border border-gray-200 dark:border-gray-700
      
      w-full 
      max-w-[260px]
      min-[375px]:max-w-[300px]
      min-[425px]:max-w-[300px]
      md:max-w-[320px]
      lg:max-w-[320px]
      2xl:max-w-[420px]

      mx-auto
    "
    >

      {/* Top Accent Line */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="p-6 text-center relative">

        {/* Edit Button */}

        <button
          onClick={() => {

            logUIAction("EMP_EDIT_CLICK", "EmployeeCard", {
              employeeId: emp._id,
            });

            onEdit(emp);

          }}
          className="absolute top-4 right-12 bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-200" />
        </button>

        {/* Delete Button */}

        <button
          onClick={() => {

            logUIAction("EMP_DELETE_CLICK", "EmployeeCard", {
              employeeId: emp._id,
            });

            onDelete(emp);

          }}
          className="absolute top-4 right-4 bg-red-100 dark:bg-red-900 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
        </button>

        {/* Profile Image */}

        <div className="flex justify-center">

          <div
            className="
            w-24 h-24 rounded-full overflow-hidden 
            border-4 border-white dark:border-gray-700
            shadow-lg 
            bg-gray-200 dark:bg-gray-700
            flex items-center justify-center
            text-gray-700 dark:text-gray-200
            text-xl font-semibold
          "
          >

            {imageUrl ? (

              <img
                src={imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />

            ) : (

              emp?.name?.slice(0, 2)?.toUpperCase() || "NA"

            )}

          </div>

        </div>

        {/* Name */}

        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
          {emp?.name}
        </h2>

        {/* Position */}

        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
          {emp?.position || "Not Assigned"}
        </p>

        {/* Divider */}

        <div className="my-5 border-t border-gray-200 dark:border-gray-700" />

        {/* Contact Info */}

        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">

          <p className="truncate">{emp?.email}</p>

          <p>{emp?.phone}</p>

        </div>

        {/* Button */}

        <button
          onClick={() => {

            logUIAction("EMP_VIEW_CLICK", "EmployeeCard", {
              employeeId: emp._id,
            });

            onView(emp);

          }}
          className="
          mt-6 w-full py-2.5 rounded-full 
          border border-gray-300 dark:border-gray-600
          text-sm font-medium 
          text-gray-700 dark:text-gray-200
          hover:bg-indigo-50 dark:hover:bg-indigo-900
          hover:border-indigo-400 dark:hover:border-indigo-500
          transition
        "
        >
          View Profile
        </button>

      </div>
    </div>
  );
};

export default EmployeeCard;