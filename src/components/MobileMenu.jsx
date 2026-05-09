import { Link } from "react-router-dom";
import { useUIStore } from "../zustand/uiStore";
import { useSelector } from "react-redux";
import { getProductImageUrl } from "../utils/constants";
import { X, LayoutGrid, ShoppingCart, Package, Flame, Play, LogOut, ChevronRight } from "lucide-react";

export default function MobileMenu() {
  const { isMenuOpen, toggleMenu } = useUIStore();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isMenuOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={toggleMenu}
      />
      
      {/* Menu Panel */}
      <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm flex animate-slide-in-left">
        <div className="relative w-full h-full bg-[#050505] border-r border-white/10 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Navigation</h2>
            <button
              onClick={toggleMenu}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* 1. Auth Section */}
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/login" 
                  className="px-4 py-4 text-sm font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-center shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-4 text-sm font-black text-white border border-white/10 hover:bg-white/5 rounded-2xl text-center hover:scale-[1.02] active:scale-95 transition-all"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link to="/profile" onClick={toggleMenu} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                 <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-lg">
                    <img src={user?.photo ? getProductImageUrl(user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                 </div>
                 <div className="overflow-hidden flex-1">
                    <p className="text-white font-black truncate">{user?.name}</p>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest truncate">{user?.email}</p>
                 </div>
                 <ChevronRight className="w-4 h-4 text-gray-600" />
              </Link>
            )}

            {/* 2. Main Nav */}
            <div className="space-y-2">
              {[
                { label: 'Home', path: '/', icon: <LayoutGrid className="w-5 h-5" /> },
                { label: 'Shop Products', path: '/products', icon: <ShoppingCart className="w-5 h-5" /> },
                { label: 'Categories', path: '/categories', icon: <Package className="w-5 h-5" /> },
                { label: 'Flash Deals', path: '/deals', icon: <Flame className="w-5 h-5" />, special: true },
                { label: 'Watch Me', path: '/watch-me', icon: <Play className="w-5 h-5" />, watch: true },
              ].map((item) => (
                <Link 
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                    item.special ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    item.watch ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={toggleMenu}
                >
                  <span className={`${item.special ? 'text-red-500' : item.watch ? 'text-purple-500' : 'text-cyan-500'} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </span>
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* 3. Account Nav (If authenticated) */}
            {isAuthenticated && (
              <div className="space-y-2 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 ml-4">Account Settings</p>
                {[
                  { label: 'My Orders', path: '/my-orders' },
                  { label: 'Wishlist', path: '/wishlist' },
                  { label: 'Settings', path: '/settings' },
                ].map((item) => (
                  <Link 
                    key={item.label}
                    to={item.path}
                    className="block px-4 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="flex items-center gap-3 px-4 py-4 mt-4 text-sm font-black text-white bg-gradient-to-r from-purple-600/50 to-indigo-600/50 rounded-2xl border border-purple-500/30"
                    onClick={toggleMenu}
                  >
                    Admin Panel
                  </Link>
                )}

                <button 
                  className="flex items-center gap-3 w-full px-4 py-4 mt-6 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                  onClick={toggleMenu}
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-black/40 border-t border-white/5">
            <p className="text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest">© 2024 HA Store Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
