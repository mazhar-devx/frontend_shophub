import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, Search, Music2, Play, User, MessageCircle, MoreVertical, Sparkles, Smile, Image as ImageIcon } from "lucide-react";
import api from "../services/api";
import { getProductImageUrl, DEFAULT_AVATAR_FALLBACK } from "../utils/constants";
import SEO from "../components/SEO";

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const messagesRef = React.useRef([]);
  
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifs, setGifs] = useState([]);
  const emojis = ["😀","😂","😍","🔥","👍","❤️","✨","🙌","😎","🥺","💯","🎉","💡","🚀","🙏"];

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
     if (!showGifPicker) return;
     const fetchGifs = async () => {
        try {
           const query = gifSearch || "trending";
           const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=Lpw21m9W3f0rLw0iS56t0n4A12qEsqbL&q=${query}&limit=20`);
           const data = await res.json();
           if (data.data) setGifs(data.data.map(g => g.images.fixed_height.url));
        } catch (e) {}
     };
     const debounce = setTimeout(fetchGifs, 300);
     return () => clearTimeout(debounce);
  }, [gifSearch, showGifPicker]);

  useEffect(() => {
    fetchConversations();
    fetchFriends();
  }, []);

  useEffect(() => {
    if (selectedConvo) {
      fetchMessages(selectedConvo.otherUser._id);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedConvo.otherUser._id, true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConvo]);

  const fetchFriends = async () => {
    try {
      const res = await api.get("/messages/friends");
      setFriends(res.data.data.friends);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      setConversations(res.data.data.conversations);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId, silent = false) => {
    try {
      const res = await api.get(`/messages/${otherUserId}`);
      const newMessages = res.data.data.messages;
      
      if (silent && newMessages.length > messagesRef.current.length) {
         const addedMessages = newMessages.slice(messagesRef.current.length);
         addedMessages.forEach(msg => {
            if (msg.sender !== user._id && msg.sender?._id !== user._id) {
                const senderName = selectedConvo?.otherUser?.vendorName || selectedConvo?.otherUser?.name || 'Someone';
                const msgType = msg.video ? 'video' : 'text';
                const textToSpeak = `Hey ${user.name}, user ${senderName} sent you a ${msgType} message, please check it out.`;
                
                if ('speechSynthesis' in window) {
                   const utterance = new SpeechSynthesisUtterance(textToSpeak);
                   window.speechSynthesis.speak(utterance);
                }

                if (Notification.permission === "granted") {
                   new Notification(`New message from ${senderName}`, { body: msg.text || "Sent an attachment" });
                }
            }
         });
      }
      setMessages(newMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConvo) return;
    try {
      const res = await api.post("/messages/send", {
        recipient: selectedConvo.otherUser._id,
        text: newMessage
      });
      setMessages([...messages, res.data.data.message]);
      setNewMessage("");
      // Update last message in conversations list
      setConversations(conversations.map(c => 
        c.otherUser._id === selectedConvo.otherUser._id 
        ? { ...c, lastMessage: res.data.data.message } 
        : c
      ));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col md:flex-row">
      <SEO title="Inbox | ShopHub" />
      
      {/* Sidebar: Conversations */}
      <div className={`w-full md:w-96 border-r border-white/10 flex flex-col h-screen ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full">
               <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-black uppercase tracking-widest text-xl">Inbox</h1>
            <div className="w-10 h-10" />
         </div>

         <div className="p-4">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search friends..." 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* Friends Horizontal List */}
            {friends.length > 0 && (
               <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-pink-500" /> Friends
                  </h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                     {friends.map(friend => (
                        <button 
                          key={friend._id}
                          onClick={() => setSelectedConvo({ otherUser: friend, lastMessage: { text: "Start chatting...", createdAt: new Date() } })}
                          className="flex-shrink-0 flex flex-col items-center gap-2 group"
                        >
                           <div className="w-14 h-14 rounded-full border-2 border-pink-500 overflow-hidden shadow-lg group-hover:scale-110 transition-transform bg-gray-800">
                              <img src={friend.photo ? getProductImageUrl(friend.photo) : DEFAULT_AVATAR_FALLBACK} className="w-full h-full object-cover" />
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-pink-500 transition-colors w-14 truncate text-center">{friend.vendorName || friend.name}</span>
                        </button>
                     ))}
                  </div>
               </div>
            )}

            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-6 mb-2 ml-5">Messages</h3>
            {conversations.length === 0 ? (
               <div className="p-10 text-center text-gray-500 font-bold">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No messages yet.</p>
                  <p className="text-xs mt-2 uppercase tracking-widest">Share a video with a friend!</p>
               </div>
            ) : (
               conversations.map((convo) => (
                  <button 
                    key={convo.otherUser._id}
                    onClick={() => setSelectedConvo(convo)}
                    className={`w-full p-4 flex gap-4 items-center hover:bg-white/5 transition-colors border-b border-white/5 ${selectedConvo?.otherUser._id === convo.otherUser._id ? 'bg-white/10' : ''}`}
                  >
                     <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0 bg-gray-800">
                        <img src={convo.otherUser.photo ? getProductImageUrl(convo.otherUser.photo) : DEFAULT_AVATAR_FALLBACK} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 text-left">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-black uppercase tracking-tight text-sm">{convo.otherUser.vendorName || convo.otherUser.name}</span>
                           <span className="text-[10px] text-gray-500 font-bold">{new Date(convo.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className={`text-xs truncate ${convo.lastMessage.read || convo.lastMessage.sender === user._id ? 'text-gray-500' : 'text-pink-500 font-black'}`}>
                           {convo.lastMessage.sender === user._id ? 'You: ' : ''}
                           {convo.lastMessage.video ? 'Shared a video' : convo.lastMessage.text}
                        </p>
                     </div>
                  </button>
               ))
            )}
         </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col h-screen bg-black/40 backdrop-blur-3xl ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
         {selectedConvo ? (
            <>
               {/* Chat Header */}
               <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setSelectedConvo(null)} className="md:hidden p-2 hover:bg-white/5 rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                     </button>
                     <Link to={`/creator/${selectedConvo.otherUser._id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:scale-110 transition-transform bg-gray-800">
                           <img src={selectedConvo.otherUser.photo ? getProductImageUrl(selectedConvo.otherUser.photo) : DEFAULT_AVATAR_FALLBACK} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h3 className="font-black text-sm uppercase tracking-tight group-hover:text-pink-500 transition-colors">{selectedConvo.otherUser.vendorName || selectedConvo.otherUser.name}</h3>
                           <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest">Friend</p>
                        </div>
                     </Link>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>

               {/* Messages List */}
               <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                  {messages.map((msg, i) => {
                     const isMine = msg.sender === user._id || msg.sender?._id === user._id;
                     return (
                        <div key={msg._id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                           {msg.video ? (
                              <div className={`max-w-[280px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl group cursor-pointer`} onClick={() => navigate(`/watch-me?v=${msg.video._id}`)}>
                                 <div className="relative aspect-[9/16]">
                                    <video src={getProductImageUrl(msg.video.videoUrl)} className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                       <div className="p-4 bg-white/10 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform">
                                          <Play className="w-8 h-8 fill-white" />
                                       </div>
                                       <span className="text-[10px] font-black uppercase tracking-widest text-white px-3 py-1 bg-black/40 rounded-full">Watch Shared Video</span>
                                    </div>
                                 </div>
                                 <div className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-gray-800">
                                       <img src={selectedConvo.otherUser.photo ? getProductImageUrl(selectedConvo.otherUser.photo) : DEFAULT_AVATAR_FALLBACK} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                       <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Shared by {isMine ? 'You' : (selectedConvo.otherUser.vendorName || selectedConvo.otherUser.name)}</p>
                                       <p className="text-xs font-bold truncate">{msg.video.name}</p>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-xl ${isMine ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                                 {msg.text.match(/^https?:\/\/.*\.(gif|png|jpe?g)$|giphy\.com|imgur\.com.*\.gif/) ? (
                                    <img src={msg.text} alt="gif" className="rounded-xl max-w-xs w-full h-auto" />
                                 ) : (
                                    msg.text
                                 )}
                              </div>
                           )}
                           <span className="text-[9px] text-gray-500 font-bold mt-1 uppercase">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMine && msg.read && <span className="ml-2 text-pink-500">Seen</span>}
                           </span>
                        </div>
                     );
                  })}
               </div>

               {/* Message Input */}
               <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl relative">
                  {/* Emoji Picker Popover */}
                  <AnimatePresence>
                     {showEmojiPicker && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-4 mb-2 bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 w-64"
                        >
                           <div className="grid grid-cols-5 gap-2">
                              {emojis.map(e => (
                                 <button key={e} onClick={() => { setNewMessage(prev => prev + e); setShowEmojiPicker(false); }} className="text-xl hover:scale-125 transition-transform">{e}</button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  {/* GIF Picker Popover */}
                  <AnimatePresence>
                     {showGifPicker && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-4 mb-2 bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 w-72 md:w-96"
                        >
                           <input 
                              type="text" 
                              placeholder="Search GIFs..."
                              value={gifSearch}
                              onChange={(e) => setGifSearch(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white mb-3 outline-none focus:border-pink-500"
                           />
                           <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                              {gifs.map((url, i) => (
                                 <button key={i} onClick={() => { setNewMessage(url); setShowGifPicker(false); handleSendMessage(); }} className="aspect-video bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition-transform">
                                    <img src={url} className="w-full h-full object-cover" />
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="flex items-center gap-3 max-w-4xl mx-auto">
                     <button onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }} className="p-2 text-gray-400 hover:text-pink-500 transition-colors">
                        <Smile className="w-6 h-6" />
                     </button>
                     <button onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }} className="p-2 text-gray-400 hover:text-pink-500 transition-colors">
                        <span className="font-black text-xs uppercase tracking-widest border-2 border-current rounded px-1.5 py-0.5">GIF</span>
                     </button>
                     <input 
                       type="text" 
                       placeholder="Send a message..." 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                       className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-inner"
                     />
                     <button 
                       onClick={handleSendMessage}
                       disabled={!newMessage.trim()}
                       className="p-4 bg-pink-500 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                     >
                        <Send className="w-6 h-6" />
                     </button>
                  </div>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
               <div className="w-32 h-32 bg-pink-500/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                  <MessageCircle className="w-16 h-16 text-pink-500 opacity-50" />
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Your Messages</h2>
               <p className="text-gray-500 max-w-xs font-bold uppercase tracking-widest text-xs leading-loose">Select a friend from the left to start chatting or sharing videos.</p>
            </div>
         )}
      </div>
    </div>
  );
}
