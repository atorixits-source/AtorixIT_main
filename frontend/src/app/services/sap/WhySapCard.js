"use client";

import { motion } from "framer-motion";

export default function WhySapCard({ icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      viewport={{ once: true }}
      className="relative perspective-[1000px]"
    >
      <div
        className="
          rounded-2xl p-8 border
          transition-all duration-300 transform
          hover:-translate-y-4 hover:rotate-x-3 hover:shadow-2xl
          
          /* LIGHT MODE */
          bg-white border-gray-200 shadow-xl
          
          /* DARK MODE */
          dark:bg-[#0b1220]
          dark:border-white/10
          dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.9)]

          
        "
        style={{ minHeight: 260 }}
      >
        {/* Icon / Number */}
        <div className="text-5xl font-bold mb-4 text-blue-600/40 dark:text-blue-400/30 text-center">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white text-center">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 text-justify">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
