import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProductImageUrl, DEFAULT_AVATAR_FALLBACK } from '../utils/constants';

const CustomCursor = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
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
      
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('button') || 
                         target.closest('a') ||
                         target.classList?.contains('cursor-pointer') ||
                         window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isClickable);
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
        labelRef.current.style.transform = `translate3d(${trailCoords.current.x}px, ${trailCoords.current.y}px, 0)`;
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

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999999] overflow-hidden hidden lg:block">
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

      {/* 2. User Label Profile Badge */}
      {isAuthenticated && user && (
        <div
          ref={labelRef}
          className={`absolute left-0 top-0 flex items-center gap-3 px-3 py-2 bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-2xl border border-pink-500/30 shadow-2xl transition-all duration-300 will-change-transform ${
            isHovering 
              ? 'translate-x-[50px] -translate-y-[10px] scale-100 opacity-100' 
              : 'translate-x-[35px] -translate-y-[10px] scale-100 opacity-100'
          }`}
          style={{
            transform: 'translate3d(-100px, -100px, 0)',
          }}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-pink-500 shadow-inner bg-gray-100 dark:bg-gray-800">
            <img 
              src={getProductImageUrl(user.photo) || DEFAULT_AVATAR_FALLBACK} 
              className="w-full h-full object-cover" 
              alt={user.name}
              onError={(e) => { e.target.src = DEFAULT_AVATAR_FALLBACK; }}
            />
          </div>
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
        </div>
      )}

      {/* 3. Subtle Trail Circle */}
      <div
        ref={trailRef}
        className={`absolute left-0 top-0 w-14 h-14 border border-pink-500/5 rounded-full will-change-transform transition-transform duration-300 ${
          isHovering ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          marginLeft: '-28px', 
          marginTop: '-28px',
        }}
      />
    </div>
  );
};

export default CustomCursor;
