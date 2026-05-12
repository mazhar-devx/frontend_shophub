import InfoLayout from './InfoLayout';
import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-white/5 py-6 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-primary dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {question}
        </span>
        <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
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
    { question: "How can I track my order?", answer: "Once your order is shipped, you will receive an email with a tracking number and a link to our tracking portal. You can also view your order status in the 'My Orders' section of your profile." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are encrypted and processed securely." },
    { question: "Can I cancel my order?", answer: "Orders can be canceled within 1 hour of placement. After that, they enter our processing stage and cannot be modified. Please contact support immediately if you need assistance." },
    { question: "Do you ship internationally?", answer: "Yes, HA Store ships to over 50 countries worldwide. Shipping times and costs vary depending on the destination and will be calculated at checkout." },
    { question: "How do I return a product?", answer: "We offer a 30-day return window for all unused items in their original packaging. Simply go to our 'Shipping & Returns' page to initiate a return request." }
  ];

  return (
    <InfoLayout 
      title="Help Center" 
      subtitle="Find answers to your questions or get in touch with our dedicated support team."
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">Frequently Asked Questions</h2>
        {faqs.map(faq => (
          <FAQItem key={faq.question} {...faq} />
        ))}
        
        <div className="mt-16 p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl text-center border border-indigo-100 dark:border-indigo-500/20">
           <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">Still need help?</h3>
           <p className="text-indigo-700/70 dark:text-indigo-400/70 text-sm mb-6">Our experts are available 24/7 via live chat or email.</p>
           <a href="/contact-us" className="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
              Contact Support
           </a>
        </div>
      </div>
    </InfoLayout>
  );
}
