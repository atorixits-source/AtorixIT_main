"use client";

import { useState } from "react";
import s4hanaProcess from "@/data/s4hanaProcess";

export default function MinimalStepper() {
  const { title, description, steps } = s4hanaProcess;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-10">
      <div className="container mx-auto px-8 lg:px-16">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-5">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center gap-6 mb-14 flex-wrap">

          {steps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={step.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 ease-out transform-gpu
                  ${
                    isActive
                      ? "bg-primary text-white scale-110 shadow-[0_4px_16px_rgba(59,130,246,0.35)]"
                      : "bg-background border border-border hover:scale-105"
                  }`}
              >
                {step.step}
              </button>
            );
          })}

        </div>

        {/* Card (same as other variants) */}
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
    </section>
  );
}
