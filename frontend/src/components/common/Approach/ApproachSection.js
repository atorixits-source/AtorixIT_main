"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import approachData from "@/data/approach.json";

/* ------------------ Breakpoint Hook ------------------ */

function useBreakpoint() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

/* ------------------ Main Component ------------------ */

export default function ApproachSection({ category, service }) {
  const data = approachData[`${category}:${service}`];
  if (!data) return null;

  const { heading, intro, steps } = data;
  const width = useBreakpoint();

  return (
    <section className="py-4">
      <div className="container-custom text-justify ">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          {/* <h2 className="text-3xl font-bold mb-3">{heading}</h2> */}
          <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
                 {heading}
            <span className="block mx-auto mt-2 h-[4px] w-2/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h2>
          
          {intro && (
            <p className="text-muted-foreground text-lg ">{intro}</p>
          )}
        </div>

        {width >= 1024 ? (
          <DesktopLayout steps={steps} />
        ) : (
          <MobileStaircase steps={steps} />
        )}
      </div>
    </section>
  );
}

/* ===================================================== */
/* ======================= DESKTOP ===================== */
/* ===================================================== */

function DesktopLayout({ steps }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid grid-cols-12 gap-12 items-start text-justify">
      {/* LEFT */}
      <div className="col-span-5 space-y-5">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              animate={{ scale: isActive ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="h-[72px] px-6 flex items-center rounded-xl border bg-background shadow-sm cursor-pointer"
            >
              <h3
                className={`font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </h3>
            </motion.div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="col-span-7 min-h-[340px]">
        <ExpandedCard step={steps[activeIndex]} />
      </div>
    </div>
  );
}

/* ===================================================== */
/* ================ MOBILE + TABLET ==================== */
/* ===================================================== */

function MobileStaircase({ steps }) {
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const isOpen = activeId === index;

        return (
          <motion.div
            key={index}
            layout="position"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className={`rounded-xl border shadow-sm overflow-hidden bg-background ${
              index % 2 === 0 ? "ml-0 mr-8" : "ml-8 mr-0"
            }`}
          >
            {/* Title (Collapsed State) */}
            {!isOpen && (
              <button
                onClick={() => setActiveId(index)}
                className="w-full h-[70px] px-5 flex items-center "
              >
                <h3 className="font-medium text-muted-foreground">
                  {step.title}
                </h3>
              </button>
            )}

            {/* Expanded Card */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.2 },
                  }}
                  className="relative overflow-hidden"
                >
                  <button
                    onClick={() => setActiveId(null)}
                    className="absolute inset-0 z-10"
                    aria-label="close"
                  />

                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={step.image}
                      alt={step.alt || step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/55" />
                  </div>

                  {/* Content */}
                  <div className="relative z-20 p-6">
                    <h4 className="text-white text-lg font-semibold mb-3">
                      {step.title}
                    </h4>

                    {step.description && (
                      <p className="text-white/90 text-sm mb-3 text-justify">
                        {step.description}
                      </p>
                    )}

                    {Array.isArray(step.points) && (
                      <ul className="space-y-2 text-sm">
                        {step.points.map((point, i) => (
                          <li key={i} className="flex gap-2 text-white/90">
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
  );
}

/* ===================================================== */
/* ================= DESKTOP CARD ====================== */
/* ===================================================== */

function ExpandedCard({ step }) {
  return (
    <motion.div
      key={step.title}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative rounded-2xl shadow-xl overflow-hidden "
    >
      <div className="absolute inset-0">
        <img
          src={step.image}
          alt={step.alt || step.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 p-10">
        <h4 className="text-2xl font-semibold text-white mb-4">
          {step.title}
        </h4>

        {step.description && (
          <p className="text-white/90 leading-relaxed mb-4 text-justify">
            {step.description}
          </p>
        )}

        {Array.isArray(step.points) && (
          <ul className="space-y-2 text-justify">
            {step.points.map((point, i) => (
              <li key={i} className="flex gap-3 text-white/90 text-justify">
                <span className="text-primary text-justify">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
