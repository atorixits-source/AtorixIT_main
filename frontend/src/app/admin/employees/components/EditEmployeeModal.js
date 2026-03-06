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

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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

    logUIAction("EMP_FIELD_CHANGE","Employee_Form",{
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

      logUIAction("EMP_FILE_UPLOAD","Employee_Form",{
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
        `${API_BASE}/api/employees/${employee._id}`,
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

  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

      {/* Modal */}

      <div className="
        w-full
        max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl
        max-h-[90vh]
        overflow-y-auto
        bg-white dark:bg-[#1e293b]
        border border-gray-200 dark:border-gray-700
        rounded-2xl
        shadow-xl
        p-6
      ">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Employee Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Profile Photo */}

          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Photo
            </label>

            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
            />

          </div>


          {/* Bank */}

          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bank Account Number
            </label>

            <input
              type="text"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
            />

          </div>


          {/* IFSC */}

          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              IFSC Code
            </label>

            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
            />

          </div>


          {/* ID TYPE */}

          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Identity Type
            </label>

            <select
              value={idType}
              onChange={(e)=>{

                const selectedType = e.target.value;

                logUIAction("EMP_ID_TYPE_CHANGE","Employee_Form",{
                  type:selectedType,
                  employeeId:employee?._id
                });

                setIdType(selectedType);

                setFormData(prev=>({
                  ...prev,
                  panNumber:"",
                  aadhaarNumber:""
                }));

              }}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
            >

              <option value="">Select ID Type</option>
              <option value="pan">PAN</option>
              <option value="aadhaar">Aadhaar</option>

            </select>

          </div>


          {/* PAN */}

          {idType === "pan" && (

            <div className="space-y-1">

              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                PAN Number
              </label>

              <input
                type="text"
                value={formData.panNumber}
                onChange={(e)=>
                  setFormData(prev=>({
                    ...prev,
                    panNumber:e.target.value.toUpperCase()
                  }))
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
              />

            </div>

          )}


          {/* AADHAAR */}

          {idType === "aadhaar" && (

            <div className="space-y-1">

              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Aadhaar Number
              </label>

              <input
                type="text"
                maxLength={12}
                value={formData.aadhaarNumber}
                onChange={(e)=>
                  setFormData(prev=>({
                    ...prev,
                    aadhaarNumber:e.target.value.replace(/\D/g,"")
                  }))
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
              />

            </div>

          )}


          {/* ADDRESS */}

          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>

            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white resize-none"
            />

          </div>


          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
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