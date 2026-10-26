import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';
import { Truck, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ShippingReturns() {
  return (
    <InfoLayout 
      title="Shipping & Returns" 
      subtitle="Everything you need to know about our express delivery, courier partners, and easy return protocol across Pakistan."
    >
      <SEO 
        title="Shipping & Return Policy Pakistan | ShopHub" 
        description="Learn about ShopHub's express 2-4 day shipping across Pakistan with Leopard, TCS, and Trax couriers. Transparent delivery windows and easy 7-day checking returns."
        canonical="https://www.shophub.pro/shipping-returns"
      />

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Express Nationwide Shipping</h2>
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-4">
            <p className="text-secondary dark:text-gray-300 leading-relaxed">
              <strong className="text-primary dark:text-white">Shipping Partners:</strong> We partner with Pakistan's premier courier services, including <strong>TCS, Leopards Courier, and Trax Logistics</strong>, to ensure prompt, trackable, and insured deliveries nationwide.
            </p>
            <p className="text-secondary dark:text-gray-300 leading-relaxed">
              <strong className="text-primary dark:text-white">Delivery Timeline:</strong> Major urban hubs (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) receive parcels within <strong>2–3 business days</strong>. Second-tier cities and remote regions are served within <strong>3–5 business days</strong>.
            </p>
            <p className="text-secondary dark:text-gray-300 leading-relaxed">
              <strong className="text-primary dark:text-white">Shipping Rates:</strong> Flat-rate standard courier shipping is PKR 250 nationwide. Free express delivery applies automatically on qualified promotions and cart thresholds.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Returns & Cancellations</h2>
          <p className="text-secondary dark:text-gray-300 leading-relaxed mb-6">
            We want you to shop with total peace of mind. Every product on ShopHub comes with our buyer protection standard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                t: "Pre-Dispatch Cancellation", 
                d: "Orders can be canceled free of charge before courier dispatch by contacting support via WhatsApp with your Order ID." 
              },
              { 
                t: "7-Day Checking Warranty", 
                d: "If your item arrives physically damaged, functionally defective, or different from described, initiate a return within 7 days." 
              },
              { 
                t: "Direct Refunds", 
                d: "Approved refunds are transferred directly to your bank account, JazzCash, or Easypaisa wallet within 3–5 working days." 
              }
            ].map(step => (
              <div key={step.t} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-cyan-600 dark:text-cyan-400 font-black text-xs uppercase mb-2 block">{step.t}</span>
                <p className="text-sm text-secondary dark:text-gray-400 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-950/20 p-8 rounded-3xl border border-red-100 dark:border-red-500/20">
          <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold">Non-Returnable Exceptions</h2>
          </div>
          <ul className="text-sm text-red-800/80 dark:text-red-400/80 list-disc pl-5 space-y-1 leading-relaxed">
            <li>Products damaged due to customer misuse, water immersion, or unauthorized electrical modifications.</li>
            <li>Customized, engraved, or bespoke items made to individual order specifications.</li>
            <li>Intimate apparel, cosmetics, and innerwear due to personal hygiene regulations.</li>
          </ul>
        </section>
      </div>
    </InfoLayout>
  );
}
