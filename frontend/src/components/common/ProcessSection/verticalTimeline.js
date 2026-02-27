"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ITEM_HEIGHT = 80;
const DOT_SIZE = 14;

// fallback images (T1 → T7)
const FALLBACK_IMAGES = [
  "/images/process/T1.webp",
  "/images/process/T2.avif",
  "/images/process/T3.jpg",
  "/images/process/T4.webp",
  "/images/process/T5.webp",
  "/images/process/T6.jpg",
  "/images/process/T7.jpg",
];

export default function VerticalTimeline({ data }) {
  if (!data || !Array.isArray(data.steps)) return null;

  const { title, description, steps } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  const dotY =
    activeIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2 - DOT_SIZE / 2;

  const activeStep = steps[activeIndex];
  const image =
    activeStep.image ||
    FALLBACK_IMAGES[activeIndex % FALLBACK_IMAGES.length];

  return (
    <section className="py-10 relative text-justify">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 text-justify">
          <h2 className="text-4xl font-bold mb-4 text-justify">{title}</h2>
          <p className="text-lg text-muted-foreground text-justify">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT — Timeline */}
          <div className="relative pl-12">
            {/* Base line */}
            <div
              className="absolute left-[6px] top-0 w-px bg-border"
              style={{ height: ITEM_HEIGHT * steps.length }}
            />

            {/* Progress line */}
            <motion.div
              className="absolute left-[6px] top-0 w-px bg-primary origin-top"
              animate={{ height: dotY + DOT_SIZE / 2 }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
            />

            {/* Dot */}
            <motion.div
              className="absolute left-[6px] rounded-full bg-primary"
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                marginLeft: -DOT_SIZE / 2,
              }}
              animate={{ top: dotY }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
            />

            {/* Titles */}
            <div>
              {steps.map((step, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={step.id}
                    className="h-[80px] flex items-center cursor-pointer"
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <motion.h4
                      animate={{ scale: isActive ? 1.05 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                      }}
                      className={`transition-colors ${
                        isActive
                          ? "text-xl font-semibold text-foreground"
                          : "text-lg text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </motion.h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Content Card */}
          <div className="flex text-justify">
            <motion.div
              key={activeIndex}
              className="max-w-lg w-full border rounded-2xl shadow-xl overflow-hidden bg-background text-justify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Image */}
              <div className="w-full h-[180px] overflow-hidden">
                <img
                  src={image}
                  alt={activeStep.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8 text-justify">
                <h3 className="text-2xl font-semibold mb-3 text-justfy">
                  {activeStep.title}
                </h3>

                <p className="text-muted-foreground mb-6 text-justify">
                  {activeStep.summary}
                </p>

                {Array.isArray(activeStep.points) && activeStep.points.length > 0 && (
  <ul className="space-y-3 text-justify">
    {activeStep.points.map((point, i) => (
      <li key={i} className="flex gap-3 text-base text-justify">
        <span className="text-primary mt-1">•</span>
        <span>{point}</span>
      </li>
    ))}
  </ul>
)}

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
