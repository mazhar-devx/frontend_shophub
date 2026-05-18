import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const FacebookIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const TwitterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;

export default function BlogPost() {
  const { slug } = useParams();
  
  // Dummy data. In a real app, you would fetch this based on the slug.
  const post = {
    id: slug,
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    content: `
      <p class="lead">Welcome to our comprehensive guide. Whether you're an audiophile looking for the next best thing or a student trying to focus in a noisy dorm, finding the right gear is crucial.</p>
      
      <h2>The Importance of Quality</h2>
      <p>When you invest in premium products, you're not just paying for a brand name. You're paying for durability, advanced engineering, and an experience that cheaper alternatives simply can't match.</p>
      
      <blockquote>"The bitterness of poor quality remains long after the sweetness of low price is forgotten."</blockquote>
      
      <h2>What to Look For</h2>
      <ul>
        <li><strong>Build Quality:</strong> Are the materials premium? Does it feel sturdy?</li>
        <li><strong>Battery Life:</strong> Nobody wants their device dying halfway through the day.</li>
        <li><strong>Comfort:</strong> If you're using it for hours, ergonomics matter.</li>
      </ul>
      
      <h2>Our Top Recommendations</h2>
      <p>After testing dozens of products in this category, we've narrowed it down to our absolute favorites. These models consistently outperformed the competition in our rigorous testing methodology.</p>
      
      <p>Stay tuned for our upcoming deep-dive reviews where we break down each of these models in painstaking detail.</p>
    `,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    category: "Tech Guide",
    author: "Alex Rivers",
    date: "May 18, 2026",
    readTime: "5 min read",
    seoDescription: "A comprehensive guide and review covering the most important aspects you need to know before making your next purchase."
  };

  // Structured Data (JSON-LD) for SEO
  const schemaOrgJSONLD = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.shophub.pro/blog/${slug}`
    },
    "headline": post.title,
    "image": [
      post.image
    ],
    "datePublished": "2026-05-18T08:00:00+08:00",
    "dateModified": "2026-05-18T09:20:00+08:00",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.shophub.pro/logo.png"
      }
    },
    "description": post.seoDescription
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-20">
      <Helmet>
        <title>{post.title} | ShopHub Journal</title>
        <meta name="description" content={post.seoDescription} />
        {/* Open Graph Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.seoDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
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
            className="text-4xl md:text-5xl lg:text-6xl font-black text-primary dark:text-white leading-tight mb-6"
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
               <User className="w-4 h-4" /> {post.author}
            </span>
            <span className="flex items-center gap-2">
               <Calendar className="w-4 h-4" /> {post.date}
            </span>
            <span className="flex items-center gap-2">
               <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </motion.div>
        </header>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden mb-12 shadow-2xl"
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
                <button aria-label="Share on Facebook" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-colors"><FacebookIcon className="w-4 h-4" /></button>
                <button aria-label="Share on Twitter" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-colors"><TwitterIcon className="w-4 h-4" /></button>
                <button aria-label="Share on LinkedIn" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] transition-colors"><LinkedinIcon className="w-4 h-4" /></button>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-10 prose prose-lg dark:prose-invert prose-cyan max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Mobile Share */}
            <div className="lg:hidden mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
               <span className="font-bold text-primary dark:text-white flex items-center gap-2"><Share2 className="w-5 h-5" /> Share this post</span>
               <div className="flex gap-2">
                  <button aria-label="Share on Facebook" className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 text-primary dark:text-white"><FacebookIcon className="w-4 h-4" /></button>
                  <button aria-label="Share on Twitter" className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 text-primary dark:text-white"><TwitterIcon className="w-4 h-4" /></button>
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
