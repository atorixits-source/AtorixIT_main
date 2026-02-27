import { motion } from "framer-motion";
import PulsingMapDots from "./PulsingMapDots";

export default function MapSection() {
  const mapRedirectUrl =
    "https://www.google.com/maps/place/Atorix+Company/@18.5921731,73.7809482,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2b9c964a13c6f:0xd35968d89b7c0807!8m2!3d18.5921731!4d73.7835231!16s%2Fg%2F11g1ppqs54?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D";

  return (
    <section className="py-10 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]"></div>
      <PulsingMapDots />

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold">Our Location</h2>
          <p className="text-muted-foreground mt-2">Find us on the map</p>
        </motion.div>

        <motion.div
          className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-border/40"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <iframe
            src="https://www.google.com/maps?q=18.5863803,73.7798&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Best SAP Training Institute in Pune"
          />
        </motion.div>

        {/* EXACT GOOGLE MAPS REDIRECTION */}
        <div className="text-center mt-6">
          <a
            href={mapRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            📍 Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
