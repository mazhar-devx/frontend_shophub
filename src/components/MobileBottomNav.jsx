import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

export default function MobileBottomNav() {
  const location = useLocation();
  const { items: cartItems } = useSelector((state) => state.cart);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/categories', 
      label: 'Categories', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      path: '/products', 
      label: 'Shop', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      path: '/cart', 
      label: 'Cart', 
      badge: cartItemCount > 0 ? cartItemCount : null,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Check for common mobile and tablet devices
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsMobileDevice(isMobile);
  }, []);

  if (!isMobileDevice) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100]">
      {/* Background with blur and subtle top border */}
      <div className="absolute inset-0 bg-white/90 dark:bg-[#030014]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"></div>
      
      {/* Navigation Items */}
      <div className="relative flex justify-around items-center h-16 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full relative group transition-colors duration-300 ${
                isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-gray-200'
              }`}
            >
              <div className="relative mb-1">
                 <div className={`transform transition-transform duration-300 ${isActive ? '-translate-y-1 scale-110' : 'group-hover:-translate-y-0.5'}`}>
                    {item.icon}
                 </div>
                 
                 {/* Badge (e.g., Cart Count) */}
                 {item.badge !== null && item.badge !== undefined && (
                   <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center shadow-md animate-pulse px-1">
                     {item.badge}
                   </span>
                 )}
              </div>
              
              <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'opacity-100 font-bold' : 'opacity-70 group-hover:opacity-100'}`}>
                {item.label}
              </span>
              
              {/* Active indicator dot */}
              <div className={`absolute bottom-0 w-1 h-1 rounded-full bg-cyan-500 dark:bg-cyan-400 transform transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
