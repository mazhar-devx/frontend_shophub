import { Link } from "react-router-dom";

export default function Footer() {
  return (
      <footer className="relative mt-20 border-t border-white/10 bg-[#050505] overflow-hidden">
         {/* Ambient Lighting */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
            
            {/* Newsletter Section */}
            <div className="mb-16 pb-16 border-b border-white/5">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="text-center md:text-left relative z-10 w-full md:w-1/2">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Stay in the loop</h3>
                     <p className="text-gray-400">Join our newsletter for exclusive drops and future-tech news.</p>
                  </div>
                  
                  <div className="w-full md:w-1/2 relative z-10">
                     <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                        <input 
                           type="email" 
                           placeholder="Enter your email" 
                           className="flex-1 bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                        <button className="bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                           Subscribe
                        </button>
                     </form>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
               {/* Brand Column */}
               <div className="space-y-6">
                  <Link to="/" className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <img src="/logo.png" alt="HA Store" className="w-full h-full object-cover" />
                     </div>
                     <span className="text-2xl font-black text-white tracking-tighter">HA STORE</span>
                  </Link>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Experience the future of commerce. We curate the boldest tech, fashion, and lifestyle products for the visionaries of tomorrow.
                  </p>
                  <div className="flex space-x-4">
                     {[
                        { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                        { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01' },
                        { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' }
                     ].map((social) => (
                        <a key={social.name} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                           <svg className="h-4 w-4" fill={social.name === 'Instagram' ? 'none' : 'currentColor'} stroke={social.name === 'Instagram' ? 'currentColor' : 'none'} strokeWidth="2" viewBox="0 0 24 24">
                              <path d={social.icon} />
                              {social.name === 'Instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
                           </svg>
                        </a>
                     ))}
                  </div>
               </div>

               {/* Links Columns */}
               {[
                  { title: "Shop", links: ["All Products", "New Arrivals", "Best Sellers", "Flash Deals", "Accessories"] },
                  { title: "Support", links: ["Help Center", "Order Status", "Shipping & Returns", "Size Guide", "Contact Us"] },
                  { title: "Company", links: ["About Us", "Careers", "Privacy Policy", "Terms of Service", "Investors"] }
               ].map((column) => (
                  <div key={column.title}>
                     <h3 className="text-white font-bold text-lg mb-6">{column.title}</h3>
                     <ul className="space-y-4">
                        {column.links.map(link => (
                           <li key={link}>
                              <Link to="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">{link}</Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>

            <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex flex-col items-center md:items-start gap-2">
                  <p className="text-gray-500 text-sm">© {new Date().getFullYear()} HA Store. All rights reserved.</p>
                  <a 
                     href="https://linkedin.com/in/mazhar-devx" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 group transition-all"
                  >
                     <span className="text-gray-600 text-xs group-hover:text-gray-400 transition-colors">Created by</span>
                     <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold text-sm hover:opacity-80 transition-opacity flex items-center gap-1">
                        Mazhar Devx
                        <svg className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                     </span>
                  </a>
               </div>
               
               <div className="flex gap-4">
                   {['visa', 'mastercard', 'amex', 'paypal'].map(card => (
                      <div key={card} className="w-10 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                         {/* Placeholder for card icons - Just colored blocks for aesthetic in this demo */}
                         <div className={`w-6 h-3 rounded-sm ${card === 'visa' ? 'bg-blue-500' : card === 'mastercard' ? 'bg-orange-500' : card === 'amex' ? 'bg-cyan-500' : 'bg-blue-700'}`}></div>
                      </div>
                   ))}
               </div>
            </div>
         </div>
      </footer>
  );
}

