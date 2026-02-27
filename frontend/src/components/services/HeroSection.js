"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Palette, Code, Megaphone, BarChart, Users } from 'lucide-react';

// Mock data - EXACTLY AS PER ORIGINAL
const heroData = {
  services: {
    tagline: "Our Services",
    title: "OUR SERVICES",
    description: "From implementation to support, our range of services covers all aspects of SAP to help you achieve your digital transformation goals.",
    cards: [
      {
        id: 1,
        title: "SAP S/4HANA",
        color: "bg-gradient-to-br from-purple-500 to-purple-700",
        details: {
          description: "Next-generation ERP suite that transforms your business processes with intelligent automation and real-time insights.",
          features: ["Digital Core Implementation", "Migration Services", "Process Optimization", "Real-time Analytics"],
        }
      },
      {
        id: 2,
        title: "SAP BTP",
        color: "bg-gradient-to-br from-blue-500 to-blue-700",
        details: {
          description: "Business Technology Platform that connects data, processes, and people to accelerate digital transformation.",
          features: ["Integration Platform", "Extension Development", "Data & Analytics", "AI/ML Services"],
        }
      },
      {
        id: 3,
        title: "SAP B1",
        color: "bg-gradient-to-br from-orange-500 to-red-600",
        details: {
          description: "Comprehensive business management solution designed specifically for small and medium enterprises.",
          features: ["Financial Management", "Sales & CRM", "Inventory Control", "Reporting & Analytics"],
        }
      },
      {
        id: 4,
        title: "SAP FICO",
        color: "bg-gradient-to-br from-green-500 to-emerald-600",
        details: {
          description: "Financial accounting and controlling module that provides complete financial management capabilities.",
          features: ["General Ledger", "Accounts Payable/Receivable", "Cost Center Accounting", "Financial Reporting"],
        }
      },
      {
        id: 5,
        title: "SAP Consulting", 
        color: "bg-gradient-to-br from-indigo-500 to-purple-600",
        details: {
          description: "Expert SAP consulting services to guide your digital transformation journey and optimize business processes.",
          features: ["Implementation Strategy", "Process Optimization", "Change Management", "Training & Support"],
        }
      }
    ]
  }
};

