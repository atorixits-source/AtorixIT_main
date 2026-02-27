"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function DetailedIndustrySection({ industry, index }) {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    margin: "-35% 0px -35% 0px",
    once: false,
  });

  const [showOverlay, setShowOverlay] = useState(true);
  const [fillActive, setFillActive] = useState(false);

  /* ----------------------------
      Overlay + Fill Sequence
  ----------------------------- */
  useEffect(() => {
    if (!isInView) return;

    setShowOverlay(true);
    setFillActive(false);

    const overlayTimer = setTimeout(() => {
      setShowOverlay(false);
      setFillActive(true);
    }, 2000);

    const scrollTimer = setTimeout(() => {
      const next = sectionRef.current?.nextElementSibling;
      if (next) {
        next.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 11000);

    return () => {
      clearTimeout(overlayTimer);
      clearTimeout(scrollTimer);
    };
  }, [isInView]);

  /* ----------------------------
      Background Particle Effect
  ----------------------------- */
  useEffect(() => {
    if (index % 2 === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width, height;

    const nodes = [];
    const connections = [];
    const nodeCount = 50;
    const connectionDistance = 100;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;

      nodes.length = 0;
      connections.length = 0;

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const connectNodes = () => {
      connections.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            connections.push({
              from: i,
              to: j,
              opacity: 1 - distance / connectionDistance,
            });
          }
        }
      }
    };

    const drawNodes = () => {
      ctx.clearRect(0, 0, width, height);

      connections.forEach((conn) => {
        const a = nodes[conn.from];
        const b = nodes[conn.to];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(100,100,255,${conn.opacity * 0.65})`;
        ctx.stroke();
      });

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,150,136,0.5)";
        ctx.fill();
      });
    };

    const animate = () => {
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      connectNodes();
      drawNodes();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [index]);

  return (
    <section
      ref={sectionRef}
      id={industry.id}
      className="py-8 md:py-8 relative overflow-hidden scroll-mt-20"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {index % 2 === 1 && (
          <canvas ref={canvasRef} className="absolute inset-0" />
        )}
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className={`flex flex-col-reverse md:flex-row gap-12 items-center ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3 }}
        >
          {/* CONTENT — UNCHANGED */}
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Industry Solutions
            </div>

            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {industry.name}
            </h2>

            <p className="text-slate-700 dark:text-slate-200 text-lg mb-8 text-justify">
              {industry.description}
            </p>

            <h3 className="text-xl font-semibold mb-4 text-justify">Key Challenges</h3>
            <div className="space-y-2 mb-8">
              {industry.challenges.map((challenge, i) => (
                <div key={i} className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-3 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p>{challenge}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4">Our Solutions</h3>
            <div className="space-y-2 mb-8">
              {industry.solutions.map((solution, i) => (
                <div key={i} className="flex items-start">
                  <div className="bg-primary/10 p-1 rounded-full mr-3 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p>{solution}</p>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="gap-2 mt-4 shadow-lg hover:shadow-xl">
              <Link href="/contact">
                Discuss Your Requirements
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* MEDIA CARD */}
          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="relative w-[95%] md:w-[88%] lg:w-[82%] aspect-square rounded-xl border border-border/40 shadow-xl overflow-hidden">

              {/* FLUID COUNTER */}
              <motion.div
                initial={{ height: "0%" }}
                animate={{ height: fillActive ? "100%" : "0%" }}
                transition={{ duration: 9, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-500/40 via-indigo-500/30 to-transparent"
              />

              {/* INNER MEDIA */}
              <div className="absolute inset-[10%] rounded-lg overflow-hidden shadow-xl">
                {industry.video ? (
                  <video
                    src={industry.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* TEXT OVERLAY */}
                <motion.div
                  animate={{ opacity: showOverlay ? 1 : 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-black/45 flex items-center justify-center"
                >
                  <h3 className="text-3xl font-bold text-white text-center px-4">
                    {industry.name}
                  </h3>
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
