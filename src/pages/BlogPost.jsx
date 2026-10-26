import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Clock, User, Share2, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../services/api";
import NotFound from "./NotFound";
import { BUYING_GUIDES } from "../data/buyingGuides";

const FacebookIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const TwitterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local curated buying guides first
    const curatedGuide = BUYING_GUIDES.find(g => g.slug === slug);
    if (curatedGuide) {
      setPost(curatedGuide);
      setLoading(false);
      return;
    }

    // 2. Fetch from backend API
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`);
        setPost(res.data.data.blog);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-20 flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <NotFound 
        title="Article Not Found"
        message="The journal article or review you are looking for does not exist or has been removed."
      />
    );
  }

  const postSlug = post.slug || slug;
  const canonicalUrl = `https://www.shophub.pro/blog/${postSlug}`;
  const isThinSpotlight = post.category === 'Product Spotlight';
  const metaDescription = post.seoDescription || post.excerpt || (typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : 'ShopHub Journal article');

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": post.title,
    "image": [
      post.image
    ],
    "datePublished": post.createdAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.createdAt || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author || "ShopHub Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.shophub.pro/logo.png"
      }
    },
    "description": metaDescription
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-20">
      <Helmet>
        <title>{post.title} | ShopHub Journal</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {isThinSpotlight ? (
          <meta name="robots" content="noindex, follow" />
        ) : (
          <meta name="robots" content="index, follow, max-image-preview:large" />
        )}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${post.title} | ShopHub Journal`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="ShopHub" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | ShopHub Journal`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={post.image} />
        
        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-cyan-500 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className="bg-cyan-500/10 text-cyan-500 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              {post.category}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-primary dark:text-white leading-tight mb-6"
          >
            {post.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium"
          >
            <span className="flex items-center gap-2">
               <User className="w-4 h-4 text-cyan-500" /> {post.author || "ShopHub Editorial"}
            </span>
            <span className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-cyan-500" /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'March 2026'}
            </span>
            <span className="flex items-center gap-2">
               <Clock className="w-4 h-4 text-cyan-500" /> {post.readTime || '5 min read'}
            </span>
          </motion.div>
        </header>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full h-[320px] md:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden mb-12 shadow-2xl relative"
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Social Share Sidebar (Sticky) */}
          <div className="hidden lg:block lg:col-span-1">
             <div className="sticky top-32 flex flex-col items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                   Share Post
                </span>
                <div className="w-[1px] h-12 bg-black/10 dark:bg-white/10 my-2"></div>
                <button aria-label="Share on Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`, '_blank')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-colors"><FacebookIcon className="w-4 h-4" /></button>
                <button aria-label="Share on Twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`, '_blank')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-colors"><TwitterIcon className="w-4 h-4" /></button>
                <button aria-label="Share on LinkedIn" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`, '_blank')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] transition-colors"><LinkedinIcon className="w-4 h-4" /></button>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-11 prose prose-lg dark:prose-invert prose-cyan max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Trust Banner inside Article */}
            <div className="not-prose my-12 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-primary dark:text-white mb-1">Shop With Total Confidence on ShopHub.pro</h4>
                <p className="text-xs text-secondary dark:text-gray-400">Cash on Delivery nationwide, 7-day checking warranty, and dedicated support at care@shophub.pro.</p>
              </div>
              <Link to="/products" className="px-5 py-2.5 rounded-xl bg-primary text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity">
                Explore Store
              </Link>
            </div>

            {/* Mobile Share */}
            <div className="lg:hidden mt-8 pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
               <span className="font-bold text-primary dark:text-white flex items-center gap-2"><Share2 className="w-5 h-5" /> Share this post</span>
               <div className="flex gap-2">
                  <button aria-label="Share on Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`, '_blank')} className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 text-primary dark:text-white"><FacebookIcon className="w-4 h-4" /></button>
                  <button aria-label="Share on Twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`, '_blank')} className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 text-primary dark:text-white"><TwitterIcon className="w-4 h-4" /></button>
               </div>
            </div>
          </div>
          
        </div>
      </article>
      
      {/* Newsletter CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-20">
         <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-black text-primary dark:text-white mb-4">Never Miss an Update</h3>
            <p className="text-secondary dark:text-gray-400 mb-8 max-w-xl mx-auto">Join our newsletter to get the latest guides, reviews, and exclusive tech deals delivered straight to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
               <input 
                  type="email" 
                  placeholder="Enter your email" 
                  aria-label="Email address"
                  className="flex-1 bg-white dark:bg-[#050505] border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all font-medium"
               />
               <button type="submit" className="bg-primary dark:bg-white text-white dark:text-black font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity">
                  Subscribe
               </button>
            </form>
         </div>
      </div>
    </div>
  );
}