export default function HeroSection() {
  const { tagline, title, description, cards } = heroData.services;
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-12 md:py-16 relative bg-white dark:bg-black overflow-hidden">
      {/* Original Enhanced Glassmorphism Background - UNCHANGED */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/8 to-indigo-500/8 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 sm:right-10 w-52 h-52 sm:w-80 sm:h-80 bg-gradient-to-r from-cyan-500/6 to-blue-600/6 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-4 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-600/6 to-sky-500/6 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[600px] sm:h-[600px] max-w-[600px] max-h-[600px] bg-gradient-to-r from-blue-400/4 to-cyan-400/4 rounded-full filter blur-3xl opacity-30 dark:opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 xl:px-12 relative z-10 h-full max-w-7xl">
        
        {/* Mobile View - FIXED FOR EVEN CARD HEIGHTS */}
        <div className="lg:hidden flex flex-col py-4 px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md shadow-lg shadow-blue-900/15 px-4 py-2 text-sm font-medium text-black dark:text-white relative mb-4">
              <motion.span 
                className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {tagline}
            </div>
            <h1 className="text-3xl font-extrabold mb-3 text-black dark:text-white relative tracking-tight">{title}</h1>
            <p className="text-base text-black-300 mb-8 leading-relaxed px-2">{description}</p>
          </motion.div>

          <div className="flex-1 overflow-y-auto pb-6 -mx-2">
            {/* ✅ FIXED: Added flex container with equal heights */}
            <div className="flex flex-col space-y-4 px-2">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-300/15 relative overflow-hidden flex flex-col"
                  style={{ minHeight: '220px' }} // ✅ FIXED: Set consistent minimum height
                >
                  <div className="absolute inset-0 bg-cover bg-center" style={{
                    backgroundImage: `url(${
                      index === 0 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746274/The-10-Biggest-Technology-Trends-That-Will-Transform-The-Next-Decade_kd5zio.jpg' :
                      index === 1 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746640/loi-ich-cua-SAP_nsfvdy.webp' :
                      index === 2 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757661617/90983c0228417c6649e48be1b3ceefe9_bjzkal.jpg' :
                      index === 3 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746821/strapi-assets-tech_a34b41e7f9_kcehed.jpg' :
                      'https://res.cloudinary.com/deni4qbla/image/upload/v1757747156/digital_technology_background_modern_silhouette_3d_design_6837527_cvachc.jpg'
                    })`
                  }}>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                  </div>
                  {/* ✅ FIXED: Added flex-1 to grow content and mt-auto to push button down */}
                  <div className="relative z-10 p-5 flex flex-col flex-1">
                    <div className="flex-1 flex flex-col justify-end">
                      <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-200 mb-3 line-clamp-2 text-justify">{card.details.description}</p>
                    </div>
                    <button className="w-fit py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full transition-colors flex items-center mt-auto">
                      Learn More <ArrowRight className="ml-1.5 w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - COMPLETELY SEPARATE LAYERS */}
        <div className="hidden lg:block relative w-full min-h-[460px]">

          {/* LEFT TEXT — ONLY WHEN NO CARD IS ACTIVE */}
          {hoveredCard === null && (
            <div
              className="absolute left-0 top-0 z-20"
              style={{ width: '450px' }}
            >
              {/* TAGLINE */}
              <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md shadow-lg shadow-blue-900/15 px-4 py-2 text-sm font-medium text-black dark:text-white mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                {tagline}
              </div>

              {/* TITLE */}
              <h1 className="text-6xl font-extrabold mb-6 text-black dark:text-white tracking-tight leading-tight">
                {title}
              </h1>

              {/* DESCRIPTION */}
              <p className="text-lg text-black-300 mb-8 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* CARDS LAYER */}
          <div className="absolute top-0 right-0 w-[55%] z-10">
            <motion.div
              initial={false}
              animate={{
                width: hoveredCard !== null ? 'calc(100vw - 12rem)' : '100%',
                marginLeft: hoveredCard !== null ? 'calc(-45vw + 6rem)' : '0'
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div
                className="flex flex-nowrap items-center justify-center w-full min-h-[500px]"
                onMouseLeave={() => setHoveredCard(null)}
              >
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="relative flex-shrink-0"
                    style={{ padding: '0 6px' }}
                    onMouseEnter={() => setHoveredCard(index)}
                  >
                    <motion.div
                      animate={{
                        width: hoveredCard === index ? 420 : 100,
                        height: 480,
                        scale: hoveredCard !== null && hoveredCard !== index ? 0.95 : 1,
                        opacity: hoveredCard !== null && hoveredCard !== index ? 0.7 : 1
                      }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                      className="bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-xl rounded-2xl shadow-2xl cursor-pointer relative overflow-hidden border border-blue-300/15"
                    >
                      {/* Background */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${
                            index === 0
                              ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746274/The-10-Biggest-Technology-Trends-That-Will-Transform-The-Next-Decade_kd5zio.jpg'
                              : index === 1
                              ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746640/loi-ich-cua-SAP_nsfvdy.webp'
                              : index === 2
                              ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757661617/90983c0228417c6649e48be1b3ceefe9_bjzkal.jpg'
                              : index === 3
                              ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746821/strapi-assets-tech_a34b41e7f9_kcehed.jpg'
                              : 'https://res.cloudinary.com/deni4qbla/image/upload/v1757747156/digital_technology_background_modern_silhouette_3d_design_6837527_cvachc.jpg'
                          })`
                        }}
                      >
                        <div className="absolute inset-0 bg-black/40" />
                      </div>

                      {/* Gradient */}
                      <div
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-900/90 via-blue-800/40 to-transparent"
                        style={{
                          height:
                            index === 0
                              ? '30%'
                              : index === 1
                              ? '50%'
                              : index === 2
                              ? '65%'
                              : index === 3
                              ? '80%'
                              : '90%'
                        }}
                      />

                      {/* CARD CONTENT - FIXED POSITIONING */}
                      {hoveredCard !== index ? (
                        // Collapsed state - vertical text
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 
                            className="text-sm font-bold text-white drop-shadow-lg uppercase tracking-widest"
                            style={{
                              writingMode: 'vertical-rl',
                              transform: 'rotate(180deg)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {card.title}
                          </h3>
                        </div>
                      ) : (
                        // Expanded state - full content with FIXED width
                        <div className="absolute inset-0 p-6">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="h-full flex flex-col justify-between"
                            style={{ width: '372px' }} // Fixed width: 420px card - 24px padding on each side
                          >
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-2xl drop-shadow-lg" style={{ fontSize: '1.5rem', lineHeight: '2rem' }}>
                                {card.title}
                              </h4>
                              <p className="text-white/90 leading-relaxed drop-shadow-md" style={{ fontSize: '0.875rem', lineHeight: '1.5rem' }}>
                                {card.details.description}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-white font-semibold drop-shadow-md" style={{ fontSize: '0.875rem' }}>
                                Key Features:
                              </h5>
                              <ul className="space-y-2">
                                {card.details.features.map((feature, i) => (
                                  <li
                                    key={i}
                                    className="text-white/80 flex items-center gap-2"
                                    style={{ fontSize: '0.75rem' }}
                                  >
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}