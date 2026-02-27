"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import differenceData from "@/data/difference.json";

export default function DifferenceSection({ category, service }) {
  const rawData = differenceData[`${category}:${service}`];
  if (!rawData) return null;

  // Normalize to array → supports single + multiple sections
  const sections = Array.isArray(rawData) ? rawData : [rawData];

  return (
    <>
      {sections.map((section, sectionIndex) => {
        const { heading, blocks } = section;
        if (!blocks || blocks.length === 0) return null;

        // Detect split comparison pattern
        const bulletBlock = blocks.find(
          (b) => b.type === "list" && b.style === "bullet"
        );
        const tickBlock = blocks.find(
          (b) => b.type === "list" && b.style === "tick"
        );

        const isSplitLayout = bulletBlock && tickBlock;

        return (
          <section key={sectionIndex} className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              {/* <h2 className="text-3xl md:text-4xl font-bold mb-12 auto">
                {heading}
              </h2> */}

                {/* <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
                  {heading}
                <span className="block mx-auto mt-2 h-[4px] w-1/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
              </h2> */}

              <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
                {heading}
                <span className="block mt-2 h-[4px] w-1/5  bg-gradient-to-r from-pink-600 via-pink-600 to-transparent dark:from-white dark:via-white dark:to-transparent">
                </span>
              </h2>




              {/* SPLIT COMPARISON LAYOUT */}
              {isSplitLayout ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 text-justify">
                  {/* LEFT */}
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-muted-foreground text-justify">
                      Traditional Approach
                    </h3>

                    <ul className="space-y-4 text-justify">
                      {bulletBlock.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-base text-muted-foreground/90"
                        >
                          <span className="mt-3 h-1.5 w-1.5 rounded-full bg-muted-foreground/70 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RIGHT */}
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-primary text-justify">
                      SAP Advantage
                    </h3>

                    <ul className="space-y-4">
                      {tickBlock.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-4 text-base text-foreground/90"
                        >
                          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary shrink-0">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </span>

                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                /* NORMAL FLOW */
                <div className="space-y-6 max-w-4xl text-justify">
                  {blocks.map((block, index) => {
                    if (block.type === "text") {
                      return (
                        <p
                          key={index}
                          className="text-lg text-foreground/80 leading-relaxed text-justify"
                        >
                          {block.content}
                        </p>
                      );
                    }

                    if (block.type === "list") {
                      const isTick = block.style === "tick";

                      return (
                        <ul
                          key={index}
                          className={`space-y-4 ${
                            isTick ? "" : "list-disc pl-5"
                          }`}
                        >
                          {block.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-base text-foreground/80"
                            >
                              {isTick ? (
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary shrink-0">
                                  <Check className="h-4 w-4 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-muted-foreground/70 shrink-0" />
                              )}

                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </motion.div>
          </section>
        );
      })}
    </>
  );
}
