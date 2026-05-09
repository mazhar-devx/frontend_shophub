import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Play, Users, MessageCircle, ChevronLeft, Share2, Grid, Bookmark } from "lucide-react";
import axios from "axios";
import { API_URL, getProductImageUrl, DEFAULT_AVATAR } from "../utils/constants";

export default function CreatorProfile() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    fetchCreatorData();
  }, [id]);

  const fetchCreatorData = async () => {
    try {
      // For now, we get creator info from the first video or a specific user endpoint
      // Assuming we have a GET /api/v1/users/:id endpoint
      const userRes = await axios.get(`${API_URL}/users/${id}`, { withCredentials: true });
      setCreator(userRes.data.data.user);

      const videoRes = await axios.get(`${API_URL}/videos/user/${id}`);
      setVideos(videoRes.data.data.videos);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const totalLikes = videos.reduce((acc, video) => acc + video.likes.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
         <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#030014] text-gray-500">
         <h2 className="text-2xl font-black mb-4">Creator not found</h2>
         <Link to="/watch-me" className="px-6 py-2 bg-pink-500 text-white rounded-full">Back to Watch Me</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030014]">
      {/* Header / Cover Area */}
      <div className="h-48 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 relative">
         <Link to="/watch-me" className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
            <ChevronLeft className="w-6 h-6" />
         </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 pb-20">
         {/* Profile Card */}
         <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] border-4 border-white dark:border-white/10 overflow-hidden shadow-2xl relative"
               >
                  <img src={creator.photo ? getProductImageUrl(creator.photo) : DEFAULT_AVATAR} className="w-full h-full object-cover" />
               </motion.div>

               <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                     <h1 className="text-3xl font-black text-primary dark:text-white tracking-tighter uppercase">{creator.vendorName || creator.name}</h1>
                     <div className="flex gap-2">
                        <button className="px-6 py-2 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20">Follow</button>
                        <button className="p-2 border border-black/10 dark:border-white/10 rounded-full dark:text-white hover:bg-black/5 dark:hover:bg-white/5"><Share2 className="w-5 h-5" /></button>
                     </div>
                  </div>

                  <div className="flex gap-8 mb-6">
                     <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-black dark:text-white">1.2K</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3" /> Followers</span>
                     </div>
                     <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-black dark:text-white">{totalLikes}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Heart className="w-3 h-3" /> Likes</span>
                     </div>
                     <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-black dark:text-white">{videos.length}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Play className="w-3 h-3" /> Videos</span>
                     </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium max-w-lg leading-relaxed">
                     {creator.description || "Passionate creator sharing moments and insights. Join me on my journey through tech, fashion, and lifestyle. 🚀"}
                  </p>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-black/5 dark:border-white/5 mt-12">
               <button 
                 onClick={() => setActiveTab("videos")}
                 className={`flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "videos" ? "text-pink-500" : "text-gray-500 hover:text-primary dark:hover:text-white"}`}
               >
                  <Grid className="w-4 h-4" /> Videos
                  {activeTab === "videos" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" />}
               </button>
               <button 
                 onClick={() => setActiveTab("liked")}
                 className={`flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "liked" ? "text-pink-500" : "text-gray-500 hover:text-primary dark:hover:text-white"}`}
               >
                  <Heart className="w-4 h-4" /> Liked
                  {activeTab === "liked" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" />}
               </button>
               <button 
                 onClick={() => setActiveTab("saved")}
                 className={`flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "saved" ? "text-pink-500" : "text-gray-500 hover:text-primary dark:hover:text-white"}`}
               >
                  <Bookmark className="w-4 h-4" /> Saved
                  {activeTab === "saved" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" />}
               </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
               {activeTab === "videos" ? videos.map((video, idx) => (
                  <motion.div 
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative aspect-[9/16] bg-black rounded-3xl overflow-hidden cursor-pointer"
                  >
                     <video src={video.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{video.views || 0}</span>
                     </div>
                     <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Heart className="w-3 h-3" />
                        <span>{video.likes.length}</span>
                     </div>
                  </motion.div>
               )) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 opacity-50">
                     <Play className="w-12 h-12 mb-4" />
                     <p className="font-bold uppercase tracking-widest text-xs">No {activeTab} videos yet</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
