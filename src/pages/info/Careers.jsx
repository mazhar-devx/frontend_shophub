import InfoLayout from './InfoLayout';

export default function Careers() {
  const perks = [
    { title: "Remote-First", desc: "Work from anywhere in the world with our distributed team." },
    { title: "Tech Stipend", desc: "Annual budget to upgrade your home office and tech stack." },
    { title: "Unlimited PTO", desc: "We value results over hours. Take time when you need it." },
    { title: "Equity Options", desc: "Grow with us. Every employee is a part-owner of HA Store." }
  ];

  return (
    <InfoLayout 
      title="Join the Future" 
      subtitle="We're looking for the bold, the curious, and the visionary to help us redefine social commerce."
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Our Culture</h2>
          <p className="text-secondary dark:text-gray-300 leading-relaxed">
            At HA Store, we operate at the intersection of speed and precision. We are a high-performance team that values radical transparency, ownership, and constant learning. If you thrive in fast-paced environments and love solving complex problems, you'll feel right at home.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {perks.map(perk => (
            <div key={perk.title} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-primary dark:text-white mb-2">{perk.title}</h3>
              <p className="text-sm text-secondary dark:text-gray-400 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-indigo-600 dark:bg-indigo-500 rounded-[2rem] p-10 text-center text-white">
          <h2 className="text-3xl font-black mb-4 tracking-tight">Open Positions</h2>
          <p className="mb-8 opacity-90">We are currently hiring for engineering, design, and marketing roles.</p>
          <a href="mailto:careers@hastore.pro" className="inline-block px-8 py-4 bg-white text-indigo-600 font-black rounded-full hover:scale-105 transition-transform shadow-xl">
            View Job Board
          </a>
        </section>

        <section className="text-center pt-10 border-t border-gray-100 dark:border-white/5">
          <p className="text-secondary dark:text-gray-500 text-sm italic">
            HA Store is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
