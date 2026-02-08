import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    brand: "",
    image: "" 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/products/${id}`);
        const product = response.data.data.product;
        
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          stock: product.stock || "",
          brand: product.brand || "",
          image: product.images?.[0] || ""
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
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        // Use formData.image correctly here
        images: [formData.image || "https://via.placeholder.com/300x300"]
      };

      await api.patch(`/products/${id}`, productData, {
        headers: {
          "Content-Type": "application/json"
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
           <h1 className="text-3xl font-bold text-white mb-2">Edit Product</h1>
           <p className="text-gray-400">Update product information and inventory.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/products")}
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

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-500/20 border border-green-500/30 text-green-200 rounded-xl flex items-center animate-pulse">
                   <span className="mr-2">✅</span> Product updated successfully! Redirecting...
                </div>
              )}

              {/* Error Message */}
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
                      name="stock" 
                      value={formData.stock} 
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
                       <option value="">Select a category</option>
                       <option value="electronics">Electronics</option>
                       <option value="clothing">Clothing</option>
                       <option value="books">Books</option>
                       <option value="home">Home & Kitchen</option>
                       <option value="beauty">Beauty</option>
                       <option value="sports">Sports</option>
                       <option value="other">Other</option>
                    </select>
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
                 <label className="text-gray-300 text-sm font-bold ml-1">Image URL</label>
                 
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       name="image" 
                       value={formData.image} 
                       onChange={handleChange}
                       placeholder="https://example.com/image.jpg"
                       className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
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
                   onClick={() => navigate("/admin/products")}
                   className="px-6 py-3 text-gray-300 hover:text-white font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   disabled={saving}
                   className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
                 >
                   {saving ? (
                     <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
              <h2 className="text-xl font-bold text-gray-400 mb-4 uppercase tracking-widest text-xs">Live Preview</h2>
              
              <div className="glass rounded-2xl overflow-hidden border border-white/10 group relative max-w-sm mx-auto">
                 <div className="relative h-64 w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {mainPreview ? (
                        <img 
                          src={mainPreview} 
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
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        {formData.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {formData.description || 'Product description will appear here...'}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                       <span className="text-2xl font-bold text-white">${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}</span>
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
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400 font-mono">EDIT MODE</span>
                 </div>
                 <p className="text-sm text-gray-300">
                    You are currently editing this product. Changes will reflect immediately after saving.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
