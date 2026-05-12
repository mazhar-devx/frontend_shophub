import InfoLayout from './InfoLayout';

export default function ShippingReturns() {
  return (
    <InfoLayout 
      title="Shipping & Returns" 
      subtitle="Everything you need to know about our global delivery and easy return process."
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Shipping Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="py-4 text-sm font-black uppercase tracking-wider text-gray-400">Method</th>
                  <th className="py-4 text-sm font-black uppercase tracking-wider text-gray-400">Timeframe</th>
                  <th className="py-4 text-sm font-black uppercase tracking-wider text-gray-400">Cost</th>
                </tr>
              </thead>
              <tbody className="text-secondary dark:text-gray-300">
                <tr className="border-b border-gray-50 dark:border-white/5">
                  <td className="py-4 font-bold">Standard Shipping</td>
                  <td className="py-4">5-7 Business Days</td>
                  <td className="py-4">$9.99 (Free over $150)</td>
                </tr>
                <tr className="border-b border-gray-50 dark:border-white/5">
                  <td className="py-4 font-bold">Express Delivery</td>
                  <td className="py-4">2-3 Business Days</td>
                  <td className="py-4">$19.99</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold">Next Day Air</td>
                  <td className="py-4">1 Business Day</td>
                  <td className="py-4">$34.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Easy Returns</h2>
          <p className="text-secondary dark:text-gray-300 leading-relaxed mb-6">
            We want you to love what you ordered. If you're not 100% satisfied, you can return your items within **30 days** of delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Initiate", d: "Go to your orders and click 'Request Return'." },
              { t: "Pack It", d: "Use the original packaging and include all tags." },
              { t: "Drop Off", d: "Use the prepaid label and drop it at any DHL/UPS." }
            ].map(step => (
              <div key={step.t} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase mb-2 block">{step.t}</span>
                <p className="text-sm text-secondary dark:text-gray-400">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-500/20">
          <h2 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Non-Returnation Items</h2>
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
