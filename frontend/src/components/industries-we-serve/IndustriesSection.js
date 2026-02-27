"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function IndustriesSection({ data }) {
  const [hovered, setHovered] = useState(null);
  if (!data) return null;
  return (
    <section>
      {/* <motion.h2 className="text-2xl font-bold mb-4">
        {data.title}
      </motion.h2> */}
      {/* <motion.h2 className="group relative inline-block text-3xl font-bold mb-6 cursor-pointer">
  <span
    className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide ">
     {data.title}
  </span>
</motion.h2> */}
      <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
        {data.title}
        <span className="block mx-auto mt-2 h-[4px] w-2/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
      </h2>


      <p className="text-muted-foreground mb-2 max-w-3xl">
        {data.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.industries.map((industry, index) => (
          <motion.div
            key={industry.id}
            className={cn(
              "relative p-4 border rounded-xl cursor-pointer",
              hovered === industry.id
                ? "border-primary/40 bg-primary/5"
                : "border-border/50"
            )}
            onMouseEnter={() => setHovered(industry.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={industry.icon?.trimStart()}
                alt={industry.name}
                width={32}
                height={32}
              />
              <h3 className="font-medium">{industry.name}</h3>
            </div>

            {hovered === industry.id && (
              <p className="text-sm text-muted-foreground">
                {industry.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
