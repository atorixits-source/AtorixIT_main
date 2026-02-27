"use client";

import React, {use} from "react";

// 🔹 Industries Section
import IndustriesSection from "@/components/industries-we-serve/IndustriesSection";

// 🔹 Industries data (COMBINED FILE)
//import { industriesDataMap } from "@/components/industries-we-serve/industriesData";
 import industriesDataMap from "@/components/industries-we-serve/industriesData";

// 🔹 Hook
import useServiceDetail from "./hooks/useServiceDetail";

// 🔹 Sections
import ServiceHero from "./sections/ServiceHero";
import ServiceMainContent from "./sections/ServiceMainContent";
import ServiceSidebar from "./sections/ServiceSidebar";
import ServiceCTA from "./sections/ServiceCTA";
import { ServiceLoading, ServiceNotFound } from "./sections/ServiceState";

// 🔹 FAQ data
import faqData from "@/data/faq";

export default function ServiceDetailPage({ params }) {
  // ✅ CORRECT PARAM HANDLING
  const { category, service } = use(params);

  const faqs = faqData?.[category]?.[service] || [];

  const {
    loading,
    notFound,
    serviceData,
    categoryData,
    relatedServices,
    serviceContent,
    flags,
  } = useServiceDetail({ category, service });

  // 🔹 Pick correct industries data for this service
  const industriesData = industriesDataMap?.[service];

  // 🔹 States
  if (loading) return <ServiceLoading />;
  if (notFound) return <ServiceNotFound />;

  return (
    <>
      {/* ===== HERO ===== */}
      <ServiceHero
        categoryName={categoryData.name}
        serviceName={serviceData.name}
        serviceDescription={serviceData.description}
      />

      {/* ===== MAIN CONTENT + SIDEBAR ===== */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <ServiceMainContent
              serviceData={serviceData}
              {...serviceContent}
              flags={flags}
              categoryId={category}
              serviceId={service}
              faqs={faqs}
            />

            <ServiceSidebar
              categoryData={categoryData}
              relatedServices={relatedServices}
              testimonials={serviceContent.testimonials}
            />
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES WE SERVE ===== */}
      {industriesData && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <IndustriesSection data={serviceData.industries} />
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <ServiceCTA />
    </>
  );
}
