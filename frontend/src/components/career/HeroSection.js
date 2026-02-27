"use client";

import { ChevronRight, Play, Sparkles, Code2, Zap } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">

      {/* ── Unique hero background — teal/cyan/indigo — completely different from rest of page ── */}
      <div className="absolute inset-0 z-0" style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0d2d4a 40%, #0a1628 100%)"
      }} />

      {/* Vivid accent blobs — teal + violet, distinct from blue/purple theme of rest */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)" }} />
      <div className="absolute top-[30%] right-[10%] w-[250px] h-[250px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)" }} />

      {/* Horizontal glowing lines — techy feel */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[15, 35, 55, 75, 90].map((top, i) => (
          <div key={i} className="absolute w-full h-px"
            style={{
              top: `${top}%`,
              background: `linear-gradient(90deg, transparent 0%, rgba(20,184,166,${0.04 + i * 0.01}) 30%, rgba(99,102,241,${0.06 + i * 0.01}) 70%, transparent 100%)`
            }}
          />
        ))}
      </div>

      {/* Floating tech tags */}
      <div className="absolute top-16 right-16 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono text-teal-300/70 border border-teal-400/20 bg-teal-500/5 pointer-events-none z-10">
        <Code2 className="w-3 h-3" /> &lt;BuildTheFuture /&gt;
      </div>
      <div className="absolute bottom-24 left-12 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono text-indigo-300/70 border border-indigo-400/20 bg-indigo-500/5 pointer-events-none z-10">
        <Zap className="w-3 h-3" /> 40% YoY Growth
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border text-sm font-semibold"
            style={{
              background: "rgba(20,184,166,0.1)",
              borderColor: "rgba(20,184,166,0.3)",
              color: "#5eead4"
            }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
            </span>
            <Sparkles className="w-4 h-4" />
            Now Hiring · Join 200+ Innovators
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
              <span className="block text-white/90 mb-2">Build Your Future</span>
              <span className="block"
                style={{
                  background: "linear-gradient(90deg, #5eead4 0%, #818cf8 50%, #f472b6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                With Atorix
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light text-white/50">
              Where exceptional talent meets groundbreaking innovation. Join us in shaping
              the future of technology while growing your career in ways you never imagined.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-2">
            <Link href="#open-positions"
              className="group px-10 py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)",
                boxShadow: "0 0 30px rgba(20,184,166,0.2)"
              }}
            >
              <span className="flex items-center gap-3">
                Explore Positions
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <button className="group px-10 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-[1.02]"
              style={{
                border: "1px solid rgba(99,102,241,0.4)",
                color: "#a5b4fc",
                background: "rgba(99,102,241,0.07)"
              }}
            >
              <span className="flex items-center gap-3">
                <Play className="w-4 h-4" />
                Watch Our Story
              </span>
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 pt-6">
            {[
              { val: "200+", label: "Team Members"      },
              { val: "15+",  label: "Countries"         },
              { val: "40%",  label: "Annual Growth"     },
              { val: "98%",  label: "Satisfaction Rate" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black" style={{ color: "#5eead4" }}>{s.val}</p>
                <p className="text-xs text-white/40 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background, #f8faff))" }} />
    </section>
  );
}