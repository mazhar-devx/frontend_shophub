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
    e.stopPropagation(); // Prevent navigation when adding to cart
    dispatch(addToCart(product));
    showToast(`${product.name} added to cart!`, "success");
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className="group relative block h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative pt-[100%] overflow-hidden bg-black/40">
           {Array.isArray(product.images) && product.images.length > 0 ? (
             <img 
               src={getProductImageUrl(product.images[0])} 
               alt={product.name}
               className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
               className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
           
           <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 border border-white/10 z-10">
              <span className="text-xs font-bold text-white uppercase tracking-wider">{product.category}</span>
           </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-white mb-1 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-colors">
            {product.name}
          </h3>
          
          {product.ratingsQuantity > 0 ? (
          <div className="flex items-center mb-3">
             <div className="flex text-yellow-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : 'text-gray-700 fill-current'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
             </div>
             <span className="text-xs text-gray-500 ml-2">({product.ratingsQuantity})</span>
          </div>
          ) : (
            <div className="flex items-center mb-3">
                <span className="text-xs text-gray-500">No reviews yet</span>
            </div>
          )}
          
          <div className="mt-auto flex justify-between items-center">
             <div className="text-xl font-bold text-white">
                {formatPrice(product.price)}
             </div>
             
             <button 
               onClick={handleAddToCart}
               className="relative overflow-hidden group/btn bg-white/10 hover:bg-white/20 text-white rounded-xl p-2.5 transition-all active:scale-95"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
               </svg>
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
