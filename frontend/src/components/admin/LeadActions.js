"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, X, Save } from "lucide-react";
import { deleteLead, updateLead } from "@/lib/adminLeadsApi";

export default function LeadActions({ lead, type, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("view");
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(lead.status || "new");

  // ✅ Sync when lead changes
  useEffect(() => {
    setSelectedStatus(lead.status || "new");
  }, [lead]);

  const closeModal = () => {
    setOpen(false);
    setMode("view");
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await deleteLead(type, lead._id);
      alert("Lead deleted successfully");
      onUpdated?.();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  /* ================= UPDATE ================= */
  const handleSave = async () => {
    try {
      if (!selectedStatus) return;

      setSaving(true);

      await updateLead(type, lead._id, {
        status: selectedStatus,
      });

      closeModal();

      // REFRESH TABLE
      onUpdated?.();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Buttons */}
      <div className="flex gap-3">

        <button
          onClick={() => {
            setMode("view");
            setOpen(true);
          }}
          className="text-blue-600"
        >
          <Eye size={16} />
        </button>

        <button
          onClick={() => {
            setMode("edit");
            setOpen(true);
          }}
          className="text-yellow-600"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={handleDelete}
          className="text-red-600"
        >
          <Trash2 size={16} />
        </button>

      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

          <div className="bg-white dark:bg-gray-800 p-6 w-full max-w-md rounded relative">

            <button
              onClick={closeModal}
              className="absolute top-3 right-3"
            >
              <X size={18} />
            </button>

            <h2 className="font-semibold mb-4">
              {mode === "view" ? "View Lead" : "Edit Lead"}
            </h2>

            {mode === "view" && (
              <div className="space-y-2 text-sm">
                <p><b>Name:</b> {lead.name}</p>
                <p><b>Email:</b> {lead.email}</p>
                <p><b>Phone:</b> {lead.phone}</p>
                <p><b>Status:</b> {lead.status}</p>
              </div>
            )}

            {mode === "edit" && (
              <div className="space-y-4">

                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  {[
                    "new","contacted","hired",
                    "reviewed","scheduled","completed",
                    "cancelled",
                  ].map(s => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>

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
    </>
  );
}