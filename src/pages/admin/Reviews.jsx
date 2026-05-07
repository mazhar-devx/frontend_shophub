import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);
  const [filterRating, setFilterRating] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // AI Generation States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [reviewCount, setReviewCount] = useState(5);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      if (response.data.status === 'success') {
        setProducts(response.data.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get("/reviews");
      if (response.data.status === 'success') {
         setReviews(response.data.data.reviews);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setLoading(false);
    }
  };

  // Filter reviews based on search term and rating
  const filteredReviews = reviews.filter(review => {
    const productName = review.product?.name || "Deleted Product";
    const customerName = review.isDummy ? (review.dummyName || "Anonymous") : (review.user?.name || "Deleted User");
    const comment = review.review || "";
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  // Get current reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const statusColors = {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      await api.patch(`/reviews/${reviewId}`, { status: newStatus });
      setReviews(reviews.map(review => 
        review.id === reviewId || review._id === reviewId ? { ...review, status: newStatus } : review
      ));
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review.id !== reviewId && review._id !== reviewId));
      } catch (err) {
        alert("Failed to delete review");
        console.error(err);
      }
    }
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleGenerateAIReviews = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Please select a product");
    
    setIsGenerating(true);
    try {
      const response = await api.post("/ai/generate-bulk-reviews", {
        productId: selectedProductId,
        count: reviewCount,
        prompt: aiPrompt
      });
      
      if (response.data.status === 'success') {
        alert(response.data.message);
        setIsAIModalOpen(false);
        fetchReviews(); // Refresh reviews list
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate reviews");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading reviews...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="mt-1 text-gray-400">Manage customer reviews</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg shadow-purple-500/20 font-bold text-sm"
          >
            <span className="text-lg">🤖</span>
            AI Review Hub
          </button>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            <option value="all" className="bg-gray-900">All Ratings</option>
            <option value="5" className="bg-gray-900">5 Stars</option>
            <option value="4" className="bg-gray-900">4 Stars</option>
            <option value="3" className="bg-gray-900">3 Stars</option>
            <option value="2" className="bg-gray-900">2 Stars</option>
            <option value="1" className="bg-gray-900">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="glass border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentReviews.length > 0 ? (
                currentReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <div className="flex items-center">
                            {review.product?.image && <img src={review.product.image} className="w-8 h-8 rounded mr-2 object-cover" alt="" />}
                            {review.product?.name || 'Unknown Product'}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <img 
                          src={review.isDummy ? review.dummyPhoto : (review.user?.photo || '/default-avatar.png')} 
                          className="w-8 h-8 rounded-full object-cover border border-white/10" 
                          alt="" 
                        />
                        <span>{review.isDummy ? (review.dummyName || "Anonymous") : (review.user?.name || 'Unknown User')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-1 text-sm text-gray-500">({review.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{review.review}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[review.status || 'Pending']}`}>
                        {review.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(review.status === "Pending" || !review.status) && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(review._id, "Approved")}
                            className="text-green-400 hover:text-green-300 mr-3"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(review._id, "Rejected")}
                            className="text-red-400 hover:text-red-300 mr-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:text-red-400 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredReviews.length > reviewsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstReview + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastReview, filteredReviews.length)}</span> of{" "}
                  <span className="font-medium">{filteredReviews.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* AI Review Hub Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isGenerating && setIsAIModalOpen(false)}></div>
          <div className="relative w-full max-w-xl glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🤖</span> AI Review Generation Hub
              </h2>
              <p className="text-xs text-gray-400 mt-1">Our neural system will generate ultra-realistic reviews for your products.</p>
            </div>
            
            <form onSubmit={handleGenerateAIReviews} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Product</label>
                <select 
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all text-sm"
                >
                  <option value="" className="bg-gray-900">Choose a product...</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id} className="bg-gray-900">{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Count ({reviewCount})</label>
                  <input 
                    type="range"
                    min="1"
                    max="20"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                <div className="flex items-center justify-center">
                   <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-lg">
                      {reviewCount} <span className="text-[10px] text-gray-500 uppercase">Reviews</span>
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Custom Prompt (Optional)</label>
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Make them sound like happy customers from Lahore, using some Roman Urdu and emojis..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all text-sm h-24 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAIModalOpen(false)}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isGenerating || !selectedProductId}
                  className="flex-[2] px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Generating Neural Feedback...
                    </>
                  ) : (
                    <>
                      <span>✨</span> Launch Neural Generation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
