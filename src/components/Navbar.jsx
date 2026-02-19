import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUIStore } from "../zustand/uiStore";
import { logout } from "../features/auth/authSlice";
import { getSearchSuggestions, clearSuggestions } from "../features/products/productSlice";
import SearchSuggestions from "./SearchSuggestions";
import { IMAGE_URL, DEFAULT_AVATAR, getProductImageUrl } from "../utils/constants";

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { suggestions, suggestionsLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  
  const { isCartOpen, toggleCart, isMenuOpen, toggleMenu, isUserMenuOpen, toggleUserMenu, theme, toggleTheme } = useUIStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSearch = () => setShowMobileSearch(!showMobileSearch);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle clicks outside the search area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get search suggestions when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(getSearchSuggestions(searchQuery));
      }, 300);
      
      return () => clearTimeout(delayDebounceFn);
    } else {
      dispatch(clearSuggestions());
    }
  }, [searchQuery, dispatch]);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
      dispatch(clearSuggestions());
    }
  };
  
  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    navigate(`/search?q=${encodeURIComponent(productName)}`);
    setShowSuggestions(false);
    dispatch(clearSuggestions());
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'glass border-b border-white/5 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent py-4 sm:py-6'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none -z-10 transition-opacity duration-300" style={{ opacity: scrolled ? 0 : 1 }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center relative">
        
        {/* Logo Area */}
        <Link to="/" className="group relative z-50 flex items-center gap-2" aria-label="HA Store Home">
           <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-xl border border-white/10 shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
              <img src="/logo.png" alt="HA Store Logo" className="w-full h-full object-cover" />
           </div>
           <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300 uppercase">
             HA Store
           </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/5 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/5 shadow-inner">
            {[
              { path: '/', label: 'Home', icon: '🏠' },
              { path: '/products', label: 'Shop', icon: '🛍️' },
              { path: '/categories', label: 'Categories', icon: '📂' },
           ].map((link) => (
             <Link 
               key={link.path}
               to={link.path} 
               aria-current={location.pathname === link.path ? 'page' : undefined}
               className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group ${location.pathname === link.path ? 'text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
             >
               <span className={`${location.pathname === link.path ? 'scale-100' : 'scale-0 w-0'} transition-all duration-300`}>{link.icon}</span>
               {link.label}
             </Link>
           ))}
           <Link to="/deals" className="px-4 py-2 rounded-full text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
             🔥 Deals
           </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search */}
          <form 
            ref={searchRef}
            onSubmit={handleSearch} 
            className={`${showMobileSearch ? 'flex absolute top-full left-0 w-full px-4 py-4 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50 animate-fade-in-down' : 'hidden'} md:flex md:static md:w-auto md:p-0 md:bg-transparent md:border-none md:shadow-none items-center transition-all`}
          >
            <div className={`flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:bg-black/40 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all duration-300 w-full md:w-auto group ${showMobileSearch ? 'ring-1 ring-purple-500/50' : ''}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onFocus={() => setShowSuggestions(true)}
                 placeholder="Search products..."
                 aria-label="Search products"
                 className="bg-transparent text-white placeholder-gray-500 focus:outline-none ml-2 w-full md:w-32 lg:w-48 text-sm transition-all md:focus:w-56"
               />
               {searchQuery && (
                  <button type="button" aria-label="Clear search" onClick={() => {setSearchQuery(''); dispatch(clearSuggestions())}} className="text-gray-500 hover:text-white">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                     </svg>
                  </button>
               )}
            </div>
            
            <SearchSuggestions 
              suggestions={suggestions}
              loading={suggestionsLoading}
              onSelect={handleSuggestionClick}
            />
          </form>

          {/* Mobile Search Toggle */}
          <button 
            onClick={toggleSearch}
            aria-label="Toggle search"
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Cart Toggle */}
          <button 
            onClick={toggleCart}
            aria-label={`View cart (${cartItemCount} items)`}
            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg border border-black animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
          
          {/* User / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                aria-label="User menu"
                className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:border-white/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px]">
                   <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                       <img 
                          src={getProductImageUrl(user?.photo) || DEFAULT_AVATAR} 
                          alt={user?.name || "User profile"} 
                          className="w-full h-full object-cover" 
                       />
                   </div>
                </div>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-4 w-60 glass border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] py-2 text-gray-200 z-50 animate-fade-in-up origin-top-right overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                    <p className="text-white font-bold truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                     <Link to="/profile" className="flex items-center px-5 py-3 text-sm hover:bg-white/5 hover:text-cyan-400 transition-colors group">
                        <span className="mr-3 text-lg group-hover:scale-110 transition-transform">👤</span> Profile
                     </Link>
                     <Link to="/my-orders" className="flex items-center px-5 py-3 text-sm hover:bg-white/5 hover:text-cyan-400 transition-colors group">
                        <span className="mr-3 text-lg group-hover:scale-110 transition-transform">📦</span> My Orders
                     </Link>
                     <Link to="/wishlist" className="flex items-center px-5 py-3 text-sm hover:bg-white/5 hover:text-cyan-400 transition-colors group">
                        <span className="mr-3 text-lg group-hover:scale-110 transition-transform">❤️</span> Wishlist
                     </Link>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="border-t border-white/5 py-2 bg-purple-500/5">
                      <Link to="/admin/dashboard" className="flex items-center px-5 py-3 text-sm text-purple-300 hover:text-white hover:bg-purple-500/20 transition-colors font-bold group">
                         <span className="mr-3 text-lg group-hover:rotate-12 transition-transform">🛡️</span> Admin Panel
                      </Link>
                    </div>
                  )}
                  <div className="border-t border-white/5 py-2">
                     <button 
                       onClick={() => { handleLogout(); toggleUserMenu(); }}
                       className="flex items-center w-full px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group"
                     >
                       <span className="mr-3 text-lg group-hover:-translate-x-1 transition-transform">🚪</span> Logout
                     </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="hidden sm:inline-flex px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all font-bold text-sm tracking-wide transform hover:scale-105"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button - Hamburger with Animation */}
          <button 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            className="md:hidden relative w-10 h-10 rounded-full flex items-center justify-center text-white focus:outline-none"
          >
            <div className="flex flex-col justify-between w-5 h-4 transform transition-all duration-300 origin-center overflow-hidden">
               <div className={`bg-white h-[2px] w-5 transform transition-all duration-300 origin-left ${isMenuOpen ? 'rotate-45 translate-x-px' : ''}`}></div>
               <div className={`bg-white h-[2px] w-5 rounded transform transition-all duration-300 ${isMenuOpen ? 'translate-x-10' : ''}`}></div>
               <div className={`bg-white h-[2px] w-5 transform transition-all duration-300 origin-left ${isMenuOpen ? '-rotate-45 translate-x-px' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay - Ultra Premium */}
        <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
           {/* Backdrop */}
           <div className={`absolute inset-0 bg-black/95 backdrop-blur-3xl transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={toggleMenu}></div>
           
           {/* Menu Content */}
           <div className={`absolute top-0 right-0 h-full w-80 bg-[#0a0a0a] border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-6 h-full flex flex-col relative overflow-hidden">
                 {/* Background Orbs */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                 <div className="flex items-center justify-between mb-10 relative z-10">
                    <span className="text-2xl font-black text-white tracking-widest uppercase">Menu</span>
                    <button onClick={toggleMenu} className="p-2 text-gray-400 hover:text-white transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                    </button>
                 </div>

                 <div className="flex-1 space-y-2 relative z-10 overflow-y-auto">
                    {[
                       { path: '/', label: 'Home', icon: '🏠' },
                       { path: '/products', label: 'Shop All', icon: '🛍️' },
                       { path: '/categories', label: 'Categories', icon: '📂' },
                       { path: '/deals', label: 'Flash Deals', icon: '🔥', special: true },
                    ].map((item, idx) => (
                       <Link 
                         key={item.path}
                         to={item.path} 
                         onClick={toggleMenu}
                         className={`flex items-center px-4 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${item.special ? 'bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-500/30 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                         style={{ transitionDelay: `${idx * 50}ms` }}
                       >
                          <span className="mr-4 text-xl">{item.icon}</span>
                          {item.label}
                          <span className="ml-auto opacity-50">→</span>
                       </Link>
                    ))}
                    
                    {!isAuthenticated && (
                       <div className="mt-8 grid grid-cols-2 gap-4">
                          <Link to="/login" onClick={toggleMenu} className="py-3 rounded-xl bg-white/5 text-center font-bold text-white border border-white/10 hover:bg-white/10 transition-all">
                             Login
                          </Link>
                          <Link to="/register" onClick={toggleMenu} className="py-3 rounded-xl bg-cyan-600 text-center font-bold text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/20">
                             Sign Up
                          </Link>
                       </div>
                    )}
                 </div>

                 {isAuthenticated && (
                    <div className="border-t border-white/10 pt-6 mt-6 relative z-10">
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 p-[1px]">
                             <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                {user?.photo ? (
                                   <img src={getProductImageUrl(user.photo)} className="w-full h-full object-cover" />
                                ) : (
                                   <img src={DEFAULT_AVATAR} className="w-full h-full object-cover" />
                                )}
                             </div>
                          </div>
                          <div>
                             <p className="font-bold text-white leading-tight">{user?.name}</p>
                             <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                       </div>
                       <button 
                          onClick={() => { handleLogout(); toggleMenu(); }}
                          className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-all"
                       >
                          Log Out
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </nav>
  );
}
