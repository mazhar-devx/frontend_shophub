import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearSuggestions } from "../features/products/productSlice";
import { useUIStore } from "../zustand/uiStore";

export default function SearchSuggestions({ suggestions, loading, onSelect, isCommandPalette = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSearch } = useUIStore();

  const handleSuggestionClick = (product) => {
    onSelect(product.name);
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(product.name)}`);
    // Close the search overlay
    toggleSearch();
    // Clear suggestions
    dispatch(clearSuggestions());
  };

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={isCommandPalette ? "w-full" : "absolute top-full left-0 w-full bg-main rounded-lg shadow-lg mt-1 z-50 border border-white/10"}>
      {loading ? (
        <div className="p-4 text-center text-secondary">Loading...</div>
      ) : suggestions.length > 0 ? (
        <ul className={isCommandPalette ? "px-2 py-2" : ""}>
          {suggestions.map((product) => (
            <li 
              key={product._id}
              onClick={() => handleSuggestionClick(product)}
              className={`flex items-center gap-4 p-3 cursor-pointer transition-colors ${isCommandPalette ? 'hover:bg-black/5 dark:hover:bg-white/5 rounded-xl mb-1' : 'border-b border-white/5 last:border-b-0 hover:bg-white/5'}`}
            >
              <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-primary dark:text-white">{product.name}</div>
                <div className="text-xs text-secondary font-medium uppercase tracking-wider">{product.category}</div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 text-cyan-500">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}