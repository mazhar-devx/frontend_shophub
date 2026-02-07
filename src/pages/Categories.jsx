import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/products/categories`);
        setCategories(response.data.data.stats);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories");
        setLoading(false);
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const getRandomGradient = (index) => {
    const gradients = [
      "from-purple-500 to-indigo-600",
      "from-cyan-400 to-blue-500",
      "from-pink-500 to-rose-500",
      "from-amber-400 to-orange-500",
      "from-emerald-400 to-teal-500",
      "from-fuchsia-500 to-purple-600",
      "from-blue-500 to-indigo-600",
      "from-rose-400 to-red-500"
    ];
    return gradients[index % gradients.length];
  };

  const getRandomIcon = (category) => {
    // Simple mapping or random fallback
    const lower = category.toLowerCase();
    if (lower.includes('phone') || lower.includes('mobile')) return "📱";
    if (lower.includes('laptop') || lower.includes('comp')) return "💻";
    if (lower.includes('audio') || lower.includes('music') || lower.includes('head')) return "🎧";
    if (lower.includes('watch') || lower.includes('wear')) return "⌚";
    if (lower.includes('camera') || lower.includes('photo')) return "📷";
    if (lower.includes('game') || lower.includes('console')) return "🎮";
    if (lower.includes('tv') || lower.includes('vision')) return "📺";
    if (lower.includes('shoe') || lower.includes('cloth') || lower.includes('fashion')) return "👕";
    return "🛍️";
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Category</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore our wide range of products organized for your convenience.
            </p>
        </div>

        {error ? (
          <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-xl max-w-md mx-auto border border-red-500/20">
            {error}
          </div>
        ) : categories.length === 0 ? (
           <div className="text-center text-gray-400 py-12 bg-black/20 rounded-3xl border border-white/5">
             <p className="text-xl">No categories found yet.</p>
             <p className="mt-2 text-sm text-gray-500">Admin needs to add products to create categories.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link 
                to={`/products?category=${encodeURIComponent(cat._id)}`}
                key={cat._id}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="glass h-full border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden flex flex-col items-center text-center z-10">
                    
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${getRandomGradient(index)} opacity-10 rounded-bl-full`}></div>
                    
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getRandomGradient(index)} flex items-center justify-center text-4xl mb-6 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300`}>
                        {getRandomIcon(cat._id)}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{cat._id}</h3>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mt-auto">
                        <span className="bg-white/10 px-3 py-1 rounded-full border border-white/5">
                            {cat.numProducts} Product{cat.numProducts !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="mt-6 flex items-center text-cyan-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        Browse Collection 
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
