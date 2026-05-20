import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {

  return (
      <footer className="relative mt-20 border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#050505] overflow-hidden transition-colors duration-500">
         {/* Ambient Lighting */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 dark:bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/5 dark:bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
            
            {/* Newsletter Section */}
            <div className="mb-16 pb-16 border-b border-black/5 dark:border-white/5">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-black/5 dark:bg-white/5 p-8 md:p-12 rounded-3xl border border-black/5 dark:border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="text-center md:text-left relative z-10 w-full md:w-1/2">
                     <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-2">Stay in the loop</h3>
                     <p className="text-secondary dark:text-gray-400">Join our newsletter for exclusive drops and future-tech news.</p>
                  </div>
                  
                  <div className="w-full md:w-1/2 relative z-10">
                     <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                        <input 
                           type="email" 
                           placeholder="Enter your email" 
                           aria-label="Newsletter email"
                           className="flex-1 bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all font-medium"
                        />
                        <button aria-label="Subscribe to newsletter" className="bg-primary dark:bg-white text-white dark:text-black font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                           Subscribe
                        </button>
                     </form>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
               {/* Brand Column */}
               <div className="space-y-6">
                  <Link to="/" className="flex items-center gap-2" aria-label="ShopHub.pro Home">
                     <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg">
                        <img src="/logo.png" alt="ShopHub.pro Logo" className="w-full h-full object-cover dark:invert-0 invert transition-all duration-500" />
                     </div>
                     <span className="text-2xl font-black text-primary dark:text-white tracking-tighter uppercase">SHOPHUB</span>
                  </Link>
                  <p className="text-secondary dark:text-gray-400 text-sm leading-relaxed">
                     Experience the future of commerce. We curate the boldest tech, fashion, and lifestyle products for the visionaries of tomorrow.
                  </p>
                  <div className="text-secondary dark:text-gray-400 text-xs mt-4 space-y-1 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                     <p><strong className="text-primary dark:text-gray-300">Business Registration:</strong> SHP-2026-98745</p>
                     <p><strong className="text-primary dark:text-gray-300">Warehouse Location:</strong> Karachi, Pakistan</p>
                     <p><strong className="text-primary dark:text-gray-300">Support Email:</strong> care@shophub.pro</p>
                  </div>
                  <div className="flex space-x-4">
                     {[
                        { name: 'Facebook', url: 'https://facebook.com/shophub.pro', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                        { name: 'Instagram', url: 'https://instagram.com/shophub.pro', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01' },
                        { name: 'TikTok', url: 'https://tiktok.com/@shophub.pro', icon: 'M9 0h1.98c.144 2.58 1.97 4.773 4.54 5.342v2.324c-1.353-.024-2.583-.49-3.568-1.258v7.871c0 3.737-3.033 6.77-6.771 6.77-3.738 0-6.77-3.033-6.77-6.77S4.444 7.51 8.182 7.51c.365 0 .717.03 1.06.084v2.404c-.34-.055-.69-.084-1.06-.084-2.428 0-4.397 1.97-4.397 4.396 0 2.428 1.969 4.397 4.397 4.397 2.429 0 4.397-1.969 4.397-4.397V0h-.88z' }
                     ].map((social) => (
                        <a 
                          key={social.name} 
                          href={social.url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow us on ${social.name}`} 
                          className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all hover:-translate-y-1"
                        >
                           <svg className="h-4 w-4" fill={social.name === 'Instagram' || social.name === 'TikTok' ? 'currentColor' : 'none'} stroke={social.name === 'Facebook' ? 'currentColor' : 'none'} strokeWidth={social.name === 'Facebook' ? "2" : "0"} viewBox="0 0 24 24">
                              <path d={social.icon} />
                              {social.name === 'Instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />}
                           </svg>
                        </a>
                     ))}
                  </div>
               </div>

                {/* Links Columns */}
                {[
                   { 
                      title: "Shop", 
                      links: [
                        { name: "All Products", path: "/products" },
                        { name: "New Arrivals", path: "/products?sortBy=newest" },
                        { name: "Best Sellers", path: "/products?sortBy=rating" },
                        { name: "Flash Deals", path: "/deals" },
                        { name: "Accessories", path: "/products?category=accessories" }
                      ] 
                   },
                   { 
                      title: "Support", 
                      links: [
                        { name: "Help Center", path: "/help-center" },
                        { name: "Order Status", path: "/my-orders" },
                        { name: "Shipping & Returns", path: "/shipping-returns" },
                        { name: "Size Guide", path: "/size-guide" },
                        { name: "Contact Us", path: "/contact-us" }
                      ] 
                   },
                   { 
                      title: "Company", 
                      links: [
                        { name: "About Us", path: "/about-us" },
                        { name: "Careers", path: "/careers" },
                        { name: "Journal", path: "/blog" },
                        { name: "Privacy Policy", path: "/privacy-policy" },
                        { name: "Skills Career", path: "/skills-career" },
                        { name: "Terms of Service", path: "/terms-of-service" }
                      ] 
                   }
                ].map((column) => (
                   <div key={column.title}>
                      <h3 className="text-primary dark:text-white font-bold text-lg mb-6">{column.title}</h3>
                      <ul className="space-y-4">
                         {column.links.map(link => (
                            <li key={link.name}>
                               <Link 
                                to={link.path}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-sm text-secondary dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                              >
                                {link.name}
                              </Link>
                            </li>
                         ))}
                      </ul>
                   </div>
                ))}
            </div>

            {/* Ultra-Professional Portfolio Link Section */}
            <div className="mt-16 flex justify-center md:justify-start">
               <a href="/mazhar.devx/index.html" className="group flex items-center gap-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-full px-6 py-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-500/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                     <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                     </svg>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs text-secondary dark:text-gray-500 font-medium uppercase tracking-wider">Explore Developer</span>
                     <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">mazhar.devx Portfolio</span>
                  </div>
                  <svg className="w-4 h-4 ml-2 text-gray-400 group-hover:text-cyan-400 transition-colors group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
               </a>
            </div>

            <div className="mt-20 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex flex-col items-center md:items-start gap-2">
                  <p className="text-secondary dark:text-gray-500 text-sm">© 2024 - 2026 ShopHub.pro. All rights reserved.</p>
                  <a 
                     href="https://linkedin.com/in/mazhar-devx" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     aria-label="Created by Mazhar Devx - LinkedIn Profile"
                     className="flex items-center gap-2 group transition-all"
                  >
                     <span className="text-secondary dark:text-gray-600 text-xs group-hover:text-primary dark:group-hover:text-gray-400 transition-colors">Created by</span>
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
                      <div key={card} className="w-10 h-7 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
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
