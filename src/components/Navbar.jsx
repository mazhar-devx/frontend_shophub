import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUIStore } from "../zustand/uiStore";
import { logout } from "../features/auth/authSlice";
import { getSearchSuggestions, clearSuggestions } from "../features/products/productSlice";
import SearchSuggestions from "./SearchSuggestions";
import { IMAGE_URL } from "../utils/constants";

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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-glass py-3' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tighter flex items-center gap-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Hamzx Store</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-secondary hover:text-primary hover:text-shadow-glow transition-all text-sm font-medium">Home</Link>
          <Link to="/products" className="text-secondary hover:text-primary hover:text-shadow-glow transition-all text-sm font-medium">Products</Link>
          <Link to="/categories" className="text-secondary hover:text-primary hover:text-shadow-glow transition-all text-sm font-medium">Categories</Link>
          <Link to="/deals" className="text-cyan-400 hover:text-cyan-300 transition-all text-sm font-bold">Deals</Link>
          
          {user?.role === 'admin' && (
            <Link 
              to="/admin/dashboard" 
              className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all text-sm font-bold border border-white/20 flex items-center"
            >
              <span className="mr-1">🛡️</span> Admin Panel
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <form 
            ref={searchRef}
            onSubmit={handleSearch} 
            className={`${showMobileSearch ? 'flex absolute top-full left-0 w-full px-4 pb-4 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50 animate-fade-in-down' : 'hidden'} md:flex md:static md:w-auto md:p-0 md:bg-black/5 md:dark:bg-white/10 md:border md:border-black/5 md:dark:border-white/10 md:rounded-full md:px-4 md:py-1.5 md:shadow-none items-center focus-within:bg-black/10 dark:focus-within:bg-white/20 focus-within:border-purple-500/50 transition-all`}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search..."
              className="bg-transparent text-white md:text-primary placeholder-gray-400 focus:outline-none w-full md:w-40 lg:w-64 text-base md:text-sm h-10 md:h-auto"
            />
            <button type="submit" className="text-gray-400 hover:text-cyan-400 md:hover:text-primary ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            
            <SearchSuggestions 
              suggestions={suggestions}
              loading={suggestionsLoading}
              onSelect={(productName) => {
                setSearchQuery(productName);
                setShowSuggestions(false);
              }}
            />
          </form>

          {/* Theme Toggle */}
          <button
             onClick={toggleTheme}
             className="p-2 text-primary hover:text-yellow-400 transition-colors"
             title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
             {theme === 'dark' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
             ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
             )}
          </button>
          
          <button 
            onClick={() => toggleSearch()}
            className="md:hidden p-2 text-primary hover:text-cyan-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => toggleCart()}
            className="p-2 text-primary hover:text-purple-400 transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                {cartItemCount}
              </span>
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => toggleUserMenu()}
                className="flex items-center space-x-2 p-1 rounded-full border border-transparent hover:border-white/20 transition-all"
              >
                <div className="bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px] rounded-full">
                   <div className="bg-black rounded-full p-0.5">
                       <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold overflow-hidden">

                           {user?.photo ? (
                               <img src={`${IMAGE_URL}${user.photo}`} alt="User" className="w-full h-full object-cover" />
                           ) : (
                               user?.name?.charAt(0)
                           )}
                       </div>
                   </div>
                </div>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 glass border border-white/10 rounded-xl shadow-2xl py-2 text-gray-200 z-50 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-white/10 mb-2">
                    <p className="text-sm text-white font-bold">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-white/10 hover:text-cyan-400 transition-colors">Profile</Link>
                  <Link to="/my-orders" className="block px-4 py-2 text-sm hover:bg-white/10 hover:text-cyan-400 transition-colors">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-white/10 hover:text-cyan-400 transition-colors">Wishlist</Link>
                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t border-white/10 my-1"></div>
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-white/10 hover:text-purple-400 transition-colors font-bold">Admin Dashboard</Link>
                      <Link to="/admin/products/new" className="block px-4 py-2 text-sm hover:bg-white/10 hover:text-purple-400 transition-colors">Add Product</Link>
                    </>
                  )}
                  <div className="border-t border-white/10 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all font-medium text-sm"
            >
              Login
            </Link>
          )}
          
          <button 
            onClick={() => toggleMenu()}
            className="md:hidden p-2 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-[60] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             <div className={`flex flex-col h-full bg-gradient-to-b from-black/90 to-purple-900/20 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-10 scale-95'}`}>
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                   <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter">Menu</span>
                   <button onClick={toggleMenu} className="p-2 text-white hover:text-red-400 transition-colors transform hover:rotate-90 duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div className="space-y-4">
                       <Link to="/" onClick={toggleMenu} className="group flex items-center space-x-4 text-2xl font-medium text-white hover:text-cyan-400 transition-all p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                          <span className="group-hover:scale-110 transition-transform duration-300">🏠</span>
                          <span>Home</span>
                       </Link>
                       <Link to="/products" onClick={toggleMenu} className="group flex items-center space-x-4 text-2xl font-medium text-white hover:text-cyan-400 transition-all p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                          <span className="group-hover:scale-110 transition-transform duration-300">🛍️</span>
                          <span>Products</span>
                       </Link>
                       <Link to="/categories" onClick={toggleMenu} className="group flex items-center space-x-4 text-2xl font-medium text-white hover:text-cyan-400 transition-all p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                          <span className="group-hover:scale-110 transition-transform duration-300">📂</span>
                          <span>Categories</span>
                       </Link>
                       <Link to="/deals" onClick={toggleMenu} className="group flex items-center space-x-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                          <span className="group-hover:scale-110 transition-transform duration-300">🔥</span>
                          <span>Deals</span>
                       </Link>
                   </div>
                   
                   {/* Mobile User Controls */}
                   <div className="border-t border-white/10 pt-8 mt-6">
                      {isAuthenticated ? (
                          <div className="animate-fade-in-up animation-delay-2000">
                             <div className="flex items-center space-x-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center text-xl font-bold text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                   {user?.photo ? (
                                      <img src={`${IMAGE_URL}${user.photo}`} alt="User" className="w-full h-full object-cover rounded-full" />
                                   ) : (
                                      user?.name?.charAt(0)
                                   )}
                                </div>
                                <div>
                                   <p className="text-white font-bold text-lg">{user?.name}</p>
                                   <p className="text-sm text-gray-400">{user?.email}</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <Link to="/profile" onClick={toggleMenu} className="bg-white/5 p-4 rounded-xl text-center text-sm font-bold hover:bg-white/10 transition-all border border-white/5 hover:border-white/20">Profile</Link>
                                <Link to="/my-orders" onClick={toggleMenu} className="bg-white/5 p-4 rounded-xl text-center text-sm font-bold hover:bg-white/10 transition-all border border-white/5 hover:border-white/20">Orders</Link>
                                <Link to="/wishlist" onClick={toggleMenu} className="bg-white/5 p-4 rounded-xl text-center text-sm font-bold hover:bg-white/10 transition-all border border-white/5 hover:border-white/20">Wishlist</Link>
                                <button onClick={() => { handleLogout(); toggleMenu(); }} className="bg-red-500/10 text-red-400 p-4 rounded-xl text-center text-sm font-bold hover:bg-red-500/20 transition-all border border-red-500/20">Logout</button>
                             </div>
                             {user?.role === 'admin' && (
                                <Link to="/admin/dashboard" onClick={toggleMenu} className="mt-6 block w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-xl text-center font-bold text-white shadow-lg transform active:scale-95 transition-transform">
                                   Access Admin Dashboard
                                </Link>
                             )}
                          </div>
                      ) : (
                          <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                             <Link to="/login" onClick={toggleMenu} className="bg-white/10 text-white p-4 rounded-xl text-center font-bold hover:bg-white/20 transition-all border border-white/10">Login</Link>
                             <Link to="/register" onClick={toggleMenu} className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-4 rounded-xl text-center font-bold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">Register</Link>
                          </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
      </div>
    </nav>
  );
}
