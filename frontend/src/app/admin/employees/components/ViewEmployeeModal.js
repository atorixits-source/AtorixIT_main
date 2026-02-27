"use client";

const ViewEmployeeModal = ({
  employee,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md px-5">

      <div className="relative w-full max-w-lg bg-white/85 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">

        {/* Gradient Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h2 className="text-lg font-semibold text-white">
            Employee Details
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-2 max-h-[90vh] overflow-y-auto">

          {[
            ["Name", employee.name],
            ["Email", employee.email],
            ["Phone", employee.phone],
            ["Bank", employee.bankAccountNumber || "-"],
            ["IFSC", employee.ifscCode || "-"],
            ["PAN", employee.panNumber || "-"],
            ["Aadhaar", employee.aadhaarNumber || "-"],
            ["Address", employee.address || "-"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-start bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
            >
              <span className="text-sm font-medium text-gray-500">
                {label}
              </span>

              <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%] break-words">
                {value}
              </span>
            </div>
          ))}

          {/* {employee.resume && (
            <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <span className="text-sm font-medium text-gray-500">
                Resume
              </span>
              <a
                href={`http://localhost:5001${employee.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold hover:underline"
              >
                View Resume
              </a>
            </div>
          )} */}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.03] transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal;