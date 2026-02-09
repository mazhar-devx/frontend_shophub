import React from 'react';
import ProductCard from "./ProductCard";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import LoadingSpinner from "./LoadingSpinner";
import { Link } from "react-router-dom";

function ProductList({ products, loading, error, view = 'grid' }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12 glass rounded-2xl border border-red-500/20 bg-red-500/5">
        <div className="text-red-400 font-medium text-lg">Error loading products</div>
        <div className="text-gray-400 mt-2">{error}</div>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-2xl border border-white/10">
        <div className="text-gray-400 text-lg">No products found</div>
        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
      </div>
    );
  }
  
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Link 
            key={product._id} 
            to={`/product/${product._id}`}
            className="flex flex-col sm:flex-row items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all group duration-300"
          >
             <div className="relative w-full sm:w-32 h-32 mb-4 sm:mb-0 sm:mr-6 shrink-0 overflow-hidden rounded-xl bg-black/40">
                {(product.images?.length || product.image) ? (
                  <img src={getProductImageUrl(product.images?.[0] || product.image)} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black">
                   <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                </div>
                )}
             </div>

            <div className="flex-1 text-center sm:text-left w-full">
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all">{product.name}</h3>
              <p className="text-gray-400 mb-4 text-sm line-clamp-2">{product.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto">
                <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-0">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : 'text-gray-700 fill-current'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">({product.ratingsQuantity} reviews)</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatPrice(product.price)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default React.memo(ProductList);
