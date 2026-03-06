const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001" || "https://atorix-backend-server.onrender.com";

/**
 * Admin Leads API
 * Shared by Admin + HR
 */

// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   "https://atorix-backend-server.onrender.com";

/* ================= ENDPOINT HELPER ================= */

function getEndpoint(type, id) {

  switch (type) {

    case "business":
      return `${BASE_URL}/api/business-leads/${id}`;

    case "demo":
      return `${BASE_URL}/api/demo-requests/${id}`;

    case "job":
    case "hiring":
      return `${BASE_URL}/api/job-applications/${id}`;

    default:
      console.error("Unknown lead type:", type);
      throw new Error(`Invalid lead type: ${type}`);
  }
}

/* ================= DELETE ================= */

export async function deleteLead(type, id) {

  const endpoint = getEndpoint(type, id);

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    console.error("DELETE API ERROR:", res.status, data);
    throw new Error(data?.message || `Delete failed (${res.status})`);
  }

  return data;
}

/* ================= UPDATE ================= */

export async function updateLead(type, id, payload) {

  const endpoint = getEndpoint(type, id);

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    console.error("UPDATE API ERROR:", res.status, data);
    throw new Error(data?.message || `Update failed (${res.status})`);
  }

  return data;
}