"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import EnhancedServiceSectionPattern from "./EnhancedServiceSectionPattern";

export default function ServiceCategorySection({ category, index }) {
  return (
    <section
      key={category.id}
      id={`${category.id}-details`}
      className={`py-8 md:py-8 relative ${
        index % 2 === 1 ? "bg-background" : ""
      }`}
    >
      <EnhancedServiceSectionPattern index={index} />

      <div className="container-custom relative z-10">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Service Category
            </div>
            <h2 className="text-3xl font-bold mb-4">{category.name}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto ">
              {category.description}
            </p>
          </motion.div>
        </div>

        {/* ✅ IMPORTANT: items-stretch */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch text-justify">
          {category.services.map((service, serviceIndex) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: serviceIndex * 0.1 }}
              className="h-full"
            >
              {/* ✅ FLEX COLUMN CARD */}
              <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                
                <CardHeader className="p-6">
                  <CardTitle className="text-xl tracking-tight">
                    {service.name}
                  </CardTitle>
                </CardHeader>

                {/* ✅ GROWS */}
                <CardContent className="px-6 pb-4 flex-1">
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{feature}</p>
                      </div>
                    ))}

                    {service.features.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-6">
                        +{service.features.length - 3} more features
                      </p>
                    )}
                  </div>
                </CardContent>

                {/* ✅ BUTTON AT BOTTOM */}
                <div className="px-6 pb-6 mt-auto">
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      variant="link"
                      className="p-0 h-auto text-primary font-medium"
                    >
                      <Link
                        href={`/services/${category.id}/${service.id}`}
                        className="flex items-center gap-1"
                      >
                        Learn more
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>

              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
