"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  X,
  Mail,
  HelpCircle,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingContactButtons() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(null);

  const phoneNumber = "+918956001555";

  // ---------------- SCROLL VISIBILITY ----------------
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
        setExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------- TOGGLES ----------------
  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    setTooltipVisible(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  // ---------------- CONTACT OPTIONS ----------------
  const contactOptions = [
    {
      id: "whatsapp",
      icon: <MessageCircle size={22} />,
      tooltip: "Message on WhatsApp",
      href: `https://wa.me/${phoneNumber.replace(/\+/g, "")}`,
      bg: "bg-green-500 hover:bg-green-600",
      external: true,
    },
    {
      id: "call",
      icon: <Phone size={22} />,
      tooltip: "Call us",
      href: `tel:${phoneNumber}`,
      bg: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "email",
      icon: <Mail size={22} />,
      tooltip: "Send Email",
      href: "mailto:info@atorix.in",
      bg: "bg-violet-500 hover:bg-violet-600",
      external: true,
    },
    {
      id: "help",
      icon: <HelpCircle size={22} />,
      tooltip: "Need Help?",
      href: "/contact",
      bg: "bg-amber-500 hover:bg-amber-600",
    },
  ];

  return (
    <div className="fixed left-5 bottom-5 z-50 flex flex-col items-end">
      {/* ⬆ SCROLL TO TOP */}
      <AnimatePresence>
        {expanded && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-3 p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-lg"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 🔘 CONTACT STACK */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="flex flex-col space-y-3 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {contactOptions.map((item) => (
              <motion.div
                key={item.id}
                className="relative"
                onMouseEnter={() => setTooltipVisible(item.id)}
                onMouseLeave={() => setTooltipVisible(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noopener noreferrer" : ""}
                  aria-label={item.tooltip}
                  className={`${item.bg} p-3 rounded-full text-white shadow-lg flex items-center justify-center transition-all`}
                >
                  {item.icon}
                </Link>

                {/* TOOLTIP */}
                {tooltipVisible === item.id && (
                  <div className="absolute left-full mr-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.tooltip}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 MAIN TOGGLE */}
      <motion.button
        onClick={toggleExpanded}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-4 rounded-full shadow-lg text-white transition-all ${
          expanded ? "bg-red-500 hover:bg-red-600" : "bg-primary"
        }`}
        aria-label="Toggle contact options"
      >
        {expanded ? <X size={24} /> : <Phone size={24} />}
      </motion.button>
    </div>
  );
}
