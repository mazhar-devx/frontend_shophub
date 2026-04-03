import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function AdminLayout() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Redirect if not admin or not authenticated
  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      navigate('/'); 
    }
  }, [user, navigate, loading]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Check for token in localStorage to prevent premature redirect before loadUser runs
  const token = localStorage.getItem('token');

  // If loading, OR if we have a token but no user (waiting for loadUser), show loader
  if (loading || (token && !user)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If we reach here and have no user, it means loadUser failed or no token existed.
  // Don't render outlet, just return null (useEffect will redirect).
  if (!user || user.role !== 'admin') {
      return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Add Product', path: '/admin/products/new', icon: '➕' },
    { name: 'Orders', path: '/admin/orders', icon: '🛍️' },
    { name: 'Customers', path: '/admin/customers', icon: '👥' },
    { name: 'Reviews', path: '/admin/reviews', icon: '⭐' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { name: 'Marketing', path: '/admin/marketing', icon: '📢' },
    { name: 'Banner', path: '/admin/banner', icon: '🖼️' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
         <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-cyan-900/10 rounded-full blur-[100px] animate-float"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 h-screen transition-all duration-300 ease-in-out glass border-r border-white/10 flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isSidebarOpen ? 'w-64' : 'w-64 md:w-20'} 
        `}
      >
        <div className="h-20 flex items-center justify-center border-b border-white/10 relative">
          <Link to="/" className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0 w-0 overflow-hidden'} md:block ${!isSidebarOpen && 'hidden'}`}>
            NEXUS<span className="text-white">ADMIN</span>
          </Link>
          {/* Logo Icon for collapsed state */}
          <span className={`text-2xl absolute transition-opacity duration-300 ${!isSidebarOpen && !isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>⚡</span>
          
          {/* Collapse Button (Desktop Only) */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-800 border border-white/20 rounded-full p-1 text-xs hover:bg-gray-700 transition-colors z-50">
            {isSidebarOpen ? '◀' : '▶'}
          </button>

          {/* Close Button (Mobile Only) */}
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const linkClasses = `flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive ? 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white shadow-lg shadow-purple-900/30 border border-white/10' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={linkClasses}
              >
                {isActive && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
                <span className="text-xl mr-3 relative z-10">{item.icon}</span>
                <span className={`font-medium whitespace-nowrap transition-all duration-300 relative z-10 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'md:opacity-0 md:-translate-x-10 md:w-0 overflow-hidden'}`}>
                  {item.name}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                   <div className="hidden md:block absolute left-full top-0 ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/10 shadow-xl">
                      {item.name}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
           <button 
             onClick={handleLogout}
             className={`flex items-center w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-all ${isSidebarOpen ? '' : 'justify-center'}`}
           >
             <span className="text-xl mr-3">🚪</span>
             {isSidebarOpen && <span className="font-medium">Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-20 glass border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-black/20 backdrop-blur-md">
           <div className="flex items-center">
               {/* Mobile Menu Button */}
               <button 
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden mr-4 p-2 text-gray-300 hover:text-white focus:outline-none"
               >
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   </svg>
               </button>

               <div className="flex items-center text-gray-400 text-sm breadcrumbs">
                  <span className="hidden sm:inline mr-2">Admin</span> <span className="hidden sm:inline">/</span> <span className="ml-0 sm:ml-2 text-white font-medium capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
               </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative group">
                 <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                 </button>
              </div>
              
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-white">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-400">Super Administrator</p>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px]">
                    <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                       {user?.name?.charAt(0) || 'A'}
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
