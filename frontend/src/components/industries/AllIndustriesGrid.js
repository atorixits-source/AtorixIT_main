"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import IndustryGridItem from "./IndustryGridItem";

export default function AllIndustriesGrid({ industries }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width, height;

    const nodes = [];
    const connections = [];
    const nodeCount = 50;
    const connectionDistance = 120;

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
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
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
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = `rgba(100, 100, 255, ${conn.opacity * 0.45})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 150, 136, 0.4)";
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

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="py-8 md:py-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-primary/10"></div>
        <div className="absolute inset-0 bg-[url('/dots.png')] opacity-[0.03]"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-primary/70">
            All Industries We Serve
          </h2>
          <p className="text-lg text-muted-foreground">
            Our SAP expertise spans across all major industries. Whatever your
            sector, we can help you implement, optimize, and support SAP
            solutions tailored to your specific needs.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {industries.map((industry) => (
            <IndustryGridItem key={industry.id} industry={industry} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
