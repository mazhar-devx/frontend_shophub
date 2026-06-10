import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, Heart, Share2, Music2, Repeat, Shuffle, ChevronLeft, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAudioStore } from '../zustand/audioStore';
import { toast } from 'react-hot-toast';

const DEFAULT_SONGS = [
  {
    id: "fallback-1",
    title: "Midnight City Lounge",
    artist: "Synthwave Producers",
    cover: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: "fallback-2",
    title: "Lo-Fi Study Beats",
    artist: "Chillhop Vibes",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: "fallback-3",
    title: "Neon Horizon",
    artist: "Cyberpunk Audio",
    cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function Songs() {
  const { 
    currentSong, isPlaying, progress, currentTime, duration,
    isMuted, volume, isRepeating, isShuffling, likedSongs, playlist,
    setPlaylist, setCurrentSong, playNext, playPrevious, togglePlay, 
    toggleMute, toggleRepeat, toggleShuffle, toggleLike
  } = useAudioStore();

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    if (playlist.length === 0) {
      setPlaylist(DEFAULT_SONGS);
    }
  }, [playlist, setPlaylist]);

  const searchSongs = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`);
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const mappedSongs = data.results.map(track => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: track.artistName,
          cover: track.artworkUrl100?.replace('100x100', '600x600') || 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=800',
          url: track.previewUrl,
          duration: "0:30" 
        })).filter(song => song.url); 
        
        if (mappedSongs.length > 0) {
          setPlaylist(mappedSongs);
          setCurrentSong(mappedSongs[0]);
          toast.success(`Found ${mappedSongs.length} songs!`);
        } else {
          toast.error("Found tracks but no playable previews.");
        }
      } else {
        // Fallback to Jamendo API if iTunes fails to find anything
        const jamendoRes = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=56d30c95&format=jsonpretty&limit=20&search=${encodeURIComponent(query)}`);
        const jamendoData = await jamendoRes.json();
        
        if (jamendoData.results && jamendoData.results.length > 0) {
          const jMapped = jamendoData.results.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artist_name,
            cover: track.image || 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=800',
            url: track.audio,
            duration: "Full"
          }));
          setPlaylist(jMapped);
          setCurrentSong(jMapped[0]);
          toast.success(`Found ${jMapped.length} free tracks on Jamendo!`);
        } else {
          toast.error("No songs found for that search across multiple providers.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch songs. Check your connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || !time) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const activeSong = currentSong || playlist[0];
  const isLiked = activeSong ? likedSongs.some(s => s.id === activeSong.id) : false;

  const handleShare = async () => {
    if (!activeSong) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Listen to ${activeSong.title} by ${activeSong.artist}`,
          text: `Check out this song I found on ShopHub Audio!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(`${activeSong.title} by ${activeSong.artist}`);
      toast.success("Song info copied to clipboard!");
    }
  };

  if (!activeSong) return null;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black text-white overflow-hidden flex flex-col md:flex-row">
      <SEO 
        title={`${activeSong.title} - ShopHub Audio`}
        description="Listen to premium curated music on ShopHub's highly advanced audio player. Search millions of free tracks."
      />

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110 transition-all duration-1000"
          style={{ backgroundImage: `url(${activeSong.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black pointer-events-none" />
      </div>

      {/* Top Nav (Mobile & Desktop) */}
      <div className="absolute top-0 left-0 right-0 p-6 flex flex-col sm:flex-row justify-between items-center z-50 gap-4">
        <div className="flex w-full sm:w-auto justify-between items-center gap-4">
          <Link to="/" className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 flex-shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Music2 className="w-5 h-5 text-cyan-500" />
            <span className="font-black uppercase tracking-[0.2em] text-xs">HA Store Audio</span>
          </div>
          <button onClick={() => setShowPlaylist(!showPlaylist)} className="md:hidden w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 flex-shrink-0">
            <ListMusic className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={searchSongs} className="relative w-full sm:w-80 group">
          <input 
            type="text" 
            placeholder="Search millions of songs..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-3 px-5 pl-12 text-sm font-bold text-white placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
          {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 animate-spin" />}
        </form>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12 mt-20 sm:mt-12 md:mt-0">
        
        {/* Album Art / Vinyl Record */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 mb-12">
          {/* Glowing Aura */}
          <motion.div 
            animate={{ 
              scale: isPlaying ? [1, 1.05, 1] : 1,
              opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-4 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-50"
          />
          
          {/* Record */}
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="relative w-full h-full rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-black"
          >
            {/* Record Grooves */}
            <div className="absolute inset-0 rounded-full border-[10px] sm:border-[20px] border-black/80" />
            <div className="absolute inset-4 rounded-full border-[1px] border-white/10" />
            <div className="absolute inset-8 rounded-full border-[1px] border-white/10" />
            <div className="absolute inset-12 rounded-full border-[1px] border-white/10" />
            
            {/* Center Label (Album Art) */}
            <div className="absolute inset-[30%] rounded-full overflow-hidden border-4 border-black bg-gray-900">
              <img src={activeSong.cover} alt="Cover" className="w-full h-full object-cover" />
            </div>
            {/* Spindle hole */}
            <div className="absolute inset-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-inner" />
          </motion.div>
        </div>

        {/* Song Info */}
        <div className="text-center mb-8 w-full max-w-md px-4">
          <motion.h2 
            key={activeSong.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 truncate"
          >
            {activeSong.title}
          </motion.h2>
          <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs sm:text-sm truncate">{activeSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md px-4 mb-8">
          <div className="h-2 w-full bg-white/10 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-500 tracking-widest">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <button onClick={toggleShuffle} className={`transition-colors ${isShuffling ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}`}><Shuffle className="w-5 h-5" /></button>
          
          <button onClick={playPrevious} className="p-2 sm:p-3 bg-white/5 rounded-full hover:bg-white/20 hover:text-cyan-400 transition-all">
            <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-current" />
          </button>
          
          <button 
            onClick={() => { if(currentSong) { togglePlay(); } else { setCurrentSong(activeSong); } }}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] flex-shrink-0"
          >
            {isPlaying ? <Pause className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-current" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-current ml-1" />}
          </button>
          
          <button onClick={playNext} className="p-2 sm:p-3 bg-white/5 rounded-full hover:bg-white/20 hover:text-purple-400 transition-all">
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-current" />
          </button>
          
          <button onClick={toggleRepeat} className={`transition-colors ${isRepeating ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}><Repeat className="w-5 h-5" /></button>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 sm:mt-12 flex gap-6 sm:gap-8">
          <button onClick={toggleMute} className={`transition-colors ${isMuted ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
          <button onClick={() => toggleLike(activeSong)} className={`transition-colors ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}>
            <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button onClick={handleShare} className="text-gray-400 hover:text-cyan-500 transition-colors">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className={`
        fixed md:relative top-0 right-0 w-full md:w-96 h-full bg-black/80 md:bg-black/40 backdrop-blur-3xl border-l border-white/10 z-40
        transition-transform duration-500 ease-in-out flex flex-col
        ${showPlaylist ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden p-6 border-b border-white/10 flex justify-between items-center bg-black/50 pt-8 sm:pt-6">
          <h3 className="font-black uppercase tracking-widest text-sm">Up Next</h3>
          <button onClick={() => setShowPlaylist(false)} className="p-2 bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden md:flex p-8 border-b border-white/10">
          <h3 className="font-black uppercase tracking-widest text-sm text-gray-400">Up Next</h3>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {playlist.map((song) => {
            const isThisPlaying = currentSong?.id === song.id;
            return (
              <button
                key={song.id}
                onClick={() => setCurrentSong(song)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  isThisPlaying 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/20' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-gray-900">
                  <img src={song.cover} alt="cover" className="w-full h-full object-cover" />
                  {isThisPlaying && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-[2px]">
                      <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1 bg-white rounded-full" />
                      <motion.div animate={{ height: ["80%", "30%", "80%"] }} transition={{ duration: 0.9, repeat: Infinity }} className="w-1 bg-white rounded-full" />
                      <motion.div animate={{ height: ["60%", "90%", "60%"] }} transition={{ duration: 0.7, repeat: Infinity }} className="w-1 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <h4 className={`font-bold truncate text-sm ${isThisPlaying ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{song.title}</h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate">{song.artist}</p>
                </div>
                <span className="text-xs font-bold text-gray-600 flex-shrink-0 ml-2">{song.duration}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
