import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { categories as staticCategories } from "../data/categories";

export default function Categories() {
  const [stats, setStats] = useState({}); // Map of category ID -> count
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [mergedCategories, setMergedCategories] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/products/categories`);
        const statsMap = {};
        const dynamicCats = [];
        
        // standardise the static IDs for check
        const staticIds = new Set(staticCategories.map(c => c.id.toLowerCase()));

        if (response.data.data.stats) {
            response.data.data.stats.forEach(item => {
                const normalizedId = item._id.toLowerCase();
                statsMap[normalizedId] = item.numProducts;
                
                // If this category is NOT in our static list, add it dynamically
                if (!staticIds.has(normalizedId)) {
                    dynamicCats.push({
                        id: item._id, // Use original casing for display if needed, or normalized
                        name: item._id, // The _id is the category name
                        icon: "📦", // Default icon
                        isDynamic: true
                    });
                }
            });
        }
        
        setStats(statsMap);
        setMergedCategories([...staticCategories, ...dynamicCats]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load category stats", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Filter categories
  const filteredCategories = mergedCategories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Optional: Filter by 'Popular' (has products) or 'All'
      const hasProducts = stats[cat.id.toLowerCase()] > 0 || (stats[cat.name.toLowerCase()] > 0);
      if (activeFilter === "Popular") return matchesSearch && hasProducts;
      return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center items-center relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse"></div>
         </div>
         <div className="relative">
             <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-purple-500">HA</div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent"></div>
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 tracking-tighter animate-fade-in-down">
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Collections</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                Dive into our curated categories. From latest tech to fashion trends, find exactly what you're looking for.
            </p>
            
            {/* Search & Filter Bar */}
            <div className="max-w-2xl mx-auto mt-10 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl animate-fade-in-up delay-200">
                <div className="relative flex-grow">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search categories..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none text-white pl-12 pr-4 py-3 focus:ring-0 placeholder-gray-500"
                    />
                </div>
                <div className="flex bg-black/20 rounded-xl p-1">
                    {['All', 'Popular'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === filter ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 animate-fade-in-up delay-300">
          {filteredCategories.map((cat, index) => {
             const count = stats[cat.id.toLowerCase()] || stats[cat.name.toLowerCase()] || 0;
             return (
                <Link 
                  key={cat.id || cat.name}
                  to={`/products?category=${encodeURIComponent(cat.id || cat.name)}`}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-600/0 rounded-3xl blur-xl group-hover:from-cyan-500/20 group-hover:to-purple-600/20 transition-all duration-500 -z-10 group-hover:scale-105"></div>
                  
                  <div className="glass h-full border border-white/5 hover:border-white/20 rounded-3xl p-6 flex flex-col items-center text-center transition-all duration-300 transform group-hover:-translate-y-2 bg-[#0a0a0a]/40 backdrop-blur-md relative overflow-hidden">
                      
                      {/* Hover Shine */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      <div className="mb-4 relative">
                          <div className="text-4xl sm:text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 filter drop-shadow-lg">
                              {cat.icon}
                          </div>
                          {count > 0 && (
                              <span className="absolute -top-2 -right-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-black animate-pulse">
                                  {count}
                              </span>
                          )}
                      </div>
                      
                      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all">
                          {cat.name}
                      </h3>
                      
                      <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                          <span className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1">
                              View Products <span className="text-lg">→</span>
                          </span>
                      </div>
                  </div>
                </Link>
             );
          })}
        </div>

        {filteredCategories.length === 0 && (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No categories found</h3>
                <p className="text-gray-400">Try adjusting your search terms.</p>
            </div>
        )}
      </div>
    </div>
  );
}
