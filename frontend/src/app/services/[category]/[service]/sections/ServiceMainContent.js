"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import FeatureShowcase from "@/components/services/categoryService/FeatureShowcase";
import FaqSection from "@/components/services/categoryService/FaqSection";

// Why Choose / SAP Section
import WhySapServices from "../../../sap/WhySapServices";

// Industries We Serve (DATA + COMPONENT)
import industriesData from "@/components/industries-we-serve/industriesData";
import IndustriesSection from "@/components/industries-we-serve/IndustriesSection";

// Common Sections
import ProcessSectionInjector from "@/components/common/ProcessSection/ProcessSectionInjector";
import CaseStudySection from "@/components/common/CaseStudy/CaseStudySection";
import MethodologySection from "@/components/common/Methodology/MethodologySection";
import DifferenceSection from "@/components/common/Difference/DifferenceSection";
import ApproachSection from "@/components/common/Approach/ApproachSection";

// Dynamic Sections
import { SERVICE_SECTION_CONFIG } from "./ServiceSectionConfig";
import ServiceSectionRenderer from "./ServiceSectionRenderer";

export default function ServiceMainContent({
  serviceData,
  additionalContent,
  benefits,
  categoryId,
  serviceId,
  faqs = [],
}) {
  const sectionKey = `${categoryId}:${serviceId}`;
  const dynamicSections = SERVICE_SECTION_CONFIG?.[sectionKey] || [];

  // ✅ CONNECT INDUSTRIES DATA USING serviceId
  const industriesSectionData = industriesData?.[serviceId];

  return (
    <div className="lg:col-span-2">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
       <div className="text-justify">
        {/* Overview */}
        <ServiceSectionRenderer
          title="Overview"
          content={additionalContent?.overview || serviceData?.details}
        />
        </div>

        {/* What is ML & Deep Learning */}
        {additionalContent?.whatIsMLDL && (
          <ServiceSectionRenderer
            title="What Is Machine Learning & Deep Learning?"
            content={additionalContent.whatIsMLDL}
          />
        )}
        {/* Why Choose */}
        <WhySapServices category={categoryId} service={serviceId} />

        {/* Difference */}
        <DifferenceSection category={categoryId} service={serviceId} />

        {/* Process */}
        <ProcessSectionInjector />

        {/* Dynamic Sections */}
        {dynamicSections.map(({ title, key, plain }) =>
          additionalContent?.[key] ? (
            <ServiceSectionRenderer
              key={key}
              title={title}
              content={additionalContent[key]}
              plain={plain}
            />
          ) : null
        )}

        {/* Features */}
        {serviceData?.features?.length > 0 && (
          <>
            {/* <h2 className="text-3xl font-bold mb-6">Key Features</h2> */}
      
    <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
              Key Features
      <span className="block mx-auto mt-2 h-[4px] w-3/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
    </h2>

            <FeatureShowcase
              features={serviceData.features}
              className="mb-16 text-justify"
            />
          </>
        )}

        {/* Benefits */}
        {benefits?.length > 0 && (
          <div className="mb-10 text-justify">
            {/* <h2 className="text-3xl font-bold mb-6">Key Benefits</h2> */}
   <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
              Key Benefits
      <span className="block mx-auto mt-2 h-[4px] w-3/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
    </h2>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-justify">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 text-justify">
                  <div className="rounded-full w-7 h-7 bg-primary/10 flex items-center text-justify">
                    <CheckCircle2 className="h-4 w-4 text-primary text-justify" />
                  </div>
                  <p className="text-lg text-justify">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approach */}
        <ApproachSection category={categoryId} service={serviceId} />

        {/* Methodology */}
        <MethodologySection category={categoryId} service={serviceId} />

        {/* Case Studies */}
        <CaseStudySection category={categoryId} service={serviceId} />

        {/* ✅ INDUSTRIES WE SERVE (CONNECTED PROPERLY) */}
        {industriesSectionData && (
          <div className="mt-6 text-justify">
            <IndustriesSection data={industriesSectionData} />
          </div>
        )}

        {/* FAQs */}
      {faqs.length > 0 && (
          <div className="mt-10 ">
            <FaqSection
              faqs={faqs}
              title="Frequently Asked Questions"
            />
          </div>
        )} 
      
        {/* CTA */}
        <div className="bg-muted/10 p-8 rounded-xl border border-border mt-10">
          {/* <h3 className="text-2xl font-bold mb-4">
            Ready to get started?
          </h3> */}
 <h3 className="inline-block text-4xl font-bold text-black dark:text-white relative">
             Ready to get started?
      <span className="block mx-auto mt-2 h-[4px] w-2/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
    </h3>

          <p className="text-muted-foreground mb-6">
            Contact our team to learn more about our {serviceData?.name}.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
