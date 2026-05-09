import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Plus, X, Music2, Bell, ChevronLeft, Send, Volume2, VolumeX, Download, Play } from "lucide-react";
import NotificationsModal from "../components/NotificationsModal";
import api from "../services/api";
import { getProductImageUrl } from "../utils/constants";

const VideoCard = ({ video, isActive, isGlobalMuted, setIsGlobalMuted, onTagClick }) => {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likes, setLikes] = useState(video.likes.length);
  const [showComments, setShowComments] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
       setIsLiked(video.likes.includes(user._id));
       setIsFollowing(video.user?.followers?.includes(user._id));
    }
  }, [isAuthenticated, user, video.likes, video.user]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
    }
  }, [isGlobalMuted]);

  const lastTap = useRef(0);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [playPauseAnim, setPlayPauseAnim] = useState(null);

  const handleTap = (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap
      lastTap.current = 0;
      if (!isLiked) handleLike();
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    } else {
      // Single tap
      lastTap.current = now;
      if (!video.videoUrl) return;
      if (videoRef.current?.paused) {
        videoRef.current.play().catch(err => console.log(err));
        setPlayPauseAnim('play');
      } else {
        videoRef.current.pause();
        setPlayPauseAnim('pause');
      }
      setTimeout(() => setPlayPauseAnim(null), 500);
    }
  };


  useEffect(() => {
    if (isActive && video.videoUrl) {
      videoRef.current?.play().catch(e => console.log("Autoplay blocked:", e.message));
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive, video.videoUrl]);

  const [showShare, setShowShare] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleComment = async () => {
    if (!isAuthenticated) return alert("Please login to comment!");
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/videos/${video._id}/comment`, { text: commentText });
      video.comments = res.data.data.comments;
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleFollow = async () => {
    if (!isAuthenticated) return alert("Please login to follow!");
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await api.post(`/users/${video.user._id}/${endpoint}`);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return alert("Please login to save!");
    try {
      const res = await api.post(`/videos/${video._id}/save`);
      setIsSaved(res.data.data.isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  const shareLinks = [
    { name: "WhatsApp", icon: "🟢", link: `https://wa.me/?text=Check out this video on ShopHub: ${window.location.origin}/watch-me?v=${video._id}` },
    { name: "Facebook", icon: "🔵", link: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/watch-me?v=${video._id}` },
    { name: "Twitter", icon: "𝕏", link: `https://twitter.com/intent/tweet?text=Check out this video on ShopHub!&url=${window.location.origin}/watch-me?v=${video._id}` },
    { name: "Download", icon: <Download className="w-6 h-6 text-pink-500" />, action: async () => {
        try {
           const response = await fetch(getProductImageUrl(video.videoUrl));
           const blob = await response.blob();
           const url = window.URL.createObjectURL(blob);
           const a = document.createElement('a');
           a.style.display = 'none';
           a.href = url;
           a.download = `shophub_video_${video._id}.mp4`;
           document.body.appendChild(a);
           a.click();
           window.URL.revokeObjectURL(url);
        } catch (error) {
           alert("Download failed. Please try again.");
        }
    }},
    { name: "Copy Link", icon: "🔗", action: () => {
        navigator.clipboard.writeText(`${window.location.origin}/watch-me?v=${video._id}`);
        alert("Link copied!");
    }}
  ];

  return (
    <div className="relative w-full h-full snap-start bg-black flex items-center justify-center overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        src={getProductImageUrl(video.videoUrl)}
        poster={video.thumbnailUrl ? getProductImageUrl(video.thumbnailUrl) : undefined}
        loop
        muted={isGlobalMuted}
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Tap Overlay (handles clicks/taps instead of video element) */}
      <div 
        className="absolute inset-0 z-10" 
        onClick={handleTap} 
      />

      {/* Double Tap Heart Animation */}
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute z-50 pointer-events-none"
          >
            <Heart className="w-32 h-32 fill-pink-500 text-pink-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Animation */}
      <AnimatePresence>
        {playPauseAnim && (
          <motion.div 
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute z-50 pointer-events-none bg-black/40 rounded-full p-6 backdrop-blur-sm"
          >
            {playPauseAnim === 'play' ? <Play className="w-16 h-16 text-white fill-white" /> : <div className="w-16 h-16 flex justify-center gap-3"><div className="w-4 h-16 bg-white rounded-full"></div><div className="w-4 h-16 bg-white rounded-full"></div></div>}
          </motion.div>
        )}
      </AnimatePresence>



      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
        {/* Creator DP */}
        <div className="relative mb-4">
           <Link to={`/creator/${video.user?._id}`} className="pointer-events-auto">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg"
              >
                 <img src={video.user?.photo ? getProductImageUrl(video.user.photo) : "/default-avatar.png"} alt="Creator" className="w-full h-full object-cover" />
              </motion.div>
           </Link>
           {user?._id !== video.user?._id && (
             <button 
               onClick={handleFollow}
               className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black transition-all pointer-events-auto ${isFollowing ? 'bg-white text-black' : 'bg-pink-500 text-white hover:scale-110'}`}
             >
                {isFollowing ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
             </button>
           )}
        </div>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
           <div className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-all ${isLiked ? 'text-pink-500 scale-110' : 'text-white group-hover:scale-110'}`}>
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">{likes}</span>
        </button>

        {/* Message / Comment */}
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1 group">
           <div className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white group-hover:scale-110 transition-all">
              <MessageCircle className="w-7 h-7" />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">{video.comments.length}</span>
        </button>

        {/* Save */}
        <button onClick={handleSave} className="flex flex-col items-center gap-1 group">
           <div className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-all ${isSaved ? 'text-yellow-500 scale-110' : 'text-white group-hover:scale-110'}`}>
              <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Share */}
        <button onClick={() => setShowShare(true)} className="flex flex-col items-center gap-1 group">
           <div className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white group-hover:scale-110 transition-all">
              <Share2 className="w-7 h-7" />
           </div>
           <span className="text-white text-xs font-bold shadow-sm">Share</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-4 bottom-8 right-16 z-20 pointer-events-none">
         <Link to={`/creator/${video.user?._id}`} className="pointer-events-auto">
            <h3 className="text-white font-bold text-lg mb-2 hover:underline inline-block">@{video.user?.vendorName || video.user?.name}</h3>
         </Link>
         <p className="text-white/90 text-sm mb-3 line-clamp-2">{video.description}</p>
         <div className="flex items-center gap-2 mb-4 flex-wrap">
            {video.tags?.map(tag => (
              <button 
                key={tag} 
                onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                className="text-white font-black text-sm italic hover:text-pink-400 hover:underline cursor-pointer pointer-events-auto bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-sm"
              >
                #{tag}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-2 text-white/80">
            <Music2 className="w-4 h-4 animate-spin-slow" />
            <marquee className="text-xs font-medium w-40">Original Sound - {video.name}</marquee>
         </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
             <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-8 w-full max-w-xs shadow-2xl relative">
                <button onClick={() => setShowShare(false)} className="absolute top-4 right-4 p-2 dark:text-white hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-6">Share to</h3>
                <div className="grid grid-cols-2 gap-4">
                   {shareLinks.map(link => (
                      link.action ? (
                        <button key={link.name} onClick={link.action} className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-black/5 dark:bg-white/5 hover:bg-pink-500/10 transition-all">
                           <span className="text-2xl">{link.icon}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{link.name}</span>
                        </button>
                      ) : (
                        <a key={link.name} href={link.link} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-black/5 dark:bg-white/5 hover:bg-pink-500/10 transition-all">
                           <span className="text-2xl">{link.icon}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{link.name}</span>
                        </a>
                      )
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

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

             <div className="flex items-center gap-3 pt-4 border-t dark:border-white/5 pointer-events-auto">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-full px-6 py-3 text-sm dark:text-white focus:ring-2 focus:ring-pink-500"
                />
                <button 
                  onClick={handleComment}
                  className="p-3 bg-pink-500 rounded-full text-white shadow-lg hover:scale-105 transition-transform"
                >
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
  const { tag: routeTag } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedType, setFeedType] = useState("foryou"); // "foryou" or "following"
  const [selectedTag, setSelectedTag] = useState(routeTag || null);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true); // Default muted for autoplay policies
  const containerRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const videoId = searchParams.get('v');
    if (videoId && videos.length > 0) {
       const index = videos.findIndex(v => v._id === videoId);
       if (index !== -1) {
          setActiveIndex(index);
          // Scroll to that video
          const container = containerRef.current;
          if (container) {
             container.scrollTo({ top: index * container.clientHeight, behavior: 'smooth' });
          }
       }
    }
  }, [videos]);

  useEffect(() => {
     if (isAuthenticated) {
        checkUnread();
     }
  }, [isAuthenticated]);

  const checkUnread = async () => {
     try {
        const res = await api.get('/notifications');
        setHasUnread(res.data.data.notifications.some(n => !n.read));
     } catch (err) {
        console.error(err);
     }
  };

  useEffect(() => {
    fetchVideos();
  }, [feedType, selectedTag]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let url = "/videos";
      if (feedType === "foryou") {
        url += `?sort=likes&userId=${user?._id || ''}`;
      } else if (feedType === "following") {
        url += `?feed=following&userId=${user?._id}`;
      }
      if (selectedTag) {
        url += `${url.includes('?') ? '&' : '?'}tag=${encodeURIComponent(selectedTag)}`;
      }
      const res = await api.get(url);
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

  if (loading && videos.length === 0) {
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
        className="w-full h-full max-w-lg relative bg-black snap-y snap-mandatory overflow-y-scroll no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
         {videos.map((video, idx) => (
           <motion.div 
             key={video._id}
             drag="x"
             dragConstraints={{ left: 0, right: 0 }}
             dragElastic={0.2}
             onDragEnd={(e, { offset }) => {
               if (offset.x < -100) {
                 window.location.href = `/creator/${video.user._id}`;
               }
             }}
             className="w-full h-full snap-start"
           >
             <VideoCard 
               video={video} 
               isActive={idx === activeIndex} 
               isGlobalMuted={isGlobalMuted}
               setIsGlobalMuted={setIsGlobalMuted}
               onTagClick={(tag) => {
                 setSelectedTag(tag);
                 navigate(`/tag/${tag}`);
               }}
             />
           </motion.div>
         ))}

         {videos.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
               <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <Music2 className="w-12 h-12 opacity-50" />
               </div>
               <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">No Videos Found</h2>
               <p className="text-gray-500 mb-8 font-medium">{feedType === 'following' ? "You aren't following anyone yet or they haven't posted." : "Be the first to share a moment!"}</p>
               {isAuthenticated && feedType === 'foryou' && (
                  <Link to="/upload-video" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform">
                     Upload Video
                  </Link>
               )}
            </div>
         )}
      </div>

      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between z-[100] pointer-events-none">
         {/* Top Left: Back to Home & Mute */}
         <div className="flex gap-2 pointer-events-auto">
           <Link 
             to="/" 
             className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all flex items-center gap-2 group shadow-2xl border border-white/10"
           >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Store</span>
           </Link>
           <button 
             onClick={() => setIsGlobalMuted(!isGlobalMuted)} 
             className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all flex items-center justify-center shadow-2xl border border-white/10"
           >
             {isGlobalMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
           </button>
         </div>

         {/* Top Center: Tabs */}
         <div className="flex items-center gap-4 pointer-events-auto bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
            <button 
              onClick={() => {
                if (!isAuthenticated) return alert("Please login to see Following feed");
                setFeedType("following");
              }}
              className={`text-sm font-black transition-all ${feedType === "following" ? 'text-white' : 'text-white/50 hover:text-white'} uppercase tracking-tighter`}
            >
              Following
            </button>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <button 
              onClick={() => {
                setFeedType("foryou");
                setSelectedTag(null);
              }}
              className={`text-sm font-black transition-all ${feedType === "foryou" && !selectedTag ? 'text-white' : 'text-white/50 hover:text-white'} uppercase tracking-tighter`}
            >
              For You
            </button>
            {selectedTag && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <button 
                  onClick={() => {
                    setSelectedTag(null);
                    if (routeTag) navigate('/watch-me');
                  }}
                  className="text-sm font-black text-pink-500 uppercase tracking-tighter flex items-center gap-1"
                >
                  #{selectedTag} <X className="w-3 h-3" />
                </button>
              </>
            )}
         </div>

          {/* Top Right: Profile & Notifications */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
             {isAuthenticated ? (
                <div className="flex flex-col items-end gap-3">
                   <button 
                     onClick={() => setShowNotifications(true)}
                     className="relative p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all border border-white/10 shadow-2xl"
                   >
                      <Bell className="w-6 h-6" />
                      {hasUnread && <span className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full border-2 border-black" />}
                   </button>

                   <Link to={`/creator/${user._id}`} className="group flex items-center gap-3 bg-black/40 backdrop-blur-xl p-1 pr-4 rounded-full border border-white/10 hover:bg-black/60 transition-all shadow-2xl">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 shadow-lg">
                         <img src={user.photo ? getProductImageUrl(user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                      </div>
                      <div className="hidden md:flex flex-col text-left">
                         <span className="text-xs font-black text-white uppercase tracking-tighter leading-none">{user.name}</span>
                         <span className="text-[9px] text-white/50 font-medium truncate w-24">{user.email}</span>
                      </div>
                   </Link>
                </div>
             ) : (
                <Link to="/login" className="px-6 py-3 bg-pink-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all shadow-pink-500/20">
                   Login
                </Link>
             )}
          </div>
       </div>

       <NotificationsModal 
         isOpen={showNotifications} 
         onClose={() => { setShowNotifications(false); setHasUnread(false); }} 
       />
    </div>
  );
}
