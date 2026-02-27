"use client";

import ProgressBar from "@/components/contact/ProgressBar";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import MapSection from "@/components/contact/MapSection";

export default function ContactPage() {
  return (
    <>
      {/* Progress bar that shows scroll position */}
      <ProgressBar />

      {/* Hero Section with animated background */}
      <ContactHero />

      {/* Contact Information & Form */}
      <ContactSection />

      {/* Map Section */}
      <MapSection />

         </>
  );
}
