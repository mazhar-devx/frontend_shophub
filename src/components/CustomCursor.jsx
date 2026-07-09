import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProductImageUrl, DEFAULT_AVATAR_FALLBACK } from '../utils/constants';

const CustomCursor = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const labelRef = useRef(null);
  
  // Track mouse coordinates outside React state to avoid re-renders
  const mouseCoords = useRef({ x: -100, y: -100 });
  const cursorCoords = useRef({ x: -100, y: -100 });
  const trailCoords = useRef({ x: -100, y: -100 });
  const requestRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const productEl = target.closest('[data-product-id]');
      if (productEl) {
        const name = productEl.getAttribute('data-product-name');
        const price = productEl.getAttribute('data-product-price');
        const image = productEl.getAttribute('data-product-image');
        const category = productEl.getAttribute('data-product-category');
        const rating = productEl.getAttribute('data-product-rating');
        const stock = parseInt(productEl.getAttribute('data-product-stock') || '0', 10);
        const desc = productEl.getAttribute('data-product-desc');
        
        setHoveredProduct({ name, price, image, category, rating, stock, desc });
        setIsHovering(true);
      } else {
        const isClickable = target.tagName === 'BUTTON' || 
                           target.tagName === 'A' || 
                           target.closest('button') || 
                           target.closest('a') ||
                           target.classList?.contains('cursor-pointer') ||
                           window.getComputedStyle(target).cursor === 'pointer';
        
        setHoveredProduct(null);
        setIsHovering(isClickable);
      }
    };

    window.addEventListener('mouseover', handleOver, { passive: true });
    return () => window.removeEventListener('mouseover', handleOver);
  }, []);

  useEffect(() => {
    // Animation loop using requestAnimationFrame for 60fps/120fps hardware-accelerated movement
    const animate = () => {
      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;

      // 1. Instant follow for main cursor
      cursorCoords.current.x = targetX;
      cursorCoords.current.y = targetY;

      // 2. Smooth trailing follow for trail circle and user label (lerp)
      const lerpFactor = 0.12; 
      trailCoords.current.x += (targetX - trailCoords.current.x) * lerpFactor;
      trailCoords.current.y += (targetY - trailCoords.current.y) * lerpFactor;

      // Update DOM styles directly
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorCoords.current.x}px, ${cursorCoords.current.y}px, 0)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailCoords.current.x}px, ${trailCoords.current.y}px, 0)`;
      }

      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${cursorCoords.current.x}px, ${cursorCoords.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  const displayName = isAuthenticated && user ? (user.role === 'admin' ? (user.vendorName || user.name) : user.name) : "Guest Shopper";
  const displayAvatar = isAuthenticated && user ? getProductImageUrl(user.photo) : DEFAULT_AVATAR_FALLBACK;
  const displayStatus = isAuthenticated && user ? "Active Member" : "Guest Mode";

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999999] overflow-hidden hidden lg:block">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* 1. Main SVG Cursor */}
      <div
        ref={cursorRef}
        className="absolute left-0 top-0 z-[9999999] will-change-transform"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          marginLeft: '-2px',
          marginTop: '-2px',
        }}
      >
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 28 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_2px_10px_rgba(236,72,153,0.4)] transition-all duration-300 ${
            isHovering ? 'scale-120 -rotate-15' : 'scale-100 rotate-0'
          }`}
        >
          <path 
            d="M2 2L11.5 24.5L14.5 14.5L24.5 11.5L2 2Z" 
            fill="url(#cursorGradientGlobal)" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
          <defs>
            <linearGradient id="cursorGradientGlobal" x1="2" y1="2" x2="24.5" y2="24.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EC4899" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 2. User/Product Details Box Floating Badge */}
      <div
        ref={labelRef}
        className="absolute left-0 top-0 pointer-events-none will-change-transform z-[9999999]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      >
        <div
          className={`flex flex-col bg-white/95 dark:bg-[#080808]/95 backdrop-blur-2xl rounded-[1.5rem] border border-pink-500/20 shadow-2xl transition-all duration-500 ease-out overflow-hidden ${
            hoveredProduct 
              ? 'translate-x-[40px] -translate-y-[40px] w-72 p-4 scale-100 opacity-100' 
              : 'translate-x-[35px] -translate-y-[10px] w-60 p-2.5 scale-100 opacity-100'
          }`}
        >
          {!hoveredProduct ? (
            /* User Info State (Default) */
            <div className="flex items-center gap-3 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-pink-500 shadow-inner bg-gray-100 dark:bg-gray-800 shrink-0">
                <img 
                  src={displayAvatar || DEFAULT_AVATAR_FALLBACK} 
                  className="w-full h-full object-cover" 
                  alt={displayName}
                  onError={(e) => { e.target.src = DEFAULT_AVATAR_FALLBACK; }}
                />
              </div>
              <div className="flex flex-col pr-2 min-w-0">
                <span className="text-[11px] font-black text-primary dark:text-white uppercase tracking-tight leading-none whitespace-nowrap truncate font-sans">
                  {displayName}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                   <div className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                   </div>
                   <span className="text-[9px] text-pink-500 font-black uppercase tracking-widest leading-none font-sans">
                      {displayStatus}
                   </span>
                </div>
              </div>
            </div>
          ) : (
            /* Product Details State (Hovered) */
            <div className="flex flex-col gap-3 transition-all duration-500 animate-fadeIn">
              {/* Product Header (Image + Title/Category) */}
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-pink-500/20 bg-gray-50 dark:bg-gray-900 shrink-0 shadow-sm relative group">
                  <img 
                    src={hoveredProduct.image} 
                    className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-500" 
                    alt={hoveredProduct.name}
                    onError={(e) => { e.target.src = "/logo.png"; }}
                  />
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-[9px] text-pink-500 font-bold uppercase tracking-wider mb-1 font-sans">
                    {hoveredProduct.category}
                  </span>
                  <h4 className="text-xs font-black text-primary dark:text-white leading-tight line-clamp-2 font-sans">
                    {hoveredProduct.name}
                  </h4>
                </div>
              </div>

              {/* Price & Stock & Rating Info */}
              <div className="flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02] p-2 rounded-xl border border-gray-100 dark:border-white/5 text-[10px] font-sans">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold">Price</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{hoveredProduct.price}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold">Rating</span>
                  <span className="font-extrabold text-yellow-500">{hoveredProduct.rating}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold">Stock</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded-full text-[8px] uppercase tracking-wide ${
                    hoveredProduct.stock > 0 
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {hoveredProduct.stock > 0 ? `${hoveredProduct.stock} In Stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Smooth fading in description paragraph */}
              {hoveredProduct.desc && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 bg-gray-50/20 dark:bg-white/[0.01] p-2 rounded-xl border border-gray-50 dark:border-white/[0.02] italic font-sans">
                  "{hoveredProduct.desc}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Subtle Trail Circle */}
      <div
        ref={trailRef}
        className="absolute left-0 top-0 w-14 h-14 pointer-events-none will-change-transform z-[9999998]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          marginLeft: '-28px', 
          marginTop: '-28px',
        }}
      >
        <div
          className={`w-full h-full border border-pink-500/10 dark:border-pink-400/15 rounded-full transition-transform duration-300 ${
            isHovering ? 'scale-150' : 'scale-100'
          }`}
        />
      </div>
    </div>
  );
};

export default CustomCursor;
