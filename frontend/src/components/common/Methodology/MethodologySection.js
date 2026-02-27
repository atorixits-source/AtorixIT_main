"use client";

import { motion } from "framer-motion";
import methodologyData from "@/data/methodology.json";

export default function MethodologySection({ category, service }) {
  const methodology = methodologyData[`${category}:${service}`];
  if (!methodology) return null;

  const { heading, intro, steps } = methodology;
  if (!steps || steps.length === 0) return null;

  return (
    <section className="mb-24">
      {/* Header */}
      <div className="mb-20 max-w-4xl">
        {/* <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {heading}
        </h2> */}
   <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
                  {heading}
            <span className="block mx-auto mt-2 h-[4px] w-2/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h2>

        {intro && (
          <p className="text-lg text-muted-foreground">
            {intro}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-primary/60 to-primary/10" />

        <div className="space-y-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative flex gap-8"
            >
              {/* Step indicator */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-primary/90 ring-2 ring-white/40 text-white flex items-center justify-center text-sm font-semibold shadow-md">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="pb-1 max-w-3xl text-justify">
                <h3 className="text-xl font-semibold mb-2">
                  {step.title}
                </h3>

                {/* Description / Bullets */}
                {Array.isArray(step.description) ? (
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {step.description.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
