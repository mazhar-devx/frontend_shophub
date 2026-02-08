import { useState, useEffect } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
      <button
        onClick={scrollToTop}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden border border-white/20"
        aria-label="Back to top"
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-full"></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700"></div>

        {/* Icon */}
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 relative z-10 transform group-hover:-translate-y-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
