// Main backend API (admin + core APIs run on port 5001)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

class ApiInterceptor {
  constructor() {
    if (typeof window === "undefined") return;
    if (window.__apiInterceptorInitialized) return;

    window.__apiInterceptorInitialized = true;
    this.originalFetch = window.fetch;
    this.init();
  }

  init() {
    const originalFetch = this.originalFetch;

    window.fetch = async (url, options = {}) => {
      let finalUrl = url;

      /* =====================================================
         1️⃣ ABSOLUTE URL → DO NOT TOUCH
      ===================================================== */
      if (typeof url === "string" && url.startsWith("http")) {
        return originalFetch(url, options);
      }

      /* =====================================================
         2️⃣ NEXT.JS INTERNAL REQUESTS → DO NOT TOUCH
      ===================================================== */
      if (
        typeof url === "string" &&
        (url.startsWith("/_next") ||
          url.startsWith("/__next") ||
          url.includes("__nextjs"))
      ) {
        return originalFetch(url, options);
      }

      /* =====================================================
         3️⃣ BACKEND API ROUTING
         Only proxy /api/* → backend server
      ===================================================== */
      // Let Next.js API routes handle job-applications
      // Do NOT intercept job applications
      if (
        typeof url === "string" &&
        url.startsWith("/api")
      ) {
        return originalFetch(url, options);
      }

      // Do NOT intercept demo requests
      if (
        typeof url === "string" &&
        url.startsWith("/api/demo-requests")
      ) {
        return originalFetch(url, options);
      }

      // Proxy other APIs
      if (typeof url === "string" && url.startsWith("/api")) {
        finalUrl = `${API_BASE_URL}${url}`;
      }
      


      /* =====================================================
         4️⃣ HEADERS & OPTIONS
      ===================================================== */
      const finalOptions = {
        ...options,
        credentials: "include",
        headers: options.headers || {},
      };

      console.log("[API]", finalOptions.method || "GET", finalUrl);

      const response = await originalFetch(finalUrl, finalOptions);

      /* =====================================================
         5️⃣ AUTH HANDLING
      ===================================================== */
      if (
        response.status === 401 &&
        !window.location.pathname.includes("/admin/login")
      ) {
        sessionStorage.removeItem("atorix_auth_token");
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }

      return response;
    };
  }
}

if (typeof window !== "undefined") {
  new ApiInterceptor();
}

export default null;
