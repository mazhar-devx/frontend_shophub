import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUIStore } from "../zustand/uiStore";
import { useSelector } from "react-redux";
import { getProductImageUrl } from "../utils/constants";
import { X, LayoutGrid, ShoppingCart, Package, Flame, Play, LogOut, ChevronRight, User, LogIn, UserPlus, BookOpen, Music2, Download } from "lucide-react";

export default function MobileMenu() {
  const { isMenuOpen, toggleMenu, theme, setTheme } = useUIStore();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("preferred_lang") || "en");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
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
      toggleMenu();
    }
  };

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
      setCurrentLang(langCode);
    }
  };
  
  if (!isMenuOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[150] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={toggleMenu}
      />
      
      {/* Menu Panel */}
      <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm flex animate-slide-in-left">
        <div className="relative w-full h-full bg-white dark:bg-[#050505] border-r border-black/5 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden">
          
          {/* 1. STICKY TOP: Auth Section (Always visible) */}
          <div className="p-6 border-b border-black/5 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0a]">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Account</h2>
                <button
                  onClick={toggleMenu}
                  aria-label="Close mobile menu"
                  className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

            {!isAuthenticated ? (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 text-sm font-black text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-center shadow-lg shadow-cyan-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                  onClick={toggleMenu}
                >
                  <LogIn className="w-5 h-5" /> Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 text-sm font-black text-primary dark:text-white border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl text-center hover:scale-[1.02] active:scale-95 transition-all"
                  onClick={toggleMenu}
                >
                  <UserPlus className="w-5 h-5" /> Create Account
                </Link>
              </div>
            ) : (
              <Link to="/profile" onClick={toggleMenu} className="flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                 <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-lg">
                    <img src={user?.photo ? getProductImageUrl(user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                 </div>
                 <div className="overflow-hidden flex-1">
                    <p className="text-primary dark:text-white font-black truncate">{user?.name}</p>
                    <p className="text-[10px] text-cyan-500 dark:text-cyan-400 font-bold uppercase tracking-widest truncate">{user?.email}</p>
                 </div>
                 <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              </Link>
            )}
             
             {isInstallable && (
               <button
                 onClick={handleInstallClick}
                 className="flex items-center justify-center gap-3 w-full mt-4 px-4 py-3 text-sm font-black text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl hover:bg-cyan-500/20 active:scale-95 transition-all"
               >
                 <Download className="w-5 h-5" /> Install App
               </button>
             )}
          </div>
          
          {/* 2. SCROLLABLE CONTENT: Navigation */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-gradient-to-b from-white to-gray-50 dark:from-[#050505] dark:to-black">
            <div>
               <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</p>
               <div className="space-y-2">
                 {[
                   { label: 'Home', path: '/', icon: <LayoutGrid className="w-5 h-5" /> },
                   { label: 'Shop Products', path: '/products', icon: <ShoppingCart className="w-5 h-5" /> },
                   { label: 'Categories', path: '/categories', icon: <Package className="w-5 h-5" /> },
                   { label: 'Flash Deals', path: '/deals', icon: <Flame className="w-5 h-5" />, special: true },
                   { label: 'Watch Me', path: '/watch-me', icon: <Play className="w-5 h-5" />, watch: true },
                   { label: 'Music', path: '/songs', icon: <Music2 className="w-5 h-5" />, music: true },
                   { label: 'Journal', path: '/blog', icon: <BookOpen className="w-5 h-5" /> },
                 ].map((item) => (
                   <Link 
                     key={item.label}
                     to={item.path}
                     className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                       item.special ? 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20' :
                       item.watch ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                       item.music ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20' :
                       'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'
                     }`}
                     onClick={toggleMenu}
                   >
                     <span className={`${item.special ? 'text-red-500' : item.watch ? 'text-purple-500' : item.music ? 'text-cyan-500' : 'text-cyan-600 dark:text-cyan-500'} group-hover:scale-110 transition-transform`}>
                       {item.icon}
                     </span>
                     <span className="font-bold">{item.label}</span>
                   </Link>
                 ))}
               </div>
            </div>

            {/* 3. Account Settings (If authenticated) */}
            {isAuthenticated && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-4 ml-2">Account Settings</p>
                <div className="space-y-1">
                   {[
                     { label: 'My Orders', path: '/my-orders' },
                     { label: 'Wishlist', path: '/wishlist' },
                     { label: 'Settings', path: '/settings' },
                   ].map((item) => (
                     <Link 
                       key={item.label}
                       to={item.path}
                       className="block px-4 py-3 text-sm font-bold text-gray-500 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                       onClick={toggleMenu}
                     >
                       {item.label}
                     </Link>
                   ))}
                   
                   {user?.role === 'admin' && (
                     <Link 
                       to="/admin/dashboard" 
                       className="flex items-center gap-3 px-4 py-4 mt-4 text-sm font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-600/50 dark:to-indigo-600/50 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-900/20"
                       onClick={toggleMenu}
                     >
                       Admin Panel
                     </Link>
                   )}

                   <button 
                     className="flex items-center gap-3 w-full px-4 py-4 mt-6 text-sm font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all border border-red-100 dark:border-red-500/10"
                     onClick={toggleMenu}
                   >
                     <LogOut className="w-5 h-5" /> Logout
                   </button>
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/10 mt-6">
               <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] ml-2">Preferences</p>
               <div className="flex gap-4">
                  {/* Theme Switcher Toggle */}
                  <div className="flex-1">
                     <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Theme</span>
                     <select
                       value={theme}
                       onChange={(e) => setTheme(e.target.value)}
                       className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary dark:text-white px-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
                     >
                       <option value="light">☀️ Light</option>
                       <option value="dark">🌙 Dark</option>
                       <option value="system">💻 System</option>
                     </select>
                  </div>
                  {/* Language Selector Toggle */}
                  <div className="flex-1">
                     <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Language</span>
                     <select
                       value={currentLang}
                       onChange={(e) => changeLanguage(e.target.value)}
                       className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary dark:text-white px-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none"
                     >
                       <option value="en">English</option>
                       <option value="ur">Urdu</option>
                       <option value="ar">Arabic</option>
                       <option value="es">Spanish</option>
                       <option value="fr">French</option>
                       <option value="zh-CN">Chinese</option>
                     </select>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-gray-100 dark:bg-black border-t border-black/5 dark:border-white/5">
            <p className="text-[10px] text-center text-gray-500 dark:text-gray-600 font-bold uppercase tracking-widest leading-relaxed">HA Store Premium Experience<br/>© 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
