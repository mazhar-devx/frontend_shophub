import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import api from "../services/api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";
import { fetchProductReviews } from "../features/reviews/reviewSlice";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { useUIStore } from "../zustand/uiStore";
import ProductReviews from "../components/ProductReviews";
import { store } from "../app/store"; // Import store for direct access

/** MongoDB ObjectIds are 24 hex characters. Dummy/placeholder IDs like "1" cause 500 from API. */
function isValidProductId(id) {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useUIStore();
  
  const { selectedProduct: product, loading, error } = useSelector((state) => state.products);
  const { productReviews } = useSelector((state) => state.reviews);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  // Zoom state
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!id) return;
    // Only call API when id is a valid MongoDB ObjectId (24 hex chars). IDs like "1" from dummy data cause 500.
    if (!isValidProductId(id)) {
      return;
    }
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));

    // Record view + recommendations (use api so Bearer token is sent; view requires auth)
    const trackAndFetch = async () => {
      try {
        await api.post(`/products/${id}/view`, {});
        const res = await api.get(`/products/recommendations`, { params: { currentId: id } });
        if (res.data?.status === "success" && res.data?.data?.products) {
          setRecommendations(res.data.data.products);
        }
      } catch (err) {
        // 401 = not logged in (view requires auth); ignore or show nothing
      }
    };
    trackAndFetch();
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    if (product) {
      // Check stock limit
      const { items: cartItems } = store.getState().cart;
      const existingItem = cartItems.find(item => item.id === product._id || item._id === product._id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      
      if (currentQty + quantity > product.stock) {
        showToast(`Cannot add more. Limit is ${product.stock}. You have ${currentQty} in cart.`, "error");
        return;
      }

      dispatch(addToCart({ ...product, id: product._id, quantity }));
      showToast(`${product.name} added to cart!`, "success");
    }
  };
  
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isInWishlist = product && wishlistItems.some(item => item.id === product.id);

  const handleAddToWishlist = () => {
    if (!product) return;
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      showToast("Removed from wishlist", "info");
    } else {
      dispatch(addToWishlist(product));
      showToast("Added to wishlist!", "success");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center glass rounded-2xl border border-red-500/20 bg-red-500/5 mt-8 mx-auto max-w-2xl">
        <div className="text-red-400 text-xl font-medium">Error loading product</div>
        <div className="text-gray-400 mt-2">{error}</div>
      </div>
    );
  }
  
  if (id && !isValidProductId(id)) {
    return (
      <div className="p-6 text-center glass rounded-2xl border border-white/10 mt-8 mx-auto max-w-2xl">
        <div className="text-gray-400 text-xl">Product not found</div>
        <p className="text-gray-500 mt-2 text-sm">The link may be from a placeholder. Browse products from the home or shop.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center glass rounded-2xl border border-white/10 mt-8 mx-auto max-w-2xl">
        <div className="text-gray-400 text-xl">Product not found</div>
      </div>
    );
  }
  
  const reviews = productReviews[id] || [];
  
  // Calculate discounted price
  const originalPrice = product.discountPercentage > 0 
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2) 
    : product.price;
  
  // Calculate savings
  const savings = product.discountPercentage > 0 
    ? (originalPrice - product.price).toFixed(2) 
    : 0;
  
  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div 
             className="relative rounded-3xl p-6 flex items-center justify-center h-[500px] overflow-hidden group glass shadow-2xl cursor-crosshair"
             onMouseMove={handleMouseMove}
             onMouseLeave={handleMouseLeave}
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 to-transparent pointer-events-none z-0"></div>
             
             {/* Main Image */}
             <div className="w-full h-full flex items-center justify-center relative z-10 pointer-events-none">
                {(product.images && product.images.length > 0) || product.image ? (
                  <img 
                      src={getProductImageUrl(product.images?.length ? product.images[selectedImage] : product.image)}
                      alt={product.name} 
                      style={{
                        transformOrigin: isHovering ? `${mousePos.x}% ${mousePos.y}%` : 'center center',
                        transform: isHovering ? 'scale(2.5)' : 'scale(1)',
                      }}
                      className={`w-full h-full object-contain transition-transform ${isHovering ? 'duration-0 ease-linear' : 'duration-500 ease-out'}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="text-gray-500">Image not available</div>';
                      }}
                   />
                ) : (
                   <svg className="w-32 h-32 opacity-20 drop-shadow-2xl text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                )}
             </div>

            <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {product.images && product.images.length > 0 ? (
               product.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`rounded-2xl p-2 flex items-center justify-center cursor-pointer transition-all ${selectedImage === index ? 'ring-2 ring-purple-500 bg-white/10' : 'bg-black/20 hover:bg-white/5 border border-white/5'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="w-full h-20 flex items-center justify-center rounded-xl overflow-hidden bg-white/5">
                       <img src={getProductImageUrl(img)} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
               ))
            ) : (
               [...Array(4)].map((_, index) => (
                  <div 
                    key={index}
                    className={`rounded-2xl p-2 flex items-center justify-center cursor-pointer transition-all ${selectedImage === index ? 'ring-2 ring-purple-500 bg-white/10 dark:bg-white/10' : 'bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-white/5 border border-black/5 dark:border-white/5'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="w-full h-20 flex items-center justify-center rounded-xl overflow-hidden bg-white/50 dark:bg-white/5">
                       <svg className="w-8 h-8 text-gray-600 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                    </div>
                  </div>
               ))
            )}
          </div>
          
          {/* Social sharing */}
          <div className="flex items-center justify-between glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm font-medium">Share Product:</span>
              <div className="flex space-x-2">
                <button className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full p-2 hover:bg-blue-600 hover:text-white transition-all">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button className="bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full p-2 hover:bg-sky-500 hover:text-white transition-all">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </button>
                <button className="bg-pink-600/20 text-pink-400 border border-pink-500/30 rounded-full p-2 hover:bg-pink-600 hover:text-white transition-all">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/></svg>
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleAddToWishlist}
              className={`flex items-center transition-colors group ${isInWishlist ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'}`}
            >
              <div className={`p-2 rounded-full mr-2 transition-colors ${isInWishlist ? 'bg-pink-500/10' : 'bg-white/5 group-hover:bg-pink-500/10'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col">
          <div className="glass rounded-3xl p-8 flex-grow shadow-2xl">
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <span className="inline-block bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                        {product.brand}
                    </span>
                    
                    {product.stock > 0 ? (
                        <div className="flex items-center text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase">{product.stock} In Stock</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
                            <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                            <span className="text-xs font-bold uppercase">Out of Stock</span>
                        </div>
                    )}
                </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary leading-tight">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : 'text-gray-700 fill-current'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-3 text-gray-400 font-medium">
                  {product.ratingsAverage} <span className="text-gray-600 mx-1">|</span> {product.ratingsQuantity} reviews
                </span>
              </div>
              
              <div className="mb-8 p-6 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/5">
                <div className="flex items-baseline mb-2">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">{formatPrice(product.price)}</div>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="ml-4 text-xl text-gray-600 line-through">{formatPrice(originalPrice)}</span>
                      <span className="ml-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg shadow-red-500/20">
                        {product.discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                {product.discountPercentage > 0 && (
                  <div className="mt-2 text-sm text-cyan-400 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Limited time offer. Discount ends soon!
                  </div>
                )}
              </div>

              <p className="text-secondary mb-8 leading-relaxed text-lg">{product.description}</p>
            </div>
            
            {product.stock > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <label className="mr-6 font-medium text-secondary">Quantity:</label>
                  <div className="flex items-center bg-black/5 dark:bg-black/40 rounded-xl border border-black/10 dark:border-white/10 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-primary hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium text-primary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-primary hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white dark:bg-white dark:text-black py-4 px-6 rounded-xl font-bold hover:opacity-90 transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Add to Cart
                  </button>
                  <button 
                     onClick={() => {
                        const { user } = store.getState().auth; // Access store directly or use selector if available in scope
                        if (!user) {
                           showToast("Please login to purchase products", "error");
                           navigate('/login');
                           return;
                        }

                        if (product) {
                           // Check stock limit logic NOT strictly needed for Buy Now as it usually goes to checkout, 
                           // but good to validate against cart if mixed.
                           // Actually, Buy Now just adds to cart and goes to checkout.
                           // We should respect the limit.
                           const { items: cartItems } = store.getState().cart;
                           const existingItem = cartItems.find(item => item.id === product._id || item._id === product._id);
                           const currentQty = existingItem ? existingItem.quantity : 0;
                           
                           if (currentQty + quantity > product.stock) {
                             showToast(`Cannot buy more. Limit is ${product.stock}. You have ${currentQty} in cart.`, "error");
                             return;
                           }

                           dispatch(addToCart({ ...product, id: product._id, quantity }));
                           // Small delay to ensure state update before nav
                           setTimeout(() => navigate('/checkout'), 100);
                        }
                     }}
                     className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary dark:text-white py-4 px-6 rounded-xl font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
            
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                 </div>
                 <span className="text-xs font-medium text-gray-300">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2 text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                 </div>
                 <span className="text-xs font-medium text-gray-300">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2 text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
                 <span className="text-xs font-medium text-gray-300">2-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="glass rounded-3xl p-8 mb-12 shadow-xl">
          <div className="flex space-x-8 border-b border-gray-200 dark:border-white/10 mb-8 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-lg font-bold transition-all relative whitespace-nowrap ${activeTab === 'description' ? 'text-primary' : 'text-gray-400 hover:text-secondary'}`}
            >
              Description
              {activeTab === 'description' && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-t-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('specifications')}
              className={`pb-4 text-lg font-bold transition-all relative whitespace-nowrap ${activeTab === 'specifications' ? 'text-primary' : 'text-gray-400 hover:text-secondary'}`}
            >
              Specifications
              {activeTab === 'specifications' && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-t-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-lg font-bold transition-all relative whitespace-nowrap ${activeTab === 'shipping' ? 'text-primary' : 'text-gray-400 hover:text-secondary'}`}
            >
              Shipping Info
              {activeTab === 'shipping' && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-t-full"></span>
              )}
            </button>
          </div>
          
          <div className="prose prose-invert max-w-none text-secondary">
            {activeTab === 'description' && (
              <div className="animate-fade-in">
                  <p className="text-lg leading-relaxed">{product.description}</p>
                  <p className="mt-4 text-gray-400">Experience the quality and innovation that defines our {product.category} collection. Designed for the modern lifestyle, this product combines functionality with aesthetic appeal.</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-primary mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                    General
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-secondary">Brand</span>
                        <span className="text-primary font-medium">{product.brand}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-secondary">Category</span>
                        <span className="text-primary font-medium capitalize">{product.category}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-secondary">Model</span>
                        <span className="text-primary font-medium">XYZ-{Math.floor(Math.random() * 1000)}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-primary mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    Dimensions
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-secondary">Height</span>
                        <span className="text-primary font-medium">10cm</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-secondary">Width</span>
                        <span className="text-primary font-medium">15cm</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-secondary">Depth</span>
                        <span className="text-primary font-medium">5cm</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-secondary">Weight</span>
                        <span className="text-primary font-medium">500g</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">Delivery Options</h4>
                         <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="bg-green-500/20 p-2 rounded-full mr-4 mt-1">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <span className="block text-primary font-medium">Free Shipping</span>
                                    <span className="text-sm text-secondary">On all orders over $50</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-green-500/20 p-2 rounded-full mr-4 mt-1">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <span className="block text-primary font-medium">Standard Delivery</span>
                                    <span className="text-sm text-secondary">3-5 business days</span>
                                </div>
                            </li>
                         </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-primary mb-4">Return Policy</h4>
                         <p className="text-secondary mb-4">
                             We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                             you can return it within 30 days for a full refund.
                         </p>
                         <button className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">Read full return policy &rarr;</button>
                    </div>
                </div>
              </div>
            )}
          </div>
      </div>
      
      {/* Product Reviews */}
      <ProductReviews productId={id} reviews={reviews} />
      
      {/* Related Products / Recommendations */}
      <section className="mt-16 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">You May Also Like</h2>
            <p className="text-gray-400">Curated recommendations based on your viewing history and this product.</p>
          </div>
        </div>
        
        {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((item) => (
                <div key={item._id} className="glass border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 group hover:-translate-y-1">
                <div className="relative bg-black/40 h-48 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => window.location.href = `/product/${item._id}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-80"></div>
                    {item.images && item.images.length > 0 ? (
                        <img src={getProductImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500" />
                    ) : item.image ? (
                        <img src={getProductImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <span className="text-3xl relative z-10 opacity-50 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110">📦</span>
                    )}
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-colors truncate">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 capitalize">{item.category}</p>
                    <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(item.ratingsAverage || 0) ? 'fill-current' : 'text-gray-700 fill-current'}`}
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        ))}
                    </div>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-white">{formatPrice(item.price)}</span>
                    <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (item.stock > 0) {
                                dispatch(addToCart({ ...item, quantity: 1 }));
                                showToast("Added to cart", "success");
                            }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-gray-500 text-center py-10">No recommendations available yet. Explore more products!</div>
        )}
      </section>
    </div>
  );
}