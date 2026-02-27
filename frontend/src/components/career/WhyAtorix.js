"use client";

import { Globe, TrendingUp, Users, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  { title: "Global Impact",   description: "Work on projects that reach millions of users worldwide. Your code will power solutions used across 15+ countries.", icon: Globe,       color: "text-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
  { title: "Rapid Growth",    description: "Join a company growing 40% year-over-year. We offer clear career paths and promotion opportunities based on merit.", icon: TrendingUp,  color: "text-purple-500",  bg: "bg-purple-500/10",  border: "border-purple-500/20"  },
  { title: "Expert Team",     description: "Collaborate with industry experts and thought leaders. Learn from the best in the field through mentorship programs.", icon: Users,       color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { title: "Meaningful Work", description: "Build products that solve real problems. See your work make a tangible difference in people's lives.",               icon: Target,      color: "text-orange-500",  bg: "bg-orange-500/10",  border: "border-orange-500/20"  },
];

const stats = [
  { value: 500,  suffix: "K+", label: "Users Served",        color: "from-blue-400 to-cyan-400"     },
  { value: 98,   suffix: "%",  label: "Client Satisfaction", color: "from-purple-400 to-pink-400"   },
  { value: 15,   suffix: "+",  label: "Countries",           color: "from-emerald-400 to-teal-400"  },
  { value: 40,   suffix: "%",  label: "Annual Growth",       color: "from-orange-400 to-yellow-400" },
];

// Animated counter hook
function useCounter(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
}

function StatCard({ stat, started }) {
  const count = useCounter(stat.value, 1800, started);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative text-center p-4 rounded-2xl cursor-default transition-all duration-300 ${
        hovered ? "bg-blue-500/15 scale-105" : "bg-blue-500/5 scale-100"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow behind number on hover */}
      {hovered && (
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-20 blur-md pointer-events-none`} />
      )}

      <p className={`relative text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent transition-all duration-300 ${hovered ? "drop-shadow-lg" : ""}`}>
        {count}{stat.suffix}
      </p>
      <p className={`relative text-sm mt-2 font-medium transition-colors duration-300 ${hovered ? "text-foreground" : "text-muted-foreground"}`}>
        {stat.label}
      </p>
    </div>
  );
}

export default function WhyAtorix() {
  const [started, setStarted] = useState(false);
  const cardRef = useRef(null);

  // Start counter when card scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">Why Atorix Stands Out</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover what makes Atorix the perfect place to build your career
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Features list */}
          <div className="space-y-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-12 h-12 ${f.bg} border ${f.border} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-justify">{f.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats card */}
          <div
            ref={cardRef}
            className="relative rounded-3xl overflow-hidden p-8 shadow-2xl shadow-blue-500/10 border border-blue-400/20 backdrop-blur-sm"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)" }}
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xl font-bold text-foreground">By the Numbers</h3>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map((stat, i) => (
                  <StatCard key={i} stat={stat} started={started} />
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-blue-400/20 mb-6" />

              {/* Testimonial */}
              <div className="relative p-5 rounded-2xl bg-blue-500/5 border border-blue-400/20 backdrop-blur-sm">
                <span className="absolute -top-4 left-4 text-5xl text-blue-400/30 font-serif leading-none select-none">"</span>
                <p className="text-sm leading-relaxed text-muted-foreground text-justify pt-2">
                  Joining Atorix was the best career decision I made. The growth opportunities and amazing team culture are unmatched.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">SC</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">Senior Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}