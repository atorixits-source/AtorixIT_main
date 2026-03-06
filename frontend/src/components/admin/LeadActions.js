"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { deleteLead, updateLead } from "@/lib/adminLeadsApi";

export default function LeadActions({ lead, type, onUpdated }) {

const [open, setOpen] = useState(false);
const [mode, setMode] = useState("view");
const [saving, setSaving] = useState(false);

const [selectedStatus, setSelectedStatus] = useState(
lead?.status || "new"
);

const [showConfirm, setShowConfirm] = useState(false);
const [loadingDelete, setLoadingDelete] = useState(false);

const [deleteError, setDeleteError] = useState(null);
const [updateError, setUpdateError] = useState(null);

const STATUS_OPTIONS = [
"new",
"contacted",
"hired",
"reviewed",
"scheduled",
"completed",
"cancelled",
];

/* ================= SYNC ================= */

useEffect(() => {
setSelectedStatus(lead?.status || "new");
}, [lead]);

const closeModal = () => {
setOpen(false);
setMode("view");
setUpdateError(null);
};

// const isValidType = (t) =>
// ["business", "demo", "job"].includes(t);

const isValidType = (t) =>
["business", "demo", "job", "hiring"].includes(t);
/* ================= DELETE ================= */

const handleDelete = async () => {
try {

if (!lead?._id) return;

if (!isValidType(type)) {
throw new Error("Invalid lead type");
}

setLoadingDelete(true);
setDeleteError(null);

await deleteLead(type, lead._id);

setShowConfirm(false);

await onUpdated?.();

} catch (err) {

console.error("Delete error:", err);

setDeleteError(err?.message || "Delete failed");

} finally {

setLoadingDelete(false);

}
};

/* ================= UPDATE ================= */

const handleSave = async () => {
try {

if (!selectedStatus || !lead || !lead._id) return;

if (!isValidType(type)) {
throw new Error("Invalid lead type");
}

setSaving(true);
setUpdateError(null);

await updateLead(type, lead._id, {
  status: selectedStatus,
});

closeModal();

await onUpdated?.();
} catch (err) {

console.error("Update error:", err);

setUpdateError(
err?.message || "Update failed"
);

} finally {

setSaving(false);

}

};

return (
<>
{/* ACTION BUTTONS */}

  <div className="flex items-center justify-center gap-2 sm:gap-3">

  
{/* VIEW */}

<button
  onClick={() => {
    setMode("view");
    setOpen(true);
  }}
  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
>
  <Eye size={16} />
</button>

{/* EDIT */}

<button
  onClick={() => {
    setMode("edit");
    setOpen(true);
  }}
  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition"
>
  <Pencil size={16} />
</button>

{/* DELETE */}

<button
  onClick={() => setShowConfirm(true)}
  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
>
  <Trash2 size={16} />
</button>
  

  </div>

{/* VIEW / EDIT MODAL */}

{open && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 sm:px-4 py-6">

  {/* Modal Wrapper */}
  <div className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl relative flex flex-col max-h-[90vh]">

    {/* Close Button */}
    <button
      onClick={closeModal}
      className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
    >
      <X size={18} />
    </button>

    {/* Header */}
    <div className="px-4 sm:px-6 pt-5 pb-3 border-b border-gray-200 dark:border-gray-700">
      <h2 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
        {mode === "view" ? "View Lead" : "Edit Lead"}
      </h2>
    </div>

    {/* Body */}
    <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">

      {mode === "view" && (

        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 break-words">

          <p>
            <span className="font-semibold">Name:</span> {lead?.name}
          </p>

          <p>
            <span className="font-semibold">Email:</span> {lead?.email}
          </p>

          <p>
            <span className="font-semibold">Phone:</span> {lead?.phone}
          </p>

          <p>
            <span className="font-semibold">Status:</span> {lead?.status}
          </p>

        </div>

      )}

      {mode === "edit" && (

        <div className="space-y-4">

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-lg"
          >

            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}

          </select>

          {updateError && (
            <p className="text-red-600 text-sm">
              {updateError}
            </p>
          )}

        </div>

      )}

    </div>

    {/* Footer */}
    {mode === "edit" && (
      <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          {saving ? "Saving..." : "Save"}
        </button>

      </div>
    )}

  </div>

</div>

)}

{/* DELETE CONFIRM MODAL */}

{showConfirm && (


<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 sm:px-4">

  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-sm rounded-xl shadow-xl relative">

    <button
      onClick={() => setShowConfirm(false)}
      className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
    >
      <X size={18} />
    </button>

    <h3 className="font-semibold mb-3 text-left text-base sm:text-lg text-gray-900 dark:text-white">
      Delete Lead?
    </h3>

    <p className="text-sm mb-4 text-left text-gray-600 dark:text-gray-300">
      Are you sure you want to delete this lead?
    </p>

    {deleteError && (
      <p className="text-red-600 text-sm mb-2">
        {deleteError}
      </p>
    )}

    <div className="flex flex-col sm:flex-row gap-3">

      <button
        onClick={() => setShowConfirm(false)}
        className="flex-1 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
      >
        Cancel
      </button>

      <button
        onClick={handleDelete}
        disabled={loadingDelete}
        className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
      >
        {loadingDelete ? "Deleting..." : "Delete"}
      </button>

    </div>

  </div>

</div>


)}

</>

);
}
