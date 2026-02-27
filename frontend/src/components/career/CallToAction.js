"use client";

import { ArrowRight, Users, Briefcase, Clock, Sparkles, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const perks = [
  { icon: Users,     title: "Collaborative Culture", desc: "Work with a team that supports and inspires each other.",                  grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "rgba(139,92,246,0.3)"  },
  { icon: Briefcase, title: "Career Growth",          desc: "Clear paths for professional development and advancement.",               grad: "linear-gradient(135deg,#2563eb,#0ea5e9)", border: "rgba(59,130,246,0.3)"  },
  { icon: Clock,     title: "Flexible Work",          desc: "We believe in work-life balance and offer flexible schedules.",           grad: "linear-gradient(135deg,#059669,#14b8a6)", border: "rgba(16,185,129,0.3)"  },
  { icon: Globe,     title: "Global Impact",          desc: "Build products that reach millions of users across 15+ countries.",       grad: "linear-gradient(135deg,#ea580c,#f59e0b)", border: "rgba(245,158,11,0.3)"  },
  { icon: Zap,       title: "Fast-Paced Growth",      desc: "Join a company scaling 40% year-over-year with endless opportunities.",  grad: "linear-gradient(135deg,#db2777,#e11d48)", border: "rgba(236,72,153,0.3)"  },
  { icon: Sparkles,  title: "Innovation First",       desc: "Experiment freely in an environment that rewards bold thinking.",        grad: "linear-gradient(135deg,#4f46e5,#7c3aed)", border: "rgba(99,102,241,0.3)"  },
];

export default function CallToAction() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const mesh = dark
    ? {
        backgroundColor: "#08091a",
        backgroundImage: [
          "radial-gradient(ellipse 80% 60% at 10% 20%,  rgba(139,92,246,0.55)  0%, transparent 55%)",
          "radial-gradient(ellipse 60% 70% at 90% 10%,  rgba(59,130,246,0.50)  0%, transparent 55%)",
          "radial-gradient(ellipse 70% 50% at 50% 90%,  rgba(16,185,129,0.40)  0%, transparent 55%)",
          "radial-gradient(ellipse 50% 60% at 80% 70%,  rgba(245,158,11,0.35)  0%, transparent 55%)",
          "radial-gradient(ellipse 40% 40% at 20% 80%,  rgba(236,72,153,0.45)  0%, transparent 55%)",
        ].join(","),
        border: "1px solid rgba(139,92,246,0.35)",
      }
    : {
        backgroundColor: "#faf8ff",
        backgroundImage: [
          "radial-gradient(ellipse 80% 60% at 10% 20%,  rgba(167,139,250,0.45) 0%, transparent 60%)",
          "radial-gradient(ellipse 60% 70% at 90% 10%,  rgba(96,165,250,0.38)  0%, transparent 60%)",
          "radial-gradient(ellipse 70% 50% at 50% 90%,  rgba(52,211,153,0.32)  0%, transparent 60%)",
          "radial-gradient(ellipse 50% 60% at 80% 70%,  rgba(251,146,60,0.28)  0%, transparent 60%)",
          "radial-gradient(ellipse 40% 40% at 20% 80%,  rgba(236,72,153,0.25)  0%, transparent 60%)",
        ].join(","),
        border: "1px solid rgba(167,139,250,0.30)",
      };

  const leftPanel = dark
    ? { background: "rgba(8,9,26,0.45)", backdropFilter: "blur(24px)" }
    : { background: "rgba(255,255,255,0.40)", backdropFilter: "blur(24px)" };

  const perkCard = dark
    ? { background: "rgba(15,12,45,0.60)", backdropFilter: "blur(14px)" }
    : { background: "rgba(255,255,255,0.70)", backdropFilter: "blur(14px)" };

  const banner = dark
    ? { background: "rgba(8,9,26,0.65)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(139,92,246,0.25)" }
    : { background: "rgba(255,255,255,0.50)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(167,139,250,0.25)" };

  const divider = dark ? "rgba(139,92,246,0.25)" : "rgba(167,139,250,0.25)";
  const headingColor = dark ? "#ffffff" : "#111827";
  const subColor = dark ? "rgba(255,255,255,0.78)" : "#374151";
  const perkTitle = dark ? "#ffffff" : "#111827";
  const perkDesc = dark ? "rgba(255,255,255,0.65)" : "#6b7280";
  const bannerText = dark ? "rgba(255,255,255,0.70)" : "#374151";
  const bannerBold = dark ? "#ffffff" : "#111827";
  const bannerLink = dark ? "#c4b5fd" : "#7c3aed";
  const badgeBg = dark ? "rgba(139,92,246,0.20)" : "rgba(139,92,246,0.10)";
  const badgeBorder = dark ? "rgba(167,139,250,0.40)" : "rgba(167,139,250,0.30)";
  const badgeText = dark ? "#c4b5fd" : "#7c3aed";
  const contactBtn = dark
    ? { background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)", color: "#ffffff" }
    : { background: "rgba(255,255,255,0.70)", border: "1px solid rgba(167,139,250,0.30)", color: "#374151" };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={mesh}>

          {/* Grid */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT */}
            <div className="p-10 lg:p-14 flex flex-col justify-center" style={leftPanel}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit mb-6"
                style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}>
                <Sparkles className="w-4 h-4" />
                We're Hiring
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight" style={{ color: headingColor }}>
                Shape the Future{" "}
                <span style={{ background: "linear-gradient(90deg,#7c3aed,#2563eb,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  With Us
                </span>
              </h2>

              <p className="text-lg mb-8 leading-relaxed" style={{ color: subColor }}>
                We're always looking for passionate individuals who want to make a real impact.
                Explore our open roles or reach out — great talent is always welcome.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#open-positions"
                  className="flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 group shadow-lg"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}
                >
                  View Open Roles
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact"
                  className="flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl hover:opacity-90 transition-all duration-300"
                  style={contactBtn}
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-10 lg:p-14" style={{ borderLeft: `1px solid ${divider}` }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: headingColor }}>
                Why people love working here
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {perks.map((perk, i) => (
                  <div key={i}
                    className="flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ ...perkCard, border: `1px solid ${perk.border}` }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: perk.grad }}>
                      <perk.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: perkTitle }}>{perk.title}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: perkDesc }}>{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom banner */}
          <div className="px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3" style={banner}>
            <p className="text-sm" style={{ color: bannerText }}>
              <span className="font-bold" style={{ color: bannerBold }}>Don't see a role that fits?</span>{" "}
              We're growing fast and always looking for great talent.
            </p>
            <Link href="#job-application"
              className="flex items-center gap-1.5 text-sm font-bold transition-colors whitespace-nowrap group"
              style={{ color: bannerLink }}
            >
              Send us your resume
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}