import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, Users, MessageCircle, ChevronLeft, Share2, Grid, Bookmark, Music2, ShoppingCart } from "lucide-react";
import { formatPrice } from "../utils/currency";
import api from "../services/api";
import { getProductImageUrl, DEFAULT_AVATAR } from "../utils/constants";
import SEO from "../components/SEO";

export default function CreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");
  const [savedSounds, setSavedSounds] = useState([]);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialType, setSocialType] = useState('followers'); // 'followers' or 'following'

   const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);
  const isOwnProfile = isAuthenticated && authUser?._id === id;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Basic check for MongoDB ObjectId format (24 hex chars)
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidId && id !== 'mazhar.devx') {
       setLoading(false);
       setCreator(null);
       return;
    }
    fetchCreatorData();
  }, [id]);

  useEffect(() => {
     if (activeTab === 'shop') {
        fetchProducts();
     } else if (activeTab !== 'videos') {
        fetchTabData();
     }
  }, [activeTab]);

  const fetchProducts = async () => {
     try {
        const res = await api.get(`/products?vendor=${id}`);
        setProducts(res.data.data.products);
     } catch (err) {
        console.error(err);
     }
  };

  const fetchTabData = async () => {
     try {
        const res = await api.get(`/videos?feed=${activeTab}&userId=${id}`);
        if (activeTab === 'liked') setLikedVideos(res.data.data.videos);
        if (activeTab === 'saved') setSavedVideos(res.data.data.videos);
        if (activeTab === 'sounds') {
           // For sounds, we fetch the original videos that represent the sounds
           const soundsRes = await api.get(`/users/${id}/saved-sounds`);
           setSavedSounds(soundsRes.data.data.sounds || []);
        }
     } catch (err) {
        console.error(err);
     }
  };

  useEffect(() => {
     if (creator && authUser) {
        setIsFollowing(creator.followers?.some(f => (f._id || f) === authUser._id));
     }
  }, [creator, authUser]);

  const fetchCreatorData = async () => {
    try {
      const userRes = await api.get(`/users/${id}`);
      setCreator(userRes.data.data.user);

      const videoRes = await api.get(`/videos/user/${id}`);
      setVideos(videoRes.data.data.videos);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFollow = async () => {
     if (!isAuthenticated) return alert("Please login to follow!");
     try {
        const endpoint = isFollowing ? 'unfollow' : 'follow';
        await api.post(`/users/${id}/${endpoint}`);
        setIsFollowing(!isFollowing);
        // Refresh data to update counts
        fetchCreatorData();
     } catch (err) {
        console.error(err);
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
      <SEO 
        title={`${creator.vendorName || creator.name} (@${creator.vendorName || creator.name})`}
        description={creator.description || `Check out ${creator.vendorName || creator.name}'s profile on ShopHub. Watch their latest videos and explore their collections.`}
        image={creator.photo ? getProductImageUrl(creator.photo) : DEFAULT_AVATAR}
        type="profile"
        keywords={`${creator.name}, creator, video, shophub, influencer, profile`}
      />
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
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                     <h1 className="text-2xl md:text-3xl font-black text-primary dark:text-white tracking-tighter uppercase text-center md:text-left">{creator.vendorName || creator.name}</h1>
                     <div className="flex gap-2">
                         {isOwnProfile ? (
                            <>
                              <Link to="/upload-video" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-pink-500/20">
                                 Upload Video
                              </Link>
                              <Link to="/profile" className="px-6 py-2 bg-black/5 dark:bg-white/10 dark:text-white font-bold rounded-full hover:scale-105 transition-all">
                                 Edit Profile
                              </Link>
                            </>
                         ) : (
                            <button 
                              onClick={handleFollow}
                              className={`px-6 py-2 font-bold rounded-full transition-all shadow-lg ${isFollowing ? 'bg-white text-black border border-black/10' : 'bg-pink-500 text-white shadow-pink-500/20'}`}
                            >
                               {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                         )}
                         <button className="p-2 border border-black/10 dark:border-white/10 rounded-full dark:text-white hover:bg-black/5 dark:hover:bg-white/5"><Share2 className="w-5 h-5" /></button>
                      </div>
                   </div>
 
                   <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-6 w-full">
                      <button 
                        onClick={() => { setSocialType('followers'); setShowSocialModal(true); }}
                        className="flex flex-col items-center md:items-start hover:scale-105 transition-transform"
                      >
                         <span className="text-xl font-black dark:text-white">{creator.followers?.length || 0}</span>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3" /> Followers</span>
                      </button>
                      <button 
                        onClick={() => { setSocialType('following'); setShowSocialModal(true); }}
                        className="flex flex-col items-center md:items-start hover:scale-105 transition-transform"
                      >
                         <span className="text-xl font-black dark:text-white">{creator.following?.length || 0}</span>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3" /> Following</span>
                      </button>
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
            <div className="flex overflow-x-auto no-scrollbar border-b border-black/5 dark:border-white/5 mt-12">
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
               <button 
                  onClick={() => setActiveTab("sounds")}
                  className={`flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "sounds" ? "text-pink-500" : "text-gray-500 hover:text-primary dark:hover:text-white"}`}
                >
                   <Music2 className="w-4 h-4" /> Sounds
                   {activeTab === "sounds" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab("shop")}
                  className={`flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "shop" ? "text-pink-500" : "text-gray-500 hover:text-primary dark:hover:text-white"}`}
                >
                   <ShoppingCart className="w-4 h-4" /> Shop
                   {activeTab === "shop" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" />}
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
                    onClick={() => navigate(`/watch-me?v=${video._id}&userId=${id}`)}
                    className="group relative aspect-[9/16] bg-black rounded-3xl overflow-hidden cursor-pointer"
                  >
                     <video src={getProductImageUrl(video.videoUrl)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{video.views || 0}</span>
                     </div>
                     <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Heart className="w-3 h-3" />
                        <span>{video.likesCount || video.likes.length}</span>
                     </div>
                  </motion.div>
               )) : activeTab === "liked" ? likedVideos.map((video, idx) => (
                  <motion.div 
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/watch-me?v=${video._id}&userId=${id}`)}
                    className="group relative aspect-[9/16] bg-black rounded-3xl overflow-hidden cursor-pointer"
                  >
                     <video src={getProductImageUrl(video.videoUrl)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{video.views || 0}</span>
                     </div>
                     <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Heart className="w-3 h-3" />
                        <span>{video.likesCount || video.likes.length}</span>
                     </div>
                  </motion.div>
               )) : activeTab === "saved" ? savedVideos.map((video, idx) => (
                  <motion.div 
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/watch-me?v=${video._id}&userId=${id}`)}
                    className="group relative aspect-[9/16] bg-black rounded-3xl overflow-hidden cursor-pointer"
                  >
                     <video src={getProductImageUrl(video.videoUrl)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{video.views || 0}</span>
                     </div>
                     <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white font-bold text-xs">
                        <Heart className="w-3 h-3" />
                        <span>{video.likesCount || video.likes.length}</span>
                     </div>
                  </motion.div>
               )) : activeTab === 'sounds' ? savedSounds.map((sound, idx) => (
                  <motion.div 
                    key={sound._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/sounds/${sound._id}`)}
                    className="group relative h-24 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden cursor-pointer flex items-center p-4 hover:scale-[1.02] transition-transform"
                  >
                     <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 relative">
                        <img src={sound.thumbnailUrl ? getProductImageUrl(sound.thumbnailUrl) : DEFAULT_AVATAR} className="w-full h-full object-cover opacity-60" />
                        <Play className="absolute inset-0 m-auto w-6 h-6 text-white fill-white" />
                     </div>
                     <div className="ml-4 flex-1 min-w-0">
                        <h4 className="font-black dark:text-white uppercase tracking-tighter truncate">Original Sound - {sound.name}</h4>
                        <p className="text-xs font-bold text-gray-500">@{sound.user?.name || 'Creator'}</p>
                     </div>
                     <div className="ml-4 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-lg text-[10px] font-black dark:text-white uppercase">
                        {sound.useCount || 0} vids
                     </div>
                  </motion.div>
               )) : activeTab === 'shop' ? products.map((product, idx) => (
                  <motion.div 
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/product/${product.slug || product._id}`)}
                    className="group relative aspect-[3/4] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden cursor-pointer flex flex-col"
                  >
                     <img src={getProductImageUrl(product.image)} className="w-full h-2/3 object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                           <h4 className="font-bold dark:text-white text-xs truncate">{product.name}</h4>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.category}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                           <span className="font-black dark:text-white text-sm">{formatPrice(product.price)}</span>
                           <div className="p-1.5 bg-black/5 dark:bg-white/10 rounded-lg group-hover:bg-pink-500 group-hover:text-white transition-colors">
                              <ShoppingCart className="w-3.5 h-3.5" />
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )) : null}
                {((activeTab === "videos" && videos.length === 0) || 
                   (activeTab === "liked" && likedVideos.length === 0) || 
                   (activeTab === "saved" && savedVideos.length === 0) ||
                   (activeTab === "sounds" && savedSounds.length === 0)) ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 opacity-50">
                     <Play className="w-12 h-12 mb-4" />
                     <p className="font-bold uppercase tracking-widest text-xs">No {activeTab} videos yet</p>
                  </div>
               ) : null}
            </div>
         </div>
      </div>

      {/* Social Modal (Followers/Following) */}
      <AnimatePresence>
        {showSocialModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
             >
                <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                   <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">{socialType}</h3>
                   <button onClick={() => setShowSocialModal(false)} className="p-2 dark:text-white hover:bg-black/5 rounded-full"><ChevronLeft className="w-5 h-5 rotate-90 md:rotate-0" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {(socialType === 'followers' ? creator.followers : creator.following)?.map(u => (
                      <Link 
                        key={u._id} 
                        to={`/creator/${u._id}`}
                        onClick={() => setShowSocialModal(false)}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                      >
                         <img src={u.photo ? getProductImageUrl(u.photo) : DEFAULT_AVATAR} className="w-12 h-12 rounded-full object-cover" />
                         <div className="flex-1 min-w-0">
                            <h4 className="font-bold dark:text-white truncate">{u.name}</h4>
                            <p className="text-xs text-gray-500 truncate">@{u.vendorName || 'user'}</p>
                         </div>
                      </Link>
                   ))}
                   {(socialType === 'followers' ? creator.followers : creator.following)?.length === 0 && (
                      <div className="py-20 text-center text-gray-500 opacity-50 font-bold uppercase tracking-widest text-xs">No {socialType} yet</div>
                   )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
