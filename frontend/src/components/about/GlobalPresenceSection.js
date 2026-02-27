"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Globe, Users, Building2 } from "lucide-react";

export default function GlobalPresenceSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-10 md:py-12 bg-muted/10 overflow-hidden">
      
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.025]" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-16 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
            Global Presence
          </span>

          <h2 className="text-3xl md:text-4xl mb-6 font-bold text-black dark:text-white relative">
            Serving Clients Around the World
            <span className="block mx-auto mt-2 h-[4px] w-1/5 bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Our international presence enables localized engagement while
            delivering the reliability, scale, and expertise of a global organization.
          </p>
        </motion.div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 md:gap-10">

          {/* LEFT — LOCATION BUTTONS */}
          <div
            className="
              space-y-3
              sm:grid sm:grid-cols-2 
              sm:gap-3 sm:space-y-0
              lg:block lg:space-y-3
  "
          >
            {locations.map((item, index) => (
              <button
                key={item.country}
                onClick={() => setActive(index)}
                className={`w-full rounded-xl px-4 py-3 md:px-5 md:py-4 text-left transition-all
                  ${
                    active === index
                      ? "bg-primary text-white shadow-lg"
                      : "bg-card border border-border/60 hover:border-primary/40"
                  }`}
              >
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5" />
                  <span className="text-base md:text-lg font-semibold">
                    {item.country}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT — DETAILS PANEL */}
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-card p-6 md:p-10 shadow-xl"
          >
            <div className="flex items-center mb-6">
              <MapPin className="h-8 w-8 text-primary mr-4" />
              <h3 className="text-2xl md:text-3xl font-semibold">
                {locations[active].country}
              </h3>
            </div>

            <p className="text-muted-foreground mb-4 leading-relaxed">
              {locations[active].address}
            </p>

            <p className="text-sm font-medium text-muted-foreground mb-8">
              Phone: {locations[active].phone}
            </p>

            {/* METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <Metric
                icon={<Users />}
                label="Clients Supported"
                value={locations[active].clients}
              />
              <Metric
                icon={<Building2 />}
                label="Office Type"
                value={locations[active].officeType}
              />
              <Metric
                icon={<Globe />}
                label="Coverage"
                value={locations[active].coverage}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* METRIC */

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-border/50 p-4 md:p-5 text-center">
      <div className="mx-auto mb-2 h-8 w-8 text-primary">
        {icon}
      </div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/* DATA */

const locations = [
  {
    country: "Pune, India",
    address:
      "Office #101, First Floor, Sai Square IT Park, Pune – 411057",
    phone: "+91 88055 63870",
    clients: "50+",
    officeType: "Delivery Center",
    coverage: "PCMC",
  },
  {
    country: "Mumbai, India",
    address:
      "4th Floor, Ram Niwas, B-405, Mumbai – 400001",
    phone: "+91 9004005382",
    clients: "50+",
    officeType: "Regional HQ",
    coverage: "Thane",
  },
];
