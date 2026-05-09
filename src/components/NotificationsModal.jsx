import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, UserPlus, Bookmark, Bell } from "lucide-react";
import api from "../services/api";
import { getProductImageUrl, DEFAULT_AVATAR } from "../utils/constants";
import { Link } from "react-router-dom";

export default function NotificationsModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data.notifications);
      setLoading(false);
      // Mark as read
      api.patch("/notifications/mark-as-read");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-pink-500 fill-current" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500 fill-current" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'save': return <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMessage = (type) => {
    switch (type) {
      case 'like': return "liked your video";
      case 'comment': return "commented on your video";
      case 'follow': return "started following you";
      case 'save': return "saved your video";
      default: return "interacted with you";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-pink-500/10 to-purple-500/10">
               <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Activity</h3>
               <button onClick={onClose} className="p-2 dark:text-white hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {loading ? (
                  <div className="py-20 flex justify-center">
                     <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  </div>
               ) : notifications.map((notif) => (
                  <div key={notif._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                     <Link to={`/creator/${notif.sender?._id}`} onClick={onClose} className="relative">
                        <img 
                          src={notif.sender?.photo ? getProductImageUrl(notif.sender.photo) : DEFAULT_AVATAR} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-pink-500 transition-all" 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1a1a1a] p-1 rounded-full shadow-lg border border-black/5 dark:border-white/10">
                           {getIcon(notif.type)}
                        </div>
                     </Link>
                     
                     <div className="flex-1 min-w-0">
                        <p className="text-sm dark:text-white leading-tight">
                           <span className="font-black">@{notif.sender?.vendorName || notif.sender?.name}</span> {getMessage(notif.type)}
                        </p>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{new Date(notif.createdAt).toLocaleDateString()}</span>
                     </div>

                     {notif.video && (
                        <Link to={`/watch-me?v=${notif.video._id}`} onClick={onClose} className="w-12 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                           <video src={notif.video.videoUrl} className="w-full h-full object-cover opacity-60" />
                        </Link>
                     )}
                  </div>
               ))}
               
               {!loading && notifications.length === 0 && (
                  <div className="py-20 text-center text-gray-500 opacity-50 font-bold uppercase tracking-widest text-xs">
                     No notifications yet
                  </div>
               )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
