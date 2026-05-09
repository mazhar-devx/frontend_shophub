import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Play, ChevronLeft, Share2, Bookmark, Plus, Music2 } from "lucide-react";
import api from "../services/api";
import { getProductImageUrl } from "../utils/constants";

export default function SoundPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalVideo, setOriginalVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSoundData();
  }, [id]);

  const fetchSoundData = async () => {
    try {
      // Fetch the original video to get sound details
      const videoRes = await api.get(`/videos`);
      const allVids = videoRes.data.data.videos;
      const original = allVids.find(v => v._id === id) || allVids[0]; // fallback
      setOriginalVideo(original);

      // Fetch videos using this sound
      const res = await api.get(`/videos?soundId=${id}`);
      setVideos([original, ...res.data.data.videos]);
      
      if (isAuthenticated && user) {
         setIsSaved(user.savedSounds?.includes(id));
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveSound = async () => {
     if (!isAuthenticated) return alert("Please login to save sounds");
     try {
        const res = await api.post(`/videos/${id}/save-sound`);
        setIsSaved(res.data.data.isSaved);
     } catch (err) {
        console.error(err);
     }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
         <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030014] pb-20">
      {/* Header Area */}
      <div className="p-6 pt-10 sticky top-0 z-50 bg-white/80 dark:bg-[#030014]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="p-2 bg-black/5 dark:bg-white/10 rounded-full dark:text-white">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <h1 className="font-black text-lg uppercase tracking-widest dark:text-white flex items-center gap-2">
           <Music2 className="w-5 h-5 text-pink-500" /> Sound
         </h1>
         <button className="p-2 bg-black/5 dark:bg-white/10 rounded-full dark:text-white">
            <Share2 className="w-5 h-5" />
         </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
         {/* Sound Info Card */}
         <div className="flex gap-6 items-center mb-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-black relative shadow-xl flex-shrink-0">
               <img src={originalVideo?.thumbnailUrl ? getProductImageUrl(originalVideo.thumbnailUrl) : "/default-avatar.png"} className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-10 h-10 text-white fill-white" />
               </div>
            </div>
            <div className="flex-1">
               <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Original Sound - {originalVideo?.name || "Unknown"}</h2>
               <p className="text-sm font-bold text-gray-500 mb-4">@{originalVideo?.user?.name || "Creator"}</p>
               <span className="px-3 py-1 bg-black/5 dark:bg-white/10 rounded-md text-xs font-bold dark:text-white">{videos.length} videos</span>
            </div>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-4 mb-10">
            <button 
              onClick={() => navigate(`/upload-video?soundId=${id}`)}
              className="flex-1 bg-pink-500 text-white py-4 rounded-full font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
            >
               <Plus className="w-5 h-5" /> Use this Sound
            </button>
            <button 
              onClick={handleSaveSound}
              className={`px-8 py-4 rounded-full font-black uppercase tracking-widest transition-transform flex justify-center items-center gap-2 ${isSaved ? 'bg-black text-white dark:bg-white dark:text-black border-2 border-transparent' : 'bg-transparent border-2 border-black/10 dark:border-white/20 dark:text-white'}`}
            >
               <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
            </button>
         </div>

         {/* Video Grid */}
         <div className="grid grid-cols-3 gap-1 md:gap-2">
            {videos.map((video, idx) => (
                <motion.div 
                 key={video._id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: idx * 0.05 }}
                 onClick={() => window.location.href = `/watch-me?v=${video._id}`}
                 className="group relative aspect-[9/16] bg-black cursor-pointer"
               >
                  <video src={getProductImageUrl(video.videoUrl)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white font-bold text-xs">
                     <Play className="w-3 h-3 fill-current" />
                     <span>{video.views || 0}</span>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
