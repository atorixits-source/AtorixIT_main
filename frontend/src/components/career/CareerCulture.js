"use client";

const pillars = [
  { title: "Innovation",    desc: "We encourage creative thinking and new ideas that drive progress." },
  { title: "Collaboration", desc: "Teamwork makes the dream work. We achieve more together." },
  { title: "Growth",        desc: "Continuous learning and development opportunities for all team members." },
];

export default function CareerCulture() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Culture</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We foster a culture of innovation, collaboration, and continuous learning.
            Our team is our greatest asset, and we're committed to creating an environment
            where everyone can thrive and do their best work.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {pillars.map((p, i) => (
              <div key={i} className="p-6 rounded-xl border border-blue-400/15 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-blue-400/35 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-foreground mb-3">{p.title}</h3>
                <p className="text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}