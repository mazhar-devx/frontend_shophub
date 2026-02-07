import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist, clearWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useUIStore } from "../zustand/uiStore";
import { formatPrice } from "../utils/currency";

export default function Wishlist() {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const { showToast } = useUIStore();

  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
    showToast("Removed from wishlist", "info");
  };

  const handleMoveToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    dispatch(removeFromWishlist(item.id));
    showToast("Moved to cart!", "success");
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    showToast("Wishlist cleared", "info");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto glass border border-white/10 rounded-3xl p-12">
          <div className="bg-white/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white">Your Wishlist is Empty</h1>
          <p className="mb-8 text-gray-400">Save items you love to revisit later</p>
          <Link 
            to="/products" 
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all transform hover:-translate-y-1 font-bold"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 relative flex justify-between items-end">
        <div>
           <div className="absolute top-0 left-0 w-64 h-64 bg-pink-900/10 rounded-full blur-3xl -z-10"></div>
           <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Wishlist</h1>
           <p className="text-gray-400">{wishlistItems.length} items saved</p>
        </div>
        <button 
          onClick={handleClearWishlist}
          className="text-gray-400 hover:text-white text-sm border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="glass border border-white/10 rounded-3xl overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
            <div className="relative h-64 bg-black/40 p-6 flex items-center justify-center overflow-hidden">
               <div className="absolute top-3 right-3 z-10">
                 <button 
                   onClick={() => handleRemoveFromWishlist(item.id)}
                   className="bg-black/50 hover:bg-red-500/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                   title="Remove"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                 </button>
               </div>
               
               <Link to={`/products/${item.id}`} className="block w-full h-full">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  )}
               </Link>
            </div>
            
            <div className="p-5">
              <Link to={`/products/${item.id}`}>
                <h3 className="text-lg font-bold text-white mb-1 truncate hover:text-pink-400 transition-colors">{item.name}</h3>
              </Link>
              <p className="text-gray-500 text-sm mb-3 capitalize">{item.category}</p>
              
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{formatPrice(item.price)}</span>
                 {item.stock > 0 ? (
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">In Stock</span>
                 ) : (
                    <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">Out of Stock</span>
                 )}
              </div>
              
              <button 
                onClick={() => handleMoveToCart(item)}
                disabled={item.stock === 0}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                  item.stock > 0 
                    ? 'bg-white text-black hover:bg-gray-200 hover:shadow-lg' 
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Moved to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
