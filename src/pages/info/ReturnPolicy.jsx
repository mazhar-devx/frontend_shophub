import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, RefreshCcw, Clock, CheckCircle, PackageX, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function ReturnPolicy() {
  const policySteps = [
    {
      icon: <Clock className="w-8 h-8 text-cyan-500" />,
      title: "14-Day Return Window",
      description: "You have 14 days from the date of delivery to initiate a return. Products must be in their original condition."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-500" />,
      title: "Condition Requirements",
      description: "Items must be unworn, unused, unwashed, and in the exact condition you received them with all original tags attached."
    },
    {
      icon: <PackageX className="w-8 h-8 text-pink-500" />,
      title: "Non-Returnable Items",
      description: "Intimate apparel, customized products, and final sale items cannot be returned due to hygiene and specific nature."
    },
    {
      icon: <RefreshCcw className="w-8 h-8 text-cyan-500" />,
      title: "Refund Processing",
      description: "Once your return is inspected and approved, a refund will be processed to your original payment method within 5-7 business days."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-primary dark:text-white pt-32 pb-20 relative overflow-hidden transition-colors duration-500">
      <Helmet>
        <title>Return Policy - ShopHub.pro</title>
        <meta name="description" content="ShopHub.pro Return and Refund Policy. Learn about our 14-day return window, condition requirements, and easy return process." />
      </Helmet>

      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 dark:bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-black/5 dark:bg-white/5 rounded-full mb-6 ring-1 ring-black/10 dark:ring-white/10">
            <ShieldCheck className="w-10 h-10 text-cyan-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
            Return & Refund Policy
          </h1>
          <p className="text-lg text-secondary dark:text-gray-400 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Our transparent return policy ensures a hassle-free experience if things don't work out.
          </p>
        </motion.div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {policySteps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-secondary dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Sections */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-12 bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-cyan-500 rounded-full"></span>
              How to Initiate a Return
            </h2>
            <div className="text-secondary dark:text-gray-400 space-y-4">
              <p>1. Log into your ShopHub.pro account and navigate to <Link to="/my-orders" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">My Orders</Link>.</p>
              <p>2. Select the order containing the item(s) you wish to return and click "Request Return".</p>
              <p>3. Choose the reason for return and submit your request.</p>
              <p>4. Once approved, you will receive an email with a return shipping label and instructions.</p>
              <p>5. securely pack the item(s) in the original packaging and attach the provided label.</p>
              <p>6. Drop off the package at the designated courier location.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
              Exchanges
            </h2>
            <p className="text-secondary dark:text-gray-400 leading-relaxed">
              We currently do not offer direct exchanges. If you need a different size, color, or item, please initiate a return for the original item and place a new order. This ensures the fastest processing time and guarantees the availability of the new item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
              Defective or Incorrect Items
            </h2>
            <p className="text-secondary dark:text-gray-400 leading-relaxed">
              In the rare event that you receive a defective, damaged, or incorrect item, please contact our support team immediately within 48 hours of delivery. We will prioritize your case and arrange for a replacement or a full refund, covering all return shipping costs.
            </p>
          </section>
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-3xl border border-cyan-500/30">
            <div>
              <h3 className="text-xl font-bold mb-2">Need further assistance?</h3>
              <p className="text-secondary dark:text-gray-400 mb-6">Our dedicated support team is here to help with your return queries.</p>
              <Link 
                to="/contact-us"
                className="inline-flex items-center justify-center gap-2 bg-primary dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
