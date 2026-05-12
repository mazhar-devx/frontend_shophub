import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getProductImageUrl, DEFAULT_AVATAR_FALLBACK } from '../utils/constants';

const CustomCursor = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // RAW Mouse values for instant, zero-delay tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Label spring - ultra-high responsiveness
  const labelSpringConfig = { damping: 45, stiffness: 600, mass: 0.1 };
  const labelX = useSpring(mouseX, labelSpringConfig);
  const labelY = useSpring(mouseY, labelSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  useEffect(() => {
    const handleOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('button') || 
                         target.closest('a') ||
                         target.classList?.contains('cursor-pointer') ||
                         window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isClickable);
    };

    window.addEventListener('mouseover', handleOver);
    return () => window.removeEventListener('mouseover', handleOver);
  }, []);

  // Show only for authenticated users on desktop
  if (!isAuthenticated || !user) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999999] overflow-hidden hidden lg:block">
      {/* 1. Sleek Designer Cursor Image (SVG Arrow) - INSTANT tracking */}
      <motion.div
        style={{
          left: mouseX, 
          top: mouseY,
          x: -2, // Center the tip
          y: -2, // Center the tip
        }}
        className="absolute z-[9999999]"
      >
        <motion.svg 
          width="28" 
          height="28" 
          viewBox="0 0 28 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ 
            scale: isHovering ? 1.2 : 1,
            rotate: isHovering ? -15 : 0
          }}
          className="drop-shadow-[0_2px_10px_rgba(236,72,153,0.4)]"
        >
          {/* Main sleek arrow body */}
          <path 
            d="M2 2L11.5 24.5L14.5 14.5L24.5 11.5L2 2Z" 
            fill="url(#cursorGradient)" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
          <defs>
            <linearGradient id="cursorGradient" x1="2" y1="2" x2="24.5" y2="24.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EC4899" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>

      {/* 2. Professional Profile Label - Highly Responsive Trailing */}
      <motion.div
        style={{
          left: labelX,
          top: labelY,
        }}
        className="absolute flex items-center gap-3 px-3 py-2 bg-white/95 dark:bg-black/90 backdrop-blur-2xl rounded-2xl border border-pink-500/30 shadow-2xl"
        animate={{ 
          x: isHovering ? 50 : 35, 
          y: -10,                 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8
        }}
        transition={{ 
           type: "spring", damping: 30, stiffness: 300
        }}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-pink-500 shadow-inner bg-gray-100 dark:bg-gray-800">
          <img 
            src={getProductImageUrl(user.photo) || DEFAULT_AVATAR_FALLBACK} 
            className="w-full h-full object-cover" 
            alt={user.name}
            onError={(e) => { e.target.src = DEFAULT_AVATAR_FALLBACK; }}
          />
        </div>

        {/* User Details */}
        <div className="flex flex-col pr-2">
          <span className="text-[11px] font-black text-primary dark:text-white uppercase tracking-tight leading-none whitespace-nowrap">
            {user.role === 'admin' ? (user.vendorName || user.name) : user.name}
          </span>
          <div className="flex items-center gap-1.5 mt-1.5">
             <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </div>
             <span className="text-[9px] text-pink-500 font-black uppercase tracking-widest leading-none">
                Active Member
             </span>
          </div>
        </div>
      </motion.div>

      {/* 3. Subtle Trail Circle */}
      <motion.div
        style={{
          left: labelX,
          top: labelY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-14 h-14 border border-pink-500/5 rounded-full"
        animate={{ 
          scale: isHovering ? 1.5 : 1,
        }}
      />
    </div>
  );
};

export default CustomCursor;
