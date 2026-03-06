  "use client";

  import { useEffect, useState, useCallback } from "react";

  import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
  import AdminLayout from "@/components/admin/AdminLayout";
  import { Button } from "@/components/ui/button";

  import {
    RefreshCw,
    Plus,
    Users,
    Mail,
    Phone,
    Building,
    User,
    MessageSquare,
    X,
    Trash2
  } from "lucide-react";

  import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api";
  import { toast } from "sonner";

  const CUSTOMER_STATUSES = [
    "contacted",
    "scheduled",
    "completed",
    "hired",
    "in_progress"
  ];

 const STATUS_STYLES = {
  contacted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  hired: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_progress: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
};

  export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("convert");
    const [expandedId, setExpandedId] = useState(null);
    const [selectedId, setSelectedId] = useState("");

    const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      interests: "",
      message: "",
      status: "contacted"
    });

    const logUI = async (action, target, details = {}) => {
      try {
        await fetch(`${API_BASE_URL}/api/audit-logs/ui`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, target, details })
        });
      } catch { }
    };

    const fetchData = useCallback(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.DEMO_REQUESTS}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        const requests = data?.data || [];

        setAllRequests(requests);
        setCustomers(requests.filter(r => CUSTOMER_STATUSES.includes(r.status)));
      } catch {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchData();
      logUI("VIEW_CUSTOMERS_PAGE");
    }, [fetchData]);

    const handleDelete = async (id, name) => {
      if (!window.confirm(`Terminate ${name}?`)) return;
      logUI("DELETE_CUSTOMER_CLICK", id);

      try {
        const res = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.DEMO_REQUESTS}/${id}`,
          { method: "DELETE", credentials: "include" }
        );
        if (!res.ok) throw new Error();
        toast.success("Customer terminated");
        fetchData();
      } catch {
        toast.error("Delete failed");
      }
    };

    const handleConvert = async () => {
      if (!selectedId) return toast.error("Select request");
      logUI("CLICK_CONVERT_CUSTOMER", selectedId);

      try {
        const res = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.DEMO_REQUESTS}/${selectedId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status: "contacted" })
          }
        );
        if (!res.ok) throw new Error();
        toast.success("Converted");
        setShowModal(false);
        setSelectedId("");
        fetchData();
      } catch {
        toast.error("Conversion failed");
      }
    };

    const handleManualAdd = async () => {
      if (!form.name || !form.email || !form.phone) {
        return toast.error("Required fields missing");
      }
      logUI("SUBMIT_MANUAL_CUSTOMER_FORM", null, form);

      try {
        const res = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.DEMO_REQUESTS}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...form,
              interests: form.interests.split(",").map(i => i.trim()).filter(Boolean)
            })
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);
        toast.success("Customer added");
        setShowModal(false);
        setForm({ name: "", email: "", phone: "", company: "", role: "", interests: "", message: "", status: "contacted" });
        fetchData();
      } catch (err) {
        toast.error(err.message || "Add failed");
      }
    };

    const formatDate = d => new Date(d).toLocaleDateString();

    return (
      <RoleBasedRoute>
        <AdminLayout title="Customers" description="Manage converted demo requests">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
            <h2 className="text-xl font-semibold flex gap-2 text-gray-900 dark:text-white">
              <Users className="w-6 h-6" />
              Our Clients
            </h2>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => { logUI("REFRESH_CUSTOMERS"); fetchData(); }}
                variant="outline"
                disabled={loading}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1e293b]"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>

              <Button
                onClick={() => { logUI("OPEN_ADD_CUSTOMER_MODAL"); setShowModal(true); }}
                style={{ color: '#ffffff' }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Cards */}
          {!loading && customers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:p-5 xl:gap-6">
              {customers.map(c => {
                const expanded = expandedId === c._id;

                return (
                  <div
                    key={c._id}
                    onClick={() => setExpandedId(expanded ? null : c._id)}
                   className="group relative rounded-2xl p-4 lg:p-5 min-h-[300px] lg:min-h-[320px] flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    {/* Status */}
                    <span className={`absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[c.status]}`}>
                      {c.status.replace("_", " ")}
                    </span>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex gap-1 text-gray-900 dark:text-white">
                        <Building className="w-4 h-4 mt-1" />
                        {c.company || "—"}
                      </h3>

                      <p className="text-sm flex gap-1 text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        {c.name}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {c.role || "Not specified"}
                      </p>

                      <div className="text-sm space-y-1 pt-2 text-gray-700">
                        <div className="flex gap-2">
                          <Mail className="w-4 h-4" />
                          {c.email}
                        </div>
                        <div className="flex gap-2">
                          <Phone className="w-4 h-4" />
                          {c.phone}
                        </div>
                      </div>

                      {c.interests?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {c.interests.map((i, idx) => (
                            <span
                              key={idx}
                             className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {i}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex items-center justify-between opacity-100 lg:opacity-0 group-hover:opacity-100 transition">
                      <span className="text-xs text-gray-500">
                        Added: {formatDate(c.createdAt)}
                      </span>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1e293b]"
                      
                          onClick={e => e.stopPropagation()}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>

                       <Button
  size="sm"
  variant="outline"
  className="border-red-300 text-red-600 bg-white dark:bg-[#1e293b] hover:bg-red-50"
  onClick={e => { e.stopPropagation(); handleDelete(c._id, c.name); }}
>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty */}
          {!loading && customers.length === 0 && (
            <div className="p-10 rounded-xl text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1e293b]">
                No customers yet
            </div>
          )}

          {/* Modal */}
          {showModal && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

    <div className="w-full max-w-[92vw] sm:max-w-lg lg:max-w-xl rounded-xl p-6 relative bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white"><button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X />
                </button>

                <h3 className="text-lg font-semibold mb-4 dark:text-white text-gray-900">
                  Add Customer
                </h3>

                {/* Tabs */}
                <div className="flex mb-4 border-b border-gray-200">
                  {["convert", "manual"].map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-4 py-2 text-sm ${activeTab === t ? "border-b-2 border-blue-500 text-gray-900" : "text-gray-500"}`}
                    >
                      {t === "convert" ? "From Demo Requests" : "Manual Entry"}
                    </button>
                  ))}
                </div>

                {/* Convert */}
                {activeTab === "convert" && (
                  <div className="space-y-4">
                    <select
                      value={selectedId}
                      onChange={e => setSelectedId(e.target.value)}
                     className="w-full border p-2 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Request</option>
                      {allRequests
                        .filter(r => !CUSTOMER_STATUSES.includes(r.status))
                        .map(r => (
                          <option key={r._id} value={r._id}>
                            {r.name} ({r.email})
                          </option>
                        ))}
                    </select>

                    <Button className="w-full" onClick={handleConvert}>
                      Convert
                    </Button>
                  </div>
                )}

                {/* Manual */}
                {activeTab === "manual" && (
                  <div className="space-y-3">
                    {["name", "email", "phone", "company", "role", "interests", "message"].map(f => (
                      <input
                        key={f}
                        placeholder={f.toUpperCase()}
                        value={form[f]}
                        onChange={e => setForm({ ...form, [f]: e.target.value })}
                       className="w-full border p-2 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    ))}

                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full border p-2 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" >
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="hired">Hired</option>
                      <option value="in_progress">In Progress</option>
                    </select>

                    <Button className="w-full" onClick={handleManualAdd}>
                      Add Customer
                    </Button>
                  </div>
                )}

              </div>
            </div>
          )}

        </AdminLayout>
      </RoleBasedRoute>
    );
  }