"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedBlobBackground from "./AnimatedBlobBackground";

/* ================= MOTION VARIANTS ================= */

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const underline = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Nitedra Singh",
      position: "Director",
      image:
        "https://res.cloudinary.com/dfmiavhld/image/upload/v1769583350/nitedra-singh_cu2tgl.webp",
      bio:
        "Leading our organization with strategic vision and deep expertise in SAP consulting, implementation, and enterprise transformation.",
    },
  ];

  return (
    <section className="relative py-10 md:py-10 overflow-hidden">
      <AnimatedBlobBackground />

      <motion.div
        className="container-custom relative z-10"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* ================= HEADER ================= */}
        <motion.div
          className="mx-auto max-w-3xl text-center mb-20"
          variants={fadeUp}
        >
          {/* Badge */}
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
            Meet Our Leadership
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl mb-6 text-center font-bold text-black dark:text-white relative">
            The Expert Behind Our Success
            <span className="block mx-auto mt-2 h-[4px] w-1/5 bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h2>


          {/* Description */}
          <p className="mt-8 text-justify md:text-lg text-muted-foreground leading-relaxed">
           Our leadership combines deep industry knowledge with hands-on experience, guiding organizations through 
           complex SAP journeys with clarity, confidence, and measurable impact. Supported by strategic insight and a 
           results-driven approach, we partner with organizations to modernize their SAP environments, improve operational efficiency, and unlock measurable business value.
          </p>
        </motion.div>

        {/* ================= LEADER CARD ================= */}
        <motion.div
          className="flex justify-center"
          variants={container}
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              className="group relative max-w-md rounded-2xl border border-border/50 bg-card p-7 shadow-sm transition-all hover:shadow-xl focus-within:shadow-xl"
              tabIndex={0}
            >
              {/* Accent strip */}
              <span className="absolute inset-x-0 top-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Image */}
              <div className="relative mb-6 aspect-square overflow-hidden rounded-xl">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-1">
                  {member.name}
                </h3>

                <p className="text-primary font-medium text-lg mb-4">
                  {member.position}
                </p>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                  {member.bio}
                </p>
              </div>

              {/* Soft glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
