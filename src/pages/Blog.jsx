import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setPosts(res.data.data.blogs);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-20">
      <Helmet>
        <title>Tech & Lifestyle Blog | ShopHub.pro</title>
        <meta name="description" content="Discover the latest in tech, fashion, and lifestyle. Read our expert guides, product reviews, and shopping tips." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden border-b border-black/5 dark:border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 dark:from-cyan-900/20 dark:to-purple-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-primary dark:text-white tracking-tighter mb-6"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">ShopHub</span> Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary dark:text-gray-400 max-w-2xl mx-auto"
          >
            Insights, reviews, and guides on the latest tech, fashion, and digital trends.
          </motion.p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
             <h3 className="text-2xl font-bold text-gray-500">No blog posts found.</h3>
             <p className="text-gray-400 mt-2">Check back later for new updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article 
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl dark:hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col"
            >
              <Link to={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
                
                <Link to={`/blog/${post.slug}`} className="block group-hover:text-cyan-500 transition-colors">
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-secondary dark:text-gray-400 text-sm mb-6 line-clamp-3">
                  {post.seoDescription}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-primary dark:text-white">{post.author}</span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`} className="text-cyan-500 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
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
