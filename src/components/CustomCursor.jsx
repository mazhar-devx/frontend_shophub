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

  // Label spring - still exists for smoothness, but with ultra-high responsiveness
  const labelSpringConfig = { damping: 45, stiffness: 600, mass: 0.1 };
  const labelX = useSpring(mouseX, labelSpringConfig);
  const labelY = useSpring(mouseY, labelSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Set values instantly - no spring on the main cursor point
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
      {/* 1. Main Cursor Point - INSTANT tracking */}
      <motion.div
        style={{
          left: mouseX, // Using RAW mouseX for 0ms delay
          top: mouseY,  // Using RAW mouseY for 0ms delay
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-5 h-5 flex items-center justify-center z-[9999999]"
      >
        {/* Core Dot */}
        <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
        
        {/* Outer Ring - Dynamic */}
        <motion.div 
           animate={{ 
             scale: isHovering ? 2.5 : 1,
             borderWidth: isHovering ? '1px' : '2px',
             borderColor: isHovering ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.5)'
           }}
           className="absolute inset-0 border rounded-full"
        />
      </motion.div>

      {/* 2. Professional Profile Label - Highly Responsive Trailing */}
      <motion.div
        style={{
          left: labelX,
          top: labelY,
        }}
        className="absolute flex items-center gap-3 px-3 py-1.5 bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-full border border-pink-500/30 shadow-2xl"
        animate={{ 
          x: isHovering ? 45 : 30, 
          y: -30,                 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8
        }}
        transition={{ 
           type: "spring", damping: 30, stiffness: 300
        }}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500 shadow-inner bg-gray-100 dark:bg-gray-800">
          <img 
            src={getProductImageUrl(user.photo) || DEFAULT_AVATAR_FALLBACK} 
            className="w-full h-full object-cover" 
            alt={user.name}
            onError={(e) => { e.target.src = DEFAULT_AVATAR_FALLBACK; }}
          />
        </div>

        {/* User Details */}
        <div className="flex flex-col pr-2">
          <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-tight leading-none whitespace-nowrap">
            {user.role === 'admin' ? (user.vendorName || user.name) : user.name}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
             <span className="text-[8px] text-pink-500 font-bold uppercase tracking-widest leading-none">
                Active Now
             </span>
          </div>
        </div>
      </motion.div>

      {/* 3. Subtle Trail Effect */}
      <motion.div
        style={{
          left: labelX,
          top: labelY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-12 h-12 border border-pink-500/10 rounded-full"
        animate={{ 
          scale: isHovering ? 2 : 1,
        }}
      />
    </div>
  );
};

export default CustomCursor;
