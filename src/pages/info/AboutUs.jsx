import InfoLayout from './InfoLayout';

export default function AboutUs() {
  return (
    <InfoLayout 
      title="Our Story" 
      subtitle="Defining the future of premium retail through innovation, design, and a relentless pursuit of excellence."
    >
      <div className="space-y-12 text-secondary dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Who We Are</h2>
          <p className="leading-relaxed">
            Founded in 2024, HA Store emerged from a simple vision: to create a destination where technology meets lifestyle in its most premium form. We aren't just a retail platform; we are a curated gallery of innovation, serving the visionaries, the creators, and the trendsetters of the modern world.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-3">Our Mission</h3>
            <p className="text-sm leading-relaxed">
              To empower individuals through high-performance products that enhance daily life, seamlessly blending aesthetic beauty with functional brilliance.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-3">Our Vision</h3>
            <p className="text-sm leading-relaxed">
              To become the global benchmark for premium social commerce, where shopping is an immersive experience driven by community and cutting-edge technology.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">The HA Experience</h2>
          <p className="leading-relaxed mb-6">
            Every product in our collection undergoes a rigorous selection process. We partner with world-class manufacturers and designers to ensure that what reaches your doorstep is nothing short of exceptional.
          </p>
          <ul className="list-disc pl-6 space-y-3">
             <li><strong>Curated Quality:</strong> Only the top 1% of products make it to our store.</li>
             <li><strong>Eco-Innovation:</strong> We prioritize sustainable manufacturing and plastic-free packaging.</li>
             <li><strong>Community Driven:</strong> Our "Watch Me" social platform connects creators directly with the products they love.</li>
          </ul>
        </section>

        <div className="pt-10 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="font-bold text-primary dark:text-white italic">"We don't just sell products; we deliver the future."</p>
        </div>
      </div>
    </InfoLayout>
  );
}
