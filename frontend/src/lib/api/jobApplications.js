import { API_BASE_URL } from "./api";

export const getJobApplications = async (page = 1, pageSize = 10) => {
  const token =
    localStorage.getItem("atorix_auth_token") ||
    localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE_URL}/api/job-applications?page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch job applications");
  }

  return data;
};