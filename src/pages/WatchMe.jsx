import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Plus, X, Send, Music2, User, ChevronLeft } from "lucide-react";
import api from "../services/api";
import { getProductImageUrl } from "../utils/constants";

const VideoCard = ({ video, isActive }) => {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes.length);
  const [showComments, setShowComments] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleLike = async () => {
    if (!isAuthenticated) return alert("Please login to like!");
    try {
      const res = await api.post(`/videos/${video._id}/like`);
      setIsLiked(res.data.data.isLiked);
      setLikes(res.data.data.likeCount);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-full snap-start bg-black flex items-center justify-center overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        className="w-full h-full object-cover"
        onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current.pause()}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
        {/* Creator DP */}
        <div className="relative mb-4">
           <motion.div 
             whileHover={{ scale: 1.1 }}
             className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg"
           >
              <img src={video.user?.photo ? getProductImageUrl(video.user.photo) : "/default-avatar.png"} alt="Creator" className="w-full h-full object-cover" />
           </motion.div>
           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center border-2 border-black">
              <Plus className="w-3 h-3 text-white" />
           </div>
        </div>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
           <div className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-all ${isLiked ? 'text-pink-500 scale-110' : 'text-white group-hover:scale-110'}`}>
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">{likes}</span>
        </button>

        {/* Comment */}
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1 group">
           <div className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white group-hover:scale-110 transition-all">
              <MessageCircle className="w-7 h-7" />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">{video.comments.length}</span>
        </button>

        {/* Save */}
        <button className="flex flex-col items-center gap-1 group">
           <div className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white group-hover:scale-110 transition-all">
              <Bookmark className="w-7 h-7" />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">Save</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 group">
           <div className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white group-hover:scale-110 transition-all">
              <Share2 className="w-7 h-7" />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">Share</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-4 bottom-8 right-16 z-20 pointer-events-none">
         <h3 className="text-white font-bold text-lg mb-2">@{video.user?.vendorName || video.user?.name}</h3>
         <p className="text-white/90 text-sm mb-3 line-clamp-2">{video.description}</p>
         <div className="flex items-center gap-2 mb-4">
            {video.tags?.map(tag => (
              <span key={tag} className="text-white font-black text-sm italic hover:underline cursor-pointer pointer-events-auto">#{tag}</span>
            ))}
         </div>
         <div className="flex items-center gap-2 text-white/80">
            <Music2 className="w-4 h-4 animate-spin-slow" />
            <marquee className="text-xs font-medium w-40">Original Sound - {video.name}</marquee>
         </div>
      </div>

      {/* Comments Sidebar/Overlay */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[70%] bg-white dark:bg-[#0f0f0f] rounded-t-3xl z-[100] p-6 flex flex-col shadow-2xl"
          >
             <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-black dark:text-white uppercase tracking-widest">{video.comments.length} Comments</span>
                <button onClick={() => setShowComments(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full dark:text-white">
                   <X className="w-6 h-6" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 mb-4">
                {video.comments.map((comment, idx) => (
                  <div key={idx} className="flex gap-4">
                     <img src={comment.user?.photo ? getProductImageUrl(comment.user.photo) : "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover" />
                     <div className="flex flex-col">
                        <span className="text-sm font-bold dark:text-white">{comment.user?.name}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
                        <span className="text-[10px] text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleDateString()}</span>
                     </div>
                  </div>
                ))}
                {video.comments.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                     <MessageCircle className="w-12 h-12 mb-2" />
                     <p className="font-bold">Be the first to comment!</p>
                  </div>
                )}
             </div>

             <div className="flex items-center gap-3 pt-4 border-t dark:border-white/5">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-full px-6 py-3 text-sm dark:text-white focus:ring-2 focus:ring-pink-500"
                />
                <button className="p-3 bg-pink-500 rounded-full text-white shadow-lg hover:scale-105 transition-transform">
                   <Send className="w-5 h-5" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function WatchMe() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get(`/videos`);
      setVideos(res.data.data.videos);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollTop;
    const height = e.target.clientHeight;
    const index = Math.round(scrollPosition / height);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
         <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
         />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Feed Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full max-w-lg relative bg-black snap-y snap-mandatory overflow-y-scroll no-scrollbar"
      >
         {videos.map((video, idx) => (
           <VideoCard 
             key={video._id} 
             video={video} 
             isActive={idx === activeIndex} 
           />
         ))}

         {videos.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
               <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <Music2 className="w-12 h-12 opacity-50" />
               </div>
               <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">No Videos Yet</h2>
               <p className="text-gray-500 mb-8 font-medium">Be the first to share a moment!</p>
               {isAuthenticated && (
                  <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform">
                     Upload Video
                  </button>
               )}
            </div>
         )}
      </div>

      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between z-[100] pointer-events-none">
         {/* Top Left: Back to Home */}
         <Link 
           to="/" 
           className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all pointer-events-auto flex items-center gap-2 group shadow-2xl border border-white/10"
         >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Store</span>
         </Link>

         {/* Top Center: Tabs */}
         <div className="flex items-center gap-4 pointer-events-auto bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
            <span className={`text-sm font-black transition-all ${activeIndex === 0 ? 'text-white' : 'text-white/50 hover:text-white'} cursor-pointer uppercase tracking-tighter`}>Following</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className={`text-sm font-black transition-all ${activeIndex !== 0 ? 'text-white' : 'text-white/50 hover:text-white'} cursor-pointer uppercase tracking-tighter`}>For You</span>
         </div>

         {/* Top Right: Profile */}
         <div className="flex flex-col items-end gap-2 pointer-events-auto">
            {isAuthenticated ? (
               <Link to={`/creator/${user._id}`} className="group flex items-center gap-3 bg-black/40 backdrop-blur-xl p-1 pr-4 rounded-full border border-white/10 hover:bg-black/60 transition-all shadow-2xl">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 shadow-lg">
                     <img src={user.photo ? getProductImageUrl(user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:flex flex-col">
                     <span className="text-xs font-black text-white uppercase tracking-tighter leading-none">{user.name}</span>
                     <span className="text-[9px] text-white/50 font-medium truncate w-24">{user.email}</span>
                  </div>
               </Link>
            ) : (
               <Link to="/login" className="px-6 py-3 bg-pink-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all shadow-pink-500/20">
                  Login
               </Link>
            )}
         </div>
      </div>
    </div>
  );
}
