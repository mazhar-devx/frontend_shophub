import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearSuggestions } from "../features/products/productSlice";
import { useUIStore } from "../zustand/uiStore";

export default function SearchSuggestions({ suggestions, loading, onSelect }) {
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
    <div className="absolute top-full left-0 w-full bg-main rounded-lg shadow-lg mt-1 z-50 border border-white/10">
      {loading ? (
        <div className="p-4 text-center text-secondary">Loading...</div>
      ) : suggestions.length > 0 ? (
        <ul>
          {suggestions.map((product) => (
            <li 
              key={product._id}
              onClick={() => handleSuggestionClick(product)}
              className="p-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 cursor-pointer"
            >
              <div className="font-medium text-primary dark:text-white">{product.name}</div>
              <div className="text-sm text-secondary">{product.category}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500">No products found</div>
      )}
    </div>
  );
}