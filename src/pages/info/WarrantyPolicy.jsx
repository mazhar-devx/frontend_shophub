import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';
import { ShieldCheck, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WarrantyPolicy() {
  const coverageItems = [
    {
      title: "Manufacturing Defects",
      desc: "Any internal hardware fault, component malfunction, or manufacturing imperfection present upon delivery."
    },
    {
      title: "Dead on Arrival (DOA)",
      desc: "Products that fail to power on or function immediately out of the box."
    },
    {
      title: "Transit Damage & Flyer Tampering",
      desc: "Items broken, cracked, or visibly impaired during courier handling (must be reported within 48 hours with parcel photos)."
    },
    {
      title: "Specification or Color Mismatch",
      desc: "Items received that differ in model, size, color, or key technical specifications from the ordered listing."
    }
  ];

  const excludedItems = [
    "Accidental drops, liquid spills, cracked screens, or external physical pressure after delivery.",
    "Damage caused by unstable voltage, power surges, or non-certified fast chargers.",
    "Unauthorized third-party repairs, software modifications, bootloader unlocking, or firmware flashing.",
    "Normal cosmetic wear and tear, superficial scuffs, or fabric fading from repeated washing."
  ];

  return (
    <InfoLayout 
      title="Warranty & Guarantee Policy" 
      subtitle="ShopHub stands behind every product delivered across Pakistan. Learn how our 7-Day Checking Warranty and brand warranties protect your purchase."
    >
      <SEO 
        title="Warranty Policy & 7-Day Buyer Guarantee | ShopHub Pakistan" 
        description="ShopHub.pro Warranty Policy. Comprehensive 7-day checking warranty, official manufacturer warranties, hassle-free claim procedure, and replacement terms across Pakistan."
        canonical="https://www.shophub.pro/warranty"
      />

      <div className="space-y-12">
        {/* Banner */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-green-500/10 via-cyan-500/10 to-transparent border border-green-500/20 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary dark:text-white mb-2">ShopHub 7-Day Checking Warranty</h2>
            <p className="text-sm text-secondary dark:text-gray-300 leading-relaxed">
              Every customer is entitled to a full <strong>7 calendar days</strong> from the moment of courier delivery to thoroughly test and verify their purchase. If any fault is detected, we arrange a free replacement or full refund.
            </p>
          </div>
        </section>

        {/* Covered vs Not Covered */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-lg font-bold">What is Covered</h3>
            </div>
            <ul className="space-y-3">
              {coverageItems.map((item, idx) => (
                <li key={idx} className="text-xs md:text-sm text-secondary dark:text-gray-300">
                  <strong className="text-primary dark:text-white block mb-0.5">{item.title}</strong>
                  {item.desc}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-500/20">
            <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400">
              <AlertOctagon className="w-5 h-5" />
              <h3 className="text-lg font-bold">What is Not Covered</h3>
            </div>
            <ul className="space-y-3">
              {excludedItems.map((item, idx) => (
                <li key={idx} className="text-xs md:text-sm text-secondary dark:text-gray-400 flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Brand Warranties */}
        <section className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">Official Brand & Manufacturer Warranties</h2>
          <p className="text-sm text-secondary dark:text-gray-300 leading-relaxed mb-4">
            For products explicitly marked with extended brand warranties (e.g. 6-Month or 1-Year Official Warranty on select electronics, smartwatches, and headphones), warranty service extends well beyond our initial 7-day checking window.
          </p>
          <p className="text-xs text-secondary dark:text-gray-400 leading-relaxed">
            During this period, warranty claims are serviced either directly through the brand's authorized service centers in Pakistan or through ShopHub's customer care assistance desk. Always retain your original invoice and retail box.
          </p>
        </section>

        {/* Claim Steps */}
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">How to File a Warranty Claim</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Record Evidence", desc: "Take clear photos or a short video clip showing the defect alongside the product serial/packaging." },
              { step: "02", title: "Contact Care", desc: "Email care@shophub.pro or message our WhatsApp helpline (+92 321 746-7482) with your Order ID." },
              { step: "03", title: "Courier Return", desc: "Our team books a reverse courier pickup or provides drop-off instructions at no cost to you." },
              { step: "04", title: "Resolution", desc: "Upon inspection (24-48 hours), receive a brand new replacement unit or a 100% refund." }
            ].map((s) => (
              <div key={s.step} className="p-6 rounded-3xl bg-white dark:bg-black/30 border border-gray-100 dark:border-white/5 shadow-sm">
                <span className="text-cyan-500 font-black text-2xl block mb-2">{s.step}</span>
                <h4 className="font-bold text-primary dark:text-white text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-secondary dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <div className="text-center pt-8 border-t border-gray-100 dark:border-white/5">
          <p className="text-secondary dark:text-gray-400 text-sm mb-4">
            Need urgent assistance with a newly delivered product?
          </p>
          <Link 
            to="/contact-us" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity"
          >
            Contact Customer Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </InfoLayout>
  );
}
