"use client";

import data from "./whySapServicesData.json";
import WhySapCard from "./WhySapCard";

export default function WhySapServices({ category, service }) {
  const filteredSections = data.sections.filter((section) => {
    if (category && service) {
      return section.category === category && section.id === service;
    }

    if (category) {
      return section.category === category;
    }

    return true;
  });

  return (
    <>
      {filteredSections.map((section) => (
        <section
          key={section.id}
          className="
            py-10
            bg-background
            dark:bg-[#020617]
            // text-justify
          "
        >
          <div className="max-w-7xl mx-auto px-4">

            {/* Heading */}
            <div className="text-center mb-20">
              {/* <h2 className="text-3xl font-bold text-foreground ">
                {section.heading}
              </h2> */}

              {/* <h2 className="group relative inline-block text-3xl font-bold mb-6 cursor-pointer">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide ">
                  {section.heading}
                </span>
              </h2> */}

                <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
                  {section.heading}
           <span className="block mx-auto mt-2 h-[4px] w-1/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
        </h2>

              <p className="text-muted-foreground max-w-3xl mx-auto mt-4 text-justify">
                {section.description}
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
              {section.points.map((point, index) => (
                <WhySapCard
                  key={index}
                  index={index}
                  icon={point.number}
                  title={point.title}
                  description={point.text}
                />
              ))}
            </div>

          </div>
        </section>
      ))}
    </>
  );
}
