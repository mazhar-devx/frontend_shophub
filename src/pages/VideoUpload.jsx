import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle, AlertCircle, Video, Tag, Type, AlignLeft, Globe, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productLink, setProductLink] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const soundId = searchParams.get('soundId');
  const { user } = useSelector((state) => state.auth);

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

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    setVideoFile(null);
    setPreview(url);
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
    e.preventDefault();
    if (!videoFile && !videoUrl) {
      return setStatus({ type: "error", message: "Please provide a video file or URL" });
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
      formData.append("description", description);
      if (productLink) formData.append("productLink", productLink);
      formData.append("tags", tagsList.join(','));
      if (soundId) formData.append("soundId", soundId);

      console.log("[VideoUpload] Sending payload:", { name, tags: tagsList, soundId });
      
      await api.post(`/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#030014] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
        >
          <Link to="/watch-me" className="absolute top-8 left-8 p-3 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full dark:text-white hover:bg-pink-500 hover:text-white transition-all z-30 group shadow-lg">
             <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side: Upload Area */}
            <div className="lg:w-1/2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/10">
              <h1 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter mb-8">Upload Video</h1>
              
              <div className="space-y-6">
                {/* File Upload */}
                <div className="relative group">
                   <input 
                     type="file" 
                     accept="video/*" 
                     onChange={handleFileChange}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <div className={`h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${videoFile ? 'border-pink-500 bg-pink-500/5' : 'border-black/10 dark:border-white/10 group-hover:border-pink-500 group-hover:bg-pink-500/5'}`}>
                      {preview ? (
                         <video src={preview} className="w-full h-full object-cover rounded-3xl" />
                      ) : (
                         <>
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                               <Upload className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-sm font-bold dark:text-white">Click to upload file</span>
                            <span className="text-xs text-gray-500 mt-2">MP4 or WebM (Max 50MB)</span>
                         </>
                      )}
                      {videoFile && (
                        <button onClick={() => {setVideoFile(null); setPreview(null);}} className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 z-20">
                           <X className="w-4 h-4" />
                        </button>
                      )}
                   </div>
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Video Poster (Optional)</label>
                   <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleThumbChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${thumbnailFile ? 'border-purple-500 bg-purple-500/5' : 'border-black/10 dark:border-white/10 group-hover:border-purple-500 group-hover:bg-purple-500/5'}`}>
                         {thumbPreview ? (
                            <img src={thumbPreview} className="w-full h-full object-cover rounded-3xl" />
                         ) : (
                            <div className="flex flex-col items-center">
                               <Upload className="w-6 h-6 text-gray-400 mb-2" />
                               <span className="text-[10px] font-bold dark:text-white uppercase tracking-widest">Upload Poster</span>
                            </div>
                         )}
                         {thumbnailFile && (
                           <button onClick={() => {setThumbnailFile(null); setThumbPreview(null);}} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 z-20">
                              <X className="w-3 h-3" />
                           </button>
                         )}
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">OR</span>
                   <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Video URL (Optional)</label>
                   <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={videoUrl}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/video.mp4" 
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      />
                   </div>
                </div>
              </div>
            </div>

            {/* Right Side: Details Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Type className="w-3 h-3" /> Video Name
                   </label>
                   <input 
                     required
                     type="text" 
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="A catchy title for your video" 
                     className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <AlignLeft className="w-3 h-3" /> Description
                   </label>
                   <textarea 
                     rows="4"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Tell us about your video..." 
                     className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Product Link (Optional)
                   </label>
                   <input 
                     type="url" 
                     value={productLink}
                     onChange={(e) => setProductLink(e.target.value)}
                     placeholder="https://example.com/product/123" 
                     className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Tags ({tagsList.length}/10)
                   </label>
                   
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add a tag..." 
                        className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      />
                      <button 
                        type="button"
                        onClick={addTag}
                        className="px-6 bg-primary dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
                      >
                         Add
                      </button>
                   </div>

                   <div className="flex flex-wrap gap-2">
                      {tagsList.map(tag => (
                        <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                           #{tag}
                           <button type="button" onClick={() => removeTag(tag)} className="hover:text-pink-700 transition-colors">
                              <X className="w-3 h-3" />
                           </button>
                        </span>
                      ))}
                   </div>
                </div>

                {status.message && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                    {status.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    <span className="text-sm font-bold">{status.message}</span>
                  </div>
                )}

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                >
                   {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   ) : (
                      <>
                        <Video className="w-5 h-5" /> Post Video
                      </>
                   )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
