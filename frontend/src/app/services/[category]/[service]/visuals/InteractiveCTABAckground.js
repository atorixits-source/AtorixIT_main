"use client";

// Interactive CTA background with animated elements
export default function InteractiveCTABackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient layer with vibrant colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-700 to-violet-800"></div>

      {/* Animated radial patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0 animate-slow-spin"></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full bg-gradient-to-r from-indigo-600/0 via-indigo-500/15 to-indigo-600/0 animate-slow-spin"
          style={{ animationDirection: "reverse", animationDuration: "25s" }}
        ></div>
      </div>

      {/* Vibrant light streams */}
      <div className="absolute top-0 left-1/5 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent skew-x-12 animate-pulse"></div>
      <div
        className="absolute top-0 left-2/5 w-[3px] h-full bg-gradient-to-b from-white/25 via-white/5 to-transparent -skew-x-12 animate-pulse"
        style={{ animationDelay: "0.7s" }}
      ></div>
      <div
        className="absolute top-0 left-3/5 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent skew-x-12 animate-pulse"
        style={{ animationDelay: "1.4s" }}
      ></div>
      <div
        className="absolute top-0 left-4/5 w-[1px] h-full bg-gradient-to-b from-white/25 via-white/5 to-transparent -skew-x-12 animate-pulse"
        style={{ animationDelay: "2.1s" }}
      ></div>

      {/* Floating light orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => {
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const size = Math.floor(Math.random() * 6) + 2;
          const opacity = Math.random() * 0.3 + 0.1;
          const duration = 20 + Math.random() * 40;
          const delay = Math.random() * -40;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animation: `float ${duration}s infinite ease-in-out ${delay}s, glow 3s infinite alternate ease-in-out ${
                  Math.random() * 3
                }s`,
              }}
            />
          );
        })}
      </div>

      {/* Grid overlay with animated opacity */}
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10 animate-opacity-pulse"></div>

      {/* Gradient wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%]">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent animate-wave"></div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent animate-wave"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}
