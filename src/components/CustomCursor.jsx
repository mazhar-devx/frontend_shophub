import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getProductImageUrl, DEFAULT_AVATAR } from '../utils/constants';

const CustomCursor = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const idleTimer = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for trailing effect
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);
      
      // Handle moving state (show label)
      setIsMoving(true);
      
      // Clear previous timer
      if (idleTimer.current) clearTimeout(idleTimer.current);
      
      // Set new timer to hide label after 1.5 seconds of no movement
      idleTimer.current = setTimeout(() => {
        setIsMoving(false);
      }, 1500);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
        setIsMoving(false);
    };
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [mouseX, mouseY, isVisible]);

  // Handle clickable elements for scaling
  useEffect(() => {
    const handleOver = (e) => {
      const target = e.target;
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('button') || 
                         target.closest('a') ||
                         target.classList.contains('cursor-pointer');
      
      setIsHovering(isClickable);
    };

    window.addEventListener('mouseover', handleOver);
    return () => window.removeEventListener('mouseover', handleOver);
  }, []);

  if (!isVisible || !isAuthenticated || !user) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden lg:block">
      {/* Main Cursor Point */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-4 h-4 bg-pink-500 rounded-full border-2 border-white shadow-lg mix-blend-difference"
        animate={{ 
          scale: isHovering ? 1.5 : 1,
        }}
      />

      {/* Trailing Profile Label */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: 20, // Offset to the right
          y: -20, // Offset up
        }}
        className="absolute flex items-center gap-2 px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full border border-pink-500/20 shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isMoving ? 1 : 0, 
          scale: isMoving ? 1 : 0.8,
          x: isHovering ? 30 : 20
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden border border-pink-500">
          <img 
            src={user.photo ? getProductImageUrl(user.photo) : DEFAULT_AVATAR} 
            className="w-full h-full object-cover" 
            alt=""
          />
        </div>
        <div className="flex flex-col pr-1">
          <span className="text-[9px] font-black text-primary dark:text-white uppercase tracking-tighter leading-none">
            {user.name}
          </span>
          <span className="text-[7px] text-pink-500 font-bold uppercase tracking-widest leading-none mt-0.5">
            Active
          </span>
        </div>
      </motion.div>

      {/* Outer Halo */}
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
          opacity: isHovering ? 0.5 : 0.2
        }}
      />
    </div>
  );
};

export default CustomCursor;
