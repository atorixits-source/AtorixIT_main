"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, BarChart } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <section className="pt-10 pb-6 border-b border-border/60 text-justify">
      
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Why Choose Us
            </div>

            <h2 className="inline-block text-3xl md:text-4xl mb-6 text-center font-bold text-black dark:text-white relative">
              A Partner You Can Trust for SAP Excellence
              <span className="block mx-auto mt-2 h-[4px] w-1/5 bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              With a strong foundation in enterprise technology and a deep understanding of complex business processes, we partner with organizations to design,
              implement, and optimize SAP solutions that drive measurable business value.
            </p>

            <div className="space-y-4">

              {/* Feature 1 */}
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Our consultants are certified SAP professionals with years of hands-on implementation experience.
                  </p>

                  {/* MOBILE/TABLET IMAGE */}
                  <motion.div
                    className="relative h-[220px] w-full mt-4 overflow-hidden rounded-lg shadow-md lg:hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dfmiavhld/image/upload/v1769581902/Web-developer01_lkdsfu.webp"
                      alt="Expert Team"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">Proven Methodology</h3>
                  <p className="text-muted-foreground">
                   Our implementation approach minimizes risk and ensures successful outcomes, on time and within budget.
                    </p>

                  <motion.div
                    className="relative h-[220px] w-full mt-4 overflow-hidden rounded-lg shadow-md lg:hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dfmiavhld/image/upload/v1769582983/Methodology_vhshnn.webp"
                      alt="Methodology"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">Industry Specialization</h3>
                  <p className="text-muted-foreground">
                   We have deep knowledge across multiple industries, enabling us to deliver tailored solutions that address specific business challenges.
                  </p>

                  <motion.div
                    className="relative h-[220px] w-full mt-4 overflow-hidden rounded-lg shadow-md lg:hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dfmiavhld/image/upload/v1769582984/industrial-plant_s8elea.webp"
                      alt="Industry"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">Customer Satisfaction</h3>
                  <p className="text-muted-foreground">
                   Our 95% client retention rate speaks to our commitment to building lasting partnerships based on trust and results.
                  </p>

                  <motion.div
                    className="relative h-[220px] w-full mt-4 overflow-hidden rounded-lg shadow-md lg:hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dfmiavhld/image/upload/v1769581901/consultation01_sx897k.webp"
                      alt="Customer Satisfaction"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* RIGHT IMAGE GRID — DESKTOP ONLY */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

              {[
                "Web-developer01_lkdsfu.webp",
                "Methodology_vhshnn.webp",
                "industrial-plant_s8elea.webp",
                "consultation01_sx897k.webp",
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className="aspect-square relative overflow-hidden rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={`https://res.cloudinary.com/dfmiavhld/image/upload/v1769581902/${img}`}
                    alt="SAP"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
