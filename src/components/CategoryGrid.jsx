import { Link } from "react-router-dom";
import { getProductImageUrl } from "../utils/constants";

export default function CategoryGrid({ title, categories, exploreLink, exploreText }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full group">
      <h3 className="text-xl font-bold text-primary dark:text-white mb-6 group-hover:text-cyan-500 transition-colors">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-4 flex-grow">
        {categories.slice(0, 4).map((cat, idx) => (
          <Link 
            key={idx} 
            to={cat.link}
            className="flex flex-col gap-2 group/item"
          >
            <div className="relative pt-[100%] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900/50">
              <img 
                src={cat.image} 
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-secondary dark:text-gray-400 group-hover/item:text-primary dark:group-hover/item:text-white transition-colors uppercase tracking-tight truncate">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
      
      <Link 
        to={exploreLink || "/categories"} 
        className="mt-6 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors flex items-center gap-1 group/link"
      >
        {exploreText || "Explore more"}
        <svg className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}
