import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-white/5 py-6 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-bold text-primary dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-cyan-500' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-secondary dark:text-gray-400 leading-relaxed text-sm md:text-base">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function HelpCenter() {
  const faqs = [
    { 
      question: "How does Cash on Delivery (COD) work across Pakistan?", 
      answer: "With Cash on Delivery, you pay the courier rider in Pakistani Rupees (PKR) only after they physically bring the parcel to your designated doorstep. We service all major cities including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and Quetta, as well as over 200+ towns nationwide." 
    },
    { 
      question: "How long does shipping take and which couriers do you use?", 
      answer: "Orders are dispatched within 24 hours via trusted logistics partners including TCS, Leopards Courier, and Trax. Delivery takes 2–4 business days depending on your city. Remote or rural districts may take 4–6 business days." 
    },
    { 
      question: "What is ShopHub's 7-Day Checking Warranty?", 
      answer: "Every order is covered by a 7-day checking warranty from the moment of delivery. If an item arrives physically damaged, functionally defective, or different from its product listing, contact customer care via WhatsApp or care@shophub.pro within 7 days for a hassle-free replacement or refund." 
    },
    { 
      question: "What payment methods are supported besides Cash on Delivery?", 
      answer: "In addition to Cash on Delivery, we support Direct Bank Transfer and secure Debit/Credit Card checkout (Visa, Mastercard, PayPak) protected by 3D Secure OTP verification." 
    },
    { 
      question: "How can I track my package in real-time?", 
      answer: "As soon as your package is dispatched, you will receive an SMS and email with your Consignment Tracking Number (CN). You can also view live tracking anytime in the 'My Orders' section of your ShopHub account." 
    },
    { 
      question: "Can I cancel my order before dispatch?", 
      answer: "Yes. You can cancel your order free of charge before it is dispatched by contacting customer support at care@shophub.pro or via WhatsApp at +92 (321) 746-7482 with your Order ID." 
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <InfoLayout 
      title="Help Center & FAQs" 
      subtitle="Find answers to common questions about Cash on Delivery, shipping timelines, returns, and order tracking across Pakistan."
    >
      <SEO 
        title="Help Center & Customer FAQs | ShopHub Pakistan" 
        description="Frequently Asked Questions about shopping on ShopHub Pakistan. Learn about Cash on Delivery (COD), TCS/Leopard delivery times, 7-day checking warranties, and returns."
        canonical="https://www.shophub.pro/help-center"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">Frequently Asked Questions</h2>
        {faqs.map(faq => (
          <FAQItem key={faq.question} {...faq} />
        ))}
        
        <div className="mt-16 p-8 bg-cyan-50 dark:bg-cyan-950/20 rounded-3xl text-center border border-cyan-100 dark:border-cyan-500/20">
           <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3">
             <MessageSquare className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Still need help?</h3>
           <p className="text-secondary dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
             Our Karachi customer support desk is available Monday through Saturday from 9:00 AM to 8:00 PM PKT.
           </p>
           <a href="/contact-us" className="inline-block px-8 py-3 bg-primary text-white dark:bg-white dark:text-black font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg">
              Contact Support Desk
           </a>
        </div>
      </div>
    </InfoLayout>
  );
}
