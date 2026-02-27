"use client";

import Image from "next/image";
import { useTheme } from "@/components/ui/theme-provider";

// Client logos
const clientLogos = [
  { name: "Binstellar", logo: "/images/clients/Binstellar.png" },
  { name: "Brihati", logo: "/images/clients/Brihati.png" },
  { name: "EPN", logo: "/images/clients/EPN.png" },
  { name: "Form6", logo: "/images/clients/Form6.png" },
  { name: "NXI", logo: "/images/clients/NXI.png" },
  { name: "SFMS", logo: "/images/clients/SFMS.png" },
  { name: "VPTechnoLabs", logo: "/images/clients/VPTechnoLabsFinal.png" },
  { name: "WebSeede", logo: "/images/clients/WebSeede.png" },
  { name: "Protergia", logo: "/images/clients/protergia.png" },
];

// automatic duplication for infinite marquee
const marqueeLogos = [...clientLogos, ...clientLogos];

export default function ClientsSection() {
  const { theme } = useTheme();

  return (
    <section className="py-10 md:py-12 border-t border-b border-border/60 bg-muted/30">
      <div className="container-custom">
        
        {/* Section header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Trusted Partners
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Our Clients
          </h2>
        </div>

        {/* Logo marquee */}
        <div className="relative w-full overflow-hidden">
          <div className="w-full overflow-hidden">
            <div className="animate-marquee inline-flex space-x-6 sm:space-x-10 lg:space-x-14 whitespace-nowrap">
              
              {marqueeLogos.map((client, index) => (
                <div key={index} className="flex items-center justify-center px-2 sm:px-3">
                  
                  {/* Responsive Logo Frame */}
                  <div
                    className="
                    flex items-center justify-center
                    h-[50px] w-[100px]
                      sm:h-[40px] sm:w-[100px]
                      lg:h-[52px] lg:w-[130px]
                    overflow-hidden
                    "
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={140}
                      height={70}
                      className={`
                      max-h-full max-w-full
                      object-contain block
                      transition-all duration-300
                      ${
                        theme === "dark"
                          ? "brightness-125 contrast-125"
                          : "grayscale opacity-80 hover:grayscale-0 hover:opacity-100"
                      }
                      `}
                    />
                  </div>

                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Client stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">100+</p>
            <p className="text-muted-foreground text-sm">Happy Clients</p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-primary">50+</p>
            <p className="text-muted-foreground text-sm">SAP Projects</p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-primary">25+</p>
            <p className="text-muted-foreground text-sm">Industries Served</p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-primary">10+</p>
            <p className="text-muted-foreground text-sm">Years Experience</p>
          </div>

        </div>
      </div>
    </section>
  );
}
