import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/currency"; // Assuming this utility exists

export default function Deals() {
  const dispatch = useDispatch();
  const { items: products, loading: isLoading, error: isError, message } = useSelector((state) => state.products);
  const [dealProducts, setDealProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      // Simulate "Deals" by picking random products or products with low price
      // For a real app, we'd check for a 'discount' field
      // Here we'll just show all products but styled as deals, or slice them
      const randomized = [...products].sort(() => 0.5 - Math.random());
      setDealProducts(randomized);
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center text-red-400">
        Error: {message}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight animate-pulse-slow">
                FLASH <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">DEALS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Limited time offers on premium tech. Grab them before they're gone!
            </p>
            
             {/* Countdown Timer Visual (Static for now) */}
            <div className="flex justify-center gap-4 mt-8 font-mono">
                <div className="bg-black/40 border border-white/10 rounded-xl p-3 min-w-[80px]">
                    <span className="text-2xl font-bold text-cyan-400">02</span>
                    <p className="text-xs text-gray-500 uppercase">Hours</p>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-3 min-w-[80px]">
                    <span className="text-2xl font-bold text-cyan-400">45</span>
                    <p className="text-xs text-gray-500 uppercase">Minutes</p>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-3 min-w-[80px]">
                    <span className="text-2xl font-bold text-cyan-400 animate-pulse">12</span>
                    <p className="text-xs text-gray-500 uppercase">Seconds</p>
                </div>
            </div>
        </div>

        {dealProducts.length === 0 ? (
           <div className="text-center text-gray-400 py-12 bg-black/20 rounded-3xl border border-white/5">
             <p className="text-xl">No active deals right now.</p>
             <p className="mt-2 text-sm text-gray-500">Check back later!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <Link 
                to={`/product/${product._id}`}
                key={product._id}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="glass h-full border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform group-hover:-translate-y-2 flex flex-col z-10 relative">
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg animate-bounce-slow">
                        -20% OFF
                    </div>

                    <div className="aspect-square overflow-hidden bg-black/40 relative group-hover:scale-105 transition-transform duration-500">
                        {product.images?.[0] || product.image ? (
                             <img 
                                src={product.images?.[0] || product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                             />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                        )}
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-1">{product.name}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider font-bold">
                                {product.category || 'Deal'}
                            </span>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 line-through decoration-red-500/50">
                                    {formatPrice(product.price * 1.2)}
                                </span>
                                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 hover:text-black flex items-center justify-center transition-all text-white border border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
