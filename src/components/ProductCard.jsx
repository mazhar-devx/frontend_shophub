import { useDispatch } from "react-redux";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import { Link } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import { useUIStore } from "../zustand/uiStore";
import { Play } from "lucide-react";

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
      to={`/product/${product.slug || product._id}`}
      aria-label={`View details for ${product.name}`}
      className="group relative block h-full select-none"
    >
        {/* Glow Effect Background - REMOVED for Ultra Light */}
      
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden h-full flex flex-col transition-all duration-500 group-hover:border-indigo-500/30 dark:group-hover:border-white/20 relative transform group-hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Image Container */}
        <div className="relative pt-[115%] overflow-hidden bg-gray-50/50 dark:bg-gray-900/40">
           {/* Badges */}
           <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
               {isNew && (
                   <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg">
                       New
                   </span>
               )}
               {product.price > 500 && (
                   <span className="px-4 py-1.5 bg-white/90 dark:bg-purple-500/90 border border-gray-100 dark:border-purple-400/30 text-indigo-600 dark:text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg backdrop-blur-md">
                       Premium
                   </span>
               )}
               {product.video && (
                    <span className="px-4 py-1.5 bg-pink-500/90 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Video
                    </span>
               )}
           </div>

           <div className="absolute top-5 right-5 z-20">
                <span className="bg-black/10 dark:bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] text-primary dark:text-white">
                    {product.category}
                </span>
           </div>

           {/* Image or Video */}
           <div className="absolute inset-0">
             {product.posterType === 'video' && product.video ? (
               <video 
                 src={product.video} 
                 autoPlay loop muted playsInline
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
               />
             ) : Array.isArray(product.images) && product.images.length > 0 ? (
               <>
                 <img 
                   src={getProductImageUrl(product.images[0])} 
                   alt={product.name}
                   loading="lazy"
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
                   onError={(e) => {
                     e.target.style.opacity = '0';
                     e.target.parentElement.classList.add('fallback-pattern');
                   }}
                 />
                 {product.images.length > 1 && (
                   <img 
                     src={getProductImageUrl(product.images[1])} 
                     alt={`${product.name} - alt`}
                     loading="lazy"
                     className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-110 z-10"
                     onError={(e) => { e.target.style.opacity = '0'; }}
                   />
                 )}
               </>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800 fallback-pattern">
                  <svg className="w-12 h-12 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
               </div>
             )}
           </div>
           
           {/* Overlay Actions */}
           <div className="absolute inset-0 bg-white/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-[4px] transition-all duration-500 flex items-center justify-center gap-4 z-20">
               <button 
                  onClick={handleAddToCart}
                  className="bg-white dark:bg-indigo-600 text-black dark:text-white p-4 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 hover:scale-110 shadow-xl border border-gray-100 dark:border-indigo-400/50"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                   </svg>
               </button>
                <div 
                   className="bg-white/90 dark:bg-white/10 backdrop-blur-xl text-black dark:text-white p-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 hover:scale-110 border border-gray-200 dark:border-white/30"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-8 flex flex-col flex-grow relative z-10 bg-white dark:bg-transparent">
          <h3 className="font-bold text-xl text-primary dark:text-white mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-300 line-clamp-1 tracking-tight">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-5">
             {product.ratingsQuantity > 0 ? (
                  <>
                     <div className="flex text-yellow-400 text-xs gap-0.5">
                         {[...Array(5)].map((_, i) => (
                         <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : 'text-gray-200 dark:text-gray-700 fill-current'}`} viewBox="0 0 20 20">
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                         </svg>
                         ))}
                     </div>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-3">{product.ratingsAverage} ({product.ratingsQuantity})</span>
                  </>
             ) : (
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No reviews</span>
             )}
          </div>
          
          <div className="mt-auto flex justify-between items-end border-t border-gray-100 dark:border-white/5 pt-6">
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mb-1.5">Price</span>
                <div className="text-2xl font-black text-primary dark:text-white tracking-tighter">
                     {product.discountPercentage > 0 ? (
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] text-red-500 line-through font-bold mb-1">
                                {formatPrice(product.price, product.currency)}
                            </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                {formatPrice(product.price * (1 - product.discountPercentage / 100), product.currency)}
                            </span>
                        </div>
                     ) : (
                        formatPrice(product.price, product.currency)
                     )}
                </div>
             </div>
             
             <button 
               onClick={handleAddToCart}
               aria-label={`Quick add ${product.name} to cart`}
               className="h-10 w-10 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 group/btn shadow-inner"
             >
               <svg className="w-5 h-5 transform group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
