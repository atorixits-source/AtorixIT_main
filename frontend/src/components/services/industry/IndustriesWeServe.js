"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import industriesWeServe from "@/data/industriesWeServe.json";

export default function IndustriesWeServe({ serviceKey }) {
  const [hoveredIndustry, setHoveredIndustry] = useState(null);

  const content = industriesWeServe[serviceKey];

  if (!content || !content.industries?.length) return null;

  const { title, intro, industries } = content;

  return (
    <section className="mt-16">
      {/* Title */}
      <motion.h2
        className="text-2xl font-bold mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      {/* Intro */}
      {intro && (
        <p className="text-muted-foreground mb-6 max-w-3xl">
          {intro}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {industries.map((industry, index) => (
          <motion.div
            key={industry.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "relative p-4 border rounded-xl cursor-pointer transition-all",
              hoveredIndustry === industry.id
                ? "border-primary/40 bg-primary/5 shadow-md"
                : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
            )}
            onMouseEnter={() => setHoveredIndustry(industry.id)}
            onMouseLeave={() => setHoveredIndustry(null)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center p-1.5">
                <Image
                  src={industry.icon}
                  alt={industry.name}
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="font-medium">{industry.name}</h3>
            </div>

            <motion.p
              className="text-sm text-muted-foreground overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: hoveredIndustry === industry.id ? 1 : 0,
                height: hoveredIndustry === industry.id ? "auto" : 0
              }}
              transition={{ duration: 0.2 }}
            >
              {industry.description}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
