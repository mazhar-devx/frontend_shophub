import { useRef } from "react";
import ProductCard from "./ProductCard";

export default function ProductSlider({ title, products, loading }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 group/slider">
      <div className="flex items-end justify-between mb-8 border-b border-black/[0.035] dark:border-white/[0.035] pb-4">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-primary dark:text-white tracking-tight">
          {title}
        </h2>
        
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm active:scale-95"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm active:scale-95"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p) => (
          <div key={p._id || p.id} className="min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
