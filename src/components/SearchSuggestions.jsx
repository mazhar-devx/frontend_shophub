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
    <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 z-50">
      {loading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : suggestions.length > 0 ? (
        <ul>
          {suggestions.map((product) => (
            <li 
              key={product._id}
              onClick={() => handleSuggestionClick(product)}
              className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-500">{product.category}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500">No products found</div>
      )}
    </div>
  );
}