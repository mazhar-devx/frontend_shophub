import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductList from "../components/ProductList";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import api from "../services/api";
import { addToCart } from "../features/cart/cartSlice";
import { useUIStore } from "../zustand/uiStore";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import HomeSkeleton from "../components/HomeSkeleton";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState(null);
  const [flashSale, setFlashSale] = useState(null);
  const [trendingProducts, setTrendingProducts] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  
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
        } finally {
            setSettingsLoading(false);
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

  const handleFlashSaleAddToCart = () => {
    // Priority: 
    // 1. Configured Flash Sale (if ID is valid)
    // 2. First product from "trending"
    // 3. First product from "products" list
    // 4. Alert user if nothing available (shouldn't happen if API works)

    let productToBuy = null;

    if (flashSale && flashSale._id) {
        productToBuy = flashSale;
    } else if (trendingProducts && trendingProducts.length > 0) {
        productToBuy = trendingProducts[0];
    } else if (products && products.length > 0) {
        productToBuy = products[0];
    }

    if (productToBuy) {
        dispatch(addToCart({ ...productToBuy, quantity: 1 }));
        navigate('/cart');
        // Optional: show toast
    } else {
        // Fallback only if absolutely no products loaded
        alert("Flash Sale product is currently unavailable. Please browse our shop.");
        navigate('/products');
    }
  };

  // Brands data
  const brands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Sony" },
    { id: 4, name: "Nike" },
    { id: 5, name: "Adidas" },
    { id: 6, name: "LG" },
  ];
  
  useEffect(() => {
    // Initialize AdSense - Push for each manual ad unit
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silent error
    }
  }, []);

  // Restore loading state for premium UX
  if ((loading || settingsLoading) && !error) {
    return <HomeSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
        <div className="glass p-8 rounded-3xl border border-red-500/20 text-center max-w-md">
           <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Connection Issue</h2>
           <p className="text-secondary dark:text-gray-400 mb-6">We're having trouble reaching our servers. Please check your internet or try refreshing.</p>
           <button onClick={() => window.location.reload()} className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform">Refresh Page</button>
        </div>
      </div>
    );
   }

  return (
    <>
      <SEO 
        title="Home" 
        description="HA Store - Premium E-Commerce for Electronics, Fashion, and More."
        keywords="ecommerce, electronics, fashion, shopping, pakistan, online store"
      />
      <div className="p-2 sm:p-4 md:p-6 min-h-screen">
      {/* Ultra-Light Premium Hero Section */}
      <div className="relative mb-20 md:mb-32 flex flex-col items-center">
        {/* Background Elements - Minimal & Performant - Desktop Only for High End */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] -z-10 overflow-hidden hidden md:block">
           {/* Soft Glow Center */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[80px] opacity-30"></div>
           {/* Accent Glow Right */}
           <div className="absolute top-20 right-0 w-[400px] h-[300px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[60px] opacity-20"></div>
           {/* Accent Glow Left */}
           <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[60px] opacity-20"></div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0 md:pt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
                {/* Left Content - Typography Focused */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md mb-8 transition-transform hover:scale-105 cursor-default shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                        </span>
                        <span className="text-[10px] md:text-xs font-bold tracking-widest text-primary dark:text-gray-200 uppercase">New Collection Live</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-primary dark:text-white leading-[0.9] tracking-tighter mb-6 relative">
                        {settings?.title?.split(' ').slice(0, -1).join(' ') || "Elevate"} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
                          {settings?.title?.split(' ').slice(-1) || "Lifestyle"}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-secondary dark:text-gray-400 font-medium max-w-lg mb-10 leading-relaxed">
                        {settings?.subtitle || "Discover ultra-premium products curated for excellence. Fast, beautiful, and designed exclusively for your unique taste."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                        <Link 
                           to={settings?.buttonLink || "/products"} 
                           className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg border border-transparent dark:border-white/10"
                        >
                           <span className="relative z-10 flex items-center justify-center gap-2">
                              {settings?.buttonText || "Start Shopping"}
                              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                           </span>
                        </Link>
                        <Link 
                           to="/categories"
                           className="group px-8 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary dark:text-white font-bold rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Explore Categories</span>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium text-secondary dark:text-gray-400 bg-white/50 dark:bg-[#0f0f0f]/50 p-4 rounded-3xl border border-black/5 dark:border-white/5">
                        <div className="flex -space-x-3">
                            <img className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a1a1a]" src="https://i.pravatar.cc/100?img=1" alt="User" />
                            <img className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a1a1a]" src="https://i.pravatar.cc/100?img=2" alt="User" />
                            <img className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a1a1a]" src="https://i.pravatar.cc/100?img=3" alt="User" />
                            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a1a1a] bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 flex items-center justify-center text-[10px] font-bold text-cyan-700 dark:text-cyan-300 shadow-inner">
                              +10k
                            </div>
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="flex text-yellow-500 text-sm">★★★★★</div>
                            <span className="text-[10px] uppercase tracking-widest mt-0.5 font-bold">Trusted Customers</span>
                        </div>
                    </div>
                </div>

                {/* Right Content - Ultra Visual */}
                <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
                    {/* Main Hero Image */}
                    <div className="relative w-full h-[400px] md:h-[600px] max-w-lg md:max-w-none flex items-center justify-center mt-12 md:mt-0">
                       <div className="absolute inset-0 bg-gradient-to-t from-[#F3f3f3] dark:from-[#030014] via-transparent to-transparent z-10 md:hidden"></div>
                       {/* Premium Background Circle */}
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-gradient-to-tr from-cyan-100 to-purple-100 dark:from-cyan-900/40 dark:to-purple-900/40 rounded-full blur-[60px] opacity-70 z-0"></div>
                       
                       {settings?.image ? (
                           <img 
                             src={getProductImageUrl(settings.image)} 
                             alt={settings?.title || "Premium ShopHub Product"} 
                             className="w-[85%] h-[85%] object-contain relative z-10 transform transition-transform duration-700 hover:scale-105"
                             loading="eager"
                           />
                       ) : (
                           <img 
                             src="https://images.unsplash.com/photo-1616469829718-0faf16324280?auto=format&fit=crop&q=80&w=1000" 
                             alt="Premium Digital Connectivity and Electronics"
                             className="w-[85%] h-[85%] object-contain relative z-10 opacity-90 transition-all duration-700 hover:scale-105"
                             // Fallback if the clean placeholder doesn't exist, use a standard one but style it better
                             onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "https://images.unsplash.com/photo-1616469829718-0faf16324280?auto=format&fit=crop&q=80&w=1000";
                                 e.target.className = "w-full h-full object-cover rounded-[3rem] opacity-80 mask-image-gradient relative z-10";
                             }}
                           />
                       )}
                    </div>

                    {/* Minimal Floating Badge - Replaces Heavy Card */}
                    <div className="absolute bottom-10 right-4 md:right-10 md:bottom-20 z-20">
                        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md px-6 py-4 rounded-3xl border border-black/5 dark:border-white/10 flex items-center gap-4 hover:scale-105 transition-transform cursor-default shadow-xl">
                             <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-md">
                                %
                             </div>
                             <div>
                                 <p className="text-xs text-secondary dark:text-gray-400 uppercase tracking-widest font-bold">Special Offer</p>
                                 <p className="text-xl font-black text-primary dark:text-white leading-none mt-1">{settings?.price || "50%"} OFF</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>


      {/* Manual AdSense Unit - Hidden until active */}
      {false && (
      <div className="w-full max-w-[1400px] mx-auto px-4 mb-24 min-h-[100px] flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%' }}
             data-ad-client="ca-pub-6521940579323633"
             data-ad-slot="2705058805"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <span className="text-[10px] text-gray-700 absolute bottom-2 right-4">Advertisement</span>
      </div>
      )}
      
      {/* Featured Collection - Minimal Header */}
      <section className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4 border-b border-white/5 pb-4">
          <div>
              <span className="text-cyan-600 dark:text-cyan-500 font-mono text-xs tracking-widest uppercase mb-2 block">Premium Selection</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">Featured Collection</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors text-sm font-medium pb-1">
            View All Products
            <div className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
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
      
      {/* Trending Products - Ultra Minimal */}
      <section className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
            <div>
                 <span className="text-purple-600 dark:text-purple-500 font-mono text-xs tracking-widest uppercase mb-2 block">Hot Picks</span>
                 <h2 className="text-3xl font-bold text-primary dark:text-white">Trending Now</h2>
            </div>
            <div className="hidden sm:flex gap-2">
                 <button className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">←</button>
                 <button className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">→</button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {finalTrending.map((product) => (
             <ProductCard key={product._id || product.id} product={product} />
        ))}
        </div>
      </section>

      {/* Second AdSense Unit - Fluid / In-Article - Hidden until active */}
      {false && (
      <div className="w-full max-w-[1400px] mx-auto px-4 mb-24 min-h-[100px] flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative">
        <ins className="adsbygoogle"
             style={{ display: 'block', textAlign: 'center' }}
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-6521940579323633"
             data-ad-slot="8211277173"></ins>
        <span className="text-[10px] text-gray-700 absolute bottom-2 right-4">Advertisement</span>
      </div>
      )}
      
      {/* Categories - Modern Chips/Tiles */}
      <section className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8 text-center text-primary dark:text-white">Shop by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { id: 'electronics', name: 'Electronics', icon: '🔌', color: 'bg-blue-500' },
            { id: 'clothing', name: 'Clothing', icon: '👕', color: 'bg-purple-500' },
            { id: 'home', name: 'Home', icon: '🏠', color: 'bg-green-500' },
            { id: 'beauty', name: 'Beauty', icon: '💄', color: 'bg-red-500' },
            { id: 'sports', name: 'Sports', icon: '⚽', color: 'bg-orange-500' },
            { id: 'books', name: 'Books', icon: '📚', color: 'bg-indigo-500' }
          ].map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="group relative h-32 rounded-2xl overflow-hidden bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/5 hover:border-cyan-500/20 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              {/* Hover Glow */}
              <div className={`absolute inset-0 ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="flex flex-col items-center justify-center h-full relative z-10">
                <span className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{category.icon}</span>
                <h3 className="text-sm font-bold text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white transition-colors">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Deals of the Day - Ultra Responsive */}
      <section className="mb-12 sm:mb-20 relative rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl group min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-white to-white dark:from-red-900 dark:via-black dark:to-black z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(220,38,38,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_50%,_rgba(220,38,38,0.2),transparent_70%)] opacity-50"></div>
        
        <div className="relative z-10 p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full">
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 w-full">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-4 mb-6">
                    <span className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">FLASH SALE</span>
                    <CountdownTimer />
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 dark:from-white dark:to-red-200 leading-tight">
                    {flashSale?.title || "Sonic X-Pro"}
                </h2>
                <p className="text-base sm:text-lg text-secondary dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
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
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] dark:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] dark:hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] text-lg transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>⚡ Shop Now</span>
                        </button>
                        <button 
                             onClick={handleFlashSaleAddToCart}
                             aria-label="Add flash sale item to cart"
                            className="flex-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-primary dark:text-white font-bold py-4 px-8 rounded-xl transition-all border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 backdrop-blur-md text-lg transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>🛒 Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center relative order-1 md:order-2 w-full mb-8 md:mb-0">
                 <div className="absolute inset-0 bg-red-500/5 dark:bg-red-600/10 blur-[30px] rounded-full transform scale-75"></div>
                 <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-[2rem] flex items-center justify-center border border-black/5 dark:border-white/10 relative z-10 overflow-hidden bg-white/50 dark:bg-black/20 group-hover:scale-105 transition-transform duration-500 shadow-sm dark:shadow-md skew-y-3 group-hover:skew-y-0">
                    {flashSale?.image ? (
                        <img 
                            src={getProductImageUrl(flashSale.image)} 
                            alt={flashSale.title} 
                            className="w-full h-full object-cover" 
                            width="400"
                            height="400"
                            loading="lazy"
                        />
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
        <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 cursor-pointer">
                <span className="text-xl font-black text-black dark:text-white tracking-widest uppercase">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter & Features Integration */}
      <section className="relative rounded-3xl overflow-hidden p-10 md:p-20 text-center glass shadow-2xl mb-12">
        <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black transition-colors duration-500" id="newsletter-bg"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Relocated Features - Minimalist Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {[
              { icon: "🚀", title: "Ultra Fast Delivery", desc: "Get your orders within 24 hours" },
              { icon: "🛡️", title: "Secure Payments", desc: "Bank-grade encryption protection" },
              { icon: "🎧", title: "24/7 Expert Support", desc: "AI and human experts always here" }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-4xl mb-4 transform hover:scale-110 transition-transform cursor-default">{feature.icon}</span>
                <h3 className="text-lg font-bold text-primary dark:text-white mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-secondary dark:text-gray-400 text-xs font-medium uppercase tracking-widest">{feature.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400">Join the Inner Circle</h2>
          <p className="text-lg text-secondary dark:text-gray-400 mb-10">Get early access to drops, exclusive discounts, and future-tech news.</p>
          
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
          }} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative z-20">
            <input 
              name="email"
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 px-6 py-4 rounded-full text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-gray-50 dark:focus:bg-white/10 transition-all font-bold"
              required
            />
            <button type="submit" className="bg-primary dark:bg-white text-white dark:text-black font-black px-8 py-4 rounded-full hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all transform hover:scale-105">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Infinite Product Marquee - Global Favorites */}
      <section className="mb-24 overflow-hidden relative py-12">
         {/* Subtle Background Glows */}
         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="mb-12 text-center px-4">
            <h2 className="text-3xl md:text-4xl font-black text-primary dark:text-white mb-3 tracking-tighter uppercase italic">
              Global <span className="text-cyan-600 dark:text-cyan-400">Favorites</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.3em] font-medium">Top Trending Products Across 50+ Countries</p>
         </div>

         <div className="relative group">
            {/* Side Masks for Seamless Fade */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-white dark:from-[#050505] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-white dark:from-[#050505] to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] will-change-transform py-4">
                {/* Duplicated list for seamless scrolling */}
                {[...displayProducts, ...displayProducts, ...displayProducts].map((product, idx) => (
                <Link 
                    key={`${product._id || idx}-${idx}`} 
                    to={`/product/${product._id}`}
                    className="w-48 md:w-64 mx-3 md:mx-4 flex flex-col bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] p-3 md:p-4 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative group/card"
                >
                    <div className="w-full aspect-square md:h-48 rounded-xl md:rounded-2xl overflow-hidden mb-4 relative bg-black/5 dark:bg-black/20">
                        <img 
                          src={getProductImageUrl(product.images?.[0] || product.image)} 
                          alt={product.name} 
                          className="w-full h-full object-cover transform scale-100 group-hover/card:scale-110 transition-transform duration-700 opacity-90 group-hover/card:opacity-100"
                          loading="lazy"
                          onError={(e) => e.target.src = '/placeholder.svg'}
                        />
                        {/* Status Tag */}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg text-[8px] font-bold text-cyan-400 uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity">
                           Popular
                        </div>
                    </div>
                    <div className="px-1">
                        <h3 className="text-xs md:text-sm font-bold text-primary dark:text-white line-clamp-1 group-hover/card:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex flex-col">
                                {product.discountPercentage > 0 && (
                                    <span className="text-[10px] text-red-400 line-through font-medium leading-none">
                                        {formatPrice(product.price, product.currency)}
                                    </span>
                                )}
                               <p className="text-cyan-400 font-black text-xs md:text-base leading-tight">
                                   {product.discountPercentage > 0 
                                     ? formatPrice(product.price * (1 - product.discountPercentage / 100), product.currency)
                                     : formatPrice(product.price, product.currency)
                                   }
                               </p>
                           </div>
                           <div className="text-[10px] text-gray-500 font-bold">★ {product.ratingsAverage || '5.0'}</div>
                        </div>
                    </div>
                </Link>
                ))}
            </div>
         </div>
      </section>
      </div>
    </>
  );
}
