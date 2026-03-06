const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||"https://atorix-backend-server.onrender.com";

/**

* Admin Leads API
* Shared by Admin + HR
  */

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

/* ================= TOKEN HELPER ================= */

function getAuthHeaders() {

const token = typeof window !== "undefined"
? localStorage.getItem("token")
: null;

const headers = {
"Content-Type": "application/json",
};

if (token) {
headers["Authorization"] = `Bearer ${token}`;
}

return headers;
}

/* ================= DELETE ================= */

export async function deleteLead(type, id) {

const endpoint = getEndpoint(type, id);

const res = await fetch(endpoint, {
method: "DELETE",
headers: getAuthHeaders(),
credentials: "include",
});

let data = {};

try {
data = await res.json();
} catch {}

if (!res.ok) {

  
console.error("DELETE API ERROR:", res.status, data);

if (res.status === 401) {
  throw new Error("Authentication required");
}

throw new Error(data?.message || `Delete failed (${res.status})`);
  

}

return data;
}

/* ================= UPDATE ================= */

export async function updateLead(type, id, payload) {

const endpoint = getEndpoint(type, id);

const res = await fetch(endpoint, {
method: "PATCH",
headers: getAuthHeaders(),
credentials: "include",
body: JSON.stringify(payload),
});

let data = {};

try {
data = await res.json();
} catch {}

if (!res.ok) {

  
console.error("UPDATE API ERROR:", res.status, data);

if (res.status === 401) {
  throw new Error("Authentication required");
}

throw new Error(data?.message || `Update failed (${res.status})`);
  

}

return data;
}
