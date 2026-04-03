import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../features/reviews/reviewSlice";
import { useUIStore } from "../zustand/uiStore";

export default function ProductReviews({ productId, reviews }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.reviews);
  const { showToast } = useUIStore();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showToast("Please login to submit a review", "error");
      return;
    }
    
    if (rating === 0) {
      showToast("Please select a rating", "error");
      return;
    }
    
    if (reviewText.trim().length < 10) {
      showToast("Review must be at least 10 characters long", "error");
      return;
    }
    
    dispatch(createReview({
      productId,
      reviewData: {
        rating,
        review: reviewText
      }
    })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        showToast("Review submitted successfully!", "success");
        setRating(0);
        setReviewText("");
      } else {
        showToast(result.payload?.message || "Failed to submit review", "error");
      }
    });
  };

  return (
    <div className="mt-12 glass border border-white/10 rounded-3xl p-8 mb-12">
      <h3 className="text-2xl font-bold mb-8 text-white flex items-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Customer Reviews</span>
        <span className="ml-4 text-sm font-normal text-gray-500 bg-white/5 py-1 px-3 rounded-full border border-white/5">{reviews ? reviews.length : 0} Reviews</span>
      </h3>
      
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4 md:space-y-6 mb-12">
          {reviews.map((review) => (
            <div key={review._id} className="bg-black/20 border border-white/5 rounded-2xl p-4 md:p-6 hover:bg-black/30 transition-colors">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs md:text-base font-bold mr-3 md:mr-4 shadow-lg">
                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-white leading-tight">{review.user?.name || 'User'}</h4>
                    <div className="flex text-yellow-500 text-[10px] md:text-sm mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-2.5 h-2.5 md:w-3 md:h-3 ${i < review.rating ? 'fill-current' : 'text-gray-700 fill-current'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 font-medium bg-white/5 py-1 px-2 md:px-3 rounded-full">
                  {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed md:pl-14">{review.review}</p>
              
              {review.aiReply && (
                <div className="mt-4 md:ml-14 p-3 md:p-4 glass border border-cyan-500/20 bg-cyan-500/5 rounded-xl md:rounded-2xl animate-fade-in relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-cyan-400/5 rounded-full blur-2xl -z-10"></div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] md:text-sm shadow-lg shadow-cyan-500/20 flex-shrink-0">
                      🤖
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                        <span className="text-[10px] md:text-xs font-bold text-cyan-400 uppercase tracking-tighter">AI Support</span>
                        <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-200 italic leading-relaxed">
                        "{review.aiReply}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed mb-12">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-400 text-lg">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
      
      {/* Review Form */}
      <div className="bg-gradient-to-br from-purple-900/10 to-indigo-900/10 rounded-2xl border border-white/10 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <h4 className="text-xl font-bold mb-6 text-white flex items-center">
          <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Write a Review
        </h4>
        
        {error && (
          <div className="mb-6 p-4 glass border border-red-500/30 bg-red-500/10 text-red-200 rounded-xl flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmitReview}>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">
              Your Rating
            </label>
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-3xl focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <span className={`transition-colors duration-200 ${i < (hoverRating || rating) ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-gray-600'}`}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="review" className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">
              Your Review
            </label>
            <textarea
              id="review"
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none shadow-inner"
              placeholder="Share your experience with this product... (min 10 characters)"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/25 active:scale-95'}`}
          >
            {loading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                </span>
            ) : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
