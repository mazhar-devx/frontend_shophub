import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Plus, X, Music2, Bell, ChevronLeft, Send, Volume2, VolumeX, Download, Play, ShoppingCart, Search, MoreVertical, Edit2, Trash2, Image as ImageIcon, MoreHorizontal, RotateCw } from "lucide-react";
import SEO from "../components/SEO";
import NotificationsModal from "../components/NotificationsModal";
import api from "../services/api";
import { getProductImageUrl } from "../utils/constants";

// URL Detector Regex
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const VideoCard = ({ video, isActive, isGlobalMuted, setIsGlobalMuted, onTagClick }) => {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likes, setLikes] = useState(video.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [editForm, setEditForm] = useState({ name: video.name, description: video.description, tags: video.tags?.join(', '), productLink: video.productLink });
  const [isActionLoading, setIsActionLoading] = useState({ like: false, save: false, follow: false, comment: false });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
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
  const pressTimer = useRef(null);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [playPauseAnim, setPlayPauseAnim] = useState(null);

  const handlePointerDown = () => {
    pressTimer.current = setTimeout(() => {
      setShowShare(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

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
      videoRef.current?.play()
        .then(() => setIsAutoplayBlocked(false))
        .catch(e => {
          console.log("Autoplay blocked:", e.message);
          setIsAutoplayBlocked(true);
        });
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      setIsAutoplayBlocked(false);
    }
  }, [isActive, video.videoUrl]);

  const [showShare, setShowShare] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentMedia, setCommentMedia] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // { commentId, username }
  const [localComments, setLocalComments] = useState(video.comments || []);

  const handleComment = async () => {
    if (!isAuthenticated) return alert("Please login to comment!");
    if (!commentText.trim() && !commentMedia) return;

    try {
      setIsActionLoading(prev => ({ ...prev, comment: true }));
      if (replyingTo) {
         const formData = new FormData();
         if (commentText.trim()) formData.append("text", commentText);
         if (commentMedia) formData.append("media", commentMedia);
         
         const res = await api.post(`/videos/${video._id}/comment/${replyingTo.commentId}/reply`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
         });
         const updatedReplies = res.data.data.replies;
         setLocalComments(localComments.map(c => c._id === replyingTo.commentId ? { ...c, replies: updatedReplies } : c));
         setReplyingTo(null);
      } else {
         const formData = new FormData();
         if (commentText.trim()) formData.append("text", commentText);
         if (commentMedia) formData.append("media", commentMedia);

         const res = await api.post(`/videos/${video._id}/comment`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
         });
         setLocalComments(res.data.data.comments);
      }
      setCommentText("");
      setCommentMedia(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(prev => ({ ...prev, comment: false }));
    }
  };

  const handleLikeComment = async (commentId) => {
     if (!isAuthenticated) return alert("Please login to like!");
     try {
        const res = await api.post(`/videos/${video._id}/comment/${commentId}/like`);
        setLocalComments(localComments.map(c => {
           if (c._id === commentId) {
              const newLikes = res.data.data.isLiked ? [...c.likes, user._id] : c.likes.filter(id => id !== user._id);
              return { ...c, likes: newLikes };
           }
           return c;
        }));
     } catch (err) {
        console.error(err);
     }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return alert("Please login to like!");
    const oldLiked = isLiked;
    const oldLikes = likes;
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);

    try {
      setIsActionLoading(prev => ({ ...prev, like: true }));
      const res = await api.post(`/videos/${video._id}/like`);
      setIsLiked(res.data.data.isLiked);
      setLikes(res.data.data.likeCount);
    } catch (err) {
      console.error(err);
      setIsLiked(oldLiked);
      setLikes(oldLikes);
    } finally {
      setIsActionLoading(prev => ({ ...prev, like: false }));
    }
  };
  const handleFollow = async () => {
    if (!isAuthenticated) return alert("Please login to follow!");
    try {
      setIsActionLoading(prev => ({ ...prev, follow: true }));
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await api.post(`/users/${video.user._id}/${endpoint}`);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(prev => ({ ...prev, follow: false }));
    }
  };
  const handleSave = async () => {
    if (!isAuthenticated) return alert("Please login to save!");
    // Optimistic
    const oldSaved = isSaved;
    setIsSaved(!isSaved);

    try {
      setIsActionLoading(prev => ({ ...prev, save: true }));
      const res = await api.post(`/videos/${video._id}/save`);
      setIsSaved(res.data.data.isSaved);
    } catch (err) {
      console.error(err);
      setIsSaved(oldSaved);
    } finally {
      setIsActionLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleDeleteVideo = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
       await api.delete(`/videos/${video._id}`);
       window.location.reload(); // Refresh to remove deleted video
    } catch (err) {
       alert(err.response?.data?.message || "Failed to delete video");
    }
  };

  const handleUpdateVideo = async () => {
     try {
        await api.patch(`/videos/${video._id}`, editForm);
        setIsEditingVideo(false);
        alert("Video updated successfully!");
        window.location.reload();
     } catch (err) {
        alert(err.response?.data?.message || "Failed to update video");
     }
  };

  const handleDeleteComment = async (commentId) => {
     if (!window.confirm("Delete this comment?")) return;
     try {
        await api.delete(`/videos/${video._id}/comment/${commentId}`);
        setLocalComments(localComments.filter(c => c._id !== commentId));
     } catch (err) {
        alert("Failed to delete comment");
     }
  };

  const handleUpdateComment = async (commentId, newText) => {
     try {
        await api.patch(`/videos/${video._id}/comment/${commentId}`, { text: newText });
        setLocalComments(localComments.map(c => c._id === commentId ? { ...c, text: newText } : c));
     } catch (err) {
        alert("Failed to update comment");
     }
  };

  const shareApps = [
    { name: "WhatsApp", icon: "whatsapp.png", color: "bg-green-500", link: `https://wa.me/?text=Check out this video on ShopHub: ${window.location.origin}/watch-me?v=${video._id}` },
    { name: "Facebook", icon: "facebook.png", color: "bg-blue-600", link: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/watch-me?v=${video._id}` },
    { name: "Twitter", icon: "twitter.png", color: "bg-black", link: `https://twitter.com/intent/tweet?text=Check out this video on ShopHub!&url=${window.location.origin}/watch-me?v=${video._id}` },
    { name: "Copy Link", icon: "link.png", color: "bg-gray-500", action: () => {
        navigator.clipboard.writeText(`${window.location.origin}/watch-me?v=${video._id}`);
        alert("Link copied!");
    }}
  ];

  const shareActions = [
    { name: "Report", icon: "🚩" },
    { name: "Not Interested", icon: "💔" },
    { name: "Save Video", icon: "💾", action: async () => {
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
    { name: "Duet", icon: "👥" }
  ];

  return (
    <div className="relative w-full h-full snap-start bg-black flex items-center justify-center overflow-hidden">
      {/* Autoplay Block Overlay */}
      {isAutoplayBlocked && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-[30] pointer-events-none">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20 animate-pulse">
               <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
         </div>
      )}

      {/* Loading Skeleton / Spinner for slow internet */}
      <AnimatePresence>
        {!isVideoLoaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center gap-6"
          >
             {/* Blurred Thumbnail as Background */}
             {video.thumbnailUrl && (
                <div className="absolute inset-0 overflow-hidden">
                   <img 
                     src={getProductImageUrl(video.thumbnailUrl)} 
                     className="w-full h-full object-cover blur-2xl opacity-50 scale-110" 
                     alt=""
                   />
                </div>
             )}
             
             {/* Spinning Glow */}
             <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-t-pink-500 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                />
             </div>
             
             <div className="text-center z-10">
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2 animate-pulse">Loading Video</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Experience the moment...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video element */}
      <video
        ref={videoRef}
        src={isActive ? getProductImageUrl(video.videoUrl) : undefined}
        poster={video.thumbnailUrl ? getProductImageUrl(video.thumbnailUrl) : undefined}
        loop
        muted={isGlobalMuted}
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Top Moving Caption */}
      {video.caption && (
        <div className="absolute top-12 left-0 right-0 z-30 pointer-events-none overflow-hidden bg-black/20 backdrop-blur-sm py-2 border-y border-white/10">
           <div className="flex whitespace-nowrap animate-marquee">
              <span className="text-white font-black uppercase tracking-widest text-sm px-4">{video.caption}</span>
              <span className="text-pink-500 font-black uppercase tracking-widest text-sm px-4">•</span>
              <span className="text-white font-black uppercase tracking-widest text-sm px-4">{video.caption}</span>
              <span className="text-pink-500 font-black uppercase tracking-widest text-sm px-4">•</span>
              <span className="text-white font-black uppercase tracking-widest text-sm px-4">{video.caption}</span>
              <span className="text-pink-500 font-black uppercase tracking-widest text-sm px-4">•</span>
           </div>
        </div>
      )}

      {/* Tap Overlay (handles clicks/taps instead of video element) */}
      <div 
        className="absolute inset-0 z-10" 
        onClick={handleTap} 
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
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
               disabled={isActionLoading.follow}
               className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black transition-all pointer-events-auto ${isFollowing ? 'bg-white text-black' : 'bg-pink-500 text-white hover:scale-110'}`}
             >
                {isActionLoading.follow ? (
                   <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : isFollowing ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
             </button>
           )}
        </div>

        {/* Like */}
        <button 
          onClick={handleLike} 
          disabled={isActionLoading.like}
          className="flex flex-col items-center gap-1 group"
        >
           <div className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-all ${isLiked ? 'text-pink-500 scale-110' : 'text-white group-hover:scale-110'}`}>
              {isActionLoading.like ? (
                 <div className="w-7 h-7 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                 <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
              )}
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
        <button 
          onClick={handleSave} 
          disabled={isActionLoading.save}
          className="flex flex-col items-center gap-1 group"
        >
           <div className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-all ${isSaved ? 'text-yellow-500 scale-110' : 'text-white group-hover:scale-110'}`}>
              {isActionLoading.save ? (
                 <div className="w-7 h-7 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                 <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />
              )}
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

        {/* More Menu (Refresh & Management) */}
        <div className="relative">
           <button 
             onClick={() => setShowVideoMenu(!showVideoMenu)} 
             className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all pointer-events-auto"
           >
              <MoreVertical className="w-7 h-7" />
           </button>
           <AnimatePresence>
              {showVideoMenu && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 10 }}
                   className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 pointer-events-auto"
                 >
                    <button 
                      onClick={() => { syncNewVideos(); setShowVideoMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5"
                    >
                       <RotateCw className="w-4 h-4 text-cyan-500" /> Refresh Feed
                    </button>

                    {isAuthenticated && user?._id === video.user?._id && (
                       <>
                          <button 
                            onClick={() => { setIsEditingVideo(true); setShowVideoMenu(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5"
                          >
                             <Edit2 className="w-4 h-4" /> Edit Video
                          </button>
                          <button 
                            onClick={handleDeleteVideo}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                             <Trash2 className="w-4 h-4" /> Delete Video
                          </button>
                       </>
                    )}
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-4 bottom-8 right-16 z-20 pointer-events-none flex flex-col items-start">
         {video.productLink && (
           <a 
             href={video.productLink} 
             target="_blank" 
             rel="noreferrer"
             className="mb-4 pointer-events-auto flex items-center gap-2 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md text-black dark:text-white px-4 py-2.5 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform border border-black/5 dark:border-white/10 group"
           >
             <ShoppingCart className="w-5 h-5 text-pink-500 group-hover:-translate-y-1 transition-transform" />
             <span className="text-sm uppercase tracking-widest">Shop Item</span>
           </a>
         )}
         <Link to={`/creator/${video.user?._id}`} className="pointer-events-auto">
            <h3 className="text-white font-bold text-lg mb-2 hover:underline inline-block">@{video.user?.vendorName || video.user?.name}</h3>
         </Link>
          <p 
            onClick={() => setShowFullDescription(!showFullDescription)}
            className={`text-white/90 text-sm mb-3 cursor-pointer pointer-events-auto transition-all ${showFullDescription ? '' : 'line-clamp-2'}`}
          >
            {video.description}
            {!showFullDescription && video.description?.length > 100 && (
               <span className="text-white/50 font-bold ml-1 hover:text-white transition-colors underline">more</span>
            )}
          </p>
         
         {/* Beautiful URL Badges from Description */}
         <div className="flex flex-wrap gap-2 mb-3">
            {video.description?.match(URL_REGEX)?.map((url, i) => (
               <a 
                 key={i} 
                 href={url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="pointer-events-auto px-3 py-1.5 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 rounded-lg text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500/40 transition-all"
               >
                  <Globe className="w-3 h-3" /> Visit Site
               </a>
            ))}
         </div>
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
          <Link to={`/sound/${video.soundId || video._id}`} className="flex items-center gap-2 text-white/80 pointer-events-auto hover:text-white group w-full overflow-hidden">
            <Music2 className="w-4 h-4 group-hover:text-pink-500 shrink-0" />
            <div className="flex whitespace-nowrap overflow-hidden relative h-5 flex-1">
              <motion.div 
                animate={{ x: [0, "-100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="text-[10px] md:text-xs font-black uppercase tracking-widest pr-12 flex-shrink-0"
              >
                {video.user?.vendorName || video.user?.name} • Original Sound - {video.name}
              </motion.div>
              <motion.div 
                animate={{ x: [0, "-100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="text-[10px] md:text-xs font-black uppercase tracking-widest pr-12 flex-shrink-0"
              >
                {video.user?.vendorName || video.user?.name} • Original Sound - {video.name}
              </motion.div>
            </div>
          </Link>
      </div>

      {/* Share Bottom Sheet */}
      <AnimatePresence>
        {showShare && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShare(false)}
              className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-[110] bg-white dark:bg-[#1a1a1a] rounded-t-[2.5rem] p-6 pb-12 shadow-2xl pointer-events-auto"
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Share to</h3>
                 <button onClick={() => setShowShare(false)} className="p-2 dark:text-white hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col gap-6">
                 <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {shareApps.map(link => (
                       <a key={link.name} href={link.link || '#'} onClick={link.action ? (e) => { e.preventDefault(); link.action(); } : undefined} target="_blank" rel="noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 group">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${link.color}`}>
                             <span className="text-2xl text-white font-black drop-shadow-md">{link.icon === 'whatsapp.png' ? 'W' : link.icon === 'facebook.png' ? 'f' : link.icon === 'twitter.png' ? 'X' : link.icon === 'link.png' ? '🔗' : link.icon}</span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-300 text-gray-700">{link.name}</span>
                       </a>
                    ))}
                 </div>
                 <div className="w-full h-[1px] bg-black/5 dark:bg-white/10" />
                 <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {shareActions.map(action => (
                       <button key={action.name} onClick={action.action} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                          <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-all">
                             <span className="text-2xl">{action.icon}</span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-300 text-gray-700">{action.name}</span>
                       </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Comments Bottom Sheet */}
      <AnimatePresence>
        {showComments && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComments(false)}
              className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-[110] bg-white dark:bg-[#1a1a1a] rounded-t-[2.5rem] p-6 pb-8 shadow-2xl h-[80vh] flex flex-col pointer-events-auto"
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-6 flex-shrink-0" />
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                 <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Comments <span className="text-pink-500">{video.comments.length}</span></h3>
                 <button onClick={() => setShowComments(false)} className="p-2 dark:text-white hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2">
                {localComments.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10 font-bold">Be the first to comment!</p>
                ) : (
                  localComments.map((comment) => (
                    <div key={comment._id} className="flex flex-col gap-3 group">
                      <div className="flex gap-3 items-start">
                         <div className="w-10 h-10 rounded-full overflow-hidden border border-black/10 flex-shrink-0">
                            <img src={comment.user?.photo ? getProductImageUrl(comment.user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-2">
                               <span className="font-bold text-xs dark:text-gray-300 text-gray-600">@{comment.user?.name || "User"}</span>
                               {comment.user?._id === video.user?._id && (
                                  <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest">Creator</span>
                               )}
                            </div>
                                                 <p className="dark:text-white text-sm font-medium mt-1">{comment.text}</p>
                             {comment.mediaUrl && (
                                <img src={getProductImageUrl(comment.mediaUrl)} className="w-32 h-auto rounded-xl mt-2 border border-black/10 dark:border-white/10" />
                             )}
                             <div className="flex gap-4 mt-2 text-[10px] text-gray-400 font-bold items-center">
                                <button onClick={() => setReplyingTo({ commentId: comment._id, username: comment.user?.name })} className="hover:text-pink-500 transition-colors">Reply</button>
                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                {isAuthenticated && (user?._id === comment.user?._id || user?._id === video.user?._id) && (
                                   <div className="flex gap-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                      {user?._id === comment.user?._id && (
                                         <button onClick={() => {
                                            const newText = prompt("Edit comment:", comment.text);
                                            if (newText && newText !== comment.text) handleUpdateComment(comment._id, newText);
                                         }} className="text-gray-400 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                                      )}
                                      <button onClick={() => handleDeleteComment(comment._id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                   </div>
                                )}
                             </div>
                          </div>
                          <button onClick={() => handleLikeComment(comment._id)} className="p-2 text-gray-400 hover:text-pink-500 transition-colors flex flex-col items-center gap-1 group/btn shrink-0">
                             <Heart className={`w-4 h-4 ${comment.likes?.includes(user?._id) ? 'fill-pink-500 text-pink-500' : 'group-hover/btn:scale-110'}`} />
                             <span className="text-[10px]">{comment.likes?.length || 0}</span>
                          </button>
                       </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                         <div className="pl-12 space-y-4 mt-2">
                            {comment.replies.map(reply => (
                               <div key={reply._id} className="flex gap-3 items-start">
                                  <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 flex-shrink-0">
                                     <img src={reply.user?.photo ? getProductImageUrl(reply.user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs dark:text-gray-400 text-gray-500">@{reply.user?.name || "User"}</span>
                                        {reply.user?._id === video.user?._id && (
                                           <span className="bg-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest">Creator</span>
                                        )}
                                     </div>
                                     <p className="dark:text-white/90 text-sm font-medium mt-0.5">{reply.text}</p>
                                     {reply.mediaUrl && (
                                        <img src={getProductImageUrl(reply.mediaUrl)} className="w-24 h-auto rounded-lg mt-2 border border-black/10 dark:border-white/10" />
                                     )}
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                    </div>
                  ))
                )}
              </div>

                      {commentMedia && (
                  <div className="mx-6 mb-2 relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-pink-500 group">
                     <img src={URL.createObjectURL(commentMedia)} className="w-full h-full object-cover" />
                     <button onClick={() => setCommentMedia(null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                     </button>
                  </div>
               )}

               {replyingTo && (
                  <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl mb-2 text-xs font-bold dark:text-gray-300 mx-6">
                     <span>Replying to @{replyingTo.username}</span>
                     <button onClick={() => setReplyingTo(null)} className="hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
               )}

               <div className="flex items-center gap-3 pt-4 border-t dark:border-white/5 pointer-events-auto flex-shrink-0 mt-2 px-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-black/10 flex-shrink-0 relative group">
                     <img src={user?.photo ? getProductImageUrl(user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                     <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon className="w-4 h-4 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setCommentMedia(e.target.files[0])} />
                     </label>
                  </div>
                  
                  <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border-none rounded-3xl pr-2 focus-within:ring-2 focus-within:ring-pink-500 transition-all">
                     <input 
                       type="text" 
                       placeholder={commentMedia ? "Add caption..." : "Add comment..."}
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                       className="w-full bg-transparent px-6 py-4 text-sm dark:text-white focus:outline-none"
                     />
                  </div>
                 <button 
                    onClick={handleComment}
                    className="p-4 bg-pink-500 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center"
                    disabled={(!commentText.trim() && !commentMedia) || isActionLoading.comment}
                  >
                     {isActionLoading.comment ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                        <Send className="w-5 h-5" />
                     )}
                  </button>
              </div>
            </motion.div>
          </>
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
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ videos: [], users: [] });
  const containerRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  // Dynamic Product Strip Logic: Prioritize active video's product, then recent ones
  const prodVideos = videos.filter(v => v.productLink);
  let displayProductVideos = prodVideos.slice(0, 4);
  const currentVideo = videos[activeIndex];

  if (currentVideo?.productLink && !displayProductVideos.some(v => v._id === currentVideo._id)) {
     displayProductVideos = [currentVideo, ...prodVideos.filter(v => v._id !== currentVideo._id).slice(0, 3)];
  } else if (currentVideo?.productLink) {
     // Reorder to put current first
     const others = displayProductVideos.filter(v => v._id !== currentVideo._id);
     displayProductVideos = [currentVideo, ...others].slice(0, 4);
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const videoId = searchParams.get('v');
    if (videoId && videos.length > 0) {
       const index = videos.findIndex(v => v._id === videoId);
       if (index !== -1) {
          setActiveIndex(index);
          // Scroll to that video with a slight delay to ensure DOM is ready
          setTimeout(() => {
            const container = containerRef.current;
            if (container) {
               container.scrollTo({ top: index * container.clientHeight, behavior: 'auto' });
            }
          }, 100);
       }
    }
  }, [videos, window.location.search]);

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

  const userIdParam = new URLSearchParams(window.location.search).get('userId');
  const soundIdParam = new URLSearchParams(window.location.search).get('soundId');

  useEffect(() => {
    fetchVideos();
  }, [feedType, selectedTag, userIdParam, soundIdParam]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const userIdParam = searchParams.get('userId');
      const soundIdParam = searchParams.get('soundId');
      
      let url = "/videos";
      if (userIdParam) {
        url = `/videos/user/${userIdParam}`;
      } else if (soundIdParam) {
        url = `/videos?soundId=${soundIdParam}`;
      } else if (feedType === "foryou") {
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

  const syncNewVideos = async (silent = false) => {
     try {
        const searchParams = new URLSearchParams(window.location.search);
        const userIdParam = searchParams.get('userId');
        const soundIdParam = searchParams.get('soundId');

        let url = "/videos";
        if (userIdParam) {
          url = `/videos/user/${userIdParam}`;
        } else if (soundIdParam) {
          url = `/videos?soundId=${soundIdParam}`;
        } else if (feedType === "foryou") {
          url += `?sort=likes&userId=${user?._id || ''}`;
        } else if (feedType === "following") {
          url += `?feed=following&userId=${user?._id}`;
        }
        
        if (selectedTag) {
          url += `${url.includes('?') ? '&' : '?'}tag=${encodeURIComponent(selectedTag)}`;
        }
        const res = await api.get(url);
        const newVids = res.data.data.videos;
        
        // Find videos that aren't in current list
        const currentIds = new Set(videos.map(v => v._id));
        const addedVids = newVids.filter(v => !currentIds.has(v._id));
        
        if (addedVids.length > 0) {
           setVideos(prev => [...addedVids, ...prev]);
           if (!silent) {
              setActiveIndex(0);
              containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
           }
        }
     } catch (err) {
        console.error(err);
     }
  };

  // Auto-sync every 30 seconds
  useEffect(() => {
     const interval = setInterval(() => {
        syncNewVideos(true);
     }, 30000);
     return () => clearInterval(interval);
  }, [videos, feedType, selectedTag]);

  const handleSearchChange = (e) => {
     const q = e.target.value;
     setSearchQuery(q);
     if (!q.trim()) {
        setSearchResults({ videos: [], users: [] });
        return;
     }

     const query = q.toLowerCase();
     
     // Filter videos
     const vids = videos.filter(v => 
        v.name.toLowerCase().includes(query) || 
        v.description?.toLowerCase().includes(query) || 
        v.tags?.some(t => t.toLowerCase().includes(query))
     );

     // Extract unique users that match query
     const usersMap = new Map();
     videos.forEach(v => {
        if (v.user && (v.user.name?.toLowerCase().includes(query) || v.user.vendorName?.toLowerCase().includes(query))) {
           usersMap.set(v.user._id, v.user);
        }
     });

     setSearchResults({ videos: vids, users: Array.from(usersMap.values()) });
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
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="w-16 h-16 border-4 border-pink-500 rounded-full"
         />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
      {videos[activeIndex] && (
        <SEO 
          title={videos[activeIndex].name}
          description={videos[activeIndex].description || `Watch @${videos[activeIndex].user?.vendorName || videos[activeIndex].user?.name}'s video on ShopHub.`}
          image={getProductImageUrl(videos[activeIndex].thumbnailUrl || videos[activeIndex].videoUrl)}
          type="video.other"
          url={`/watch-me?v=${videos[activeIndex]._id}`}
          keywords={`${videos[activeIndex].tags?.join(', ')}, shophub, video, social, shopping, ${videos[activeIndex].user?.vendorName || videos[activeIndex].user?.name}`}
        >
          <meta property="og:video" content={getProductImageUrl(videos[activeIndex].videoUrl)} />
          <meta property="og:video:type" content="video/mp4" />
          <meta property="og:video:width" content="720" />
          <meta property="og:video:height" content="1280" />
          <meta name="twitter:card" content="player" />
          <meta name="twitter:player" content={getProductImageUrl(videos[activeIndex].videoUrl)} />
          <meta name="twitter:player:width" content="720" />
          <meta name="twitter:player:height" content="1280" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": videos[activeIndex].name,
              "description": videos[activeIndex].description || "Short video on ShopHub",
              "thumbnailUrl": [getProductImageUrl(videos[activeIndex].thumbnailUrl || videos[activeIndex].videoUrl)],
              "uploadDate": videos[activeIndex].createdAt,
              "contentUrl": getProductImageUrl(videos[activeIndex].videoUrl),
              "embedUrl": `${window.location.origin}/watch-me?v=${videos[activeIndex]._id}`,
              "duration": "PT0M30S",
              "interactionStatistic": [
                {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/LikeAction",
                  "userInteractionCount": videos[activeIndex].likes?.length || 0
                },
                {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/CommentAction",
                  "userInteractionCount": videos[activeIndex].comments?.length || 0
                }
              ],
              "author": {
                "@type": "Person",
                "name": videos[activeIndex].user?.vendorName || videos[activeIndex].user?.name,
                "url": `${window.location.origin}/creator/${videos[activeIndex].user?._id}`,
                "image": getProductImageUrl(videos[activeIndex].user?.photo)
              }
            })}
          </script>
        </SEO>
      )}

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
      <div className="absolute top-0 left-0 right-0 p-3 md:p-6 flex items-start justify-between z-[100] pointer-events-none gap-1">
         {/* Top Left: Back to Home & Mute */}
         <div className="flex gap-1 md:gap-2 pointer-events-auto shrink-0">
           <Link 
             to="/" 
             className="p-2 md:p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all flex items-center gap-2 group shadow-2xl border border-white/10"
           >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest hidden lg:inline">Store</span>
           </Link>
           <button 
             onClick={() => setIsGlobalMuted(!isGlobalMuted)} 
             className="p-2 md:p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all flex items-center justify-center shadow-2xl border border-white/10"
           >
             {isGlobalMuted ? <VolumeX className="w-4 h-4 md:w-6 md:h-6" /> : <Volume2 className="w-4 h-4 md:w-6 md:h-6" />}
           </button>
         </div>

         {/* Top Center: Tabs */}
         {routeTag ? (
            <div className="flex items-center gap-2 md:gap-4 pointer-events-auto bg-black/20 backdrop-blur-md px-3 py-1.5 md:px-6 md:py-3 rounded-full border border-white/5 shrink-0 mx-1">
               <button onClick={() => navigate('/watch-me')} className="text-white hover:text-pink-500 transition-colors">
                 <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
               </button>
               <span className="text-[10px] md:text-sm font-black text-white uppercase tracking-tighter">#{routeTag}</span>
            </div>
         ) : (
             <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl pointer-events-auto">
                   <button 
                     onClick={() => {
                       if (!isAuthenticated) return alert("Please login to see Following feed");
                       setFeedType("following");
                     }}
                     className={`text-[10px] md:text-sm font-black transition-all ${feedType === "following" ? 'text-white' : 'text-white/50 hover:text-white'} uppercase tracking-tighter`}
                   >
                     Following
                   </button>
                   <span className="w-1 h-1 rounded-full bg-white/30" />
                   <button 
                     onClick={() => {
                       setFeedType("foryou");
                     }}
                     className={`text-[10px] md:text-sm font-black transition-all ${feedType === "foryou" ? 'text-white' : 'text-white/50 hover:text-white'} uppercase tracking-tighter`}
                   >
                     For You
                   </button>
                </div>

                {/* Horizontal Product Feed - Ultra Small & Responsive */}
                {videos.some(v => v.productLink) && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex gap-2 overflow-x-auto no-scrollbar max-w-[90vw] px-2 pointer-events-auto justify-center"
                   >
                      {displayProductVideos.map((v, i) => (
                         <button 
                           key={v._id} 
                           onClick={() => {
                             const index = videos.findIndex(vid => vid._id === v._id);
                             if (index !== -1) {
                               setActiveIndex(index);
                               containerRef.current?.scrollTo({ top: index * containerRef.current.clientHeight, behavior: 'smooth' });
                             }
                           }}
                           className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${videos[activeIndex]?._id === v._id ? 'border-pink-500 scale-110 shadow-lg shadow-pink-500/20' : 'border-white/20 hover:border-white/50 opacity-60'}`}
                         >
                            <img src={getProductImageUrl(v.thumbnailUrl || v.videoUrl)} className="w-full h-full object-cover" alt="Product" />
                         </button>
                      ))}
                   </motion.div>
                )}
             </div>
         )}
           {/* Top Right: Profile & Notifications */}
           <div className="flex flex-col items-end gap-2 md:gap-3 pointer-events-auto shrink-0">
              <div className="flex items-center gap-1 md:gap-3">
                 <button 
                   onClick={() => setShowSearch(true)}
                   className="p-2 md:p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all border border-white/10 shadow-2xl"
                 >
                    <Search className="w-4 h-4 md:w-6 md:h-6" />
                 </button>
                 
                 {isAuthenticated && (
                   <button 
                     onClick={() => setShowNotifications(true)}
                     className="relative p-2 md:p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-black/60 transition-all border border-white/10 shadow-2xl"
                   >
                      <Bell className="w-4 h-4 md:w-6 md:h-6" />
                      {hasUnread && <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full border border-black md:border-2" />}
                   </button>
                 )}
              </div>

              {isAuthenticated ? (
                 <Link to={`/creator/${user._id}`} className="group flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-xl p-1 pr-3 md:pr-4 rounded-full border border-white/10 hover:bg-black/60 transition-all shadow-2xl">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-pink-500 shadow-lg">
                         <img src={user.photo ? getProductImageUrl(user.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                      </div>
                      <div className="hidden lg:flex flex-col text-left">
                         <span className="text-xs font-black text-white uppercase tracking-tighter leading-none">{user.name}</span>
                         <span className="text-[9px] text-white/50 font-medium truncate w-24">{user.email}</span>
                      </div>
                   </Link>
             ) : (
                <Link to="/login" className="px-4 py-2 md:px-6 md:py-3 bg-pink-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all shadow-pink-500/20">
                   Login
                </Link>
             )}
          </div>
       </div>

       <NotificationsModal 
         isOpen={showNotifications} 
         onClose={() => { setShowNotifications(false); setHasUnread(false); }} 
       />

       {/* Search Overlay */}
       <AnimatePresence>
          {showSearch && (
             <motion.div 
               initial={{ opacity: 0, y: -50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -50 }}
               className="absolute inset-0 z-[200] bg-[#030014]/95 backdrop-blur-2xl flex flex-col"
             >
                <div className="p-6 flex items-center gap-4 border-b border-white/10 flex-shrink-0">
                   <button onClick={() => setShowSearch(false)} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10">
                      <ChevronLeft className="w-6 h-6" />
                   </button>
                   <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search videos, tags, or creators..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                   {searchQuery && searchResults.users.length > 0 && (
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Creators</h3>
                         <div className="flex gap-4 overflow-x-auto no-scrollbar">
                            {searchResults.users.map(u => (
                               <Link key={u._id} to={`/creator/${u._id}`} onClick={() => setShowSearch(false)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-pink-500 transition-colors">
                                     <img src={u.photo ? getProductImageUrl(u.photo) : "/default-avatar.png"} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs font-bold text-white group-hover:text-pink-500">@{u.vendorName || u.name}</span>
                               </Link>
                            ))}
                         </div>
                      </div>
                   )}

                   {searchQuery && searchResults.videos.length > 0 && (
                       <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Videos</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                             {searchResults.videos.map(v => (
                                <div key={v._id} onClick={() => { setShowSearch(false); navigate(`/watch-me?v=${v._id}`); }} className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden cursor-pointer group shadow-xl hover:ring-4 ring-pink-500 transition-all">
                                   <img src={getProductImageUrl(v.thumbnailUrl || v.videoUrl)} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                      <span className="text-white font-black text-[10px] uppercase tracking-tighter line-clamp-1">{v.name}</span>
                                      <div className="flex items-center gap-1 mt-0.5">
                                         <Play className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                                         <span className="text-pink-500 text-[8px] font-black uppercase">@{v.user?.vendorName || v.user?.name}</span>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                   )}

                   {searchQuery && searchResults.videos.length === 0 && searchResults.users.length === 0 && (
                      <div className="text-center text-gray-500 mt-20">
                         <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                         <p className="font-bold">No results found for "{searchQuery}"</p>
                      </div>
                   )}
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
