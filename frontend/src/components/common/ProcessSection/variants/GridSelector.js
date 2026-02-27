"use client";

import { useState } from "react";
import s4hanaProcess from "@/data/s4hanaProcess";

export default function GridSelector() {
  const { title, description, steps } = s4hanaProcess;
  const [activeIndex, setActiveIndex] = useState(null);

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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={step.id}
                className="relative h-[240px]"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Base tile */}
                <div
                  className={`absolute inset-0 rounded-2xl border bg-background flex flex-col items-center justify-center
                    transition-all duration-300 ease-out
                    ${
                      isActive
                        ? "opacity-0 scale-95"
                        : "opacity-100"
                    }`}
                >
                  <div className="text-3xl mb-3">🧩</div>
                  <h4 className="text-lg font-semibold text-center px-4">
                    {step.title}
                  </h4>
                </div>

                {/* Hover card */}
                <div
                  className={`absolute inset-0 rounded-2xl border bg-background shadow-xl
                    transition-all duration-300 ease-out transform-gpu
                    ${
                      isActive
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                >
                  {/* Scroll container */}
                  <div className="h-full p-6 overflow-hidden">
                    <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">

                      <h3 className="text-xl font-semibold mb-3">
                        {step.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4">
                        {step.summary}
                      </p>

                      <ul className="space-y-2 text-sm leading-relaxed">
                        {step.points.map((point, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
