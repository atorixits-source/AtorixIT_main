"use client";

import { useState } from "react";

export default function ProcessSection() {
  

  const [activeStep, setActiveStep] = useState(steps[0]);

  return (
    <section className="py-2 bg-background">
      <div className="container mx-auto px-4">

        {/* Section Header */}
<div className="max-w-3xl mx-auto text-center mb-10">
  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
    {title}
  </h2>

  <p className="text-muted-foreground text-lg">
    {description}
  </p>
</div>


        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left: Circular Steps */}
{/* Left: Circular Steps */}
<div className="relative flex items-center justify-center h-[460px]">
  <div className="relative w-[360px] h-[360px] rounded-full border border-dashed border-border flex items-center justify-center">

    {steps.map((step, index) => {
      const isActive = activeStep.id === step.id;

      const angle = (360 / steps.length) * index - 90; // 12 o'clock start
      const radius = 160;

      const x = radius * Math.cos((angle * Math.PI) / 180);
      const y = radius * Math.sin((angle * Math.PI) / 180);

      return (
        <button
          key={step.id}
          onClick={() => setActiveStep(step)}
          style={{
            transform: `translate(${x}px, ${y}px)`
          }}
          className={`absolute w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all
            ${isActive
              ? "bg-primary text-white shadow-lg scale-110"
              : "bg-background border border-border hover:bg-primary/10"
            }`}
        >
          {/* Icon placeholder */}
          <span className="text-lg">
            🧩
          </span>

          {/* Step number */}
          <span className="text-[10px] opacity-80">
            {step.step}
          </span>
        </button>
      );
    })}

  </div>
</div>

          {/* Right: Detail Card */}
<div className="flex justify-center">
  <div className="w-full max-w-sm rounded-2xl border border-border p-6 bg-card shadow-lg">
    <h3 className="text-xl font-semibold mb-3">
      {activeStep.title}
    </h3>
    <p className="text-muted-foreground mb-5 text-sm">
      {activeStep.summary}
    </p>

    <ul className="space-y-2">
      {activeStep.points.map((point, index) => (
        <li
          key={index}
          className="flex items-start gap-2 text-sm"
        >
          <span className="text-primary mt-1">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
</div>

        </div>
      </div>
    </section>
  );
}
