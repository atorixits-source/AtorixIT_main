"use client"; 

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import servicesData from "@/data/services.json";
import serviceDetailsData from "@/data/serviceDetails.json";


export default function useServiceDetail() {
  const { category: categoryId, service: serviceId } = useParams();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [serviceData, setServiceData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [serviceContent, setServiceContent] = useState(null);

  useEffect(() => {
    /* ---------------- CATEGORY ---------------- */
    const category = servicesData.categories.find(
      (cat) => cat.id === categoryId
    );

    if (!category) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    /* ---------------- SERVICE ---------------- */
    const service = category.services.find(
      (serv) => serv.id === serviceId
    );

    if (!service) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setCategoryData(category);
    setServiceData(service);

    setRelatedServices(
      category.services.filter((s) => s.id !== serviceId).slice(0, 3)
    );

    /* ---------------- SERVICE DETAILS ---------------- */
    const details =
      serviceDetailsData.serviceDetails?.[categoryId]?.[serviceId] || {};

   

    /* ---------------- FINAL CONTENT ---------------- */
    setServiceContent({
      testimonials: details.testimonials || [],
      // faqs: resolvedFaqs, // ✅ FIXED
      processSteps: details.processSteps || [],
      relevantIndustries: details.relevantIndustries || null,
      benefits: details.benefits || [],
      additionalContent: details.additionalContent || null,
    });

    setLoading(false);
  }, [categoryId, serviceId]);

  /* ---------------- PAGE FLAGS ---------------- */
  const flags = {
    isS4HANAPage:
      categoryId === "erp-tech" && serviceId === "sap-s4-hana-ecc",
    isS4HANACloudPage:
      categoryId === "erp-tech" && serviceId === "sap-s4-hana-cloud",
    isBusinessOnePage:
      categoryId === "erp-tech" &&
      serviceId === "sap-business-one-hana",
    isAnalyticsPage:
      categoryId === "erp-tech" && serviceId === "sap-analytics",
    isDynamicsPage:
      categoryId === "microsoft-dynamics" &&
      serviceId === "dynamics-365",
    isCyberSecurityPage:
      categoryId === "security" &&
      serviceId === "cyber-security",
  };

  return {
    loading,
    notFound,
    serviceData,
    categoryData,
    relatedServices,
    serviceContent,
    flags,
  };
}
