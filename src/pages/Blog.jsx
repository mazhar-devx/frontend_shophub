import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User, Loader2, Sparkles, BookOpen } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import { BUYING_GUIDES } from "../data/buyingGuides";

export default function Blog() {
  const [backendPosts, setBackendPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs?limit=all');
        const list = res.data?.data?.blogs || [];
        // Filter out thin auto-generated spotlight blogs from main editorial feed
        const nonSpotlight = list.filter(b => b.category !== 'Product Spotlight');
        setBackendPosts(nonSpotlight);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Merge curated comprehensive buying guides with genuine editorial posts
  const allPosts = useMemo(() => {
    const combined = [...BUYING_GUIDES, ...backendPosts];
    // Remove duplicate slugs if any
    const uniqueMap = new Map();
    combined.forEach(p => {
      if (!uniqueMap.has(p.slug)) uniqueMap.set(p.slug, p);
    });
    return Array.from(uniqueMap.values());
  }, [backendPosts]);

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    allPosts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return allPosts;
    return allPosts.filter(p => p.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-20">
      <Helmet>
        <title>ShopHub Journal | Tech Reviews, Buyer Guides & Online Shopping Pakistan</title>
        <meta 
          name="description" 
          content="Explore expert buying guides, smart tech reviews, fashion insights, and safe online shopping advice in Pakistan on the ShopHub Journal." 
        />
        <link rel="canonical" href="https://www.shophub.pro/blog" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:title" content="ShopHub Journal | Tech Reviews, Buyer Guides & Online Shopping Pakistan" />
        <meta property="og:description" content="Explore expert buying guides, smart tech reviews, fashion insights, and safe online shopping advice in Pakistan." />
        <meta property="og:url" content="https://www.shophub.pro/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ShopHub" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden border-b border-black/5 dark:border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 dark:from-cyan-900/20 dark:to-purple-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Editorial & Shopping Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-primary dark:text-white tracking-tight mb-4"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">ShopHub</span> Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-secondary dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            In-depth buying guides, tech reviews, PTA verification tutorials, and consumer advice to help you shop smart across Pakistan.
          </motion.p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white dark:bg-white dark:text-black shadow-lg"
                    : "bg-gray-100 dark:bg-white/5 text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
             <h3 className="text-2xl font-bold text-gray-500">No articles found in this category.</h3>
             <button 
               onClick={() => setSelectedCategory("All")}
               className="text-cyan-500 font-bold mt-2 hover:underline inline-block"
             >
               View All Articles
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article 
                key={post.slug || post._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.08, 0.4) }}
                className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl dark:hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="block relative h-56 sm:h-64 overflow-hidden bg-gray-100 dark:bg-black/40">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category || "Journal"}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" /> 
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'March 2026'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" /> 
                      {post.readTime || "5 min read"}
                    </span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} className="block group-hover:text-cyan-500 transition-colors">
                    <h2 className="text-xl font-bold text-primary dark:text-white mb-3 line-clamp-2 leading-snug">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-secondary dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {post.excerpt || post.seoDescription || (typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) : '')}
                  </p>
                  
                  <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between mt-auto">
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <User className="w-3 h-3" /> {post.author || "ShopHub"}
                    </span>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="inline-flex items-center gap-1 text-xs font-black text-cyan-500 group-hover:translate-x-1 transition-transform"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
