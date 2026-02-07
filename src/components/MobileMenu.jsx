import { Link } from "react-router-dom";
import { useUIStore } from "../zustand/uiStore";
import { useSelector } from "react-redux";

export default function MobileMenu() {
  const { isMenuOpen, toggleMenu } = useUIStore();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isMenuOpen) return null;
  
  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={toggleMenu}
      />
      
      {/* Menu Panel */}
      <div className="absolute inset-y-0 left-0 max-w-full flex animate-fade-in-up">
        <div className="relative w-screen max-w-xs">
          <div className="h-full flex flex-col glass border-r border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Menu</h2>
                <button
                  type="button"
                  className="-m-2 p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={toggleMenu}
                >
                  <span className="sr-only">Close panel</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <nav className="space-y-3">
                {['Home', 'Products', 'Categories', 'Deals'].map((item) => (
                  <Link 
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="block px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/10 hover:text-cyan-400 rounded-xl transition-all"
                    onClick={toggleMenu}
                  >
                    {item}
                  </Link>
                ))}
                
                <div className="border-t border-white/10 my-4 pt-4"></div>
                
                {!isAuthenticated ? (
                  <>
                    <Link 
                      to="/login" 
                      className="block px-4 py-3 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl mb-3 text-center shadow-lg shadow-purple-900/20"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block px-4 py-3 text-base font-medium text-gray-200 border border-white/20 hover:bg-white/5 rounded-xl text-center"
                      onClick={toggleMenu}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/10 hover:text-cyan-400 rounded-xl transition-all"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/10 hover:text-cyan-400 rounded-xl transition-all"
                      onClick={toggleMenu}
                    >
                      My Orders
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="block px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/10 hover:text-cyan-400 rounded-xl transition-all"
                      onClick={toggleMenu}
                    >
                      Wishlist
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        className="block px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl transition-all shadow-lg shadow-purple-900/20 mb-2"
                        onClick={toggleMenu}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      className="block w-full text-left px-4 py-3 text-base font-medium text-red-400 hover:bg-red-500/10 rounded-xl mt-4"
                      onClick={toggleMenu}
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}