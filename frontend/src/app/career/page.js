"use client";

import { useState } from "react";
import HeroSection from "@/components/career/HeroSection";
import CoreValues from "@/components/career/CoreValues";
import WhyAtorix from "@/components/career/WhyAtorix";
import OpenPositions from "@/components/career/OpenPositions";
import CallToAction from "@/components/career/CallToAction";
import JobApplicationForm from "@/components/career/JobApplicationForm";
import CareerCulture from "@/components/career/CareerCulture";

const customStyles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }

  /* ── Base background — LIGHTER ── */
  .career-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: #f7f9ff;          /* was #f0f4ff — softer, near-white */
  }
  .dark .career-bg { background: #0d1220; } /* was #080c14 — slightly lighter dark */

  /* ── Roadmap canvas ── */
  .career-roadmap {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 0.55;                /* overall canvas dimmed — was full opacity */
  }

  /* Animated dash path */
  .roadmap-path {
    stroke-dasharray: 18 10;
    animation: dash-move 3s linear infinite;
  }
  @keyframes dash-move {
    to { stroke-dashoffset: -112; }
  }

  /* Milestone pulse ring */
  @keyframes milestone-pulse {
    0%   { r: 10; opacity: 0.8; }
    50%  { r: 16; opacity: 0.3; }
    100% { r: 10; opacity: 0.8; }
  }
  @keyframes milestone-pulse2 {
    0%   { r: 10; opacity: 0.6; }
    50%  { r: 18; opacity: 0.2; }
    100% { r: 10; opacity: 0.6; }
  }

  .pulse-1 { animation: milestone-pulse  2.5s ease-in-out infinite; }
  .pulse-2 { animation: milestone-pulse  2.5s ease-in-out infinite 0.6s; }
  .pulse-3 { animation: milestone-pulse2 2.5s ease-in-out infinite 1.2s; }
  .pulse-4 { animation: milestone-pulse  2.5s ease-in-out infinite 1.8s; }
  .pulse-5 { animation: milestone-pulse2 2.5s ease-in-out infinite 0.4s; }
  .pulse-6 { animation: milestone-pulse  2.5s ease-in-out infinite 1.0s; }

  /* Floating milestone label shimmer */
  @keyframes label-float {
    0%, 100% { transform: translateY(0px);   opacity: 0.85; }
    50%       { transform: translateY(-5px);  opacity: 1;    }
  }
  .lbl-1 { animation: label-float 4s ease-in-out infinite; }
  .lbl-2 { animation: label-float 4s ease-in-out infinite 1s; }
  .lbl-3 { animation: label-float 4s ease-in-out infinite 2s; }
  .lbl-4 { animation: label-float 4s ease-in-out infinite 3s; }
  .lbl-5 { animation: label-float 4s ease-in-out infinite 0.5s; }
  .lbl-6 { animation: label-float 4s ease-in-out infinite 1.5s; }

  /* Soft ambient glows — reduced opacity */
  .career-glow-tl {
    position: fixed; top: -15%; left: -10%;
    width: 55%; height: 55%; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .dark .career-glow-tl { background: radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%); }
  .career-glow-br {
    position: fixed; bottom: -15%; right: -10%;
    width: 50%; height: 50%; border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .dark .career-glow-br { background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%); }

  /* ── All page content above background ── */
  .career-content {
    position: relative;
    z-index: 1;
  }

  /* ── Thin blue divider between sections ── */
  .career-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(59,130,246,0.18) 20%,
      rgba(59,130,246,0.32) 50%,
      rgba(59,130,246,0.18) 80%,
      transparent 100%
    );
    position: relative;
    z-index: 1;
  }

  /* ── Strip ALL hardcoded backgrounds from every child component ── */
  .career-content section,
  .career-content .bg-gray-50,
  .career-content .bg-gray-900,
  .career-content .bg-gray-950,
  .career-content .bg-white,
  .career-content .bg-gray-800,
  .career-content .bg-muted\/30,
  .career-content .bg-gradient-to-b,
  .career-content .bg-gradient-to-r {
    background: transparent !important;
  }
