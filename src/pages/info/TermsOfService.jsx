import InfoLayout from './InfoLayout';

export default function TermsOfService() {
  return (
    <InfoLayout 
      title="Terms of Service" 
      subtitle="The legal framework governing your journey with HA Store. Please read these carefully."
    >
      <div className="space-y-8 text-sm md:text-base text-secondary dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing or using the HA Store platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you are prohibited from using the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">2. User Accounts</h2>
          <p className="leading-relaxed">
            You are responsible for maintaining the confidentiality of your account and password. HA Store reserves the right to terminate accounts that violate our community guidelines or engage in fraudulent activity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">3. Intellectual Property</h2>
          <p className="leading-relaxed">
            All content on this site, including designs, text, and graphics, is the property of HA Store. You may not reproduce, distribute, or create derivative works without our explicit written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">4. Limitation of Liability</h2>
          <p className="leading-relaxed">
            HA Store shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or any products purchased through it.
          </p>
        </section>

        <section className="pt-8 border-t border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-400">
            For further legal inquiries, please contact our legal department at legal@hastore.pro.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
