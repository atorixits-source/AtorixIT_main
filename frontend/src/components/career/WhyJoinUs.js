"use client";

const benefits = [
  { icon: "🏆", title: "Competitive Salary",  description: "We offer industry-competitive compensation packages." },
  { icon: "🏡", title: "Flexible Work",        description: "Work from anywhere with our remote-friendly policies." },
  { icon: "📚", title: "Learning & Growth",    description: "Access to courses and conferences for your development." },
  { icon: "❤️", title: "Health Benefits",      description: "Comprehensive health insurance for you and your family." },
  { icon: "🎯", title: "Challenging Work",     description: "Work on meaningful projects that make a real impact." },
  { icon: "🤝", title: "Great Team",           description: "Collaborate with talented and passionate colleagues." },
];

export default function WhyJoinUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Join Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="p-6 rounded-xl border border-blue-400/15 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-blue-400/35 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{b.title}</h3>
              <p className="text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}