"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_IMAGES = [
  "/images/process/T1.webp",
  "/images/process/T2.avif",
  "/images/process/T3.jpg",
  "/images/process/T4.webp",
  "/images/process/T5.webp",
  "/images/process/T6.jpg",
  "/images/process/T7.jpg",
];

export default function MobileProcessCards({ data }) {
  if (!data?.steps?.length) return null;

  const { title, description, steps } = data;
  const [activeId, setActiveId] = useState(null);

  return (
    <section className="py-10">
      <div className="container-custom space-y-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          {/* <h2 className="text-2xl font-bold mb-3">{title}</h2> */}
        <h3 className="inline-block text-4xl font-bold text-black dark:text-white relative">
                  {title}
            <span className="block mx-auto mt-2 h-[4px] w-1/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h3>
          <p className="text-muted-foreground text-base">{description}</p>
        </div>

        {/* Cards */}
        <div className="space-y-6 text-justify">
          {steps.map((step, index) => {
            const isOpen = activeId === step.id;
            const imageSrc =
              step.image ||
              FALLBACK_IMAGES[index] ||
              FALLBACK_IMAGES[0];

            return (
              <motion.div
                key={step.id}
                layout="position"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="rounded-xl border bg-card shadow-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setActiveId(isOpen ? null : step.id)
                  }
                  className="w-full text-left"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">

                    {/* Image zoom isolated from layout */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{ scale: isOpen ? 1.06 : 1.02 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <img
                        src={imageSrc}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </motion.div>

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Title */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-lg font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </button>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.2 }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-6">
                        <p className="text-muted-foreground text-sm mb-4">
                          {step.summary}
                        </p>

                        {Array.isArray(step.points) && step.points.length > 0 && (
  <ul className="space-y-2 text-sm">
    {step.points.map((point, i) => (
      <li key={i} className="flex gap-2">
        <span className="text-primary">•</span>
        <span>{point}</span>
      </li>
    ))}
  </ul>
)}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
