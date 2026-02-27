"use client";

import { useState } from "react";
import s4hanaProcess from "@/data/s4hanaProcess";

export default function CircularDial() {
  const { title, description, steps } = s4hanaProcess;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-10">
      <div className="container mx-auto px-8 lg:px-16">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl font-bold mb-5">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Dial + Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-center">

          {/* LEFT — Circular Dial */}
          <div className="flex justify-center">
            <div className="relative w-[420px] h-[420px]">

              {/* Dial ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-border" />

              {steps.map((step, index) => {
                const angle = (360 / steps.length) * index - 90;
                const radius = 180;

                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);

                const isActive = activeIndex === index;

                return (
                  /* POSITION WRAPPER — NEVER ANIMATED */
                  <div
                    key={step.id}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(${x}px, ${y}px)`
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {/* ANIMATION NODE — SAFE TO SCALE */}
                    <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">

                      <div
                        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer
                          transition-all duration-300 ease-out transform-gpu will-change-transform
                          ${
                            isActive
                              ? "bg-primary text-white scale-110 shadow-xl"
                              : "bg-background border border-border hover:scale-105"
                          }`}
                      >
                        <span className="text-xl">🧩</span>
                        <span className="text-xs opacity-80">
                          {step.step}
                        </span>
                      </div>

                      {/* Title — absolutely isolated */}
                      <div
                        className={`absolute top-[72px] text-sm font-semibold whitespace-nowrap
                          transition-all duration-300 ease-out
                          ${
                            isActive
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-1 pointer-events-none"
                          }`}
                        style={{
                          textShadow:
                            "0 2px 10px rgba(59,130,246,0.35)"
                        }}
                      >
                        {step.title}
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* RIGHT — Detail Card */}
          <div className="flex justify-center">
            <div className="max-w-lg w-full border rounded-2xl p-10 shadow-xl">

              <h3 className="text-3xl font-semibold mb-4">
                {steps[activeIndex].title}
              </h3>

              <p className="text-lg text-muted-foreground mb-8">
                {steps[activeIndex].summary}
              </p>

              <ul className="space-y-4 text-base leading-relaxed">
                {steps[activeIndex].points.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
