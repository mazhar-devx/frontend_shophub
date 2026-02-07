import { useState } from "react";
import { useUIStore } from "../zustand/uiStore";

export default function ProductFilter({ onFilterChange }) {
  const { isMobileFiltersOpen, toggleMobileFilters } = useUIStore();
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "featured",
    rating: "all",
    brand: "all"
  });
  
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "books", name: "Books" },
    { id: "home", name: "Home & Kitchen" },
    { id: "beauty", name: "Beauty" },
    { id: "sports", name: "Sports" }
  ];
  
  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Top Rated" },
    { id: "newest", name: "Newest Arrivals" }
  ];
  
  const ratingOptions = [
    { id: "all", name: "All Ratings" },
    { id: "4", name: "4 Stars & Up" },
    { id: "3", name: "3 Stars & Up" },
    { id: "2", name: "2 Stars & Up" },
    { id: "1", name: "1 Star & Up" }
  ];
  
  const brandOptions = [
    { id: "all", name: "All Brands" },
    { id: "apple", name: "Apple" },
    { id: "samsung", name: "Samsung" },
    { id: "sony", name: "Sony" },
    { id: "nike", name: "Nike" },
    { id: "adidas", name: "Adidas" }
  ];
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handlePriceChange = (filterType, value) => {
    // Validate that the value is a number or empty
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleFilterChange(filterType, value);
    }
  };
  
  return (
    <>
      {/* Mobile filter dialog */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={toggleMobileFilters} />
          
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="relative w-screen max-w-xs">
              <div className="h-full flex flex-col glass border-r border-white/10 shadow-2xl animate-fade-in-right">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={toggleMobileFilters}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Category filter */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Category</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center group">
                          <div className="relative flex items-center">
                             <input
                               id={`mobile-category-${category.id}`}
                               name="category"
                               type="radio"
                               checked={filters.category === category.id}
                               onChange={() => handleFilterChange("category", category.id)}
                               className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                             />
                          </div>
                          <label
                            htmlFor={`mobile-category-${category.id}`}
                            className={`ml-3 text-sm cursor-pointer transition-colors ${filters.category === category.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price filter */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Price Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="mobile-min-price" className="block text-xs font-medium text-gray-400 mb-1">
                          Min
                        </label>
                        <input
                          type="text"
                          id="mobile-min-price"
                          value={filters.minPrice}
                          onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                          className="block w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label htmlFor="mobile-max-price" className="block text-xs font-medium text-gray-400 mb-1">
                          Max
                        </label>
                        <input
                          type="text"
                          id="mobile-max-price"
                          value={filters.maxPrice}
                          onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                          className="block w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="1000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating filter */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Rating</h3>
                    <div className="space-y-3">
                      {ratingOptions.map((rating) => (
                        <div key={rating.id} className="flex items-center group">
                          <input
                            id={`mobile-rating-${rating.id}`}
                            name="rating"
                            type="radio"
                            checked={filters.rating === rating.id}
                            onChange={() => handleFilterChange("rating", rating.id)}
                            className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                          />
                          <label
                            htmlFor={`mobile-rating-${rating.id}`}
                            className={`ml-3 text-sm cursor-pointer transition-colors ${filters.rating === rating.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                          >
                            {rating.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Brand filter */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Brand</h3>
                    <div className="space-y-3">
                      {brandOptions.map((brand) => (
                        <div key={brand.id} className="flex items-center group">
                          <input
                            id={`mobile-brand-${brand.id}`}
                            name="brand"
                            type="radio"
                            checked={filters.brand === brand.id}
                            onChange={() => handleFilterChange("brand", brand.id)}
                            className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                          />
                          <label
                            htmlFor={`mobile-brand-${brand.id}`}
                            className={`ml-3 text-sm cursor-pointer transition-colors ${filters.brand === brand.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                          >
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sort by */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Sort By</h3>
                    <div className="space-y-3">
                      {sortOptions.map((option) => (
                        <div key={option.id} className="flex items-center group">
                          <input
                            id={`mobile-sort-${option.id}`}
                            name="sort-by"
                            type="radio"
                            checked={filters.sortBy === option.id}
                            onChange={() => handleFilterChange("sortBy", option.id)}
                            className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                          />
                          <label
                            htmlFor={`mobile-sort-${option.id}`}
                            className={`ml-3 text-sm cursor-pointer transition-colors ${filters.sortBy === option.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                          >
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 p-6">
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-500"
                    onClick={toggleMobileFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop filters */}
      <div className="hidden md:block">
        <div className="space-y-8">
          {/* Category filter */}
          <div>
            <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Category</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center group">
                  <input
                    id={`category-${category.id}`}
                    name="category"
                    type="radio"
                    checked={filters.category === category.id}
                    onChange={() => handleFilterChange("category", category.id)}
                    className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className={`ml-3 text-sm cursor-pointer transition-colors ${filters.category === category.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price filter */}
          <div>
            <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Price Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="min-price" className="block text-xs font-medium text-gray-400 mb-1">
                  Min
                </label>
                <input
                  type="text"
                  id="min-price"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  className="block w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="block text-xs font-medium text-gray-400 mb-1">
                  Max
                </label>
                <input
                  type="text"
                  id="max-price"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  className="block w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
          
          {/* Rating filter */}
          <div>
            <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Rating</h3>
            <div className="space-y-3">
              {ratingOptions.map((rating) => (
                <div key={rating.id} className="flex items-center group">
                  <input
                    id={`rating-${rating.id}`}
                    name="rating"
                    type="radio"
                    checked={filters.rating === rating.id}
                    onChange={() => handleFilterChange("rating", rating.id)}
                    className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                  />
                  <label
                    htmlFor={`rating-${rating.id}`}
                    className={`ml-3 text-sm cursor-pointer transition-colors ${filters.rating === rating.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                  >
                    {rating.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Brand filter */}
          <div>
            <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Brand</h3>
            <div className="space-y-3">
              {brandOptions.map((brand) => (
                <div key={brand.id} className="flex items-center group">
                  <input
                    id={`brand-${brand.id}`}
                    name="brand"
                    type="radio"
                    checked={filters.brand === brand.id}
                    onChange={() => handleFilterChange("brand", brand.id)}
                    className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                  />
                  <label
                    htmlFor={`brand-${brand.id}`}
                    className={`ml-3 text-sm cursor-pointer transition-colors ${filters.brand === brand.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                  >
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sort by */}
          <div>
            <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wider text-xs">Sort By</h3>
            <div className="space-y-3">
              {sortOptions.map((option) => (
                <div key={option.id} className="flex items-center group">
                  <input
                    id={`sort-${option.id}`}
                    name="sort-by"
                    type="radio"
                    checked={filters.sortBy === option.id}
                    onChange={() => handleFilterChange("sortBy", option.id)}
                    className="h-4 w-4 border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-black transition-all cursor-pointer"
                  />
                  <label
                    htmlFor={`sort-${option.id}`}
                    className={`ml-3 text-sm cursor-pointer transition-colors ${filters.sortBy === option.id ? 'text-cyan-400 font-medium' : 'text-gray-400 group-hover:text-white'}`}
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}