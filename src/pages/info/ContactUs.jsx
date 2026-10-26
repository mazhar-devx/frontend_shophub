import InfoLayout from './InfoLayout';
import SEO from '../../components/SEO';
import { Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <InfoLayout 
      title="Contact Customer Care" 
      subtitle="Have questions about an order, tracking, returns, or seller partnerships? We are here to help."
    >
      <SEO 
        title="Contact Us | ShopHub Customer Care & Support Pakistan" 
        description="Get in touch with ShopHub customer service. Reach us via email at care@shophub.pro, live WhatsApp assistance, order tracking support, or at our Karachi operations desk."
        canonical="https://www.shophub.pro/contact-us"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Contact Info */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Get in Touch</h2>
            <div className="space-y-8">
               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all flex-shrink-0">
                     <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white">Email Us</h3>
                    <p className="text-sm text-secondary dark:text-gray-400">care@shophub.pro</p>
                    <p className="text-xs text-gray-400 mt-0.5">Average response time: 2–4 hours</p>
                  </div>
               </div>

               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all flex-shrink-0">
                     <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white">Customer Support & WhatsApp</h3>
                    <p className="text-sm text-secondary dark:text-gray-400">+92 (321) 746-7482</p>
                    <p className="text-xs text-gray-400 mt-0.5">Direct order inquiries & verification</p>
                  </div>
               </div>

               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all flex-shrink-0">
                     <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white">Operations Center</h3>
                    <p className="text-sm text-secondary dark:text-gray-400">Suite 402, Business Avenue, Shahrah-e-Faisal</p>
                    <p className="text-xs text-gray-400 mt-0.5">Karachi 75400, Sindh, Pakistan</p>
                  </div>
               </div>
            </div>
          </section>

          <section className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
             <div className="flex items-center gap-3 mb-4">
                <Clock className="text-cyan-500 w-5 h-5" />
                <h2 className="text-lg font-bold text-primary dark:text-white">Operating Hours</h2>
             </div>
             <p className="text-sm text-secondary dark:text-gray-400 leading-relaxed mb-3">
               <strong>Monday – Saturday:</strong> 9:00 AM – 8:00 PM (PKT)<br />
               <strong>Sunday:</strong> Automated tracking and urgent order dispatch support.
             </p>
             <p className="text-xs text-gray-400">
               For order status, you can also view your live tracking number under the <a href="/my-orders" className="text-cyan-500 hover:underline">My Orders</a> dashboard.
             </p>
          </section>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-gray-50 dark:bg-white/[0.03] p-8 md:p-10 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner">
           {submitted ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                 <CheckCircle className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">Message Received</h3>
               <p className="text-sm text-secondary dark:text-gray-400 max-w-sm mx-auto">
                 Thank you for reaching out to ShopHub. Our customer care team will respond to your email within 24 hours.
               </p>
               <button 
                 onClick={() => setSubmitted(false)}
                 className="mt-6 text-xs font-bold text-cyan-500 hover:underline"
               >
                 Send another message
               </button>
             </div>
           ) : (
             <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Your Name"
                    className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Subject / Order ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Order #64f89... or Product Inquiry"
                    className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="How can we assist you today?"
                    className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all resize-none text-sm"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-white dark:bg-white dark:text-black font-black rounded-2xl hover:opacity-90 transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                  Send Message
                </button>
             </form>
           )}
        </div>
      </div>
    </InfoLayout>
  );
}
