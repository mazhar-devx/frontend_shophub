import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getProductImageUrl, DEFAULT_AVATAR } from '../utils/constants';

const CustomCursor = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for trailing effect
  const springConfig = { damping: 25, stiffness: 200 };
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
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  // Handle clickable elements
  useEffect(() => {
    const handleOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mouseover', handleOver);
    return () => window.removeEventListener('mouseover', handleOver);
  }, []);

  if (!isVisible || !isAuthenticated || !user) return null;

  return (
    <motion.div
      style={{
        left: cursorX,
        top: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="fixed pointer-events-none z-[9999] hidden lg:flex items-center gap-3 px-3 py-1.5 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isHovering ? 1.2 : 1, 
        opacity: 1,
      }}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500 shadow-lg">
        <img 
          src={user.photo ? getProductImageUrl(user.photo) : DEFAULT_AVATAR} 
          className="w-full h-full object-cover" 
          alt=""
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-pink-500 uppercase tracking-tighter leading-none">
          {user.name}
        </span>
        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none">
          Online
        </span>
      </div>
      
      {/* Trailing Dot */}
      <motion.div 
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-1.5 h-1.5 bg-pink-500 rounded-full ml-1"
      />
    </motion.div>
  );
};

export default CustomCursor;
