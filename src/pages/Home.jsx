import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductList from "../components/ProductList";
import { Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import api from "../services/api";
import { addToCart } from "../features/cart/cartSlice";
import { useUIStore } from "../zustand/uiStore";
import { useNavigate } from "react-router-dom";

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
      <div className="relative rounded-[2.5rem] overflow-hidden mb-16 sm:mb-24 min-h-[600px] md:h-[800px] flex flex-col justify-center border border-white/5 bg-gray-900 shadow-2xl group">
        {/* Background Image - Optimized & Fixed */}
        <div className="absolute inset-0 z-0 overflow-hidden">
             {settings?.image ? (
                 <img 
                   src={getProductImageUrl(settings.image)} 
                   alt="Hero" 
                   className="w-full h-full object-cover opacity-50 scale-105 group-hover:scale-100 transition-transform duration-[20s] ease-linear" 
                   loading="eager"
                 />
             ) : (
                 <img 
                   src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80" 
                   alt="Hero" 
                   className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[20s] ease-linear" 
                 />
             )}
             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>

        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between text-primary px-6 sm:px-12 py-12 md:py-0 max-w-[1400px] mx-auto">
          <div className="max-w-3xl mb-12 md:mb-0 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-down">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-300">New Collection Available</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 text-white leading-tight tracking-tight animate-fade-in-up">
              {settings?.title?.split(' ').slice(0, -1).join(' ') || "Future"} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x">{settings?.title?.split(' ').slice(-1) || "Commerce"}</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-300 font-light max-w-2xl mx-auto md:mx-0 leading-relaxed animate-fade-in-up animation-delay-1000">
              {settings?.subtitle || "Experience the next generation of shopping with AI-driven recommendations and ultra-fast delivery."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start animate-fade-in-up animation-delay-2000">
              <Link to={settings?.buttonLink || "/products"} className="group relative px-8 py-5 rounded-full bg-white text-black font-bold text-lg overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                    {settings?.buttonText || "Start Exploring"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
              <Link to="/products?category=electronics" className="px-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md hover:border-white/30 flex items-center justify-center gap-2">
                 <span>Latest Tech</span>
              </Link>
            </div>
          </div>
          
          <div className="relative w-full md:w-1/2 flex justify-center animate-float">
             <div className="relative w-72 h-72 md:w-[30rem] md:h-[30rem]">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-[60px]"></div>
                <div className="w-full h-full rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                   <div className="text-center p-12">
                      <div className="text-8xl md:text-9xl mb-4 transform hover:scale-110 transition-transform cursor-default">🛍️</div>
                      <div className="text-4xl font-black text-white mb-2">{settings?.price || "50%"}</div>
                      <div className="text-cyan-400 tracking-[0.5em] uppercase text-sm font-bold">OFF EVERYTHING</div>
                   </div>
                   
                   {/* Decorative lines */}
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                   <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us - New Section */}
      <section className="mb-24">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { icon: "🚀", title: "Ultra Fast Delivery", desc: "Get your orders within 24 hours with our hyper-local logistics network." },
                { icon: "🛡️", title: "Secure Payments", desc: "Bank-grade encryption ensures your data is always protected." },
                { icon: "🎧", title: "24/7 Expert Support", desc: "Our AI and human experts are here to help you anytime, day or night." }
            ].map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-2 group">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20 group-hover:bg-white/10">{feature.icon}</div>
                   <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                   <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
            ))}
         </div>
      </section>
      
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
                src={(Array.isArray(product.images) && product.images.length > 0) ? getProductImageUrl(product.images[0]) : (product.image ? getProductImageUrl(product.image) : "/placeholder.svg")} 
                alt={product.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.svg";
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
      
      {/* Deals of the Day - Ultra Responsive */}
      <section className="mb-12 sm:mb-20 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(220,38,38,0.2),transparent_70%)] animate-pulse"></div>
        
        <div className="relative z-10 p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full">
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 w-full">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-4 mb-6">
                    <span className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full animate-bounce shadow-lg shadow-red-600/40">FLASH SALE</span>
                    <CountdownTimer />
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-200 leading-tight">
                    {flashSale?.title || "Sonic X-Pro"}
                </h2>
                <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                    {flashSale?.subtitle || "Active Noise Cancelling, 30-hour battery life, and ultra-comfortable earcups. The future of sound is here."}
                </p>
                
                <div className="flex flex-col w-full sm:w-auto gap-4">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                        <div className="text-4xl font-black text-white">{formatPrice(flashSale?.price || 199.99)}</div>
                        <div className="text-xl text-gray-500 line-through decoration-red-500 decoration-2">{formatPrice(flashSale?.originalPrice || 399.99)}</div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button 
                            onClick={() => navigate('/products')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] text-lg transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>⚡ Shop Now</span>
                        </button>
                        <button 
                             onClick={() => navigate('/products')}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md text-lg transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>🛒 View Collection</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center relative order-1 md:order-2 w-full mb-8 md:mb-0">
                 <div className="absolute inset-0 bg-red-600/30 blur-[80px] rounded-full transform scale-75 animate-pulse"></div>
                 <div className="glass w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-[2rem] flex items-center justify-center border border-white/10 relative z-10 overflow-hidden bg-black/20 group-hover:scale-105 transition-transform duration-700 shadow-2xl skew-y-3 group-hover:skew-y-0">
                    {flashSale?.image ? (
                        <img src={getProductImageUrl(flashSale.image)} alt={flashSale.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <span className="text-6xl mb-4 block">🎧</span>
                            <span className="text-gray-400 text-sm tracking-widest uppercase">Sonic X-Pro</span>
                        </div>
                    )}
                    
                    {/* Glossy reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
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

      {/* Infinite Product Marquee */}
      <section className="mb-20 overflow-hidden relative group">
         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--deep-bg)] to-transparent z-10 pointer-events-none"></div>
         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--deep-bg)] to-transparent z-10 pointer-events-none"></div>
         
         <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Global Favorites</h2>
         </div>

         <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused]">
            {/* Duplicated list for seamless scrolling */}
            {[...displayProducts, ...displayProducts, ...displayProducts].map((product, idx) => (
               <Link 
                 key={`${product._id || idx}-${idx}`} 
                 to={`/product/${product._id}`}
                 className="w-64 mx-4 flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors duration-300"
               >
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-4 relative">
                     <img 
                       src={getProductImageUrl(product.images?.[0] || product.image)} 
                       alt={product.name} 
                       className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                       onError={(e) => e.target.src = '/placeholder.svg'}
                     />
                  </div>
                  <h3 className="text-sm font-bold text-white text-center line-clamp-1">{product.name}</h3>
                  <p className="text-cyan-400 font-mono text-xs mt-1">{formatPrice(product.price)}</p>
               </Link>
            ))}
         </div>
      </section>
    </div>
  );
}
