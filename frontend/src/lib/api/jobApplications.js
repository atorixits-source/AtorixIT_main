export const getJobApplications = async (page = 1, pageSize = 100) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job-applications?page=${page}&pageSize=${pageSize}`,
    {
      credentials: "include",
      cache: "no-store", // VERY IMPORTANT
    }
  );

  return res.json();
};
