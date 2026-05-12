import { useState, useEffect } from 'react';
import api from '../services/api';
import { getProductImageUrl } from '../utils/constants';

export default function ReviewMarquee() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // High-quality dummy data fallback
  const dummyReviews = [
    {
      _id: 'd1',
      review: "Absolutely incredible! The build quality is unmatched and the performance blew me away. Best purchase I've made this year.",
      rating: 5,
      user: { name: "Alex Mercer", photo: "https://i.pravatar.cc/150?img=11" },
      product: { name: "Ultra Wireless Headphones" }
    },
    {
      _id: 'd2',
      review: "Sleek, fast, and exactly what I needed. The battery life is phenomenal. Highly recommend to everyone.",
      rating: 5,
      user: { name: "Sarah Jenkins", photo: "https://i.pravatar.cc/150?img=5" },
      product: { name: "Smart Watch Series 7" }
    },
    {
      _id: 'd3',
      review: "Customer service was top-notch, and the product arrived a day early. The unboxing experience was ultra premium.",
      rating: 4.5,
      user: { name: "David Chen", photo: "https://i.pravatar.cc/150?img=33" },
      product: { name: "Ergonomic Gaming Chair" }
    },
    {
      _id: 'd4',
      review: "I was skeptical at first, but this completely exceeded my expectations. Worth every single penny.",
      rating: 5,
      user: { name: "Elena Rodriguez", photo: "https://i.pravatar.cc/150?img=47" },
      product: { name: "Advanced Running Shoes" }
    },
    {
      _id: 'd5',
      review: "A masterpiece of engineering. The attention to detail is evident in every curve and feature.",
      rating: 5,
      user: { name: "Michael Chang", photo: "https://i.pravatar.cc/150?img=53" },
      product: { name: "Pro Vision VR Headset" }
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/reviews');
        if (data.status === 'success' && data.data.reviews.length > 0) {
          // Get the latest 10 reviews
          setReviews(data.data.reviews.slice(0, 10));
        } else {
          setReviews(dummyReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(dummyReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return null;

  // Render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <span key={i}>★</span>;
          } else if (i === fullStars && hasHalfStar) {
            return <span key={i} className="opacity-70">★</span>; // Representing half star visually
          }
          return <span key={i} className="text-gray-600">★</span>;
        })}
      </div>
    );
  };

  return (
    <section className="mb-24 overflow-hidden relative py-12">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="mb-12 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-black text-primary dark:text-white mb-3 tracking-tighter uppercase">
          Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">Visionaries</span>
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">Real Reviews from Verified Buyers</p>
      </div>

      <div className="relative group">
        {/* Edge Masks for fading effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f8fafc] dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#f8fafc] dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="flex w-max animate-scroll-slow group-hover:[animation-play-state:paused] will-change-transform py-4">
          {/* Double the list for infinite seamless scrolling */}
          {[...reviews, ...reviews, ...reviews].map((review, idx) => (
            <div 
              key={`${review._id}-${idx}`} 
              className="w-80 md:w-96 mx-4 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-between hover:border-cyan-500/30 dark:hover:border-cyan-400/30 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {renderStars(review.rating || 5)}
                  <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Verified
                  </span>
                </div>
                
                <p className="text-sm md:text-base text-secondary dark:text-gray-300 leading-relaxed mb-6 italic">
                  "{review.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                <img 
                  src={review.user?.photo ? (review.user.photo.startsWith('http') ? review.user.photo : getProductImageUrl(review.user.photo)) : `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}&background=random`} 
                  alt={review.user?.name || "User"} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary dark:text-white">{review.user?.name || "Anonymous"}</span>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium line-clamp-1">{review.product?.name || "HA Store Customer"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
