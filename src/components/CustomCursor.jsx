import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getProductImageUrl, DEFAULT_AVATAR_FALLBACK } from '../utils/constants';

const CustomCursor = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Configuration for smooth but responsive movement
  // Stiffness and Damping tuned for "Liquid" feel without vibration
  const mainSpringConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const labelSpringConfig = { damping: 35, stiffness: 450, mass: 0.2 };

  const cursorX = useSpring(mouseX, mainSpringConfig);
  const cursorY = useSpring(mouseY, mainSpringConfig);
  
  const labelX = useSpring(mouseX, labelSpringConfig);
  const labelY = useSpring(mouseY, labelSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for extra smoothness if needed, 
      // but MotionValues are already optimized.
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

  // Handle clickable elements for scaling
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
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden hidden lg:block">
      {/* 1. Main Cursor Point (The pink dot) */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-4 h-4 bg-pink-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(236,72,153,0.5)] z-[999999]"
        animate={{ 
          scale: isHovering ? 1.5 : 1,
        }}
      />

      {/* 2. Trailing Pulse Ring */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-8 h-8 border border-pink-500/30 rounded-full"
        animate={{ 
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.6 : 0.2
        }}
      />

      {/* 3. The Professional Profile Label - Fluid Zero-Vibration Movement */}
      <motion.div
        style={{
          left: labelX,
          top: labelY,
        }}
        className="absolute flex items-center gap-3 px-3 py-1.5 bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-full border border-pink-500/30 shadow-2xl"
        animate={{ 
          x: isHovering ? 40 : 30, // Horizontal offset
          y: -30,                 // Vertical offset
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8
        }}
        transition={{ 
           x: { type: "spring", damping: 25, stiffness: 200 },
           y: { type: "spring", damping: 25, stiffness: 200 },
           opacity: { duration: 0.2 }
        }}
      >
        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500 shadow-inner bg-gray-100 dark:bg-gray-800">
          <img 
            src={getProductImageUrl(user.photo) || DEFAULT_AVATAR_FALLBACK} 
            className="w-full h-full object-cover" 
            alt={user.name}
            onError={(e) => { e.target.src = DEFAULT_AVATAR_FALLBACK; }}
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col pr-2">
          <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-tight leading-none whitespace-nowrap">
            {user.role === 'admin' ? (user.vendorName || user.name) : user.name}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
             <span className="text-[8px] text-pink-500 font-bold uppercase tracking-widest leading-none">
                Online
             </span>
          </div>
        </div>
        
        {/* Decorative corner tag */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-white dark:border-black shadow-sm" />
      </motion.div>
    </div>
  );
};

export default CustomCursor;
