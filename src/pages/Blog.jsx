import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      id: "best-wireless-headphones-under-50",
      title: "Best Wireless Headphones Under $50 (2026 Guide)",
      excerpt: "You don't need to spend hundreds to get premium sound. We reviewed the top budget wireless headphones that punch way above their weight class.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      category: "Audio",
      author: "Alex Rivers",
      date: "May 18, 2026",
      readTime: "5 min read"
    },
    {
      id: "gaming-headphones-for-students",
      title: "Top Gaming Headphones for Students on a Budget",
      excerpt: "Finding the perfect balance between studying and gaming? These headsets offer crystal clear mic quality for zoom calls and immersive 3D audio for competitive gaming.",
      image: "https://images.unsplash.com/photo-1599669500516-b600f20e1643?q=80&w=2070&auto=format&fit=crop",
      category: "Gaming",
      author: "Jordan Lee",
      date: "May 15, 2026",
      readTime: "7 min read"
    },
    {
      id: "airpods-alternatives",
      title: "5 AirPods Alternatives That Actually Sound Better",
      excerpt: "Apple's AirPods are great, but these 5 alternatives offer better battery life, superior active noise cancellation, and high-res audio support.",
      image: "https://images.unsplash.com/photo-1606220588913-b3eea895124b?q=80&w=2070&auto=format&fit=crop",
      category: "Tech",
      author: "Sam Taylor",
      date: "May 12, 2026",
      readTime: "6 min read"
    },
    {
      id: "mechanical-vs-membrane-keyboard",
      title: "Mechanical vs Membrane Keyboards: Which is Better?",
      excerpt: "Still typing on a mushy laptop keyboard? It's time to upgrade. Discover the differences between switch types and why your fingers will thank you.",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop",
      category: "Computing",
      author: "Chris Evans",
      date: "May 10, 2026",
      readTime: "8 min read"
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-xl dark:hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col"
            >
              <Link to={`/blog/${post.id}`} className="block relative h-64 overflow-hidden">
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
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
                
                <Link to={`/blog/${post.id}`} className="block group-hover:text-cyan-500 transition-colors">
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-secondary dark:text-gray-400 text-sm mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-primary dark:text-white">{post.author}</span>
                  </div>
                  
                  <Link to={`/blog/${post.id}`} aria-label={`Read ${post.title}`} className="text-cyan-500 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
