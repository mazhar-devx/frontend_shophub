import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, searchProducts } from "../features/products/productSlice";
import ProductList from "../components/ProductList";
import ProductFilter from "../components/ProductFilter";
import { useUIStore } from "../zustand/uiStore";

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, loading, error, pagination } = useSelector((state) => state.products);
  const { toggleMobileFilters } = useUIStore();
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "featured",
    rating: "all",
    brand: "all",
    page: 1
  });
  
  useEffect(() => {
    // Fetch products with current filters
    dispatch(searchProducts({
      category: filters.category !== "all" ? filters.category : undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      sortBy: filters.sortBy !== "featured" ? filters.sortBy : undefined,
      rating: filters.rating !== "all" ? filters.rating : undefined,
      brand: filters.brand !== "all" ? filters.brand : undefined,
      page: filters.page
    }));
  }, [dispatch, filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    });
  };
  
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };
  
  // View options
  const [view, setView] = useState('grid'); // grid or list
  
  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="mb-8 relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 glass border border-white/10 rounded-3xl p-8 mb-8 overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-900/20 to-transparent rounded-full blur-3xl -z-10"></div>
             <h1 className="text-4xl font-bold mb-2 text-white tracking-tight">All Products</h1>
             <p className="text-gray-400 max-w-2xl">Discover our curated collection of premium items. Filter by category, price, or rating to find exactly what you're looking for.</p>
        </div>
        
        {/* Results info and view options */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="text-gray-400 font-medium">
            {pagination && (
              <span>Showing <span className="text-white">{products.length}</span> of <span className="text-white">{pagination.totalProducts}</span> products</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center glass border border-white/10 rounded-xl overflow-hidden p-1">
              <button 
                onClick={() => setView('grid')}
                className={`p-2.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2.5 rounded-lg transition-all ${view === 'list' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <div className="relative">
                <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({...filters, sortBy: e.target.value})}
                className="appearance-none bg-black/40 glass border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-white/5 transition-colors"
                >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 relative z-0">
        {/* Filters sidebar */}
        <div className="md:w-1/4">
          <div className="md:hidden mb-4">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl shadow-lg text-sm font-medium text-white glass hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all active:scale-95"
              onClick={toggleMobileFilters}
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter Products
            </button>
          </div>
          
          <div className="hidden md:block glass border border-white/10 rounded-3xl p-6 sticky top-24 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </h2>
              <button 
                onClick={() => handleFilterChange({
                  category: "all",
                  minPrice: "",
                  maxPrice: "",
                  sortBy: "featured",
                  rating: "all",
                  brand: "all",
                  page: 1
                })}
                className="text-xs font-bold text-gray-400 hover:text-purple-400 uppercase tracking-wider transition-colors"
              >
                Clear All
              </button>
            </div>
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>
        </div>
        
        {/* Product list */}
        <div className="md:w-3/4">
          <ProductList 
            products={products} 
            loading={loading} 
            error={error} 
            view={view}
          />
          
          {/* Pagination */}
          {pagination && products.length > 0 && (
            <div className="mt-12 flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0 glass border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm">
                Showing <span className="font-bold text-white">{(pagination.currentPage - 1) * 12 + 1}</span> to <span className="font-bold text-white">{Math.min(pagination.currentPage * 12, pagination.totalProducts)}</span> of <span className="font-bold text-white">{pagination.totalProducts}</span> products
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pagination.hasPrevPage ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20' : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'}`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                <div className="flex space-x-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    // Simple pagination logic for display, ideally should handle large ranges
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                            pagination.currentPage === pageNum 
                            ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-lg shadow-purple-500/30 transform scale-105' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pagination.hasNextPage ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20' : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}