"use client";

import { useState } from "react";

const FALLBACK_IMAGES = [
  "/images/process/T1.webp",
  "/images/process/T2.avif",
  "/images/process/T3.jpg",
  "/images/process/T4.webp",
  "/images/process/T5.webp",
  "/images/process/T6.jpg",
  "/images/process/T7.jpg",
];

export default function TabletStepper({ data }) {
  // HARD GUARD
  if (!data || !data.steps || data.steps.length === 0) {
    return null;
  }

  const { title, description, steps } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];

  if (!activeStep) return null;

  // ✅ Correct image resolution order
  const imageSrc =
    activeStep.image ||
    FALLBACK_IMAGES[activeIndex] ||
    FALLBACK_IMAGES[0];

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          {/* <h2 className="text-3xl font-bold mb-3">{title}</h2> */}
         <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
                  {title}
            <span className="block mx-auto mt-2 h-[4px] w-1/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h2>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center gap-5 mb-10 flex-wrap">
          {steps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={step.id}
                onClick={() => setActiveIndex(index)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 ease-out transform-gpu
                  ${
                    isActive
                      ? "bg-primary text-white scale-110 shadow-md"
                      : "bg-background border border-border hover:scale-105"
                  }`}
              >
                {step.step}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="flex justify-center px-6">
          <div className="max-w-xl w-full rounded-2xl overflow-hidden bg-background shadow-xl">

            {/* Image */}
            <div className="w-full h-[200px] overflow-hidden">
              <img
                src={imageSrc}
                alt={activeStep.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 text-justify">
              <h3 className="text-2xl font-semibold mb-3">
                {activeStep.title}
              </h3>

              <p className="text-muted-foreground mb-5">
                {activeStep.summary}
              </p>

              {Array.isArray(activeStep.points) && activeStep.points.length > 0 && (
  <ul className="space-y-3">
    {activeStep.points.map((point, i) => (
      <li key={i} className="flex gap-3 text-base">
        <span className="text-primary mt-1">•</span>
        <span>{point}</span>
      </li>
    ))}
  </ul>
)}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
