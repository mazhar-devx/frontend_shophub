import InfoLayout from './InfoLayout';

export default function SizeGuide() {
  const sizes = [
    { label: "S", chest: "34-36\"", waist: "28-30\"" },
    { label: "M", chest: "38-40\"", waist: "32-34\"" },
    { label: "L", chest: "42-44\"", waist: "36-38\"" },
    { label: "XL", chest: "46-48\"", waist: "40-42\"" },
    { label: "XXL", chest: "50-52\"", waist: "44-46\"" }
  ];

  return (
    <InfoLayout 
      title="Size Guide" 
      subtitle="Ensuring the perfect fit for your HA Store collection. Follow our guide for precise measurements."
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Men's Apparel</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="py-4 text-sm font-black uppercase tracking-wider text-gray-400">Size</th>
                  <th className="py-4 text-sm font-black uppercase tracking-wider text-gray-400">Chest</th>
                  <th className="py-4 text-sm font-black uppercase tracking-wider text-gray-400">Waist</th>
                </tr>
              </thead>
              <tbody className="text-secondary dark:text-gray-300">
                {sizes.map(s => (
                  <tr key={s.label} className="border-b border-gray-50 dark:border-white/5 last:border-0">
                    <td className="py-4 font-bold">{s.label}</td>
                    <td className="py-4">{s.chest}</td>
                    <td className="py-4">{s.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
           <h2 className="text-xl font-bold text-primary dark:text-white mb-4">How to Measure</h2>
           <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase text-indigo-600 dark:text-indigo-400 mb-2">Chest</h3>
                <p className="text-sm text-secondary dark:text-gray-400">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-indigo-600 dark:text-indigo-400 mb-2">Waist</h3>
                <p className="text-sm text-secondary dark:text-gray-400">Measure around the narrowest part of your waist (usually where your body bends side to side), keeping the tape horizontal.</p>
              </div>
           </div>
        </section>

        <section className="text-center pt-10 border-t border-gray-100 dark:border-white/5">
           <p className="text-secondary dark:text-gray-500 text-sm">
             Between sizes? We recommend ordering the larger size for a more relaxed fit.
           </p>
        </section>
      </div>
    </InfoLayout>
  );
}
