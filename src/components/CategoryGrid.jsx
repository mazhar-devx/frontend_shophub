import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryGrid({ title, categories, exploreLink, exploreText }) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil((categories?.length || 0) / itemsPerPage);

  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentItems = categories?.slice(page * itemsPerPage, (page + 1) * itemsPerPage) || [];

  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full group overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary dark:text-white group-hover:text-cyan-500 transition-colors">
          {title}
        </h3>
        {totalPages > 1 && (
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === page ? 'w-4 bg-cyan-500' : 'w-1.5 bg-black/10 dark:bg-white/10'}`} 
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="relative flex-grow">
        {/* Invisible placeholder to define fluid height without collapsing */}
        <div className={`grid gap-4 invisible pointer-events-none ${Math.min(4, categories?.length || 0) === 1 ? 'grid-cols-1' : 'grid-cols-2'}`} aria-hidden="true">
          {Array.from({ length: Math.min(4, categories?.length || 0) }).map((_, idx) => (
            <div key={idx} className={`flex flex-col gap-2 ${Math.min(4, categories?.length || 0) === 3 && idx === 0 ? 'col-span-2' : ''}`}>
              <div className={Math.min(4, categories?.length || 0) === 1 ? 'pt-[100%]' : Math.min(4, categories?.length || 0) === 3 && idx === 0 ? 'pt-[50%]' : 'pt-[100%]'} />
              <span className="text-[11px] uppercase tracking-tight truncate">&nbsp;</span>
            </div>
          ))}
        </div>

        {/* Visible animated container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`grid gap-4 absolute inset-0 ${
              currentItems.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {currentItems.map((cat, idx) => (
              <Link 
                key={`${page}-${idx}`} 
                to={cat.link}
                className={`flex flex-col gap-2 group/item ${
                  currentItems.length === 3 && idx === 0 ? 'col-span-2 aspect-[2/1] flex-row' : ''
                }`}
              >
                <div className={`relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900/50 border border-black/[0.03] dark:border-white/[0.03] ${
                  currentItems.length === 3 && idx === 0 ? 'w-1/2 h-full' : 'pt-[100%]'
                }`}>
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/item:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 dark:group-hover/item:bg-black/30 transition-colors duration-500" />
                </div>
                <div className={currentItems.length === 3 && idx === 0 ? 'flex flex-col justify-center flex-1 px-4' : ''}>
                  <span className="text-[11px] font-bold text-secondary dark:text-gray-400 group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors uppercase tracking-tight truncate">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <Link 
        to={exploreLink || "/categories"} 
        className="mt-6 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors flex items-center gap-1 group/link z-10 w-fit"
      >
        {exploreText || "Explore more"}
        <svg className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}
