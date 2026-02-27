"use client";

import { Briefcase, MapPin, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { jobPositions as fallbackPositions } from "@/data/jobPositions";

export default function OpenPositions() {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_job_openings");
    if (stored) {
      const parsed = JSON.parse(stored);
      const activeJobs = parsed.filter((j) => j.status === "active");
      setPositions(activeJobs.length > 0 ? activeJobs : fallbackPositions);
    } else {
      setPositions(fallbackPositions);
    }
  }, []);

  return (
    <section className="py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4 mr-2" />
            Join Our Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-4 leading-tight">
            Current
            <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Find your perfect role and join our amazing team of innovators
          </p>
        </div>

        {positions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No open positions at the moment. Check back soon!
          </div>
        ) : (
          /*
            KEY FIX: Use CSS `columns` instead of grid.
            columns-1 on mobile, columns-2 on lg+.
            Each column is a completely independent flow — cards in column 1
            never affect the height or spacing of cards in column 2.
            `break-inside-avoid` prevents a card from being split across columns.
          */
          <div className="columns-1 lg:columns-2 gap-6 mb-10">
            {positions.map((position) => (
              <div key={position.id} className="break-inside-avoid mb-6 group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div
                  className="relative bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-blue-400/15 rounded-3xl p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/35 transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    setSelectedPosition(
                      selectedPosition?.id === position.id ? null : position
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{position.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>{position.department || "IT"}</span>
                            <span className="mx-2">•</span>
                            <span>{position.type || "Full-time"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {position.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          {position.experience}
                        </div>
                        {position.salary && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                            {position.salary}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 flex-shrink-0 ml-3">
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${selectedPosition?.id === position.id ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {selectedPosition?.id === position.id && (
                    <div className="mt-6 pt-6 border-t border-blue-400/15">
                      {position.description && (
                        <>
                          <h4 className="font-semibold text-foreground mb-3">Job Description</h4>
                          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                            {position.description}
                          </p>
                        </>
                      )}

                      <h4 className="font-semibold text-foreground mb-2">Requirements</h4>
                      <ul className="space-y-2 mb-4">
                        {(
                          Array.isArray(position.requirements) && position.requirements.length > 0
                            ? position.requirements
                            : [
                                "Bachelor's degree in a relevant field",
                                `${position.experience} of professional experience`,
                                "Strong problem-solving skills",
                                "Excellent communication and teamwork",
                                "Passion for learning and growth",
                              ]
                        ).map((item, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-muted-foreground text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="text-center py-2.5 px-5 bg-blue-500/10 border border-blue-400/20 text-muted-foreground rounded-lg text-sm">
                        Please contact us or use the application form below
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}