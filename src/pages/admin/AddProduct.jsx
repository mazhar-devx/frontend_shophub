import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { fetchProducts } from "../../features/products/productSlice";
import { categories } from "../../data/categories";

export default function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "electronics",
    brand: "",
    countInStock: "",
    imageUrl: "", // For manual URL entry
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      // Create preview URLs
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    // If we're revoking URLs, we should do it here to avoid memory leaks, but strictly optional for small app
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      // Create FormData
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      
      // Handle Custom Category
      const finalCategory = formData.category === 'other' ? formData.customCategory : formData.category;
      if (!finalCategory) throw new Error("Please specify a category");
      data.append('category', finalCategory);
      
      data.append('brand', formData.brand);
      data.append('stock', formData.countInStock || 0);
      
      // Append Image URL if provided
      if (formData.imageUrl) {
        data.append('images', formData.imageUrl);
      }

      // Append Files
      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      // IMPORTANT: Set Content-Type to undefined to let browser set boundary
      const response = await api.post('/products', data, {
        headers: {
            'Content-Type': undefined
        }
      });
      
      if (response.data.status === 'success') {
         dispatch(fetchProducts()); 
         navigate('/admin/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Determine main preview image (URL or first uploaded)
  const mainPreview = formData.imageUrl || previewImages[0] || null;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Create New Product</h1>
           <p className="text-gray-400">Add a new item to your store inventory.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products')}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
        >
          ← Back to Products
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="lg:w-2/3">
           <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl border border-white/10 space-y-6 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl flex items-center animate-shake">
                   <span className="mr-2">⚠️</span> {error}
                </div>
              )}

              <div className="space-y-2">
                 <label className="text-gray-300 text-sm font-bold ml-1">Product Name</label>
                 <input 
                   type="text" 
                   name="name" 
                   value={formData.name} 
                   onChange={handleChange}
                   placeholder="e.g. Wireless Noise-Cancelling Headphones"
                   className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold ml-1">Price ($)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange}
                      placeholder="e.g. 299.99"
                      step="0.01"
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold ml-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      name="countInStock" 
                      value={formData.countInStock} 
                      onChange={handleChange}
                      placeholder="e.g. 100"
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold ml-1">Category</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                    >
                       <option value="">Select Category</option>
                       {categories.map((cat, index) => (
                           <option key={index} value={cat.id}>{cat.icon} {cat.name}</option>
                       ))}
                       <option value="other">Other (Custom)</option>
                    </select>

                    {formData.category === 'other' && (
                        <div className="mt-4 animate-fade-in-down">
                           <input 
                             type="text" 
                             name="customCategory" 
                             value={formData.customCategory || ''} 
                             onChange={handleChange}
                             placeholder="Enter custom category name..."
                             className="w-full bg-black/30 border border-purple-500/50 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                           />
                        </div>
                     )}
                 </div>
                 <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold ml-1">Brand</label>
                    <input 
                      type="text" 
                      name="brand" 
                      value={formData.brand} 
                      onChange={handleChange}
                      placeholder="e.g. Apple, Sony"
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-gray-300 text-sm font-bold ml-1">Product Images</label>
                 
                 {/* URL Input */}
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       name="imageUrl" 
                       value={formData.imageUrl} 
                       onChange={handleChange}
                        placeholder="Paste image URL here (Optional)..."
                       className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                 </div>
                 <p className="text-xs text-gray-500 ml-1">Or upload images from your device below</p>

                 {/* File Upload Area */}
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {/* Add Button */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 flex flex-col items-center justify-center cursor-pointer transition-all group"
                    >
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                             </svg>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-purple-400">Add Image</span>
                        <input 
                            type="file" 
                            multiple 
                            ref={fileInputRef}
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>

                    {/* URL Preview */}
                    {formData.imageUrl && (
                        <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                            <img src={formData.imageUrl} alt="URL Preview" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, imageUrl: ''})}
                                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                ×
                            </button>
                            <span className="absolute bottom-1 left-1 text-[10px] bg-purple-500/80 text-white px-1.5 py-0.5 rounded">URL</span>
                        </div>
                    )}

                    {/* File Previews */}
                    {previewImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                            <img src={img} alt="File Preview" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                ×
                            </button>
                            <span className="absolute bottom-1 left-1 text-[10px] bg-blue-500/80 text-white px-1.5 py-0.5 rounded">FILE</span>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-gray-300 text-sm font-bold ml-1">Description</label>
                 <textarea
                   name="description" 
                   value={formData.description} 
                   onChange={handleChange}
                   placeholder="Detailed product description..."
                   rows="4"
                   className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                 ></textarea>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                 <button 
                   type="button"
                   onClick={() => navigate('/admin/products')}
                   className="px-6 py-3 text-gray-300 hover:text-white font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   disabled={loading}
                   className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
                 >
                   {loading ? (
                     <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                     </span>
                   ) : 'Create Product'}
                 </button>
              </div>
           </form>
        </div>

        {/* Live Preview Section */}
        <div className="lg:w-1/3">
           <div className="sticky top-6">
              <h2 className="text-xl font-bold text-gray-400 mb-4 uppercase tracking-widest text-xs">Live Preview</h2>
              
              <div className="glass rounded-2xl overflow-hidden border border-white/10 group relative max-w-sm mx-auto">
                 <div className="relative h-64 w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {mainPreview ? (
                        <img src={mainPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => e.target.style.display='none'} />
                    ) : (
                        <span className="text-gray-600">No Image</span>
                    )}
                    
                    {mainPreview && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                 </div>

                 <div className="p-6">
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">{formData.category || 'CATEGORY'}</p>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        {formData.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {formData.description || 'Product description will appear here...'}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                       <span className="text-2xl font-bold text-white">${formData.price || '0.00'}</span>
                       <button className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-purple-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                       </button>
                    </div>
                 </div>
              </div>
              
              <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400 font-mono">STATUS</span>
                 </div>
                 <p className="text-sm text-gray-300">
                    Ready to publish to store. This item will appear immediately after creation.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
