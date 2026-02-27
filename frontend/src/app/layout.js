"use client";

import { Inter } from "next/font/google";
import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import PopupContactForm from "@/components/common/PopupContactForm";
import { AuthProvider } from "@/context/AuthContext";
import { pingBackend } from "@/lib/api";
import "@/utils/api/apiInterceptor";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <html lang="en">
      <head>
        {/* ✅ Tawk Scripts Only For Public Pages */}
        {!isAdminRoute && (
          <>
            <Script
              id="tawk-main"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.Tawk_API = window.Tawk_API || {};
                  window.Tawk_LoadStart = new Date();

                  (function () {
                    var s1 = document.createElement("script");
                    var s0 = document.getElementsByTagName("script")[0];
                    s1.async = true;
                    s1.src = "https://embed.tawk.to/66a4ec76becc2fed692be739/1i3q3nbqb";
                    s1.charset = "UTF-8";
                    s1.setAttribute("crossorigin", "*");
                    s0.parentNode.insertBefore(s1, s0);
                  })();
                `,
              }}
            />

            <Script
              id="tawk-control"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.Tawk_API = window.Tawk_API || {};

                  function isBusinessHours() {
                    const now = new Date();
                    const istTime = new Date(
                      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                    );
                    const day = istTime.getDay();
                    const hour = istTime.getHours();
                    return day >= 1 && day <= 5 && hour >= 10 && hour < 19;
                  }

                  window.Tawk_API.onLoaded = function () {

                    function setWidgetStyle() {

                      if (!window.Tawk_API.customStyle) return;

                      const widgetWidth = Math.min(360, window.innerWidth - 24);
                      const widgetHeight = Math.min(520, window.innerHeight - 140);

                      window.Tawk_API.customStyle({
                        widget: {
                          width: widgetWidth,
                          height: widgetHeight,
                        },
                        visibility: {
                          desktop: {
                            position: "br",
                            xOffset: 12,
                            yOffset: 18,
                          },
                          mobile: {
                            position: "br",
                            xOffset: 12,
                            yOffset: 18,
                          },
                        },
                      });
                    }

                    setWidgetStyle();

                    if (isBusinessHours()) {
                      window.Tawk_API.showWidget();
                    } else {
                      window.Tawk_API.hideWidget();
                    }
                  };
                `,
              }}
            />
          </>
        )}
      </head>

      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <ChatProvider>

              {/* ✅ Navbar Hidden On Admin Routes */}
              {!isAdminRoute && <Navbar />}

              <main>{children}</main>

              {/* ✅ Public Only Components */}
              {!isAdminRoute && <Footer />}
              {!isAdminRoute && <FloatingContactButtons />}
              {!isAdminRoute && <PopupContactForm />}

            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}