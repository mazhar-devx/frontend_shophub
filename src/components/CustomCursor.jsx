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

  // Smooth springs for trailing effect on the main point
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

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
      {/* Main Cursor Point */}
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
      >
        <motion.div 
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-pink-500 rounded-full"
        />
      </motion.div>

      {/* Profile Label - Zero Lag */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          left: 0,
          top: 0,
        }}
        className="absolute flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-black/80 backdrop-blur-xl rounded-full border border-pink-500/30 shadow-2xl"
        animate={{ 
          x: mouseX.get() + (isHovering ? 35 : 25),
          y: mouseY.get() - 25,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.9
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500 shadow-inner bg-gray-100 dark:bg-gray-800">
          <img 
            src={getProductImageUrl(user.photo) || DEFAULT_AVATAR_FALLBACK} 
            className="w-full h-full object-cover" 
            alt=""
            onError={(e) => { e.target.src = DEFAULT_AVATAR_FALLBACK; }}
          />
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-tight leading-none whitespace-nowrap">
            {user.role === 'admin' ? (user.vendorName || user.name) : user.name}
          </span>
          <span className="text-[8px] text-pink-500 font-bold uppercase tracking-widest leading-none mt-1">
            Online
          </span>
        </div>
        
        {/* Decorative corner tag */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-black shadow-sm" />
      </motion.div>

      {/* Trailing Outer Circle */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-10 h-10 border border-pink-500/20 rounded-full"
        animate={{ 
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.4 : 0.1
        }}
      />
    </div>
  );
};

export default CustomCursor;
