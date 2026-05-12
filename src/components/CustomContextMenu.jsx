import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, ArrowRight, ExternalLink, Search, Info, ShieldCheck } from 'lucide-react';

const CustomContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetProduct, setTargetProduct] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Only for desktop
      if (window.innerWidth < 1024) return;
      
      e.preventDefault();
      
      // Find if clicked on a product
      const productCard = e.target.closest('[data-product-id]');
      const productSlug = productCard?.getAttribute('data-product-id');
      setTargetProduct(productSlug);

      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setVisible(false);
      }
    };

    const handleScroll = () => setVisible(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { 
      label: 'Back', 
      icon: <ArrowLeft className="w-4 h-4" />, 
      action: () => navigate(-1) 
    },
    { 
      label: 'Forward', 
      icon: <ArrowRight className="w-4 h-4" />, 
      action: () => navigate(1) 
    },
    { 
      label: 'Reload', 
      icon: <RefreshCw className="w-4 h-4" />, 
      action: () => window.location.reload() 
    },
    { type: 'separator' },
    ...(targetProduct ? [
      { 
        label: 'Open Product', 
        icon: <ExternalLink className="w-4 h-4 text-pink-500" />, 
        action: () => navigate(`/product/${targetProduct}`) 
      }
    ] : []),
    { 
      label: 'Search Store', 
      icon: <Search className="w-4 h-4" />, 
      action: () => navigate('/search') 
    },
    { type: 'separator' },
    { 
      label: 'Secure Store', 
      icon: <ShieldCheck className="w-4 h-4 text-green-500" />, 
      action: () => {} 
    },
    { 
      label: 'About ShopHub', 
      icon: <Info className="w-4 h-4" />, 
      action: () => navigate('/about-us') 
    }
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ 
            position: 'fixed', 
            top: position.y, 
            left: position.x,
            zIndex: 10000 
          }}
          className="bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 w-56 overflow-hidden"
        >
          {menuItems.map((item, idx) => (
            item.type === 'separator' ? (
              <div key={idx} className="h-px bg-black/5 dark:bg-white/5 my-1.5 mx-2" />
            ) : (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                  setVisible(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-secondary dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white transition-all group"
              >
                <span className="group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          ))}
          
          <div className="mt-1 px-3 py-2 bg-pink-500/5 rounded-xl border border-pink-500/10">
             <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest text-center">
                ShopHub Professional
             </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomContextMenu;
