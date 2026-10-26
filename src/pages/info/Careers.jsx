import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';
import { Briefcase, MapPin, Laptop, Heart, Award } from 'lucide-react';

export default function Careers() {
  const perks = [
    { title: "Hybrid & Remote Flexibility", desc: "Collaborate seamlessly from anywhere in Pakistan with our modern digital infrastructure." },
    { title: "Learning & Development Stipend", desc: "Annual professional development budget to upgrade your engineering, design, or marketing skills." },
    { title: "Generous Leave Policy", desc: "We emphasize high-impact outcomes over rigid hours. Enjoy paid annual and medical leave." },
    { title: "Impact & Ownership", desc: "Directly shape the next generation of social e-commerce and creator platforms in Pakistan." }
  ];

  return (
    <InfoLayout 
      title="Careers at ShopHub" 
      subtitle="Help us build Pakistan's fastest-growing social e-commerce and live video shopping ecosystem."
    >
      <SEO 
        title="Careers & Job Openings | ShopHub Pakistan" 
        description="Explore career opportunities at ShopHub.pro. Join our engineering, design, operations, and marketing teams building the future of social commerce in Pakistan."
        canonical="https://www.shophub.pro/careers"
      />

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Our Culture</h2>
          <p className="text-secondary dark:text-gray-300 leading-relaxed">
            At ShopHub, we operate at the intersection of speed, technology, and customer delight. We are a fast-moving team passionate about solving the real-world challenges of Pakistani e-commerce: reliable delivery, transparent buyer-seller communication, and immersive social shopping. If you value ownership, craftsmanship, and continuous learning, you will fit right in.
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

        <section className="bg-gradient-to-br from-cyan-600 to-purple-600 rounded-[2rem] p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-black mb-3 tracking-tight">Open Opportunities</h2>
          <p className="mb-6 opacity-90 max-w-lg mx-auto text-sm leading-relaxed">
            We are actively expanding our software engineering, merchant onboarding, digital marketing, and logistics operations teams in Karachi and Lahore.
          </p>
          <a 
            href="mailto:careers@shophub.pro" 
            className="inline-block px-8 py-3.5 bg-white text-primary font-black rounded-full hover:scale-105 transition-transform shadow-xl text-xs uppercase tracking-wider"
          >
            Email Your CV to careers@shophub.pro
          </a>
        </section>

        <section className="text-center pt-8 border-t border-gray-100 dark:border-white/5">
          <p className="text-secondary dark:text-gray-500 text-xs italic">
            ShopHub is an equal opportunity employer. We celebrate diversity, meritocracy, and inclusion across all our recruitment decisions.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