`;

export default function CareerPage() {
  return (
    <>
      <style jsx global>{customStyles}</style>

      {/* Base background */}
      <div className="career-bg" />

      {/* Career Roadmap Background */}
      <div className="career-roadmap">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Path gradients — reduced opacity values */}
            <linearGradient id="pathGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(59,130,246,0.35)"/>   {/* was 0.5 */}
              <stop offset="50%"  stopColor="rgba(139,92,246,0.35)"/>
              <stop offset="100%" stopColor="rgba(20,184,166,0.35)"/>
            </linearGradient>
            <linearGradient id="pathGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(236,72,153,0.22)"/>   {/* was 0.35 */}
              <stop offset="100%" stopColor="rgba(99,102,241,0.22)"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── PATH 1: ghost band — lighter fill ── */}
          <path
            d="M-20,180 C120,180 180,320 320,320 C460,320 500,160 640,160 C780,160 820,380 960,360 C1100,340 1140,200 1280,220 C1360,230 1420,280 1460,280"
            fill="none" stroke="rgba(59,130,246,0.05)" strokeWidth="28" strokeLinecap="round"
          />                                             {/* was 0.08 */}
          <path
            className="roadmap-path"
            d="M-20,180 C120,180 180,320 320,320 C460,320 500,160 640,160 C780,160 820,380 960,360 C1100,340 1140,200 1280,220 C1360,230 1420,280 1460,280"
            fill="none" stroke="url(#pathGrad1)" strokeWidth="2.5" strokeLinecap="round"
          />

          {/* ── PATH 2: ghost band — lighter fill ── */}
          <path
            d="M-20,680 C100,680 160,560 300,540 C440,520 500,680 640,700 C780,720 840,580 980,560 C1120,540 1180,680 1320,660 C1400,650 1440,620 1460,620"
            fill="none" stroke="rgba(139,92,246,0.04)" strokeWidth="22" strokeLinecap="round"
          />                                             {/* was 0.06 */}
          <path
            className="roadmap-path"
            d="M-20,680 C100,680 160,560 300,540 C440,520 500,680 640,700 C780,720 840,580 980,560 C1120,540 1180,680 1320,660 C1400,650 1440,620 1460,620"
            fill="none" stroke="url(#pathGrad2)" strokeWidth="2" strokeLinecap="round"
            style={{animationDelay: "-1.5s"}}
          />

          {/* ── MILESTONE 1 — Apply (blue) ── */}
          <circle cx="320" cy="320" r="10" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5" filter="url(#glow)"/>
          <circle className="pulse-1" cx="320" cy="320" r="10" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1.2"/>
          <circle cx="320" cy="320" r="5" fill="rgba(59,130,246,0.6)"/>
          <g className="lbl-1">
            <rect x="280" y="287" width="80" height="24" rx="12" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.22)" strokeWidth="1"/>
            <text x="320" y="303" textAnchor="middle" fill="rgba(59,130,246,0.75)" fontSize="10" fontWeight="700" fontFamily="system-ui">✦ Apply</text>
          </g>

          {/* ── MILESTONE 2 — Screen (purple) ── */}
          <circle cx="640" cy="160" r="10" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.35)" strokeWidth="1.5" filter="url(#glow)"/>
          <circle className="pulse-2" cx="640" cy="160" r="10" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="1.2"/>
          <circle cx="640" cy="160" r="5" fill="rgba(139,92,246,0.6)"/>
          <g className="lbl-2">
            <rect x="588" y="127" width="104" height="24" rx="12" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.22)" strokeWidth="1"/>
            <text x="640" y="143" textAnchor="middle" fill="rgba(139,92,246,0.75)" fontSize="10" fontWeight="700" fontFamily="system-ui">✦ Screening</text>
          </g>

          {/* ── MILESTONE 3 — Interview (teal) ── */}
          <circle cx="960" cy="360" r="10" fill="rgba(20,184,166,0.1)" stroke="rgba(20,184,166,0.35)" strokeWidth="1.5" filter="url(#glow)"/>
          <circle className="pulse-3" cx="960" cy="360" r="10" fill="none" stroke="rgba(20,184,166,0.2)" strokeWidth="1.2"/>
          <circle cx="960" cy="360" r="5" fill="rgba(20,184,166,0.6)"/>
          <g className="lbl-3">
            <rect x="908" y="327" width="104" height="24" rx="12" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.22)" strokeWidth="1"/>
            <text x="960" y="343" textAnchor="middle" fill="rgba(20,184,166,0.75)" fontSize="10" fontWeight="700" fontFamily="system-ui">✦ Interview</text>
          </g>

          {/* ── MILESTONE 4 — Offer (pink) ── */}
          <circle cx="1280" cy="220" r="10" fill="rgba(236,72,153,0.1)" stroke="rgba(236,72,153,0.35)" strokeWidth="1.5" filter="url(#glow)"/>
          <circle className="pulse-4" cx="1280" cy="220" r="10" fill="none" stroke="rgba(236,72,153,0.2)" strokeWidth="1.2"/>
          <circle cx="1280" cy="220" r="5" fill="rgba(236,72,153,0.6)"/>
          <g className="lbl-4">
            <rect x="1240" y="187" width="80" height="24" rx="12" fill="rgba(236,72,153,0.08)" stroke="rgba(236,72,153,0.22)" strokeWidth="1"/>
            <text x="1280" y="203" textAnchor="middle" fill="rgba(236,72,153,0.75)" fontSize="10" fontWeight="700" fontFamily="system-ui">✦ Offer</text>
          </g>

          {/* ── MILESTONE 5 — Join (orange) ── */}
          <circle cx="300" cy="540" r="8" fill="rgba(251,146,60,0.1)" stroke="rgba(251,146,60,0.3)" strokeWidth="1.5" filter="url(#glow)"/>
          <circle className="pulse-5" cx="300" cy="540" r="8" fill="none" stroke="rgba(251,146,60,0.2)" strokeWidth="1.2"/>
          <circle cx="300" cy="540" r="4" fill="rgba(251,146,60,0.6)"/>
          <g className="lbl-5">
            <rect x="260" y="510" width="80" height="22" rx="11" fill="rgba(251,146,60,0.08)" stroke="rgba(251,146,60,0.22)" strokeWidth="1"/>
            <text x="300" y="525" textAnchor="middle" fill="rgba(251,146,60,0.75)" fontSize="10" fontWeight="700" fontFamily="system-ui">✦ Join</text>
          </g>

          {/* ── MILESTONE 6 — Growth (emerald) ── */}
          <circle cx="980" cy="560" r="10" fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.35)" strokeWidth="1.5" filter="url(#glow)"/>
          <circle className="pulse-6" cx="980" cy="560" r="10" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1.2"/>
          <circle cx="980" cy="560" r="5" fill="rgba(52,211,153,0.6)"/>
          <g className="lbl-6">
            <rect x="930" y="527" width="100" height="24" rx="12" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.22)" strokeWidth="1"/>
            <text x="980" y="543" textAnchor="middle" fill="rgba(52,211,153,0.75)" fontSize="10" fontWeight="700" fontFamily="system-ui">✦ Growth</text>
          </g>

        </svg>
      </div>

      <div className="career-glow-tl" />
      <div className="career-glow-br" />

      {/* All page content */}
      <div className="career-content min-h-screen">

        <HeroSection />
        <div className="career-divider" />

        <CoreValues />
        <div className="career-divider" />

        <CareerCulture />
        <div className="career-divider" />

        <WhyAtorix />
        <div className="career-divider" />

        <section id="open-positions" className="py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OpenPositions />
          </div>
        </section>
        <div className="career-divider" />

        <CallToAction />
        <div className="career-divider" />

        <section id="job-application" className="py-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                Apply &amp; Start Your Journey
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                Fill out the form below to apply for a position at Atorix.
              </p>
            </div>

            {/* 3-col: left card | form | right card */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 items-stretch">

              {/* LEFT — Career growth tips */}
              <div className="hidden lg:flex flex-col rounded-2xl overflow-hidden border border-blue-400/20 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="relative flex-shrink-0 overflow-hidden" style={{height: "224px", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #162032 100%)"}}>
                  <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage: "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)", backgroundSize: "32px 32px"}} />
                  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none" style={{background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)"}} />
                  <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full pointer-events-none" style={{background: "radial-gradient(circle, rgba(20,184,166,0.20) 0%, transparent 65%)"}} />
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      <span className="text-xs font-bold tracking-widest uppercase" style={{color: "#34d399"}}>Actively Hiring</span>
                    </div>
                    <div>
                      <p className="text-white font-black leading-snug" style={{fontSize: "22px"}}>
                        "The best teams are built on trust, talent & shared vision."
                      </p>
                      <p className="mt-2 text-xs font-semibold" style={{color: "rgba(148,163,184,0.6)"}}>— Atorix Culture</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-foreground mb-5">💡 Tips for a Winning Application</p>
                    <ul className="space-y-3">
                      {[
                        { tip: "Tailor your resume to the specific role",    icon: "📄", color: "bg-blue-500/10 border-blue-400/20"     },
                        { tip: "Keep cover letter sharp — under 200 words",  icon: "✍️", color: "bg-purple-500/10 border-purple-400/20"  },
                        { tip: "Quantify achievements with real numbers",    icon: "📊", color: "bg-emerald-500/10 border-emerald-400/20" },
                        { tip: "Always upload resume in PDF format",         icon: "📎", color: "bg-orange-500/10 border-orange-400/20"   },
                        { tip: "Highlight your key tools & tech stack",      icon: "🛠️", color: "bg-pink-500/10 border-pink-400/20"       },
                        { tip: "Show passion — not just skills",             icon: "🔥", color: "bg-red-500/10 border-red-400/20"          },
                      ].map((item, i) => (
                        <li key={i} className={"flex items-center gap-3 px-4 py-3 rounded-xl border " + item.color}>
                          <span className="text-2xl flex-shrink-0">{item.icon}</span>
                          <span className="text-sm font-semibold text-foreground leading-snug">{item.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 pt-4 border-t border-blue-400/15">
                    <p className="text-base text-muted-foreground">⏱ We respond within <span className="text-blue-500 font-bold">3–5 business days</span></p>
                  </div>
                </div>
              </div>

              {/* CENTER — Form */}
              <div>
                <JobApplicationForm />
              </div>

              {/* RIGHT — Illustrated girl holding board */}
              <div className="hidden lg:flex flex-col rounded-2xl overflow-hidden border border-purple-400/20 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                <div className="relative flex-shrink-0 flex flex-col items-center justify-end px-4 pt-6 overflow-hidden" style={{minHeight: "320px", background: "linear-gradient(160deg, #f0e6ff 0%, #e0eaff 100%)"}}>
                  <div className="absolute top-3 right-5 text-2xl select-none">✦</div>
                  <div className="absolute top-8 left-5 text-lg text-purple-300 select-none">✦</div>
                  <div className="absolute top-16 right-8 w-3 h-3 rounded-full bg-pink-300" />
                  <div className="absolute top-5 left-16 w-2 h-2 rounded-full bg-indigo-300" />
                  <div className="relative z-10 w-full mb-1">
                    <div className="bg-white rounded-2xl shadow-xl border-[3px] border-purple-200 px-4 py-4 mx-3 text-center" style={{transform: "rotate(-1.5deg)"}}>
                      <p className="text-gray-900 font-black text-xl leading-tight tracking-tight">🎉 We are excited</p>
                      <p className="text-gray-900 font-black text-xl leading-tight">to onboard you!</p>
                      <p className="text-purple-500 text-xs font-bold mt-1">✨ Your journey starts here</p>
                    </div>
                  </div>
                  <img
                    src="https://illustrations.popsy.co/amber/woman-with-a-laptop.svg"
                    alt="Welcome to Atorix"
                    className="relative z-0 w-52 h-52 object-contain mt-1"
                    style={{filter: "brightness(1.1) saturate(1.2) contrast(1.05)"}}
                  />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-foreground mb-5">🌟 What Happens Next?</p>
                    <ul className="space-y-4">
                      {[
                        { step: "Application reviewed by our HR team",         num: "01", color: "text-blue-500",    bg: "bg-blue-500/10 border-blue-400/20"    },
                        { step: "Shortlisted? Expect a call within 5 days",    num: "02", color: "text-purple-500",  bg: "bg-purple-500/10 border-purple-400/20" },
                        { step: "Technical + culture fit interview round",      num: "03", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-400/20"},
                        { step: "Offer letter & onboarding within 2 weeks",    num: "04", color: "text-orange-500",  bg: "bg-orange-500/10 border-orange-400/20"  },
                      ].map((item, i) => (
                        <li key={i} className={"flex items-center gap-4 px-4 py-3 rounded-xl border " + item.bg}>
                          <span className={"text-2xl font-black flex-shrink-0 " + item.color}>{item.num}</span>
                          <span className="text-sm font-semibold text-foreground leading-snug">{item.step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 pt-4 border-t border-purple-400/15">
                    <p className="text-base text-muted-foreground">🌍 <span className="text-purple-500 font-bold">Remote & hybrid</span> roles available globally</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
}