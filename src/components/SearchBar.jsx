import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSearchSuggestions, clearSuggestions } from "../features/products/productSlice";
import { useUIStore } from "../zustand/uiStore";
import SearchSuggestions from "./SearchSuggestions";

export default function SearchBar() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const { suggestions, suggestionsLoading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Focus the search input when the component mounts
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Get search suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(getSearchSuggestions(searchTerm));
      }, 300);
      
      return () => clearTimeout(delayDebounceFn);
    } else {
      dispatch(clearSuggestions());
    }
  }, [searchTerm, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      toggleSearch();
      dispatch(clearSuggestions());
    }
  };

  const handleSuggestionClick = (productName) => {
    setSearchTerm(productName);
    navigate(`/search?q=${encodeURIComponent(productName)}`);
    toggleSearch();
    dispatch(clearSuggestions());
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 animate-fade-in-down">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={toggleSearch}
      />
      
      <div className="relative w-full max-w-3xl mx-4 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <form onSubmit={handleSubmit} className="flex-grow flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="flex-grow bg-white/5 border border-white/10 text-white placeholder-gray-400 text-lg px-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              autoFocus
            />
            
            <SearchSuggestions 
              suggestions={suggestions}
              loading={suggestionsLoading}
              onSelect={(productName) => {
                setSearchTerm(productName);
                handleSubmit({ preventDefault: () => {} });
              }}
            />
          </form>
          <button
            onClick={() => {
              toggleSearch();
              dispatch(clearSuggestions());
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 bg-black/40">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Popular Searches</h3>
          <div className="flex flex-wrap gap-3">
            {['Electronics', 'Clothing', 'Books', 'Home', 'Beauty', 'Sports'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  navigate(`/search?q=${encodeURIComponent(term)}`);
                  toggleSearch();
                  dispatch(clearSuggestions());
                }}
                className="px-4 py-2 bg-white/5 border border-white/5 text-gray-300 rounded-full text-sm hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all duration-300"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}