import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';
import { ShieldCheck, Sparkles, HeartHandshake, Truck } from 'lucide-react';

export default function AboutUs() {
  return (
    <InfoLayout 
      title="Our Story" 
      subtitle="Defining the future of premium online shopping and social commerce across Pakistan through curated quality and transparency."
    >
      <SEO 
        title="About ShopHub - Pakistan's Premier Social Shopping Marketplace" 
        description="Discover ShopHub.pro: Pakistan's destination for authentic tech, fashion, and social video shopping. Learn about our quality curation, buyer protection, and nationwide logistics."
        canonical="https://www.shophub.pro/about-us"
      />

      <div className="space-y-12 text-secondary dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Who We Are</h2>
          <p className="leading-relaxed">
            Founded with a vision to redefine e-commerce in Pakistan, <strong>ShopHub.pro</strong> is an innovative shopping platform that bridges the gap between digital discovery and doorstep reliability. We aren't just an online store; we are an immersive social marketplace where buyers explore real unboxing clips, authentic customer reviews, and curated collections from certified vendors.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-3">Our Mission</h3>
            <p className="text-sm leading-relaxed">
              To empower Pakistani consumers with genuine products, transparent pricing, and seamless Cash on Delivery (COD) services, eliminating the uncertainty commonly associated with local online shopping.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-3">Our Vision</h3>
            <p className="text-sm leading-relaxed">
              To become Pakistan's most trusted social e-commerce ecosystem, where video shopping, buyer protection, and fast delivery empower both consumers and local creators.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">The ShopHub Standard</h2>
          <p className="leading-relaxed mb-6">
            Every product in our catalog undergoes rigorous vendor verification. We partner with reputable distributors and local creators to guarantee that your delivery is authentic, durable, and accurately presented.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <HeartHandshake className="w-6 h-6 text-cyan-500 mb-2" />
              <h4 className="font-bold text-primary dark:text-white text-sm mb-1">Authenticity Guaranteed</h4>
              <p className="text-xs text-secondary dark:text-gray-400">Strict anti-counterfeit vendor vetting and genuine product warranties.</p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <Truck className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-bold text-primary dark:text-white text-sm mb-1">Nationwide Express</h4>
              <p className="text-xs text-secondary dark:text-gray-400">Fast 2–4 day delivery via TCS, Leopards, and Trax couriers with tracking.</p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <ShieldCheck className="w-6 h-6 text-green-500 mb-2" />
              <h4 className="font-bold text-primary dark:text-white text-sm mb-1">7-Day Warranty</h4>
              <p className="text-xs text-secondary dark:text-gray-400">Hassle-free replacement or refund on defective or mismatched deliveries.</p>
            </div>
          </div>
        </section>

        <div className="pt-10 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="font-bold text-primary dark:text-white italic">
            "ShopHub: Premium products, transparent service, delivered right to your doorstep."
          </p>
        </div>
      </div>
    </InfoLayout>
  );
}
