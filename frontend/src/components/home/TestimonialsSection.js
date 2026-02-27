"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// DATA (UNCHANGED)
const testimonials = [
  {
    name: "John Anderson",
    position: "CTO, Global Healthcare Inc.",
    company: "Global Healthcare Inc.",
    image: "/images/clients/Brihati.png",
    text: "Atorix IT Solutions transformed our SAP infrastructure with precision and care. Their team's expertise in S/4 HANA implementation was evident throughout the project. We experienced minimal disruption and are now enjoying the benefits of a more efficient, scalable system.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    position: "IT Director",
    company: "EuroPharma Group",
    image: "/images/clients/Form6.png",
    text: "The migration to S/4 HANA seemed daunting until we partnered with Atorix IT. Their methodical approach and regular communication made the transition smooth. Their post-implementation support has been exceptional - responsive and thorough.",
    rating: 5,
  },
  {
    name: "Robert Chen",
    position: "Operations Manager",
    company: "Pacific Manufacturing",
    image: "/images/clients/NXI.png",
    text: "We needed an SAP partner who understood the nuances of manufacturing processes. Atorix IT not only delivered a tailored implementation but also provided valuable insights that improved our workflows. Their team feels like an extension of our business.",
    rating: 4,
  },
  {
    name: "Amelia Thompson",
    position: "CFO",
    company: "Infinity Retail",
    image: "/images/clients/protergia.png",
    text: "Working with Atorix IT Solutions on our SAP integration project was a revelation. Their consultants took the time to understand our unique business requirements, resulting in a solution that improved our financial reporting efficiency by 40%.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (autoplay) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [current, autoplay]);

  const goToNext = () => {
    setCurrent((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
    setAutoplay(false);
  };

  const goToPrev = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    setAutoplay(false);
  };

  return (
    <section className="relative py-10 overflow-hidden bg-background ">

      {/* SOFT GLOW BACKGROUND */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]" />

      <div className="container-custom relative z-10">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Client Testimonials
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            What Our Clients Say
          </h2>

          <p className="text-muted-foreground text-lg">
            Discover how Atorix IT Solutions has helped businesses transform their operations
            with our SAP implementation and support services.
          </p>
        </div>

        {/* CARD */}
        <div className="relative max-w-xl mx-auto mt-14 rounded-[30px] bg-card border border-border shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          {/* FLOATING OVAL IMAGE */}
         <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
  <div
    className="
      flex items-center justify-center
      w-[150px]
      h-[150px]
      rounded-full
      bg-white dark:bg-gray-900
      ring-4 ring-background
      shadow-lg
      p-3
    "
  >
    <Image
      src={testimonials[current].image}
      alt={testimonials[current].company}
      width={110}
      height={110}
      className="object-contain max-w-full max-h-full"
      priority
    />
  </div>
</div>


          {/* CONTENT */}
          <div className="pt-32 pb-12 px-6 md:px-14 text-justify">

            {/* QUOTE ICON */}
            <Quote className="mx-auto mb-6 h-10 w-10 text-primary opacity-70" />

            {/* TEXT */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {testimonials[current].text}
            </p>

            {/* STARS */}
      <div className="flex justify-center items-center gap-1.5 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            strokeWidth={2.2}
            className={
              i < testimonials[current].rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        ))}
      </div>


            {/* NAME */}
            <h4 className="text-xl font-semibold">
              {testimonials[current].name}
            </h4>

            {/* ROLE */}
            <p className="text-muted-foreground text-sm mb-8">
              {testimonials[current].position}
            </p>

            {/* NAVIGATION */}
            <div className="flex justify-center gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={goToPrev}
                className="rounded-full hover:scale-105 transition"
              >
                <ChevronLeft />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={goToNext}
                className="rounded-full hover:scale-105 transition"
              >
                <ChevronRight />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
