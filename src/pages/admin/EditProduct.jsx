import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { getProductImageUrl } from "../../utils/constants";
import { categories } from "../../data/categories";
import { formatPrice } from "../../utils/currency";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    customCategory: "",
    stock: "",
    brand: "",
    image: "",
    shippingType: "free",
    shippingCost: "0",
    taxPercentage: "0",
    currency: "PKR",
    length: "",
    width: "",
    height: "",
    dimensionUnit: "cm",
    discountPercentage: "",
    videoUrl: "",
    posterType: "image"
  });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [aiReviewCount, setAiReviewCount] = useState(10);
  const [generatingReviews, setGeneratingReviews] = useState(false);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/products/${id}`);
        const product = response.data.data.product;
        
        const isStandardCategory = categories.some(cat => cat.id === product.category);
        
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: isStandardCategory ? (product.category || "") : "other",
          customCategory: isStandardCategory ? "" : (product.category || ""),
          stock: product.stock || "",
          brand: product.brand || "",
          image: product.images?.[0] || "",
          shippingType: product.shippingCost > 0 ? "paid" : "free",
          shippingCost: product.shippingCost || "0",
          taxPercentage: product.taxPercentage || "0",
          discountPercentage: product.discountPercentage || "0",
          currency: product.currency || "PKR",
          length: product.specifications?.dimensions?.length || "",
          width: product.specifications?.dimensions?.width || "",
          height: product.specifications?.dimensions?.height || "",
          dimensionUnit: product.specifications?.dimensions?.unit || "cm",
          videoUrl: product.video || "",
          posterType: product.posterType || "image"
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product data");
        setLoading(false);
        console.error("Error fetching product:", err);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock || !formData.brand) {
        throw new Error("All fields are required");
      }

      // Convert price and stock to numbers
      const productData = {
        ...formData,
        category: formData.category === 'other' ? formData.customCategory : formData.category, // Handle custom
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        shippingCost: formData.shippingType === 'free' ? 0 : (parseFloat(formData.shippingCost) || 0),
        taxPercentage: parseFloat(formData.taxPercentage) || 0,
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        currency: formData.currency,
        specifications: {
          dimensions: {
            length: Number(formData.length) || 0,
            width: Number(formData.width) || 0,
            height: Number(formData.height) || 0,
            unit: formData.dimensionUnit || 'cm'
          }
        },
        // Use formData.image correctly here
        images: [formData.image || "https://via.placeholder.com/300x300"],
        posterType: formData.posterType
      };

      // Since we might be uploading a video file, we need to use FormData instead of JSON
      // But wait, the current update logic uses JSON: await api.patch(..., productData)
      // To support file uploads, we need to convert it to FormData.
      const data = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'specifications' || key === 'images') {
          data.append(key, JSON.stringify(productData[key]));
        } else {
          data.append(key, productData[key]);
        }
      });
      if (formData.videoUrl) data.append('videoUrl', formData.videoUrl);
      if (selectedVideo) data.append('videoFile', selectedVideo);

      await api.patch(`/products/${id}`, data, {
        headers: {
          "Content-Type": undefined
        }
      });

      // Show success message
      setSuccess(true);
      
      // Redirect to products page after successful update
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update product");
      console.error("Error updating product:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReviews = async () => {
    try {
      setGeneratingReviews(true);
      setError("");
      const response = await api.post(`/reviews/generate-bulk`, {
        productId: id,
        count: Number(aiReviewCount)
      });
      alert(response.data.message || "Reviews generated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to generate reviews");
      console.error("Error generating reviews:", err);
    } finally {
      setGeneratingReviews(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  // Determine main preview image
  const mainPreview = formData.image || null;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Edit Product</h1>
           <p className="text-gray-600 dark:text-gray-500 dark:text-gray-400">Update product information and inventory.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/products")}
          className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 text-primary dark:text-white rounded-lg border border-black/5 dark:border-white/10 transition-colors"
        >
          ← Back to Products
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="lg:w-2/3">
           <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl border border-black/5 dark:border-white/10 space-y-6 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              {/* Success Message */}
              {success && (
                <div className="p-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-500 shadow-lg shadow-green-500/5">
                   <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-xl shrink-0">
                      ✅
                   </div>
                   <div>
                      <h4 className="font-bold">Product Updated!</h4>
                      <p className="text-sm opacity-80">All changes have been synchronized. Redirecting to your inventory...</p>
                   </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl flex items-center animate-shake">
                   <span className="mr-2">⚠️</span> {error}
                </div>
              )}

              <div className="space-y-2">
                 <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Product Name</label>
                 <input 
                   type="text" 
                   name="name" 
                   value={formData.name} 
                   onChange={handleChange}
                   placeholder="e.g. Wireless Noise-Cancelling Headphones"
                   className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Price</label>
                    <div className="flex gap-2">
                        <select 
                            name="currency" 
                            value={formData.currency} 
                            onChange={handleChange}
                            className="bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                        >
                            <option value="PKR">PKR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="INR">INR</option>
                            <option value="AED">AED</option>
                        </select>
                        <input 
                          type="number" 
                          name="price" 
                          value={formData.price} 
                          onChange={handleChange}
                          placeholder="e.g. 299.99"
                          step="0.01"
                          className="flex-1 bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      name="stock" 
                      value={formData.stock} 
                      onChange={handleChange}
                      placeholder="e.g. 100"
                      className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-white/5">
                 <div className="space-y-4">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Shipping Type</label>
                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, shippingType: 'free'})}
                            className={`flex-1 py-3 rounded-xl border transition-all font-bold ${formData.shippingType === 'free' ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'bg-black/30 border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-500 hover:border-black/10 dark:border-white/20'}`}
                        >
                            Free
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, shippingType: 'paid'})}
                            className={`flex-1 py-3 rounded-xl border transition-all font-bold ${formData.shippingType === 'paid' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-black/30 border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-500 hover:border-black/10 dark:border-white/20'}`}
                        >
                            Paid
                        </button>
                    </div>

                    {formData.shippingType === 'paid' && (
                        <div className="animate-fade-in-down">
                            <input 
                                type="number" 
                                name="shippingCost" 
                                value={formData.shippingCost} 
                                onChange={handleChange}
                                placeholder="Shipping Cost ($)"
                                step="0.01"
                                className="w-full bg-black/30 border border-cyan-500/50 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                        </div>
                    )}
                 </div>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Tax (%)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="taxPercentage" 
                                    value={formData.taxPercentage} 
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-500 font-bold">%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Discount (%)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="discountPercentage" 
                                    value={formData.discountPercentage} 
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-500 font-bold">%</span>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-white/5">
                 <div className="space-y-4">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Dimensions (L x W x H)</label>
                    <div className="grid grid-cols-4 gap-4">
                       <input 
                          type="number" 
                          name="length" 
                          value={formData.length} 
                          onChange={handleChange}
                          placeholder="Length"
                          className="bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                       />
                       <input 
                          type="number" 
                          name="width" 
                          value={formData.width} 
                          onChange={handleChange}
                          placeholder="Width"
                          className="bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                       />
                       <input 
                          type="number" 
                          name="height" 
                          value={formData.height} 
                          onChange={handleChange}
                          placeholder="Height"
                          className="bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                       />
                       <select 
                          name="dimensionUnit" 
                          value={formData.dimensionUnit} 
                          onChange={handleChange}
                          className="bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                       >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                          <option value="mm">mm</option>
                       </select>
                    </div>
                 </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Category</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                    >
                       <option value="">Select a category</option>
                       {categories.map((cat, index) => (
                           <option key={index} value={cat.id}>{cat.icon} {cat.name}</option>
                       ))}
                       <option value="other">Other</option>
                    </select>

                    {formData.category === 'other' && (
                        <div className="mt-4 animate-fade-in-down">
                           <input 
                             type="text" 
                             name="customCategory" 
                             value={formData.customCategory || ''} 
                             onChange={handleChange}
                             placeholder="Enter custom category name..."
                             className="w-full bg-black/30 border border-purple-500/50 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                           />
                        </div>
                     )}
                 </div>
                 <div className="space-y-2">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Brand</label>
                    <input 
                      type="text" 
                      name="brand" 
                      value={formData.brand} 
                      onChange={handleChange}
                      placeholder="e.g. Apple, Sony"
                      className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Image URL</label>
                 
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       name="image" 
                       value={formData.image} 
                       onChange={handleChange}
                       placeholder="https://example.com/image.jpg"
                       className="flex-1 bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                 </div>
              </div>

              {/* Product Video Section */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                 <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Product Video (Optional)</label>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-xs ml-1">Video URL</label>
                       <input 
                          type="text" 
                          name="videoUrl" 
                          value={formData.videoUrl} 
                          onChange={handleChange}
                          placeholder="https://example.com/video.mp4"
                          className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-xs ml-1">Or Upload Video</label>
                       <input 
                          type="file" 
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-3.5 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                       />
                       {selectedVideo && <p className="text-xs text-green-400 ml-1">Selected: {selectedVideo.name}</p>}
                    </div>
                 </div>

                 <div className="space-y-2 mt-4">
                    <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-xs ml-1">Set as Poster?</label>
                    <select 
                       name="posterType" 
                       value={formData.posterType} 
                       onChange={handleChange}
                       className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                    >
                       <option value="image">Show Image as Poster</option>
                       <option value="video">Show Video as Poster</option>
                       <option value="none">Show None (Fallback)</option>
                    </select>
                    <p className="text-xs text-gray-600 dark:text-gray-500 ml-1">This determines what shows on the product cards.</p>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-gray-600 dark:text-gray-300 text-sm font-bold ml-1">Description</label>
                 <textarea
                   name="description" 
                   value={formData.description} 
                   onChange={handleChange}
                   placeholder="Detailed product description..."
                   rows="4"
                   className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl p-4 text-primary dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                 ></textarea>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-end gap-4">
                 <button 
                   type="button"
                   onClick={() => navigate("/admin/products")}
                   className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:text-white font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   disabled={saving}
                   className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-primary dark:text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
                 >
                   {saving ? (
                     <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary dark:text-white" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                     </span>
                   ) : 'Update Product'}
                 </button>
              </div>
           </form>
        </div>

        {/* Live Preview Section */}
        <div className="lg:w-1/3">
           <div className="sticky top-6">
              <h2 className="text-xl font-bold text-gray-600 dark:text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest text-xs">Live Preview</h2>
              
              <div className="glass rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 group relative max-w-sm mx-auto">
                 <div className="relative h-64 w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {mainPreview ? (
                        <img 
                          src={getProductImageUrl(mainPreview)} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = "https://via.placeholder.com/300x300";
                          }}
                        />
                    ) : (
                        <span className="text-gray-600">No Image</span>
                    )}
                    
                    {mainPreview && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                 </div>

                 <div className="p-6">
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">{formData.category || 'CATEGORY'}</p>
                    <h3 className="text-lg font-bold text-primary dark:text-white mb-2 leading-tight">
                        {formData.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {formData.description || 'Product description will appear here...'}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-4">
                       <span className="text-2xl font-bold text-primary dark:text-white">
                          {formData.currency === 'PKR' ? 'Rs.' : 
                           formData.currency === 'USD' ? '$' : 
                           formData.currency === 'EUR' ? '€' : 
                           formData.currency === 'GBP' ? '£' : 
                           formData.currency === 'INR' ? '₹' : 
                           formData.currency === 'AED' ? 'AED ' : ''} 
                          {formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                       </span>
                       <button className="h-10 w-10 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white hover:bg-purple-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                       </button>
                    </div>
                 </div>
              </div>
              
              <div className="mt-6 p-4 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 font-mono">EDIT MODE</span>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                    You are currently editing this product. Changes will reflect immediately after saving.
                 </p>
              </div>

              {/* AI Review Generator Box */}
              <div className="mt-6 p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm relative overflow-hidden group">
                 <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none"></div>
                 
                 <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl animate-pulse">✨</span>
                    <h3 className="text-lg font-black text-primary dark:text-white">AI Review Generator</h3>
                 </div>
                 
                 <p className="text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 mb-4">
                    Deep Brain AI will automatically read your product's name and description, "think" about its features, and write realistic customer reviews.
                 </p>
                 
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                       <label className="text-sm font-bold text-gray-600 dark:text-gray-300 flex-1">Number of Reviews:</label>
                       <input 
                         type="number" 
                         min="1" 
                         max="20" 
                         value={aiReviewCount}
                         onChange={(e) => setAiReviewCount(e.target.value)}
                         className="w-20 bg-black/10 dark:bg-black/50 border border-black/5 dark:border-white/10 rounded-lg p-2 text-primary dark:text-white text-center focus:outline-none focus:border-cyan-500"
                       />
                    </div>
                    
                    <button 
                      onClick={handleGenerateReviews}
                      disabled={generatingReviews || !id}
                      className="w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-primary dark:text-white font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                       {generatingReviews ? (
                         <>
                           <svg className="animate-spin h-4 w-4 text-primary dark:text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Generating...
                         </>
                       ) : (
                         <>
                           Generate Fake Reviews
                         </>
                       )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
