"use client";

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children, title, description }) {
  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden ">

      {/* ================= EXACT TECH BACKGROUND ================= */}
     {/* ================= IMPROVED TECH BACKGROUND ================= */}
<div className="absolute inset-0 -z-10 overflow-hidden">

  {/* 1️⃣ Base Light Blue Gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#f8fcff] via-[#eaf6fd] to-[#cfe9f9]" />

  {/* 2️⃣ Left Soft White Fade */}
  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />

  {/* 3️⃣ Hexagon Grid Overlay */}
  <div
    className="absolute inset-0 opacity-[0.15]"
    style={{
      backgroundImage:
        "url('data:image/svg+xml;utf8,\
        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"104\" viewBox=\"0 0 120 104\">\
        <polygon points=\"60,1 119,30 119,74 60,103 1,74 1,30\" fill=\"none\" stroke=\"%2390cdf4\" stroke-width=\"1\"/>\
        </svg>')",
      backgroundSize: "120px 104px",
    }}
  />

  {/* 4️⃣ Advanced Circuit Layer */}
  <svg
    className="absolute inset-0 w-full h-full opacity-30"
    viewBox="0 0 1600 900"
    preserveAspectRatio="none"
  >
    <g stroke="#7dd3fc" strokeWidth="1.2" fill="none">
      <path d="M0 200 H400 V280 H900 V340 H1400" />
      <path d="M150 0 V180 H500 V420 H1100" />
      <path d="M100 550 H600 V700 H1500" />
      <path d="M600 150 H900 V260 H1300" />
    </g>

    <g fill="#38bdf8">
      <circle cx="400" cy="280" r="4" />
      <circle cx="900" cy="340" r="4" />
      <circle cx="500" cy="420" r="4" />
      <circle cx="1100" cy="260" r="4" />
      <circle cx="1500" cy="700" r="4" />
    </g>
  </svg>

  {/* 5️⃣ Complex HUD Right Side (Layered Rings) */}
  <div className="absolute right-[-300px] top-[-200px] w-[950px] h-[950px] rounded-full border-[50px] border-blue-200/40 opacity-60" />
  <div className="absolute right-[-250px] top-[-150px] w-[800px] h-[800px] rounded-full border-[30px] border-blue-300/40 opacity-50" />
  <div className="absolute right-[-200px] top-[-100px] w-[650px] h-[650px] rounded-full border-[15px] border-blue-400/30 opacity-40" />

  {/* 6️⃣ Soft Radial Blue Glow */}
  <div className="absolute right-[-150px] top-[50px] w-[700px] h-[700px] bg-blue-300/30 rounded-full blur-3xl opacity-50" />

</div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full font-['Times_New_Roman',serif]   ">

        <AdminSidebar />

        <div className="flex-1 flex flex-col">

          {/* Header */}
          <header className="border-b border-gray-200 ml-10">
            <div className="px-4 sm:px-6 md:px-8 py-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                {title}
              </h1>

              {description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
          </main>

        </div>
      </div>


      
    </div>
  );
}