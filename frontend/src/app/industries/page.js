"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import {
  Car,
  Stethoscope,
  ShoppingBag,
  Factory,
  Zap,
  Landmark,
  Phone,
  Truck,
  Film,
  Pill,
  Building2,
  Utensils,
  Ship,
  BarChart2,
  Beaker,
  Bed,
  Wheat,
  Shield,
  GraduationCap,
} from "lucide-react";

import industriesData from "@/data/industries.json";

import HeroSection from "@/components/industries/HeroSection";
import IndustriesOverview from "@/components/industries/IndustriesOverview";
import DetailedIndustrySection from "@/components/industries/DetailedIndustrySection";
import AllIndustriesGrid from "@/components/industries/AllIndustriesGrid";
import IndustryCtaSection from "@/components/industries/IndustryCtaSection";

export default function IndustriesPage() {
  const industryIconMap = {
    healthcare: Stethoscope,
    manufacturing: Factory,
    finance: Landmark,
    retail: ShoppingBag,
    energy: Zap,
    automotive: Car,
    pharmaceuticals: Pill,
    telecom: Phone,
    logistics: Truck,
    construction: Building2,
    media: Film,
    food: Utensils,
    shipping: Ship,
    trading: BarChart2,
    chemical: Beaker,
    hospitality: Bed,
    agriculture: Wheat,
    insurance: Shield,
    education: GraduationCap,
  };

  const industriesWithIcons = useMemo(() => {
    return industriesData.map((industry) => ({
      ...industry,
      icon: industryIconMap[industry.id],
    }));
  }, []);

  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredIndustries, setFilteredIndustries] =
    useState(industriesWithIcons);
  const [visibleDetailCount, setVisibleDetailCount] = useState(6);
  const [pendingScrollId, setPendingScrollId] = useState(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const overviewRef = useRef(null);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredIndustries(industriesWithIcons);
      return;
    }

    const filterMap = {
      manufacturing: [
        "manufacturing",
        "automotive",
        "chemical",
        "food",
        "pharmaceuticals",
      ],
      services: [
        "hospitality",
        "telecom",
        "media",
        "education",
        "logistics",
        "shipping",
      ],
      retail: ["retail", "food", "trading"],
      healthcare: ["healthcare", "pharmaceuticals"],
      finance: ["finance", "insurance", "trading"],
    };

    setFilteredIndustries(
      industriesWithIcons.filter(
        (industry) =>
          filterMap[activeFilter] &&
          filterMap[activeFilter].includes(industry.id)
      )
    );
  }, [activeFilter, industriesWithIcons]);

  const loadMoreIndustries = () => {
    setVisibleDetailCount((prev) =>
      Math.min(prev + 3, industriesData.length)
    );
  };

  const handleExploreClick = () => {
    overviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------------------------------------------
      🔥 PERFECT INDUSTRY SCROLL HANDLER
  --------------------------------------------------- */

  const scrollToIndustry = useCallback((id) => {
    const index = industriesData.findIndex((i) => i.id === id);
    if (index === -1) return;

    const requiredCount = index + 1;

    setPendingScrollId(id);

    setVisibleDetailCount((prev) =>
      prev < requiredCount ? requiredCount : prev
    );
  }, []);

  // Perform scroll AFTER required sections are rendered
  useEffect(() => {
    if (!pendingScrollId) return;

    const el = document.getElementById(pendingScrollId);
    if (!el) return;

    setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setPendingScrollId(null);
    }, 200);
  }, [pendingScrollId, visibleDetailCount]);

  /* --------------------------------------------------- */

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <HeroSection onExploreClick={handleExploreClick} />

      <IndustriesOverview
        ref={overviewRef}
        industries={filteredIndustries}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        resetFilters={() => setActiveFilter("all")}
        onIndustryClick={scrollToIndustry}   // 👈 ADD THIS
      />

      <div className="bg-muted/10">
        {industriesData.slice(0, visibleDetailCount).map((industry, index) => (
          <DetailedIndustrySection
            key={industry.id}
            industry={industry}
            index={index}
          />
        ))}

        {visibleDetailCount < industriesData.length && (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={loadMoreIndustries}
                variant="outline"
                size="lg"
                className="gap-2 shadow-sm hover:shadow-md"
              >
                Load More Industries
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      <AllIndustriesGrid
        industries={industriesWithIcons}
        onIndustryClick={scrollToIndustry}   // 👈 ADD THIS
      />

      <IndustryCtaSection />
    </>
  );
}
