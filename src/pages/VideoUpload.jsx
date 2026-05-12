import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, X, CheckCircle, AlertCircle, Video, Tag, 
  Type, AlignLeft, Globe, ChevronLeft, ChevronRight, 
  Search, Package, Sparkles, Wand2, Music
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getProductImageUrl } from "../utils/constants";
import { formatPrice } from "../utils/currency";

export default function VideoUpload() {
  const [step, setStep] = useState(1);
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
  
  // Product Search State
  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const soundId = searchParams.get('soundId');
  const { user } = useSelector((state) => state.auth);

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
      if (file.size > 50 * 1024 * 1024) {
         setStatus({ type: "error", message: "Video size must be less than 50MB" });
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

  const nextStep = () => {
    if (step === 1 && !videoFile && !videoUrl) {
      return setStatus({ type: "error", message: "Please select a video first" });
    }
    setStep(step + 1);
    setStatus({ type: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#030014] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <Link to="/watch-me" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="font-bold uppercase tracking-widest text-xs">Back to Feed</span>
           </Link>
           <div className="flex gap-2">
              {[1, 2].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-600' : 'w-4 bg-white/10'}`} />
              ))}
           </div>
        </div>

        <motion.div 
          layout
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* LEFT SIDE: Preview & Media */}
            <div className="lg:w-2/5 p-8 lg:p-12 bg-black/20 border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="sticky top-12">
                <div className="mb-8">
                   <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-pink-500" />
                      Studio
                   </h1>
                   <p className="text-gray-400 text-sm mt-2 font-medium">Share your vibes with the community.</p>
                </div>

                <div className="relative aspect-[9/16] max-w-[280px] mx-auto rounded-[2.5rem] border-8 border-white/5 bg-black overflow-hidden shadow-2xl group">
                   {preview ? (
                      <video src={preview} className="w-full h-full object-cover" autoPlay muted loop />
                   ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                         <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4 border border-white/10">
                            <Video className="w-8 h-8 text-gray-600" />
                         </div>
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Video Preview will appear here</p>
                      </div>
                   )}
                   
                   {/* Floating Caption Preview */}
                   {caption && (
                     <div className="absolute top-10 left-0 right-0 z-20 overflow-hidden bg-black/40 backdrop-blur-md py-2">
                        <div className="whitespace-nowrap animate-marquee font-black text-xs text-white uppercase tracking-widest px-4">
                           {caption} • {caption} • {caption}
                        </div>
                     </div>
                   )}

                   {/* Progress Overlay */}
                   {loading && (
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8">
                        <div className="relative w-24 h-24 mb-6">
                           <svg className="w-full h-full" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-pink-500" strokeDasharray={`${uploadProgress * 2.83} 283`} strokeLinecap="round" />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">{uploadProgress}%</div>
                        </div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest animate-pulse text-center">Processing Media...</p>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Form Steps */}
            <div className="lg:w-3/5 p-8 lg:p-12 relative">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-500">
                          <Upload className="w-5 h-5" />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-white">Media Assets</h2>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Step 01 / 02</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Video Upload Dropzone */}
                       <div className="relative group">
                          <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className={`h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-6 text-center transition-all ${videoFile ? 'border-pink-500 bg-pink-500/5' : 'border-white/10 bg-white/5 group-hover:border-pink-500 group-hover:bg-pink-500/10'}`}>
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${videoFile ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                {videoFile ? <CheckCircle className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                             </div>
                             <span className="text-xs font-black text-white uppercase tracking-widest">{videoFile ? videoFile.name.substring(0, 15) + '...' : 'Select Video'}</span>
                             {!videoFile && <span className="text-[10px] text-gray-500 mt-2">MP4, WebM (Max 50MB)</span>}
                          </div>
                       </div>

                       {/* Poster Upload Dropzone */}
                       <div className="relative group">
                          <input type="file" accept="image/*" onChange={handleThumbChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className={`h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-6 text-center transition-all ${thumbnailFile ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-white/5 group-hover:border-purple-500 group-hover:bg-purple-500/10'}`}>
                             {thumbPreview ? (
                                <img src={thumbPreview} className="w-full h-full object-cover rounded-[1.8rem]" />
                             ) : (
                                <>
                                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3 text-gray-400 group-hover:scale-110 transition-transform">
                                      <Upload className="w-6 h-6" />
                                   </div>
                                   <span className="text-xs font-black text-white uppercase tracking-widest">Video Poster</span>
                                   <span className="text-[10px] text-gray-500 mt-2">Required for feed cover</span>
                                </>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Video Caption</label>
                       <div className="relative">
                          <Wand2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                          <input 
                            type="text" 
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Enter scrolling text for the top..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                          />
                       </div>
                    </div>

                    <button 
                      onClick={nextStep}
                      className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-pink-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group"
                    >
                       Continue to Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                          <AlignLeft className="w-5 h-5" />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-white">Discovery & Details</h2>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Step 02 / 02</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Video Name</label>
                             <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Title..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Tags ({tagsList.length}/10)</label>
                             <div className="flex gap-2">
                                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="e.g. fashion" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none" />
                                <button type="button" onClick={addTag} className="px-4 bg-white/10 text-white rounded-xl hover:bg-white/20">Add</button>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          {tagsList.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                               #{tag} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                            </span>
                          ))}
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Description</label>
                          <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this video about?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none resize-none" />
                       </div>

                       {/* Product Search Selector */}
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                             <Package className="w-3 h-3" /> Link a Product (Search)
                          </label>
                          <div className="relative">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                             <input 
                               type="text" 
                               value={productQuery}
                               onChange={(e) => setProductQuery(e.target.value)}
                               placeholder="Search for a product to link..." 
                               className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                             />
                             {isSearchingProducts && (
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                             )}
                          </div>
                          
                          {/* Search Results Dropdown */}
                          <AnimatePresence>
                             {productResults.length > 0 && !selectedProduct && (
                               <motion.div 
                                 initial={{ opacity: 0, y: -10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 className="absolute w-full z-50 mt-2 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                               >
                                  {productResults.map(p => (
                                    <button 
                                      key={p._id}
                                      type="button"
                                      onClick={() => {setSelectedProduct(p); setProductQuery(""); setProductResults([]);}}
                                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                                    >
                                       <img src={getProductImageUrl(p.images?.[0] || p.image)} className="w-10 h-10 rounded-lg object-cover" />
                                       <div>
                                          <p className="text-xs font-bold text-white">{p.name}</p>
                                          <p className="text-[10px] text-cyan-400 font-bold">{formatPrice(p.price)}</p>
                                       </div>
                                    </button>
                                  ))}
                               </motion.div>
                             )}
                          </AnimatePresence>

                          {/* Selected Product Tag */}
                          {selectedProduct && (
                            <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                               <div className="flex items-center gap-3">
                                  <img src={getProductImageUrl(selectedProduct.images?.[0] || selectedProduct.image)} className="w-8 h-8 rounded-lg object-cover" />
                                  <span className="text-xs font-bold text-white">{selectedProduct.name}</span>
                               </div>
                               <X className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" onClick={() => setSelectedProduct(null)} />
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button onClick={() => setStep(1)} className="flex-1 px-6 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-white transition-all">Back</button>
                       <button 
                         disabled={loading}
                         onClick={handleSubmit}
                         className="flex-[2] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs"
                       >
                          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Globe className="w-4 h-4" /> Publish Video</>}
                       </button>
                    </div>

                    {status.message && (
                      <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'}`}>
                        {status.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        {status.message}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
