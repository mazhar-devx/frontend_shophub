import InfoLayout from './InfoLayout';

export default function TermsOfService() {
  return (
    <InfoLayout 
      title="Terms of Service" 
      subtitle="The legal framework governing your journey with ShopHub.pro. Please read these carefully."
    >
      <div className="space-y-8 text-sm md:text-base text-secondary dark:text-gray-300">
        <section>
          <p className="leading-relaxed">
            Welcome to ShopHub.pro. By accessing our platform, you agree to these Terms of Service. ShopHub.pro operates as an independent retail and marketplace entity. All product specifications, brand names, and trademarks are the property of their respective owners. ShopHub.pro guarantees the delivery of goods as described, subject to local import regulations and stock availability. We reserve the right to cancel orders suspected of fraud or due to inventory discrepancies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">1. User Accounts</h2>
          <p className="leading-relaxed">
            You are responsible for maintaining the confidentiality of your account and password. ShopHub.pro reserves the right to terminate accounts that violate our community guidelines or engage in fraudulent activity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">2. Intellectual Property</h2>
          <p className="leading-relaxed">
            All content on this site, including designs, text, and graphics, is the property of ShopHub.pro. You may not reproduce, distribute, or create derivative works without our explicit written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">3. Limitation of Liability</h2>
          <p className="leading-relaxed">
            ShopHub.pro shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or any products purchased through it.
          </p>
        </section>

        <section className="pt-8 border-t border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-400">
            For further legal inquiries, please contact our legal department at legal@shophub.pro.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
