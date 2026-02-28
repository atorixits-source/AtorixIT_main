"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { logUIAction } from "@/lib/uiLogger";

const EditEmployeeModal = ({
  employee,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    bankAccountNumber: "",
    ifscCode: "",
    panNumber: "",
    aadhaarNumber: "",
    address: "",
    profilePhoto: null,
    resume: null,
  });

  const [idType, setIdType] = useState("");
  const [loading, setLoading] = useState(false);

  ////////////////////////////////////////////////////////
  // LOAD EMPLOYEE DATA
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (employee) {
      setFormData({
        bankAccountNumber: employee.bankAccountNumber || "",
        ifscCode: employee.ifscCode || "",
        panNumber: employee.panNumber || "",
        aadhaarNumber: employee.aadhaarNumber || "",
        address: employee.address || "",
        profilePhoto: null,
        resume: null,
      });

      if (employee.panNumber) setIdType("pan");
      else if (employee.aadhaarNumber) setIdType("aadhaar");
      else setIdType("");
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  ////////////////////////////////////////////////////////
  // INPUT CHANGE
  ////////////////////////////////////////////////////////
  const handleChange = (e) => {
    const { name, value } = e.target;

    logUIAction("EMP_FIELD_CHANGE", "Employee_Form", {
      field: name,
      employeeId: employee?._id,
    });

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  ////////////////////////////////////////////////////////
  // FILE CHANGE
  ////////////////////////////////////////////////////////
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      logUIAction("EMP_FILE_UPLOAD", "Employee_Form", {
        field: e.target.name,
        filename: file.name,
        size: file.size,
        employeeId: employee?._id,
      });
    }

    setFormData(prev => ({
      ...prev,
      [e.target.name]: file,
    }));
  };

  ////////////////////////////////////////////////////////
  // SUBMIT
  ////////////////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee?._id) {
      alert("Invalid employee");
      return;
    }

    if (formData.panNumber && formData.aadhaarNumber) {
      alert("Only PAN or Aadhaar allowed");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      form.append("bankAccountNumber", formData.bankAccountNumber);
      form.append("ifscCode", formData.ifscCode);
      form.append("address", formData.address);

      if (formData.panNumber)
        form.append("panNumber", formData.panNumber);

      if (formData.aadhaarNumber)
        form.append("aadhaarNumber", formData.aadhaarNumber);

      if (formData.profilePhoto instanceof File)
        form.append("profilePhoto", formData.profilePhoto);

      if (formData.resume instanceof File)
        form.append("resume", formData.resume);

      const res = await fetch(
        `/api/employees/${employee._id}`,
        {
          method: "PUT",
          body: form,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      if (typeof onUpdated === "function") {
        await onUpdated();
      }

      onClose();

    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setLoading(false);
  };
//  max-w-[95%]               /* 320px */
//       min-[375px]:max-w-[92%]   /* 375px */
//       min-[425px]:max-w-[88%]   /* 425px */
//       md:max-w-[600px]          /* 768px */
//       lg:max-w-[700px]          /* 1024px */
//       2xl:max-w-[700px]         /* 1400px */
  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                  bg-black/40 backdrop-blur-sm 
                  px-3 sm:px-6">

      {/* Responsive Modal Box */}
      <div className="
      w-full
     
      max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl

      max-h-[90vh]
      overflow-y-auto

      bg-purple-100/95 
      backdrop-blur-xl 
      rounded-3xl 
      shadow-2xl 
      p-4 sm:p-6 md:p-8
    ">

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
          Employee Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2 ">

          {/* Profile Photo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Profile Photo:
            </label>
            <div className="w-full bg-white/70 rounded-2xl px-3 py-2">
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-700 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Bank Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Bank Account Number:
            </label>
            <input
              type="text"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              className="w-full bg-white/70 rounded-2xl px-3 py-2 outline-none"
            />
          </div>

          {/* IFSC */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              IFSC Code:
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full bg-white/70 rounded-2xl px-3 py-2 outline-none"
            />
          </div>

          {/* ID Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Identity Type:
            </label>

            <select
              value={idType}
              onChange={(e) => {
                const selectedType = e.target.value;

                logUIAction("EMP_ID_TYPE_CHANGE", "Employee_Form", {
                  type: selectedType,
                  employeeId: employee?._id,
                });

                setIdType(selectedType);

                setFormData(prev => ({
                  ...prev,
                  panNumber: "",
                  aadhaarNumber: "",
                }));
              }}
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select ID Type</option>
              <option value="pan">PAN</option>
              <option value="aadhaar">Aadhaar</option>
            </select>
          </div>

          {/* PAN Input */}
          {idType === "pan" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                PAN Number:
              </label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    panNumber: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="Enter PAN Number"
                className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Aadhaar Input */}
          {idType === "aadhaar" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Aadhaar Number:
              </label>
              <input
                type="text"
                maxLength={12}
                value={formData.aadhaarNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aadhaarNumber: e.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="Enter Aadhaar Number"
                className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Address:
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-white/70 rounded-2xl px-3 py-2 outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="
          flex flex-col sm:flex-row 
          gap-3 sm:gap-4 
          justify-end 
          pt-4
        ">

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-xl 
                       bg-purple-200 text-gray-700 
                       hover:bg-purple-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-2 rounded-2xl 
                       bg-gradient-to-r from-purple-600 to-indigo-600 
                       text-white font-semibold shadow-lg 
                       hover:opacity-90 transition"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );




};

export default EditEmployeeModal;