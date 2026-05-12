import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, X, CheckCircle, AlertCircle, Video, Tag, 
  Type, AlignLeft, Globe, ChevronLeft, 
  Search, Package, Sparkles, Wand2, ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getProductImageUrl } from "../utils/constants";
import { formatPrice } from "../utils/currency";

export default function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [productLink, setProductLink] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState({ type: "", message: "" });
  
  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const soundId = searchParams.get('soundId');

  useEffect(() => {
    if (productQuery.length > 2) {
      const delay = setTimeout(async () => {
        setIsSearchingProducts(true);
        try {
          const res = await api.get(`/products/search?q=${productQuery}&limit=5`);
          if (res.data?.status === 'success') {
            setProductResults(res.data.data.products);
          }
        } catch (err) {
          console.error("Product search failed");
        } finally {
          setIsSearchingProducts(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setProductResults([]);
    }
  }, [productQuery]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const limit = isVercel ? 4.5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > limit) {
         setStatus({ 
           type: "error", 
           message: isVercel 
             ? "Vercel limits uploads to 4.5MB. Please upload a smaller video or use direct Cloudinary upload." 
             : "Video size must be less than 50MB" 
         });
         return;
      }
      setVideoFile(file);
      setVideoUrl("");
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbPreview(url);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tagsList.includes(tag) && tagsList.length < 10) {
      setTagsList([...tagsList, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTagsList(tagsList.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!videoFile && !videoUrl) {
      return setStatus({ type: "error", message: "Please provide a video file or URL" });
    }
    if (!thumbnailFile) {
      return setStatus({ type: "error", message: "A Video Poster is required!" });
    }

    setLoading(true);
    setStatus({ type: "info", message: "Uploading your masterpiece..." });

    try {
      const formData = new FormData();
      if (videoFile) {
        formData.append("videoFile", videoFile);
      } else {
        formData.append("videoUrl", videoUrl);
      }
      
      if (thumbnailFile) {
        formData.append("thumbnailFile", thumbnailFile);
      }

      formData.append("name", name);
      formData.append("caption", caption);
      formData.append("description", description);
      
      const finalProductLink = selectedProduct ? `/product/${selectedProduct._id}` : productLink;
      if (finalProductLink) formData.append("productLink", finalProductLink);
      
      formData.append("tags", tagsList.join(','));
      if (soundId) formData.append("soundId", soundId);

      await api.post(`/videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setStatus({ type: "success", message: "Video uploaded successfully! Redirecting..." });
      setTimeout(() => navigate("/watch-me"), 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Upload failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <Link to="/watch-me" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="font-bold uppercase tracking-widest text-xs">Back to Feed</span>
           </Link>
           <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-pink-500" />
              Creator Studio
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* LEFT: Preview Column */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="relative aspect-[9/16] w-full rounded-[2.5rem] border-8 border-white/5 bg-black overflow-hidden shadow-2xl">
                     {preview ? (
                        <video src={preview} className="w-full h-full object-cover" autoPlay muted loop />
                     ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                           <Video className="w-12 h-12 text-gray-700 mb-4" />
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Video Preview</p>
                        </div>
                     )}
                      {/* Product Link Preview Overlay */}
                      {(selectedProduct || productLink) && (
                        <div className="absolute left-4 bottom-24 z-30 flex items-center gap-2 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md text-black dark:text-white px-4 py-2.5 rounded-2xl font-black shadow-2xl scale-[0.6] origin-left border border-black/5 dark:border-white/10">
                           <ShoppingCart className="w-5 h-5 text-pink-500" />
                           <span className="text-xs uppercase tracking-widest">Shop Item</span>
                        </div>
                      )}

                      {caption && (
                        <div className="absolute top-10 left-0 right-0 z-20 overflow-hidden bg-black/40 backdrop-blur-md py-2">
                           <div className="whitespace-nowrap animate-marquee font-black text-[10px] text-white uppercase tracking-widest px-4">
                              {caption} • {caption}
                           </div>
                        </div>
                      )}
                   </div>
              </div>

              {/* Progress Summary Card */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-xl shadow-pink-500/20">
                   <div className="flex justify-between items-end mb-4">
                      <span className="text-xs font-black uppercase tracking-widest">Uploading Media</span>
                      <span className="text-2xl font-black">{uploadProgress}%</span>
                   </div>
                   <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                   </div>
                </motion.div>
              )}
           </div>

           {/* RIGHT: Form Column */}
           <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Media Section */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-500">
                        <Upload className="w-5 h-5" />
                     </div>
                     <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 1: Media Selection</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Video Upload Dropzone */}
                    <div className="relative group">
                       <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                       <div className={`h-56 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center transition-all ${videoFile ? 'border-pink-500 bg-pink-500/5' : 'border-white/10 bg-white/5 group-hover:border-pink-500 group-hover:bg-pink-500/10'}`}>
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${videoFile ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-white/10 text-gray-400'}`}>
                             {videoFile ? <CheckCircle className="w-7 h-7" /> : <Video className="w-7 h-7" />}
                          </div>
                          <span className="text-xs font-black text-white uppercase tracking-[0.1em]">{videoFile ? videoFile.name.substring(0, 20) + '...' : 'Select Video File'}</span>
                          <span className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">MP4, WebM (Max 50MB)</span>
                       </div>
                    </div>

                    {/* Poster Upload Dropzone */}
                    <div className="relative group">
                       <input type="file" accept="image/*" onChange={handleThumbChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                       <div className={`h-56 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden transition-all ${thumbnailFile ? 'border-purple-500' : 'border-white/10 bg-white/5 group-hover:border-purple-500 group-hover:bg-purple-500/10'}`}>
                          {thumbPreview ? (
                             <img src={thumbPreview} className="w-full h-full object-cover" />
                          ) : (
                             <div className="flex flex-col items-center p-8">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-gray-400 group-hover:scale-110 transition-transform">
                                   <Upload className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-[0.1em]">Video Poster</span>
                                <span className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">Required Cover Image</span>
                             </div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 lg:p-10 space-y-8">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                        <AlignLeft className="w-5 h-5" />
                     </div>
                     <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 2: Video Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Type className="w-3 h-3" /> Video Name</label>
                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Catchy title..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Wand2 className="w-3 h-3" /> Moving Caption</label>
                        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Scrolling top text..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> Description</label>
                     <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell the world about your video..." className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Tags */}
                     <div className="space-y-4">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Tag className="w-3 h-3" /> Tags ({tagsList.length}/10)</label>
                        <div className="flex gap-2">
                           <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="e.g. fashion" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none" />
                           <button type="button" onClick={addTag} className="px-6 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-pink-500 hover:text-white transition-all">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {tagsList.map(tag => (
                             <span key={tag} className="px-4 py-2 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                                #{tag} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => removeTag(tag)} />
                             </span>
                           ))}
                        </div>
                     </div>

                    {/* Product Search & Link */}
                    <div className="space-y-6">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Package className="w-3 h-3" /> Tag a Product</label>
                        
                        {/* Manual Link Input */}
                        <div className="space-y-3">
                           <div className="flex items-center justify-between ml-1">
                              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Option A: External Product Link</span>
                           </div>
                           <input 
                             type="url" 
                             value={productLink}
                             onChange={(e) => {
                               setProductLink(e.target.value);
                               if (e.target.value) setSelectedProduct(null);
                             }}
                             placeholder="Paste URL (e.g. https://shophub.pro/product/...)" 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-inner"
                           />
                        </div>

                        <div className="relative flex items-center py-2">
                           <div className="flex-1 h-[1px] bg-white/5"></div>
                           <span className="px-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">OR</span>
                           <div className="flex-1 h-[1px] bg-white/5"></div>
                        </div>

                        {/* Search Internal Catalog */}
                        <div className="space-y-3">
                           <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Option B: Search Store Catalog</span>
                           <div className="relative">
                              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input 
                                type="text" 
                                value={productQuery}
                                onChange={(e) => setProductQuery(e.target.value)}
                                placeholder="Find product by name..." 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                              />
                              {isSearchingProducts && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                              )}
                              
                              {/* Results */}
                              <AnimatePresence>
                                {productResults.length > 0 && !selectedProduct && (
                                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute w-full z-50 mt-2 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                     {productResults.map(p => (
                                       <button key={p._id} type="button" onClick={() => {setSelectedProduct(p); setProductLink(""); setProductQuery(""); setProductResults([]);}} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0">
                                          <img src={getProductImageUrl(p.images?.[0] || p.image)} className="w-12 h-12 rounded-xl object-cover" />
                                          <div>
                                             <p className="text-xs font-black text-white uppercase tracking-tight">{p.name}</p>
                                             <p className="text-[10px] text-cyan-400 font-black">{formatPrice(p.price)}</p>
                                          </div>
                                       </button>
                                     ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                           </div>
                        </div>

                        {selectedProduct && (
                          <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl animate-fade-in-down">
                             <div className="flex items-center gap-4">
                                <img src={getProductImageUrl(selectedProduct.images?.[0] || selectedProduct.image)} className="w-10 h-10 rounded-xl object-cover" />
                                <span className="text-xs font-black text-white uppercase tracking-tight">{selectedProduct.name}</span>
                             </div>
                             <X className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedProduct(null)} />
                          </div>
                        )}
                     </div>
                  </div>

                  {status.message && (
                    <div className={`p-5 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'}`}>
                      {status.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                      {status.message}
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] shadow-2xl shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 text-sm"
                  >
                     {loading ? (
                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                     ) : (
                        <><Globe className="w-6 h-6" /> Publish Masterpiece</>
                     )}
                  </button>
                </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
