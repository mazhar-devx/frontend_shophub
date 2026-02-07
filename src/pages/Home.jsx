import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductList from "../components/ProductList";
import { Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import api from "../services/api";

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState(null);
  const [flashSale, setFlashSale] = useState(null);
  const [trendingProducts, setTrendingProducts] = useState(null);
  
  // Dummy Data for Fallback
  const dummyProducts = [
    {
      _id: "1",
      name: "Ultra Wireless Headphones",
      description: "Premium noise-cancelling headphones with AI-driven sound",
      price: 299.99,
      ratingsAverage: 4.8,
      ratingsQuantity: 120,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"],
      category: "electronics"
    },
    {
       _id: "2",
       name: "Smart Watch Series 7",
       description: "The future of health on your wrist",
       price: 399.99,
       ratingsAverage: 4.7,
       ratingsQuantity: 85,
       images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60"],
       category: "electronics"
    },
    {
       _id: "3",
       name: "Ergonomic Gaming Chair",
       description: "Comfort for long sessions",
       price: 159.99,
       ratingsAverage: 4.5,
       ratingsQuantity: 42,
       images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop&q=60"],
       category: "home"
    },
    {
       _id: "4", 
       name: "Advanced Running Shoes",
       description: "Speed and comfort combined",
       price: 129.99,
       ratingsAverage: 4.9,
       ratingsQuantity: 200,
       images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"],
       category: "sports"
    }
  ];

  useEffect(() => {
    dispatch(fetchProducts());
    
    // Fetch Settings
    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            if (data.status === 'success') {
                setSettings(data.data.settings?.hero);
                setFlashSale(data.data.settings?.flashSale);
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    // Fetch Trending
    const fetchTrending = async () => {
        try {
            const { data } = await api.get('/products/trending');
            if (data.status === 'success') {
                setTrendingProducts(data.data.products);
            }
        } catch (err) {
            console.error("Failed to fetch trending", err);
        }
    };

    fetchSettings();
    fetchTrending();
  }, [dispatch]);
  
  // Logic: Use Real Products if available, otherwise fallback to Dummy
  // Improved: If we have ANY products (even 1), we prefer them over dummy data.
  const realProducts = products && products.length > 0 ? products : [];
  const displayProducts = realProducts.length > 0 ? realProducts : dummyProducts;

  // Featured: Sort by Rating (High to Low), take 8
  const featuredProducts = [...displayProducts].sort((a, b) => b.ratingsAverage - a.ratingsAverage).slice(0, 8);
  
  // Trending Fallback: use fetched trending if available, else featured
  const finalTrending = (trendingProducts && trendingProducts.length > 0) ? trendingProducts : featuredProducts.slice(0, 4);

  // Brands data
  const brands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Sony" },
    { id: 4, name: "Nike" },
    { id: 5, name: "Adidas" },
    { id: 6, name: "LG" },
  ];
  
  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen">
      <div className="relative rounded-3xl overflow-hidden mb-8 sm:mb-12 min-h-[400px] md:h-[600px] flex flex-col justify-center border border-white/5 bg-gray-900 shadow-2xl">
        {/* Background Image - Optimized */}
        {settings?.image && (
             <div className="absolute inset-0 z-0">
                <img 
                  src={settings.image} 
                  alt="Hero" 
                  className="w-full h-full object-cover opacity-60" 
                  loading="eager"
                />
                {/* Gradient Overlay for Text Readability - Lightweight */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
             </div>
        )}

        {/* Fallback Gradient if no image */}
        {!settings?.image && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black z-0"></div>
        )}

        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between text-primary px-4 py-8 md:px-12 md:py-0">
          <div className="max-w-2xl mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 text-white leading-tight">
              {settings?.title?.split(' ').slice(0, -1).join(' ') || "Future"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{settings?.title?.split(' ').slice(-1) || "Commerce"}</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-10 text-gray-300 font-light">
              {settings?.subtitle || "Experience the next generation of shopping with AI-driven recommendations and ultra-fast delivery."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center md:justify-start">
              <Link to={settings?.buttonLink || "/products"} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 sm:py-4 sm:px-10 rounded-full text-sm sm:text-lg transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20">
                {settings?.buttonText || "Start Exploring"}
              </Link>
              <Link to="/products?category=electronics" className="bg-white/5 border border-white/10 text-white font-bold py-3 px-6 sm:py-4 sm:px-10 rounded-full text-sm sm:text-lg hover:bg-white/10 transition-colors">
                Latest Tech
              </Link>
            </div>
          </div>
          
          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              {/* Simplified graphics */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
              
              <div className="w-full h-full rounded-3xl flex items-center justify-center border border-white/10 relative overflow-hidden group bg-white/5">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="text-center p-8">
                    <span className="block text-6xl md:text-8xl font-black text-white mb-2">
                        {settings?.price || "50%"}
                    </span>
                    <span className="text-xl md:text-2xl text-cyan-300 font-light tracking-widest uppercase">
                        {settings?.price ? "Starting At" : "Off Everything"}
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-white dark:to-gray-400">Featured Collection</h2>
          <Link to="/products" className="text-cyan-400 hover:text-cyan-300 flex items-center transition-colors font-medium">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Product List supports both real and dummy data */}
        <ProductList 
          products={featuredProducts} 
          loading={loading} 
          error={error} 
        />
        
        {/* Only show 'Add Product' link if using dummy data (which implies DB is empty) AND user is admin */}
        {realProducts.length === 0 && user?.role === 'admin' && (
             <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm mb-2">Showing demo products. Database is empty.</p>
                  <Link to="/admin" className="text-purple-400 hover:text-purple-300 text-sm underline">
                    Add Real Products
                  </Link>
             </div>
        )}
      </section>
      
      {/* Trending Products */}
      <section className="mb-20">
        <div className="flex items-center mb-10 gap-4 overflow-hidden">
            <div className="h-1 flex-grow bg-gradient-to-r from-purple-600 to-transparent rounded-full opacity-50"></div>
            <h2 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">🔥 Trending Now</h2>
            <div className="h-1 flex-grow bg-gradient-to-l from-purple-600 to-transparent rounded-full opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {finalTrending.map((product) => (
            <div key={product._id || product.id} className="ultra-card rounded-2xl overflow-hidden group relative flex flex-col">
            <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                {/* Image placeholder - in real app would be an img tag */}
                <img 
                src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/300"} 
                alt={product.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300?text=No+Image";
                }}
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                HOT
                </div>
            </div>
            
            
            <div className="p-5 bg-card/90 backdrop-blur-sm flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-1 truncate text-primary group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                <p className="text-secondary text-xs mb-3 uppercase tracking-wider">{product.category}</p>
                
                <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-xl text-primary">{formatPrice(product.price)}</span>
                <Link to={`/product/${product._id || product.id}`} className="bg-gray-100 dark:bg-white/10 hover:bg-purple-600 dark:hover:bg-purple-600 text-gray-800 dark:text-white hover:text-white p-2 rounded-lg transition-all duration-300 backdrop-blur-md border border-gray-200 dark:border-white/5 hover:border-purple-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </Link>
                </div>
            </div>
            </div>
        ))}
        </div>
      </section>
      
      {/* Categories */}
      <section className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center">Shop by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {[
            { id: 'electronics', name: 'Electronics', icon: '🔌', color: 'from-blue-500 to-cyan-500' },
            { id: 'clothing', name: 'Clothing', icon: '👕', color: 'from-purple-500 to-pink-500' },
            { id: 'home', name: 'Home', icon: '🏠', color: 'from-green-500 to-emerald-500' },
            { id: 'beauty', name: 'Beauty', icon: '💄', color: 'from-red-500 to-rose-500' },
            { id: 'sports', name: 'Sports', icon: '⚽', color: 'from-orange-500 to-yellow-500' },
            { id: 'books', name: 'Books', icon: '📚', color: 'from-indigo-500 to-blue-500' }
          ].map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="group relative h-32 sm:h-40 rounded-2xl overflow-hidden glass hover:border-purple-500/50 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className="flex flex-col items-center justify-center h-full z-10 relative">
                <span className="text-3xl sm:text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{category.icon}</span>
                <h3 className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Deals of the Day */}
      <section className="mb-12 sm:mb-20 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-black z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-6 sm:p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-4 mb-4 sm:mb-6">
                    <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full animate-pulse">FLASH SALE</span>
                    <CountdownTimer />
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-100 to-white dark:from-white dark:to-red-200">
                    {flashSale?.title || "Premium Headphones"}
                </h2>
                <p className="text-sm sm:text-base text-gray-200 dark:text-gray-300 mb-6 sm:mb-8 max-w-md">
                    {flashSale?.subtitle || "Immerse yourself in pure sound. Active Noise Cancelling, 30-hour battery life, and ultra-comfortable earcups."}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-6 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl sm:text-3xl font-bold text-white">{formatPrice(flashSale?.price || 199.99)}</div>
                        <div className="text-lg sm:text-xl text-gray-400 line-through">{formatPrice(flashSale?.originalPrice || 399.99)}</div>
                    </div>
                    <Link to="/products" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] text-center">
                        Buy Now
                    </Link>
                </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center relative order-1 md:order-2 w-full">
                 <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full transform scale-75 md:scale-100"></div>
                 <div className="glass w-56 h-56 sm:w-72 sm:h-72 rounded-full flex items-center justify-center border border-white/10 relative z-10 overflow-hidden bg-white/5 mx-auto">
                    {flashSale?.image ? (
                        <img src={flashSale.image} alt={flashSale.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-500 text-sm">Product Image</span>
                    )}
                 </div>
            </div>
        </div>
      </section>
      
      {/* Brands */}
      <section className="mb-20">
        <div className="glass rounded-2xl p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 cursor-pointer">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black dark:from-gray-200 dark:to-white">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="relative rounded-3xl overflow-hidden p-10 md:p-20 text-center glass shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Join the Inner Circle</h2>
          <p className="text-lg text-gray-400 mb-10">Get early access to drops, exclusive discounts, and future-tech news.</p>
          
          <form onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.elements.email.value;
              try {
                  await api.post('/marketing/subscribe', { email });
                  alert("Welcome to the club! 🚀");
                  e.target.reset();
              } catch (err) {
                  alert(err.response?.data?.message || "Something went wrong");
              }
          }} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              name="email"
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow bg-white/5 dark:bg-white/5 border border-gray-300 dark:border-white/10 px-6 py-4 rounded-full text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
              required
            />
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-full hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
