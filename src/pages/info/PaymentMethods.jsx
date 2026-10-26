import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';
import { Banknote, CreditCard, ShieldCheck, RefreshCw, Smartphone, Building2 } from 'lucide-react';

export default function PaymentMethods() {
  const methods = [
    {
      icon: <Banknote className="w-8 h-8 text-green-500" />,
      title: "Cash on Delivery (COD)",
      desc: "Our most popular payment method across Pakistan. Pay cash to the courier rider only after they physically bring the parcel to your doorstep.",
      notes: "Available nationwide across 200+ cities and towns including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and Peshawar."
    },
    {
      icon: <Building2 className="w-8 h-8 text-cyan-500" />,
      title: "Online Bank Transfer (IBFT)",
      desc: "Transfer funds directly from any Pakistani bank account via mobile app or ATM (1Link / Raast network) for faster dispatch priority.",
      notes: "Bank account details are provided during checkout. Simply share your transaction screenshot via WhatsApp to confirm dispatch."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-orange-500" />,
      title: "Digital Wallets (JazzCash, Easypaisa, Nayapay, Sadapay)",
      desc: "Instant digital payments from your favorite Pakistani microfinance wallet. Fast, secure, and hassle-free.",
      notes: "Enjoy immediate confirmation with zero transaction surcharges on ShopHub promotions."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-purple-500" />,
      title: "Debit & Credit Cards (Visa, Mastercard, PayPak)",
      desc: "Pay securely with any local or international card. All card transactions are protected by 3D Secure 2.0 One-Time Password (OTP) verification.",
      notes: "ShopHub never stores full card numbers or CVV codes on our servers. Transactions are encrypted end-to-end via PCI-DSS certified gateways."
    }
  ];

  return (
    <InfoLayout 
      title="Payment Methods & Security" 
      subtitle="ShopHub provides secure, transparent, and flexible payment options tailored for online shoppers across Pakistan."
    >
      <SEO 
        title="Payment Methods | Cash on Delivery & Online Payments Pakistan - ShopHub" 
        description="Explore secure payment methods at ShopHub Pakistan: Cash on Delivery (COD), Direct Bank Transfer, Visa/Mastercard cards with 3D Secure OTP, and mobile wallets."
        canonical="https://www.shophub.pro/payment-methods"
      />

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Supported Payment Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {methods.map((m, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                <div>
                  <div className="mb-4">{m.icon}</div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-2">{m.title}</h3>
                  <p className="text-sm text-secondary dark:text-gray-400 leading-relaxed mb-4">{m.desc}</p>
                </div>
                <div className="pt-3 border-t border-black/5 dark:border-white/5 text-xs text-secondary dark:text-gray-500">
                  <strong>Coverage:</strong> {m.notes}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-500/20">
          <div className="flex items-center gap-3 mb-4 text-cyan-600 dark:text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-bold">100% Secure Checkout Guarantee</h2>
          </div>
          <p className="text-sm text-secondary dark:text-gray-300 leading-relaxed mb-4">
            Your online safety is paramount. Every electronic interaction with ShopHub is encrypted using enterprise-grade 256-bit TLS/SSL certificates. We partner exclusively with State Bank of Pakistan (SBP) regulated payment processors and logistics providers.
          </p>
          <ul className="text-xs text-secondary dark:text-gray-400 list-disc pl-5 space-y-1.5">
            <li>Zero hidden transaction fees or undisclosed surcharges.</li>
            <li>Mandatory OTP verification on all card payments.</li>
            <li>Verification phone calls for high-value Cash on Delivery orders to prevent fraudulent shipments.</li>
          </ul>
        </section>

        <section className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 mb-4 text-purple-600 dark:text-purple-400">
            <RefreshCw className="w-6 h-6" />
            <h2 className="text-xl font-bold">Refund Timelines & Policies</h2>
          </div>
          <p className="text-sm text-secondary dark:text-gray-400 leading-relaxed mb-4">
            If you return an item under our 7-Day Checking Warranty or cancel an order prior to dispatch, refunds are issued promptly via your preferred channel:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/5">
              <span className="font-bold text-primary dark:text-white block mb-1">Bank Transfer & Mobile Wallets</span>
              <p className="text-gray-500 dark:text-gray-400">Processed within <strong>2–4 business days</strong> once returned merchandise is inspected.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/5">
              <span className="font-bold text-primary dark:text-white block mb-1">Credit / Debit Cards</span>
              <p className="text-gray-500 dark:text-gray-400">Bank reversal completed within <strong>5–8 business days</strong> depending on your issuing bank.</p>
            </div>
          </div>
        </section>

        <section className="text-center pt-8 border-t border-gray-100 dark:border-white/5">
          <p className="text-secondary dark:text-gray-400 text-xs">
            Have questions about billing or payment verification? Contact our finance desk at <strong>care@shophub.pro</strong> or via WhatsApp at <strong>+92 (321) 746-7482</strong>.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
