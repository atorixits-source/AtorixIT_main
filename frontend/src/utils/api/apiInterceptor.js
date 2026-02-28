// src/utils/api/apiInterceptor.js

// Backend base URL (must be defined in .env file)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function setupApiInterceptor() {
  if (typeof window === "undefined") return;

  // Prevent multiple overrides
  if (window.__apiInterceptorInitialized) return;
  window.__apiInterceptorInitialized = true;

  // Save original fetch
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    try {
      let url = input;

      // 1️⃣ If absolute URL → don't modify
      if (typeof input === "string" && input.startsWith("http")) {
        return originalFetch(input, init);
      }

      // 2️⃣ Ignore Next.js internal assets
      if (
        typeof input === "string" &&
        (input.startsWith("/_next") ||
          input.startsWith("/__next") ||
          input.includes("__nextjs"))
      ) {
        return originalFetch(input, init);
      }

      // 3️⃣ Attach backend base URL for /api routes
      if (typeof input === "string" && input.startsWith("/api")) {
        if (!API_BASE_URL) {
          console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
          return originalFetch(input, init);
        }
        url = `${API_BASE_URL}${input}`;
      }

      // 4️⃣ Final request options
      const finalOptions = {
        ...init,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      };

      return originalFetch(url, finalOptions);

    } catch (error) {
      console.error("API Interceptor Error:", error);
      throw error;
    }
  };
}

// Initialize once
setupApiInterceptor();

export default null;