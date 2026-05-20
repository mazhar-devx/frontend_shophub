import InfoLayout from './InfoLayout';

export default function ShippingReturns() {
  return (
    <InfoLayout 
      title="Shipping & Returns" 
      subtitle="Everything you need to know about our express delivery and easy return process across Pakistan."
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Express Shipping Protocol</h2>
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <p className="text-secondary dark:text-gray-300 leading-relaxed mb-4">
              <strong className="text-primary dark:text-white">Shipping Partners:</strong> We proudly partner with Pakistan's premier courier services, including <strong>Leopard, TCS, and Trax</strong>, to ensure secure and trackable delivery nationwide.
            </p>
            <p className="text-secondary dark:text-gray-300 leading-relaxed">
              <strong className="text-primary dark:text-white">Delivery Window:</strong> Standard delivery takes <strong>3–5 working days</strong> from the moment of dispatch. Remote areas may require additional time.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Returns & Cancellations</h2>
          <p className="text-secondary dark:text-gray-300 leading-relaxed mb-6">
            We want you to love what you ordered. Our returns policy is designed for maximum transparency and trust.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Cancellations", d: "Orders can be canceled before dispatch by contacting our support via WhatsApp." },
              { t: "Returns", d: "If you receive a defective or incorrect item, you have 48 hours to initiate a return request with photographic evidence." },
              { t: "Refunds", d: "Approved refunds are processed within 7 working days to your original payment method or via bank transfer/mobile wallet." }
            ].map(step => (
              <div key={step.t} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase mb-2 block">{step.t}</span>
                <p className="text-sm text-secondary dark:text-gray-400">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-500/20">
          <h2 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Non-Returnable Items</h2>
          <ul className="text-sm text-red-800/70 dark:text-red-400/70 list-disc pl-5 space-y-1">
            <li>Personalized or custom-engraved products</li>
            <li>Intimate apparel and swimwear (for hygiene reasons)</li>
            <li>Final sale or clearance items</li>
          </ul>
        </section>
      </div>
    </InfoLayout>
  );
}
