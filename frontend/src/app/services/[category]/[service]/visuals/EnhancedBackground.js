"use client";

import { useEffect, useState } from "react";

// Enhanced animated gradient background component with interactive elements
export default function EnhancedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to window size for parallax effect
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10"></div>

      {/* Dynamic animated gradient shapes that react to mouse movement */}
      <div
        className="absolute -top-[30%] -right-[10%] w-[80%] h-[70%] rounded-full bg-gradient-to-br from-primary/15 via-blue-500/10 to-transparent opacity-70 blur-[80px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${
            mousePosition.y * -20
          }px)`,
        }}
      ></div>

      <div
        className="absolute top-[60%] -left-[10%] w-[50%] h-[40%] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-transparent opacity-60 blur-[70px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${
            mousePosition.y * 20
          }px)`,
        }}
      ></div>

      {/* Subtle animated accent shapes */}
      <div className="absolute top-[20%] right-[30%] w-[20%] h-[20%] rounded-full bg-cyan-500/10 opacity-40 blur-[50px] animate-pulse"></div>
      <div
        className="absolute bottom-[10%] right-[20%] w-[15%] h-[15%] rounded-full bg-amber-500/10 opacity-30 blur-[40px] animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Pattern overlay with subtle animation */}
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03] animate-subtle-float"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => {
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const size = Math.floor(Math.random() * 5) + 1;
          const opacity = Math.random() * 0.15;
          const duration = 15 + Math.random() * 30;
          const delay = Math.random() * -30;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animation: `float ${duration}s infinite ease-in-out ${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Animated light beams */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-primary/40 via-primary/10 to-transparent animate-pulse"></div>
      <div
        className="absolute top-0 left-2/3 w-[1px] h-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-violet-500/30 via-violet-500/10 to-transparent animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Horizontal light traces */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-subtle-float"></div>
      <div
        className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent animate-subtle-float"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
}
