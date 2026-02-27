"use client";

import caseStudies from "@/data/caseStudies.json";

export default function CaseStudySection({ category, service }) {
  const caseStudy = caseStudies.find(
    (item) => item.category === category && item.service === service
  );

  if (!caseStudy) return null;

  return (
    <section
      id={`case-study-${caseStudy.slug}`}
      className="py-10 border-t border-border"
    >
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-wide text-primary uppercase">
            Case Study
          </span>
    
 <h2 className=" text-3xl font-bold text-black dark:text-white relative">
                  {caseStudy.title}
            <span className="block mx-auto mt-2 h-[4px] w-1/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h2>
          {/* <h2 className="text-2xl md:text-3xl font-semibold mt-2">
            {caseStudy.title}
          </h2> */}
        </div>

        {/* Meta Cards */}
        <div className="flex flex-wrap gap-4 mb-10 text-justify">
          {caseStudy.client && (
            <MetaCard label="Client" value={caseStudy.client} />
          )}
          {caseStudy.clientType && (
            <MetaCard label="Client Type" value={caseStudy.clientType} />
          )}
          {caseStudy.industry && (
            <MetaCard label="Industry" value={caseStudy.industry} />
          )}
          {caseStudy.engagementDuration && (
            <MetaCard
              label="Engagement"
              value={caseStudy.engagementDuration}
            />
            
          )}
          {caseStudy.sapLandscape && (
            <MetaCard label="SAP" value={caseStudy.sapLandscape} />
          )}
          {caseStudy.thirdPartySystem && (
            <MetaCard
              label="Integration"
              value={caseStudy.thirdPartySystem}
            />
          )}
        </div>

        {/* Challenge */}
        <div className="mb-8 text-justify">
          <h3 className="text-lg font-medium mb-2">Challenge</h3>
          <p className="text-muted-foreground leading-relaxed">
            {caseStudy.challenge}
          </p>
        </div>

        {/* Solution */}
        <div className="mb-8 text-justify">
          <h3 className="text-lg font-medium mb-3">Atorix Solution</h3>
          <ul className="space-y-2">
            {caseStudy.solution.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outcome */}
        <div className="mb-10 text-justify">
          <h3 className="text-lg font-medium mb-3">Results</h3>
          <ul className="space-y-2">
            {caseStudy.outcome.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary text-sm">✓</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quote */}
        {caseStudy.quote && (
          <blockquote className="border-l-2 border-primary/30 pl-4 text-sm  text-muted-foreground text-justify">
            {caseStudy.quote}
          </blockquote>
        )}
      </div>
    </section>
  );
}

/* Meta Card Component */
function MetaCard({ label, value }) {
  return (
    <div className="min-h-[72px] px-5 py-3 rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="text-sm font-semibold text-foreground leading-tight mt-1">
        {value}
      </div>
    </div>
  );
}
