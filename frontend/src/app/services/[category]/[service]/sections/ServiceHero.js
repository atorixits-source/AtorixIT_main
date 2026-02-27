"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnhancedBackground from "../visuals/EnhancedBackground";

export default function ServiceHero({
  categoryName,
  serviceName,
  serviceDescription,
}) {
  return (
    <section className="py-10 md:py-10 relative overflow-hidden">
      <EnhancedBackground />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <Link
              href="/services"
              className="text-sm font-medium text-muted-foreground hover:text-primary inline-flex items-center group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="relative">
                Back to Services
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300 "></span>
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-5 text-justify"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse text-justify"></span>
            {categoryName}
          </motion.div>

          {/* <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {serviceName}
          </motion.h1> */}

            <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}>
                  {serviceName}
           <span className="block mt-2 h-[4px] w-1/5  bg-gradient-to-r from-pink-600 via-pink-600 to-transparent dark:from-white dark:via-white dark:to-transparent"></span>
        </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-10 text-justify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {serviceDescription}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Button asChild size="lg" className="relative overflow-hidden group">
              <Link href="/contact">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="relative overflow-hidden group"
            >
              <Link href="/get-demo">
                <span className="relative z-10">Request Demo</span>
                <span className="absolute inset-0 bg-gradient-to-r from-muted/0 via-muted/30 to-muted/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
