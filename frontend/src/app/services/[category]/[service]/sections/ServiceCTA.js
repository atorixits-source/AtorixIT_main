"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServiceCTA() {
  return (
    <section className="py-10 md:py-10 text-white relative overflow-hidden">
      {/* Enhanced animated interactive background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 overflow-hidden">
        {/* Animated circular glow elements */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0 animate-slow-spin"></div>

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-r from-indigo-600/0 via-indigo-500/15 to-indigo-600/0 animate-slow-spin"
          style={{ animationDirection: "reverse", animationDuration: "30s" }}
        />

        {/* Dynamic wave effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%]">
          <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent animate-wave"></div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent animate-wave"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        {/* Animated overlay patterns */}
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.png')] animate-opacity-pulse"></div>

        {/* Light beams */}
        <div className="absolute left-1/4 top-0 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent skew-x-12 animate-pulse"></div>
        <div
          className="absolute left-2/3 top-0 w-[3px] h-full bg-gradient-to-b from-white/25 via-white/5 to-transparent -skew-x-12 animate-pulse"
          style={{ animationDelay: "0.7s" }}
        />
        <div
          className="absolute left-1/3 top-0 w-[1px] h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent skew-x-6 animate-pulse"
          style={{ animationDelay: "1.4s" }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => {
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const size = Math.floor(Math.random() * 4) + 2;
            const opacity = Math.random() * 0.6 + 0.2;
            const duration = 20 + Math.random() * 30;
            const delay = Math.random() * -30;

            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity,
                  animation: `float ${duration}s infinite ease-in-out ${delay}s, glow 3s infinite alternate ease-in-out ${Math.random() * 3}s`,
                }}
              />
            );
          })}
        </div>

        {/* Horizontal light traces */}
        <div className="absolute top-1/4 left-0 w-full h-[1px] mt-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-subtle-float"></div>
        <div
          className="absolute top-3/4 left-0 w-full h-[1px] mt-4 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-subtle-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform Your Business with Expert SAP Services
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Let our team of experienced consultants help you harness the full
            potential of SAP for your business.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90"
            >
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white bg-blue-700/40 border-white/20 hover:bg-blue-600/50"
            >
              <Link href="/services">
                Explore More Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
