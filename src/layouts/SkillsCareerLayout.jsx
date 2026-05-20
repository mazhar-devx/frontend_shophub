import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Home, BookOpen, Video, Calendar, FileText, 
  PenTool, Edit3, Monitor, Eye, Clock, Library, 
  Star, DollarSign, MessageSquare, ChevronDown, LogOut
} from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { DEFAULT_AVATAR, getProductImageUrl } from "../utils/constants";

export default function SkillsCareerLayout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/skills-career');
  };

  const navLinks = [
    { name: "Academic", path: "/skills-career/academic", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Live Classes", path: "/skills-career/live-classes", icon: <Video className="w-4 h-4" /> },
    { name: "Leave", path: "/skills-career/leave", icon: <Calendar className="w-4 h-4" /> },
    { name: "Attachments", path: "/skills-career/attachments", icon: <FileText className="w-4 h-4" /> },
    { name: "Homework", path: "/skills-career/homework", icon: <PenTool className="w-4 h-4" /> },
    { name: "Exam Master", path: "/skills-career/exam-master", icon: <Edit3 className="w-4 h-4" /> },
    { name: "Online Exam", path: "/skills-career/online-exam", icon: <Monitor className="w-4 h-4" /> },
    { name: "Supervision", path: "/skills-career/supervision", icon: <Eye className="w-4 h-4" /> },
    { name: "Attendance", path: "/skills-career/attendance", icon: <Clock className="w-4 h-4" /> },
    { name: "Library", path: "/skills-career/library", icon: <Library className="w-4 h-4" /> },
    { name: "Events", path: "/skills-career/events", icon: <Star className="w-4 h-4" /> },
    { name: "Fees History", path: "/skills-career/fees-history", icon: <DollarSign className="w-4 h-4" /> },
    { name: "Messages", path: "/skills-career/messages", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // For desktop header, show 4 items and put the rest in dropdown
  const visibleLinks = navLinks.slice(0, 4);
  const dropdownLinks = navLinks.slice(4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-primary dark:text-white font-sans transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-cyan-500 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              
              <Link to="/skills-career" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 uppercase">
                  Skills - Career
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center ml-8">
                <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <Home className="w-4 h-4" /> Home
                </Link>
                
                {visibleLinks.map(link => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                      location.pathname === link.path 
                        ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {link.icon} {link.name}
                  </Link>
                ))}

                {/* More Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    More <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                      >
                        {dropdownLinks.map(link => (
                          <Link 
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                              location.pathname === link.path
                                ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <span className={location.pathname === link.path ? 'text-cyan-500' : 'text-gray-400'}>
                              {link.icon}
                            </span>
                            {link.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex justify-center">
                <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <Home className="w-4 h-4" /> Home
                </Link>
              </div>
            )}

            {/* User Area */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-primary dark:text-white leading-none">{user?.name}</p>
                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider mt-1">Student</p>
                  </div>
                  <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500 p-[2px]">
                      <img 
                        src={getProductImageUrl(user?.photo) || DEFAULT_AVATAR} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {/* Hover profile menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white rounded-full font-bold text-sm transition-opacity shadow-lg shadow-cyan-500/20">
                  Login to Access
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/10 z-[70] flex flex-col shadow-2xl lg:hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500 p-[2px]">
                  <img 
                    src={getProductImageUrl(user?.photo) || DEFAULT_AVATAR} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-primary dark:text-white">{user?.name}</p>
                  <p className="text-xs text-cyan-500 font-bold uppercase tracking-wider mt-0.5">Student</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
              <Link 
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mb-2"
              >
                <Home className="w-5 h-5 text-gray-400" /> Home
              </Link>
              <div className="h-px bg-gray-100 dark:bg-white/5 my-2 mx-4" />
              
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-l-2 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <span className={location.pathname === link.path ? 'text-cyan-500' : 'text-gray-400'}>
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-white/5">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
