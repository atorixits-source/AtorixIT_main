"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import VerticalTimeline from "./variants/VerticalTimeline";
import TabletStepper from "./variants/TabletStepper";
import MobileProcessCards from "./variants/MobileProcessCards";

import serviceProcessMap from "@/data/serviceProcesses.json";


/**
 * Simple breakpoint hook
 * (we avoid CSS-only because logic differs per variant)
 */
function useBreakpoint() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

export default function ProcessSectionInjector() {
  const params = useParams();
  const service = params?.service;

  // 🔒 HARD GUARD — no slug, no render
  if (!service) return null;

  const processData = serviceProcessMap[service];
  const width = useBreakpoint();

  // 🔒 HARD GUARD — slug exists but no process data
  if (!processData || !processData.steps || processData.steps.length === 0) {
    return null;
  }

  /**
   * BREAKPOINT RULES (LOCKED)
   * mobile   < 768   → cards
   * tablet   < 1024  → stepper
   * desktop  ≥ 1024  → vertical timeline
   */

  if (width < 768) {
    return <MobileProcessCards data={processData} />;
  }

  if (width < 1024) {
    return <TabletStepper data={processData} />;
  }

  return <VerticalTimeline data={processData} />;
}

