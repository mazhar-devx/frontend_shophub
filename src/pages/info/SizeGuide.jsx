import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';

export default function SizeGuide() {
  const sizes = [
    { label: "S", chest: "36–38\"", waist: "28–30\"", length: "27\"" },
    { label: "M", chest: "38–40\"", waist: "32–34\"", length: "28\"" },
    { label: "L", chest: "42–44\"", waist: "36–38\"", length: "29\"" },
    { label: "XL", chest: "46–48\"", waist: "40–42\"", length: "30\"" },
    { label: "XXL", chest: "50–52\"", waist: "44–46\"", length: "31\"" }
  ];

  return (
    <InfoLayout 
      title="Apparel Size Guide" 
      subtitle="Ensuring the perfect fit for your ShopHub clothing and lifestyle collections. Follow our measurement chart below."
    >
      <SEO 
        title="Apparel Size Guide & Fitting Charts | ShopHub Pakistan" 
        description="Comprehensive clothing size chart for Men and Women on ShopHub Pakistan. Measure chest, waist, and length in inches to find your perfect fit."
        canonical="https://www.shophub.pro/size-guide"
      />

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Standard Apparel Measurements (Inches)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-gray-400">Size</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-gray-400">Chest</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-gray-400">Waist</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-gray-400">Length</th>
                </tr>
              </thead>
              <tbody className="text-secondary dark:text-gray-300 text-sm">
                {sizes.map(s => (
                  <tr key={s.label} className="border-b border-gray-50 dark:border-white/5 last:border-0">
                    <td className="py-4 font-bold text-primary dark:text-white">{s.label}</td>
                    <td className="py-4">{s.chest}</td>
                    <td className="py-4">{s.waist}</td>
                    <td className="py-4">{s.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
           <h2 className="text-xl font-bold text-primary dark:text-white mb-4">How to Measure Accurately</h2>
           <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400 mb-2">1. Chest</h3>
                <p className="text-xs text-secondary dark:text-gray-400 leading-relaxed">
                  Measure around the fullest part of your chest, keeping the tape horizontal under the arms.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 mb-2">2. Waist</h3>
                <p className="text-xs text-secondary dark:text-gray-400 leading-relaxed">
                  Measure around your natural waistline, where trousers or shalwar are comfortably worn.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-pink-600 dark:text-pink-400 mb-2">3. Length</h3>
                <p className="text-xs text-secondary dark:text-gray-400 leading-relaxed">
                  Measure from the highest point of your shoulder down to the desired bottom hemline.
                </p>
              </div>
           </div>
        </section>

        <section className="text-center pt-8 border-t border-gray-100 dark:border-white/5">
           <p className="text-secondary dark:text-gray-500 text-xs">
             Between sizes? We recommend selecting the larger size for a relaxed, comfortable fit. You can also contact support for sizing guidance on specific articles.
           </p>
        </section>
      </div>
    </InfoLayout>
  );
}
