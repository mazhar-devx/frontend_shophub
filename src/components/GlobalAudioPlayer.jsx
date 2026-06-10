import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAudioStore } from '../zustand/audioStore';

export default function GlobalAudioPlayer() {
  const audioRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    currentSong, isPlaying, volume, isMuted,
    setProgress, playNext, setIsPlaying, togglePlay, setCurrentSong 
  } = useAudioStore();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
           console.error("Audio play error:", e);
           setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100, current, duration);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const stopAndClose = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setCurrentSong(null);
  };

  const goToSongsPage = () => {
    navigate('/songs');
  };

  const isSongsPage = location.pathname === '/songs';
  
  // We don't render the mini player on the songs page itself, 
  // but we DO render the audio element so it keeps playing!
  return (
    <>
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}

      <AnimatePresence>
        {!isSongsPage && currentSong && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[9999] cursor-move select-none"
            whileDrag={{ scale: 1.05 }}
          >
            <div 
              onClick={goToSongsPage}
              className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-4 w-72 hover:border-cyan-500/50 transition-colors group cursor-pointer"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-[2px]">
                    <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ height: ["80%", "30%", "80%"] }} transition={{ duration: 0.9, repeat: Infinity }} className="w-1 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ height: ["60%", "90%", "60%"] }} transition={{ duration: 0.7, repeat: Infinity }} className="w-1 bg-cyan-400 rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <h4 className="text-white text-sm font-bold truncate">{currentSong.title}</h4>
                <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); playNext(); }}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>
                <button 
                  onClick={stopAndClose}
                  className="w-6 h-6 flex items-center justify-center absolute -top-2 -right-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
