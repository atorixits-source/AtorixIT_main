const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://atorixit-main.onrender.com";

/**
 * Admin Leads API
 */

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

/* ================= TOKEN ================= */

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("atorix_auth_token") ||
    sessionStorage.getItem("atorix_auth_token")
  );
}

/* ================= DELETE ================= */

export async function deleteLead(type, id) {
  const endpoint = getEndpoint(type, id);

  const token = getToken();

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

  const token = getToken();

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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