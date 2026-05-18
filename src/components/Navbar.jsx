import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUIStore } from "../zustand/uiStore";
import { logout } from "../features/auth/authSlice";
import { getSearchSuggestions, clearSuggestions } from "../features/products/productSlice";
import SearchSuggestions from "./SearchSuggestions";
import { DEFAULT_AVATAR, getProductImageUrl } from "../utils/constants";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Laptop, 
  ChevronDown, 
  Flame, 
  LayoutGrid, 
  LogOut, 
  Package, 
  Heart, 
  Settings,
  ArrowRight,
  Download,
  Play
} from "lucide-react";

import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { suggestions, suggestionsLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  
  const { isCartOpen, toggleCart, isMenuOpen, toggleMenu, isUserMenuOpen, toggleUserMenu, theme, setTheme } = useUIStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("preferred_lang") || "en");
  const [showCategoriesMegaMenu, setShowCategoriesMegaMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const themeRef = useRef(null);
  const langRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Search Modal Keyboard Shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check current language from cookie on mount
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const currentGoogTrans = getCookie('googtrans');
    if (currentGoogTrans) {
      const lang = currentGoogTrans.split('/').pop();
      setCurrentLang(lang);
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (window.doGoogleLanguageTranslation) {
      localStorage.setItem("preferred_lang", langCode);
      window.doGoogleLanguageTranslation(langCode);
    } else {
      toast.error("Translation engine not ready. Please refresh.");
    }
  };

  // Handle clicks outside theme/lang menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };
  
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
  
  const handleLogout = () => dispatch(logout());
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchModal(false);
      dispatch(clearSuggestions());
    }
  };
  
  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    navigate(`/search?q=${encodeURIComponent(productName)}`);
    setShowSearchModal(false);
    dispatch(clearSuggestions());
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Main Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'top-4 px-4' : 'top-0'}`}>
        <motion.div 
          layout
          className={`mx-auto flex items-center justify-between relative transition-all duration-500 ${
            scrolled 
              ? 'max-w-5xl bg-white/80 dark:bg-black/60 backdrop-blur-2xl border border-gray-100 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-full px-6 py-2' 
              : 'max-w-7xl px-4 sm:px-6 py-4'
          }`}
        >
          {/* Ambient Glows for Scrolled State */}
          {scrolled && (
             <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute -top-10 left-1/4 w-32 h-32 bg-cyan-500/10 blur-[30px] rounded-full"></div>
                <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-purple-500/10 blur-[30px] rounded-full"></div>
             </div>
          )}

          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3 z-50">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className={`relative overflow-hidden rounded-xl border border-black/5 dark:border-white/10 shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300 ${scrolled ? 'w-8 h-8' : 'w-10 h-10 md:w-11 md:h-11'}`}
             >
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover dark:invert-0 invert" />
             </motion.div>
             <span className={`font-black tracking-tighter text-primary dark:text-white uppercase transition-all duration-300 ${scrolled ? 'text-lg md:text-xl' : 'text-xl sm:text-2xl'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-500`}>
               HA Store
             </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop', path: '/products' },
              ].map((item) => (
                <Link 
                  key={item.label}
                  to={item.path} 
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all hover:bg-black/5 dark:hover:bg-white/10 ${location.pathname === item.path ? 'text-cyan-500' : 'text-secondary dark:text-gray-300'}`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div layoutId="nav-pill" className="absolute inset-0 bg-cyan-500/10 rounded-full -z-10" />
                  )}
                </Link>
              ))}

              <Link 
                to="/watch-me" 
                className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all hover:bg-black/5 dark:hover:bg-white/10 ${location.pathname === '/watch-me' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'}`}
              >
                Watch Me
                {location.pathname === '/watch-me' && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-purple-500/10 rounded-full -z-10" />
                )}
              </Link>
              
              {/* Mega Menu Trigger */}
              <div 
                 className="relative"
                 onMouseEnter={() => setShowCategoriesMegaMenu(true)}
                 onMouseLeave={() => setShowCategoriesMegaMenu(false)}
              >
                 <Link to="/categories" className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/10 ${location.pathname === '/categories' ? 'text-cyan-500' : 'text-secondary dark:text-gray-300'}`}>
                    Categories
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showCategoriesMegaMenu ? 'rotate-180' : ''}`} />
                 </Link>
                 
                 {/* Mega Menu Dropdown */}
                 <AnimatePresence>
                   {showCategoriesMegaMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] glass rounded-3xl p-6 shadow-2xl border border-white/10 z-50 flex gap-6 before:content-[''] before:absolute before:-top-4 before:left-0 before:w-full before:h-4"
                      >
                         <div className="flex-1 grid grid-cols-2 gap-4">
                            {[
                              { name: 'Electronics', path: '/products?category=electronics', icon: '💻', color: 'bg-blue-500/10 text-blue-500' },
                              { name: 'Fashion', path: '/products?category=clothing', icon: '👕', color: 'bg-pink-500/10 text-pink-500' },
                              { name: 'Digital Businesses', path: '/products?category=website', icon: '🌐', color: 'bg-indigo-500/10 text-indigo-500' },
                              { name: 'Luxury Assets', path: '/products?category=luxury', icon: '💎', color: 'bg-purple-500/10 text-purple-500' },
                              { name: 'Home & Living', path: '/products?category=home', icon: '🏠', color: 'bg-orange-500/10 text-orange-500' },
                              { name: 'Sports', path: '/products?category=sports', icon: '⚽', color: 'bg-green-500/10 text-green-500' },
                            ].map(cat => (
                               <Link key={cat.name} to={cat.path} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group/link">
                                  <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover/link:scale-110 transition-transform ${cat.color}`}>{cat.icon}</span>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-sm text-primary dark:text-white">{cat.name}</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Explore All</span>
                                  </div>
                               </Link>
                            ))}
                         </div>
                         <div className="w-1/3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-5 flex flex-col justify-end relative overflow-hidden group/featured">
                            <div className="absolute inset-0 bg-black/20 group-hover/featured:bg-transparent transition-colors"></div>
                            <div className="relative z-10 flex flex-col">
                               <span className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Featured</span>
                               <span className="text-xl font-black text-white leading-tight mb-4">New Season Arrival</span>
                               <button className="flex items-center gap-2 text-xs font-bold text-white bg-white/20 backdrop-blur-md w-fit px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                                 Shop Now <ArrowRight className="w-3 h-3" />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                   )}
                 </AnimatePresence>
              </div>
              
              <Link to="/deals" className="px-4 py-2 rounded-full text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 hover:bg-red-500/10 transition-all flex items-center gap-2 group">
                <Flame className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" /> 
                Deals
              </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 relative z-50">
            {/* Search Trigger */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSearchModal(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-primary dark:text-white transition-all group"
            >
               <Search className="h-5 w-5 group-hover:text-cyan-500 transition-colors" />
            </motion.button>
            
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-primary dark:text-white transition-all gap-1"
              >
                  <span className="text-xs font-black uppercase">{currentLang}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 glass border border-white/10 rounded-3xl shadow-2xl py-4 z-50 origin-top-right overflow-hidden"
                  >
                    <div className="px-4 pb-3 border-b border-white/5 mb-2">
                       <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Select Global Language</p>
                    </div>
                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar px-2">
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { code: 'en', label: 'English', flag: '🇬🇧' },
                          { code: 'ur', label: 'Urdu', flag: '🇵🇰' },
                          { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
                          { code: 'zh-CN', label: 'Chinese', flag: '🇨🇳' },
                          { code: 'es', label: 'Spanish', flag: '🇪🇸' },
                          { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
                          { code: 'bn', label: 'Bengali', flag: '🇧🇩' },
                          { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
                          { code: 'ru', label: 'Russian', flag: '🇷🇺' },
                          { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
                          { code: 'de', label: 'German', flag: '🇩🇪' },
                          { code: 'fr', label: 'French', flag: '🇫🇷' },
                          { code: 'tr', label: 'Turkish', flag: '🇹🇷' },
                          { code: 'it', label: 'Italian', flag: '🇮🇹' },
                          { code: 'ko', label: 'Korean', flag: '🇰🇷' },
                          { code: 'fa', label: 'Persian', flag: '🇮🇷' },
                          { code: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
                          { code: 'th', label: 'Thai', flag: '🇹🇭' },
                          { code: 'nl', label: 'Dutch', flag: '🇳🇱' },
                          { code: 'id', label: 'Indonesian', flag: '🇮🇩' },
                          { code: 'ms', label: 'Malay', flag: '🇲🇾' },
                          { code: 'pa', label: 'Punjabi', flag: '🇵🇰' },
                          { code: 'el', label: 'Greek', flag: '🇬🇷' },
                          { code: 'he', label: 'Hebrew', flag: '🇮🇱' },
                          { code: 'sv', label: 'Swedish', flag: '🇸🇪' },
                          { code: 'no', label: 'Norwegian', flag: '🇳🇴' },
                          { code: 'da', label: 'Danish', flag: '🇩🇰' },
                          { code: 'fi', label: 'Finnish', flag: '🇫🇮' },
                          { code: 'pl', label: 'Polish', flag: '🇵🇱' },
                          { code: 'uk', label: 'Ukrainian', flag: '🇺🇦' },
                          { code: 'ro', label: 'Romanian', flag: '🇷🇴' },
                          { code: 'hu', label: 'Hungarian', flag: '🇭🇺' },
                          { code: 'cs', label: 'Czech', flag: '🇨🇿' },
                          { code: 'sk', label: 'Slovak', flag: '🇸🇰' },
                          { code: 'bg', label: 'Bulgarian', flag: '🇧🇬' },
                          { code: 'hr', label: 'Croatian', flag: '🇭🇷' },
                          { code: 'sr', label: 'Serbian', flag: '🇷🇸' },
                          { code: 'sl', label: 'Slovenian', flag: '🇸🇮' },
                          { code: 'et', label: 'Estonian', flag: '🇪🇪' },
                          { code: 'lv', label: 'Latvian', flag: '🇱🇻' },
                          { code: 'lt', label: 'Lithuanian', flag: '🇱🇹' },
                          { code: 'tl', label: 'Tagalog', flag: '🇵🇭' },
                          { code: 'sw', label: 'Swahili', flag: '🇰🇪' },
                          { code: 'am', label: 'Amharic', flag: '🇪🇹' },
                          { code: 'yo', label: 'Yoruba', flag: '🇳🇬' },
                          { code: 'ig', label: 'Igbo', flag: '🇳🇬' },
                          { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
                          { code: 'zu', label: 'Zulu', flag: '🇿🇦' },
                          { code: 'xh', label: 'Xhosa', flag: '🇿🇦' },
                          { code: 'af', label: 'Afrikaans', flag: '🇿🇦' },
                          { code: 'my', label: 'Burmese', flag: '🇲🇲' },
                          { code: 'km', label: 'Khmer', flag: '🇰🇭' },
                          { code: 'lo', label: 'Lao', flag: '🇱🇦' },
                          { code: 'si', label: 'Sinhala', flag: '🇱🇰' },
                          { code: 'ne', label: 'Nepali', flag: '🇳🇵' },
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`flex items-center gap-2 px-3 py-2 text-[10px] transition-all rounded-xl ${currentLang === lang.code ? 'bg-cyan-500/10 text-cyan-500 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                          >
                            <span className="text-base">{lang.flag}</span>
                            <span className="truncate">{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Switcher */}
            <div className="relative" ref={themeRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-primary dark:text-white transition-all"
              >
                  {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              <AnimatePresence>
                {isThemeMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-40 glass border border-white/10 rounded-2xl shadow-2xl py-2 z-50 origin-top-right"
                  >
                    {[
                      { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                      { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                      { id: 'system', label: 'System', icon: <Laptop className="w-4 h-4" /> }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setTheme(item.id); setIsThemeMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${theme === item.id ? 'bg-cyan-500/10 text-cyan-500 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Toggle */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-primary dark:text-white transition-all group"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </motion.button>
            
            {/* Download App Button */}
            {isInstallable && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 rounded-full font-bold text-sm transition-all border border-cyan-500/20 mr-2 group"
              >
                <Download className="w-4 h-4 group-hover:animate-bounce" />
                <span>Install App</span>
              </motion.button>
            )}

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-[2px] rounded-full border border-transparent hover:border-cyan-500/50 transition-all bg-gradient-to-br from-purple-500/20 to-cyan-500/20"
                >
                   <div className="w-8 h-8 rounded-full overflow-hidden bg-black relative">
                       <img src={getProductImageUrl(user?.photo) || DEFAULT_AVATAR} alt="User" className="w-full h-full object-cover" />
                   </div>
                </motion.button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 glass border border-black/5 dark:border-white/10 bg-white/90 dark:bg-black/60 rounded-3xl shadow-2xl py-2 z-50 origin-top-right overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex items-center gap-3">
                        <img src={getProductImageUrl(user?.photo) || DEFAULT_AVATAR} className="w-10 h-10 rounded-full object-cover border border-black/5 dark:border-white/10" />
                        <div className="overflow-hidden">
                           <p className="text-primary dark:text-white font-bold truncate text-sm">{user?.role === 'admin' ? (user?.vendorName || user?.name) : user?.name}</p>
                           <p className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate uppercase font-bold tracking-widest">{user?.email}</p>
                        </div>
                      </div>
                      <div className="py-2">
                         {[
                           { to: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
                           { to: '/my-orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
                           { to: '/wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
                           { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                         ].map(item => (
                           <Link key={item.to} to={item.to} onClick={toggleUserMenu} className="flex items-center px-5 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white transition-colors gap-3">
                             {item.icon} {item.label}
                           </Link>
                         ))}
                      </div>
                      {user?.role === 'admin' && (
                        <div className="border-y border-black/5 dark:border-white/5 py-2 bg-purple-50 dark:bg-purple-500/10">
                          <Link to="/admin/dashboard" onClick={toggleUserMenu} className="flex items-center px-5 py-3 text-sm text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-white font-bold gap-3">
                            <LayoutGrid className="w-4 h-4" /> Admin Panel
                          </Link>
                        </div>
                      )}
                      <div className="pt-1">
                         <button onClick={() => { handleLogout(); toggleUserMenu(); }} className="flex items-center w-full px-5 py-4 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors gap-3 font-bold">
                           <LogOut className="w-4 h-4" /> Logout
                         </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                Login
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="md:hidden w-9 h-9 rounded-full flex flex-col items-center justify-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <motion.span 
                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }}
                className="w-5 h-[2px] bg-primary dark:bg-white" 
              />
              <motion.span 
                animate={{ opacity: isMenuOpen ? 0 : 1 }}
                className="w-5 h-[2px] bg-primary dark:bg-white" 
              />
              <motion.span 
                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }}
                className="w-5 h-[2px] bg-primary dark:bg-white" 
              />
            </motion.button>
          </div>
        </motion.div>
      </nav>

      {/* Ultra-Premium Search Command Palette */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
              onClick={() => setShowSearchModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] dark:shadow-2xl overflow-hidden"
            >
               <form onSubmit={handleSearch} className="flex items-center px-6 py-5 border-b border-black/5 dark:border-white/5">
                  <Search className="w-6 h-6 text-cyan-500 mr-4" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, or categories..."
                    className="w-full bg-transparent border-none outline-none text-xl text-primary dark:text-white placeholder-gray-500 font-medium"
                  />
                  <div className="flex items-center gap-3 ml-4">
                     <span className="hidden sm:inline-block px-2 py-1 bg-black/5 dark:bg-white/5 rounded text-[10px] font-black text-gray-400 border border-black/5 dark:border-white/5">ESC</span>
                     <button type="button" onClick={() => setShowSearchModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500">
                       <X className="w-4 h-4" />
                     </button>
                  </div>
               </form>
               
               <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <SearchSuggestions 
                    suggestions={suggestions}
                    loading={suggestionsLoading}
                    onSelect={handleSuggestionClick}
                    isCommandPalette={true}
                  />
                  
                  {!searchQuery && (
                    <div className="p-8">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Popular Searches</p>
                       <div className="flex flex-wrap gap-3">
                          {['iPhone 15', 'AirPods Pro', 'MacBook Air', 'Smart Watch', 'Gaming Headset'].map(term => (
                            <button 
                              key={term} 
                              onClick={() => {
                                navigate(`/search?q=${encodeURIComponent(term)}`);
                                setSearchQuery("");
                                setShowSearchModal(false);
                                dispatch(clearSuggestions());
                              }} 
                              className="px-5 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-500 text-primary dark:text-white rounded-xl text-sm font-bold transition-all border border-transparent hover:border-cyan-500/30 flex items-center gap-2"
                            >
                               <Search className="w-3 h-3 opacity-50" /> {term}
                            </button>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu is now handled globally by MobileMenu component */}
    </>
  );
}
