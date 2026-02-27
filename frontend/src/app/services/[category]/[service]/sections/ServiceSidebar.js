"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Testimonial from "@/components/services/categoryService/Testimonial";

export default function ServiceSidebar({
  categoryData,
  relatedServices,
  testimonials,
}) {
  return (
    <div className="lg:col-span-1 text-justify  ">
      <div className="sticky top-24 space-y-8">
        {/* Service Category Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-muted/20 rounded-xl border border-border p-6"
        >
          <h3 className="text-xl font-bold mb-4">Service Category</h3>
          <p className="text-muted-foreground mb-4">
            {categoryData?.name}
          </p>

          <Button asChild variant="outline" className="w-full">
            <Link href={`/services#${categoryData?.id}-details`}>
              Explore Category
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Testimonials */}
        {testimonials?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Client Testimonials</h3>
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} testimonial={testimonial} />
            ))}
          </motion.div>
        )}

        {/* Related Services */}
        {relatedServices?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-muted/20 rounded-xl border border-border p-6"
          >
            <h3 className="text-xl font-bold mb-4">Related Services</h3>

            <div className="space-y-4">
              {relatedServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${categoryData.id}/${service.id}`}
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{service.name}</p>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {service.description.substring(0, 80)}...
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
