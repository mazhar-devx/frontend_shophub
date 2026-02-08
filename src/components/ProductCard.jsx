import { useDispatch } from "react-redux";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import { Link } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import { useUIStore } from "../zustand/uiStore";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { showToast } = useUIStore();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); 
    dispatch(addToCart(product));
    showToast(`${product.name} added to cart!`, "success");
  };

  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // New if < 7 days old

  return (
    <Link 
      to={`/product/${product._id}`}
      className="group relative block h-full select-none"
    >
        {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-cyan-500/0 rounded-[2rem] blur-xl group-hover:from-purple-600/20 group-hover:via-cyan-500/20 group-hover:to-purple-600/20 transition-all duration-700 -z-10 group-hover:scale-105"></div>
      
      <div className="glass border border-white/10 rounded-[2rem] overflow-hidden h-full flex flex-col transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-[#0a0a0a]/40 backdrop-blur-md relative transform group-hover:-translate-y-2">
        
        {/* Basic Shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

        {/* Image Container */}
        <div className="relative pt-[110%] overflow-hidden bg-gray-900/50">
           {/* Badges */}
           <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
               {isNew && (
                   <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md animate-pulse">
                       New
                   </span>
               )}
               {product.price > 500 && (
                   <span className="px-3 py-1 bg-purple-500/80 border border-purple-400/30 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md">
                       Premium
                   </span>
               )}
           </div>

           <div className="absolute top-4 right-4 z-20">
                <span className="bg-black/40 backdrop-blur-xl border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                </span>
           </div>

           {/* Image */}
           {Array.isArray(product.images) && product.images.length > 0 ? (
             <img 
               src={getProductImageUrl(product.images[0])} 
               alt={product.name}
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
               onError={(e) => {
                 e.target.onerror = null;
                 e.target.style.display = 'none';
                 e.target.parentElement.classList.add('fallback-pattern');
               }}
             />
           ) : product.image ? (
              <img 
               src={getProductImageUrl(product.image)} 
               alt={product.name}
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
               onError={(e) => {
                 e.target.onerror = null;
                 e.target.style.display = 'none';
               }}
             />
           ) : (
             <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black">
                <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
           )}
           
           {/* Overlay Actions */}
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
               <button 
                  onClick={handleAddToCart}
                  className="bg-white text-black p-3 rounded-full hover:bg-cyan-400 hover:text-white transition-all duration-300 transform translate-y-10 group-hover:translate-y-0 hover:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  title="Add to Cart"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                   </svg>
               </button>
               <div 
                  className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 delay-75 transform translate-y-10 group-hover:translate-y-0 hover:scale-110 border border-white/20"
                  title="View Details"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                   </svg>
               </div>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative z-10">
          <h3 className="font-bold text-lg text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300 line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-4">
             {product.ratingsQuantity > 0 ? (
                 <>
                    <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : 'text-gray-700 fill-current'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({product.ratingsQuantity})</span>
                 </>
             ) : (
                <span className="text-xs text-gray-500">No reviews yet</span>
             )}
          </div>
          
          <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-4">
             <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Price</span>
                <div className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {formatPrice(product.price)}
                </div>
             </div>
             
             <button 
               onClick={handleAddToCart}
               className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors group/link"
             >
               Add to Cart 
               <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
