"use client";

const values = [
  { title: "Innovation",    description: "We embrace change and encourage creative thinking to drive progress." },
  { title: "Excellence",    description: "We strive for the highest standards in everything we do." },
  { title: "Integrity",     description: "We conduct our business with honesty, transparency, and ethical behavior." },
  { title: "Collaboration", description: "We believe in the power of teamwork and mutual respect." },
  { title: "Passion",       description: "We are passionate about our work and committed to making a difference." },
  { title: "Impact",        description: "We focus on delivering meaningful results for our clients and community." },
];

export default function CoreValues() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Core Values</h2>
          <p className="mt-4 text-xl text-muted-foreground">The principles that guide everything we do</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div key={index} className="p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2 text-blue-500">{value.title}</h3>
              <p className="text-muted-foreground text-justify">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}