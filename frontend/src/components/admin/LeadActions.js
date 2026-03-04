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

  /* ================= SYNC ================= */
  useEffect(() => {
    setSelectedStatus(lead?.status || "new");
  }, [lead]);

  const closeModal = () => {
    setOpen(false);
    setMode("view");
    setUpdateError(null);
  };

  const isValidType = (t) =>
    ["business", "demo", "job"].includes(t);

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

      if (onUpdated) onUpdated();

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
      if (!selectedStatus || !lead?._id) return;

      if (!isValidType(type)) {
        throw new Error("Invalid lead type");
      }

      setSaving(true);
      setUpdateError(null);

      await updateLead(type, lead._id, {
        status: selectedStatus,
      });

      closeModal();

      if (onUpdated) onUpdated();

    } catch (err) {
      console.error("Update error:", err);
      setUpdateError(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        {/* VIEW */}
        <button
          onClick={() => {
            setMode("view");
            setOpen(true);
          }}
          className="text-blue-600"
        >
          <Eye size={16} />
        </button>

        {/* EDIT */}
        <button
          onClick={() => {
            setMode("edit");
            setOpen(true);
          }}
          className="text-yellow-600"
        >
          <Pencil size={16} />
        </button>

        {/* DELETE */}
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* VIEW / EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-md rounded relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3"
            >
              <X size={18} />
            </button>

            <h2 className="font-semibold mb-4 text-left">
              {mode === "view" ? "View Lead" : "Edit Lead"}
            </h2>

            {mode === "view" && (
              <div className="space-y-2 text-sm">
                <p><b>Name:</b> {lead?.name}</p>
                <p><b>Email:</b> {lead?.email}</p>
                <p><b>Phone:</b> {lead?.phone}</p>
                <p><b>Status:</b> {lead?.status}</p>
              </div>
            )}

            {mode === "edit" && (
              <div className="space-y-4">
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value)
                  }
                  className="w-full border p-2 rounded"
                >
                  {[
                    "new",
                    "contacted",
                    "hired",
                    "reviewed",
                    "scheduled",
                    "completed",
                    "cancelled",
                  ].map((s) => (
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

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-sm rounded-lg relative">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-3 right-3"
            >
              <X size={18} />
            </button>

            <h3 className="font-semibold mb-3 text-left">
              Delete Lead?
            </h3>

            <p className="text-sm mb-4 text-left">
              Are you sure you want to delete this lead?
            </p>

            {deleteError && (
              <p className="text-red-600 text-sm mb-2">
                {deleteError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border px-3 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loadingDelete}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded"
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