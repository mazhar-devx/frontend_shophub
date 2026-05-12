import InfoLayout from './InfoLayout';

export default function PrivacyPolicy() {
  const sections = [
    { title: "1. Information We Collect", body: "We collect information you provide directly to us (name, email, shipping address) and information automatically collected through your use of the site (IP address, device data, browsing history)." },
    { title: "2. How We Use Your Data", body: "Your data is used to process orders, personalize your shopping experience, and communicate with you about updates and promotions. We do not sell your personal data to third parties." },
    { title: "3. Google One Tap & Authentication", body: "When you use Google One Tap to sign in, we receive your name, email, and profile picture from Google to create your account and simplify your login process. You can manage this at any time in your Google Account settings." },
    { title: "4. Cookies & Tracking", body: "We use essential cookies to keep you logged in and functional/analytics cookies to improve our performance. Marketing cookies (including those for Google AdSense) are only used with your explicit consent." },
    { title: "5. Your Data Rights", body: "You have the right to access, correct, or delete your personal information. To exercise these rights, please contact our privacy officer at privacy@hastore.pro." }
  ];

  return (
    <InfoLayout 
      title="Privacy Policy" 
      subtitle="Your privacy is the core of our trust. Here is how we protect and manage your data at HA Store."
    >
      <div className="space-y-10">
        <p className="text-secondary dark:text-gray-400 text-sm mb-8">Last Updated: May 12, 2026</p>
        
        {sections.map(section => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-primary dark:text-white mb-3">{section.title}</h2>
            <p className="text-secondary dark:text-gray-300 leading-relaxed text-sm md:text-base">
              {section.body}
            </p>
          </section>
        ))}

        <section className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 mt-10">
          <h2 className="text-xl font-bold text-primary dark:text-white mb-3">Cookie Consent Management</h2>
          <p className="text-sm text-secondary dark:text-gray-400 mb-6">
            You can update your cookie preferences at any time. We strictly adhere to GDPR and CCPA guidelines regarding user data and tracking.
          </p>
          <button 
            onClick={() => localStorage.removeItem('cookie-consent-preferences')}
            className="px-6 py-2 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-primary dark:text-white text-xs font-bold rounded-full hover:bg-gray-50 dark:hover:bg-black/60 transition-colors"
          >
            Reset Preferences
          </button>
        </section>
      </div>
    </InfoLayout>
  );
}
