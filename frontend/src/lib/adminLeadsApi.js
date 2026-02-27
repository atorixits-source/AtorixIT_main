const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Admin Leads API
 * Shared by Admin + HR
 */

export async function deleteLead(type, id) {
  let endpoint;

  if (type === "business") {
    endpoint = `${BASE_URL}/api/business-leads/${id}`; // ✅ FIX: was /api/demo-requests/${id}
  } else if (type === "job") {
    endpoint = `${BASE_URL}/api/job-applications/${id}`;
  } else {
    throw new Error("Invalid lead type");
  }

  const res = await fetch(endpoint, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Delete failed");
  }

  return data;
}

export async function updateLead(type, id, payload) {
  let endpoint;

  if (type === "business") {
    endpoint = `${BASE_URL}/api/business-leads/${id}`;
  } 
  else if (type === "demo") {
    endpoint = `${BASE_URL}/api/demo-requests/${id}`;
  } 
  else if (type === "job") {
    endpoint = `${BASE_URL}/api/job-applications/${id}`;
  } 
  else {
    throw new Error("Invalid lead type");
  }

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload), // ✅ IMPORTANT
  });

  const text = await res.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text);
  }

  if (!res.ok) {
    throw new Error(data.message || "Update failed");
  }

  return data;
}
