import InfoLayout from './InfoLayout';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactUs() {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will get back to you within 24 hours. 🚀");
  };

  return (
    <InfoLayout 
      title="Contact Us" 
      subtitle="Have a question or just want to say hi? We'd love to hear from you."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Contact Info */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Get in Touch</h2>
            <div className="space-y-8">
               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white">Email Us</h3>
                    <p className="text-sm text-secondary dark:text-gray-400">support@hastore.pro</p>
                  </div>
               </div>

               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                     <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white">Call Us</h3>
                    <p className="text-sm text-secondary dark:text-gray-400">+92 (300) 123-4567</p>
                  </div>
               </div>

               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                     <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white">Visit Our Studio</h3>
                    <p className="text-sm text-secondary dark:text-gray-400">123 Tech Avenue, Future City, PK</p>
                  </div>
               </div>
            </div>
          </section>

          <section className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
             <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-indigo-500" />
                <h2 className="text-lg font-bold text-primary dark:text-white">Support Hours</h2>
             </div>
             <p className="text-sm text-secondary dark:text-gray-400 leading-relaxed">
               Our support team is active **24/7** for urgent order inquiries. General inquiries are answered Monday - Friday, 9:00 AM - 6:00 PM (GMT+5).
             </p>
          </section>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-gray-50 dark:bg-white/[0.03] p-8 md:p-10 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner">
           <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-xs"
              >
                Send Message
              </button>
           </form>
        </div>
      </div>
    </InfoLayout>
  );
}
