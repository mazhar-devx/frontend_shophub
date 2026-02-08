import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">HA Store</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Pioneering the future of digital commerce. We bring you premium products with an experience that feels like tomorrow.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all text-white hover:text-cyan-400 hover:-translate-y-1">
                  <span className="sr-only">{social}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 sm:mb-6 text-white">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Contact Us', 'FAQs', 'Shipping Policy', 'Returns & Exchanges', 'Privacy Policy'].map((item) => (
                <li key={item}><Link to="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 sm:mb-6 text-white">Discover</h3>
            <ul className="space-y-2 sm:space-y-3">
              {['All Products', 'Special Offers', 'New Arrivals', 'Brands', 'Gift Cards'].map((item) => (
                <li key={item}><Link to="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h3 className="text-lg font-bold mb-4 sm:mb-6 text-white">Contact</h3>
             <ul className="space-y-3 sm:space-y-4 text-sm text-gray-400">
                <li className="flex items-start">
                   <span className="mr-3 mt-1">📍</span>
                   <span>1234 Future Street, Tech City, Digital State, 99999</span>
                </li>
                <li className="flex items-center">
                   <span className="mr-3">📧</span>
                   <span>mazhar.devx@gmail.com</span>
                </li>
                <li className="flex items-center">
                   <span className="mr-3">📞</span>
                   <span>+92 317 0611234</span>
                </li>
             </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MazharDevx All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-xs">Secure Payments</span>
             {/* Payment icons placeholders */}
             <div className="flex space-x-2">
                 {[1,2,3,4].map(i => <div key={i} className="w-8 h-5 bg-white/10 rounded"></div>)}
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
