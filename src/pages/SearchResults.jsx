import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts } from "../features/products/productSlice";
import ProductList from "../components/ProductList";
import ProductFilter from "../components/ProductFilter";

export default function SearchResults() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: products, loading, error, pagination } = useSelector((state) => state.products);
  
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "featured",
    page: 1
  });
  
  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";
  
  useEffect(() => {
    // Fetch products with current filters and search query
    dispatch(searchProducts({
      q: query,
      category: filters.category !== "all" ? filters.category : undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      sortBy: filters.sortBy !== "featured" ? filters.sortBy : undefined,
      page: filters.page
    }));
  }, [dispatch, query, filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      page: 1 // Reset to first page when filters change
    });
  };
  
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  if (!query) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No search query provided</h2>
        <button 
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600">
          {query ? `Showing results for "${query}"` : "All Products"}
          {pagination && (
            <span className="ml-2">
              ({pagination.totalProducts} {pagination.totalProducts === 1 ? "result" : "results"})
            </span>
          )}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>
        </div>
        
        {/* Product list */}
        <div className="md:w-3/4">
          <ProductList 
            products={products} 
            loading={loading} 
            error={error} 
          />
          
          {/* Pagination */}
          {pagination && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-4 py-2 rounded-md ${pagination.hasPrevPage ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                Previous
              </button>
              
              <span className="mx-4 text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-md ${pagination.hasNextPage ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}