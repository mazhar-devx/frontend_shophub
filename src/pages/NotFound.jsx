import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Search, ShoppingBag, ArrowLeft, Layers } from 'lucide-react';

export default function NotFound({ 
  title = "Page Not Found", 
  message = "The page or product you are looking for does not exist, was removed, or has moved to a new address." 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <Helmet>
        <title>{title} (404) | ShopHub</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content="The page you requested could not be found on ShopHub.pro." />
      </Helmet>

      <div className="max-w-xl w-full text-center space-y-8">
        {/* Glow & Badge */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full blur-2xl"></div>
          <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            HTTP 404 Error
          </span>
        </div>

        {/* Big Glitch 404 */}
        <h1 className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-600 bg-clip-text text-transparent">
          404
        </h1>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* In-page Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, brands, categories..."
            aria-label="Search ShopHub products"
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>

        {/* Navigation Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-lg"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Catalog
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <Layers className="w-4 h-4" /> All Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
