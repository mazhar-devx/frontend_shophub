import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  ListMusic, Heart, Share2, Music2, Repeat, Shuffle,
  ChevronLeft, Search, Loader2, ChevronDown, Disc3,
  Radio, Zap, Star, TrendingUp, Clock, Mic2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAudioStore } from '../zustand/audioStore';
import { toast } from 'react-hot-toast';

// ─── Palette & Design Tokens ─────────────────────────────────────────────────
// Deep space noir with holographic accent gradients
// Primary BG: #04060F  Surface: #0D1117  Accent1: #7B5EA7  Accent2: #3ECFCF  Highlight: #F72585

const DEFAULT_SONGS = [
  {
    id: "fallback-1",
    title: "Midnight City Lounge",
    artist: "Synthwave Producers",
    album: "Neon Dreams",
    cover: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12",
    genre: "Synthwave"
  },
  {
    id: "fallback-2",
    title: "Lo-Fi Study Beats",
    artist: "Chillhop Vibes",
    album: "Chill Sessions",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05",
    genre: "Lo-Fi"
  },
  {
    id: "fallback-3",
    title: "Neon Horizon",
    artist: "Cyberpunk Audio",
    album: "Electric Void",
    cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44",
    genre: "Electronic"
  },
  {
    id: "fallback-4",
    title: "Solar Wind",
    artist: "Cosmic Drift",
    album: "Orbit",
    cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "4:58",
    genre: "Ambient"
  },
  {
    id: "fallback-5",
    title: "Digital Rain",
    artist: "Matrix Ensemble",
    album: "Code Noir",
    cover: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "5:22",
    genre: "Tech House"
  }
];

// ─── Animated Waveform Bars ───────────────────────────────────────────────────
const WaveformBars = ({ isPlaying, color = "#3ECFCF", bars = 32 }) => (
  <div className="flex items-center gap-[2px] h-8">
    {Array.from({ length: bars }).map((_, i) => (
      <motion.div
        key={i}
        className="rounded-full"
        style={{ width: 2, background: color, originY: 1 }}
        animate={isPlaying ? {
          scaleY: [0.2, Math.random() * 0.8 + 0.2, Math.random() * 1 + 0.3, 0.2],
        } : { scaleY: 0.15 }}
        transition={{
          duration: isPlaying ? 0.5 + Math.random() * 0.5 : 0.3,
          repeat: Infinity,
          delay: i * 0.03,
          ease: "easeInOut"
        }}
        initial={{ scaleY: 0.15 }}
      />
    ))}
  </div>
);

// ─── Spectrum Visualizer Ring ─────────────────────────────────────────────────
const SpectrumRing = ({ isPlaying, size = 420 }) => {
  const numBars = 64;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = size * 0.38;

  return (
    <svg width={size} height={size} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {Array.from({ length: numBars }).map((_, i) => {
        const angle = (i / numBars) * Math.PI * 2 - Math.PI / 2;
        const barH = isPlaying ? 8 + Math.random() * 28 : 4;
        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * (innerR + barH);
        const y2 = cy + Math.sin(angle) * (innerR + barH);
        const hue = (i / numBars) * 60 + 180;
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={`hsl(${hue}, 90%, 65%)`}
            strokeWidth={2.5}
            strokeLinecap="round"
            animate={isPlaying ? {
              x2: [x2, cx + Math.cos(angle) * (innerR + Math.random() * 30 + 4), x2],
              y2: [y2, cy + Math.sin(angle) * (innerR + Math.random() * 30 + 4), y2],
              opacity: [0.5, 1, 0.5]
            } : { opacity: 0.18 }}
            transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.01 }}
          />
        );
      })}
    </svg>
  );
};

// ─── Floating Particle Field ──────────────────────────────────────────────────
const ParticleField = ({ isPlaying }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 4 + 1,
          height: Math.random() * 4 + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: i % 3 === 0 ? '#7B5EA7' : i % 3 === 1 ? '#3ECFCF' : '#F72585',
        }}
        animate={isPlaying ? {
          y: [0, -80, 0],
          x: [0, Math.random() * 30 - 15, 0],
          opacity: [0, 0.8, 0],
          scale: [0, 1.5, 0]
        } : { opacity: 0 }}
        transition={{
          duration: 3 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

// ─── Vinyl Record Component ───────────────────────────────────────────────────
const VinylRecord = ({ song, isPlaying, size = 340 }) => {
  const grooves = [0.88, 0.78, 0.68, 0.58, 0.48];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow aura */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #7B5EA780, #3ECFCF80, #F7258580, #7B5EA780)',
          filter: 'blur(24px)',
          zIndex: 0
        }}
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Holo spectrum ring SVG */}
      <div className="absolute inset-0 z-10" style={{ width: size, height: size }}>
        <SpectrumRing isPlaying={isPlaying} size={size} />
      </div>

      {/* Main disc */}
      <motion.div
        className="absolute inset-0 rounded-full z-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #04060f 60%, #000 100%)',
          boxShadow: `0 0 60px #7B5EA730, 0 0 120px #3ECFCF20, inset 0 0 30px #00000080`
        }}
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        {/* Vinyl grooves */}
        {grooves.map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/[0.04]"
            style={{
              inset: `${((1 - r) / 2) * 100}%`,
              boxShadow: `0 0 2px rgba(62,207,207,0.05)`
            }}
          />
        ))}

        {/* Holographic sheen layer */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(62,207,207,0.06) 25%, transparent 50%, rgba(123,94,167,0.06) 75%, transparent 100%)',
          }}
          animate={{ rotate: isPlaying ? -360 : 0 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center label / album art */}
        <div
          className="absolute rounded-full overflow-hidden border-[3px]"
          style={{
            inset: '28%',
            borderColor: '#1a1a2e',
            boxShadow: '0 0 20px #000, 0 0 40px #7B5EA730'
          }}
        >
          <img src={song?.cover} alt="Album Art" className="w-full h-full object-cover" />
          {/* Center hole */}
          <div className="absolute inset-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-lg z-10" />
        </div>
      </motion.div>

      {/* Tonearm */}
      <motion.div
        className="absolute z-30"
        style={{
          right: '-8%',
          top: '2%',
          width: '55%',
          height: '55%',
          transformOrigin: '90% 10%',
        }}
        animate={{ rotate: isPlaying ? 18 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full" overflow="visible">
          {/* Arm */}
          <line x1="108" y1="12" x2="48" y2="100" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="108" y1="12" x2="108" y2="28" stroke="#aaa" strokeWidth="4" strokeLinecap="round" />
          {/* Pivot point */}
          <circle cx="108" cy="12" r="6" fill="#555" stroke="#888" strokeWidth="1.5" />
          <circle cx="108" cy="12" r="2.5" fill="#ccc" />
          {/* Stylus head */}
          <circle cx="46" cy="103" r="4" fill="#3ECFCF" opacity="0.9" />
          <circle cx="46" cy="103" r="2" fill="#fff" opacity="0.7" />
        </svg>
      </motion.div>
    </div>
  );
};

// ─── Interactive Seeker Bar ───────────────────────────────────────────────────
const SeekerBar = ({ progress, currentTime, duration, onSeek }) => {
  const trackRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const getPercent = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    onSeek(getPercent(e.clientX));
  };
  const handlePointerMove = (e) => {
    if (dragging) onSeek(getPercent(e.clientX));
    setHoverX(getPercent(e.clientX) * 100);
  };
  const handlePointerUp = (e) => {
    setDragging(false);
    onSeek(getPercent(e.clientX));
  };

  const formatTime = (t) => {
    if (isNaN(t) || !t) return "0:00";
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full space-y-2">
      <div
        ref={trackRef}
        className="relative h-1.5 rounded-full cursor-pointer group"
        style={{ background: 'rgba(255,255,255,0.08)' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => { setHovering(false); }}
      >
        {/* Buffered track hint */}
        <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7B5EA7, #3ECFCF)',
            boxShadow: '0 0 12px #3ECFCF60'
          }}
          layout
        />

        {/* Hover ghost */}
        {hovering && (
          <div
            className="absolute top-0 left-0 h-full rounded-full opacity-20"
            style={{ width: `${hoverX}%`, background: '#fff' }}
          />
        )}

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `calc(${progress}% - 8px)`,
            background: 'linear-gradient(135deg, #7B5EA7, #3ECFCF)',
            boxShadow: '0 0 16px #3ECFCF80'
          }}
          animate={{ scale: hovering || dragging ? 1.4 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

// ─── Volume Knob ──────────────────────────────────────────────────────────────
const VolumeControl = ({ volume, isMuted, onToggleMute, onVolumeChange }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onToggleMute}
      className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
      style={{ color: isMuted ? '#F72585' : 'rgba(255,255,255,0.5)' }}
    >
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
    <div className="relative w-20 h-1 rounded-full cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)' }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onVolumeChange(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      }}
    >
      <div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ width: `${isMuted ? 0 : volume * 100}%`, background: 'linear-gradient(90deg, #7B5EA7, #3ECFCF)' }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow"
        style={{ left: `calc(${isMuted ? 0 : volume * 100}% - 6px)` }}
      />
    </div>
  </div>
);

// ─── Playlist Item ────────────────────────────────────────────────────────────
const PlaylistItem = ({ song, index, isCurrent, isPlaying, onClick }) => (
  <motion.button
    layout
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ delay: index * 0.03 }}
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative overflow-hidden"
    style={{
      background: isCurrent ? 'linear-gradient(135deg, rgba(123,94,167,0.25), rgba(62,207,207,0.15))' : 'transparent',
      border: `1px solid ${isCurrent ? 'rgba(62,207,207,0.3)' : 'transparent'}`,
    }}
    whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)', x: 2 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Active glow sweep */}
    {isCurrent && (
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{ background: 'linear-gradient(90deg, transparent, #3ECFCF, transparent)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
    )}

    {/* Track number / playing indicator */}
    <div className="w-7 flex-shrink-0 flex items-center justify-center">
      {isCurrent && isPlaying ? (
        <WaveformBars isPlaying bars={3} color="#3ECFCF" />
      ) : (
        <span className="text-xs font-mono" style={{ color: isCurrent ? '#3ECFCF' : 'rgba(255,255,255,0.25)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
    </div>

    {/* Cover */}
    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
      style={{ boxShadow: isCurrent ? '0 0 12px #3ECFCF40' : 'none' }}>
      <img src={song.cover} alt="" className="w-full h-full object-cover" />
    </div>

    {/* Info */}
    <div className="flex-1 text-left min-w-0">
      <p className="text-xs font-bold truncate" style={{ color: isCurrent ? '#fff' : 'rgba(255,255,255,0.7)' }}>
        {song.title}
      </p>
      <p className="text-[10px] truncate mt-0.5 font-medium" style={{ color: isCurrent ? '#3ECFCF' : 'rgba(255,255,255,0.35)' }}>
        {song.artist}
      </p>
    </div>

    {/* Duration */}
    <span className="text-[10px] font-mono flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>
      {song.duration}
    </span>
  </motion.button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Songs() {
  const {
    currentSong, isPlaying, progress, currentTime, duration,
    isMuted, volume, isRepeating, isShuffling, likedSongs, playlist,
    setPlaylist, setCurrentSong, playNext, playPrevious, togglePlay,
    toggleMute, toggleRepeat, toggleShuffle, toggleLike, setVolume, seekTo
  } = useAudioStore();

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [activeTab, setActiveTab] = useState("queue"); // queue | liked
  const [searchFocused, setSearchFocused] = useState(false);
  const [bgSrc, setBgSrc] = useState(null);

  useEffect(() => {
    if (playlist.length === 0) setPlaylist(DEFAULT_SONGS);
  }, [playlist, setPlaylist]);

  // Smooth background transition
  useEffect(() => {
    if (activeSong?.cover) {
      const t = setTimeout(() => setBgSrc(activeSong.cover), 100);
      return () => clearTimeout(t);
    }
  }, [currentSong?.id]);

  const searchSongs = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`);
      const data = await res.json();
      if (data.results?.length > 0) {
        const mapped = data.results.map(t => ({
          id: t.trackId.toString(),
          title: t.trackName,
          artist: t.artistName,
          album: t.collectionName || '',
          cover: t.artworkUrl100?.replace('100x100', '600x600') || DEFAULT_SONGS[0].cover,
          url: t.previewUrl,
          duration: "0:30",
          genre: t.primaryGenreName || ''
        })).filter(s => s.url);
        if (mapped.length) {
          setPlaylist(mapped);
          setCurrentSong(mapped[0]);
          toast.success(`Found ${mapped.length} songs`, { icon: '🎵' });
        } else {
          toast.error("No playable previews found");
        }
      } else {
        // Fallback: Jamendo
        const jr = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=56d30c95&format=jsonpretty&limit=20&search=${encodeURIComponent(query)}`);
        const jd = await jr.json();
        if (jd.results?.length > 0) {
          const jm = jd.results.map(t => ({
            id: t.id, title: t.name, artist: t.artist_name, album: '',
            cover: t.image || DEFAULT_SONGS[0].cover,
            url: t.audio, duration: "Full", genre: ''
          }));
          setPlaylist(jm);
          setCurrentSong(jm[0]);
          toast.success(`${jm.length} free tracks on Jamendo`, { icon: '🎶' });
        } else {
          toast.error("No results found");
        }
      }
    } catch (err) {
      toast.error("Search failed. Check your connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSeek = useCallback((pct) => {
    if (seekTo && duration) seekTo(pct * duration);
  }, [seekTo, duration]);

  const activeSong = currentSong || playlist[0];
  const isLiked = activeSong ? likedSongs.some(s => s.id === activeSong.id) : false;

  const handleShare = async () => {
    if (!activeSong) return;
    if (navigator.share) {
      try { await navigator.share({ title: activeSong.title, text: `${activeSong.title} by ${activeSong.artist}`, url: window.location.href }); }
      catch {}
    } else {
      navigator.clipboard.writeText(`${activeSong.title} by ${activeSong.artist}`);
      toast.success("Copied to clipboard!", { icon: '📋' });
    }
  };

  const displayedList = activeTab === 'liked' ? likedSongs : playlist;

  if (!activeSong) return null;

  return (
    <div
      className="fixed inset-0 w-full overflow-hidden flex flex-col md:flex-row select-none"
      style={{
        background: '#04060F',
        color: '#fff',
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        height: '100dvh'
      }}
    >
      <SEO
        title={`${activeSong.title} — Audio`}
        description="Ultra-advanced music player. Search and stream millions of tracks."
      />

      {/* ── Layered Dynamic Background ── */}
      <AnimatePresence mode="crossfade">
        <motion.div
          key={bgSrc}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgSrc || activeSong.cover})`, filter: 'blur(80px) saturate(150%)', transform: 'scale(1.2)', opacity: 0.18 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Deep color layers */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 30% 80%, rgba(123,94,167,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 70% 20%, rgba(62,207,207,0.08) 0%, transparent 70%)'
      }} />
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(4,6,15,0.3) 0%, rgba(4,6,15,0.7) 50%, rgba(4,6,15,0.95) 100%)'
      }} />

      {/* Floating particles */}
      <ParticleField isPlaying={isPlaying} />

      {/* ── Top Navigation Bar ── */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(180deg, rgba(4,6,15,0.8) 0%, transparent 100%)', backdropFilter: 'blur(2px)' }}>
        
        <Link to="/"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-90"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ChevronLeft className="w-4 h-4" />
        </Link>

        {/* Logo wordmark */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          <Disc3 className="w-4 h-4" style={{ color: '#3ECFCF' }} />
          <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: '#3ECFCF' }}>AUDIO</span>
        </div>

        {/* Search */}
        <motion.form
          onSubmit={searchSongs}
          className="flex-1 relative"
          animate={{ maxWidth: searchFocused ? '100%' : '360px' }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full py-2.5 pl-10 pr-10 text-xs font-medium rounded-full outline-none transition-all"
            style={{
              background: searchFocused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${searchFocused ? '#3ECFCF60' : 'rgba(255,255,255,0.08)'}`,
              color: '#fff',
              boxShadow: searchFocused ? '0 0 20px #3ECFCF20' : 'none'
            }}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: searchFocused ? '#3ECFCF' : 'rgba(255,255,255,0.3)' }} />
          {isSearching
            ? <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin" style={{ color: '#3ECFCF' }} />
            : query && <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ color: '#3ECFCF' }}>GO</button>
          }
        </motion.form>

        {/* Mobile playlist toggle */}
        <button
          onClick={() => setShowPlaylist(v => !v)}
          className="md:hidden w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-90 relative"
          style={{
            background: showPlaylist ? 'rgba(62,207,207,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${showPlaylist ? '#3ECFCF60' : 'rgba(255,255,255,0.1)'}`,
            color: showPlaylist ? '#3ECFCF' : '#fff'
          }}
        >
          <ListMusic className="w-4 h-4" />
          {playlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
              style={{ background: '#7B5EA7', color: '#fff' }}>
              {Math.min(playlist.length, 99)}
            </span>
          )}
        </button>
      </header>

      {/* ── Main Player Column ── */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 pb-6 pt-20 md:pt-16 overflow-hidden">

        {/* Vinyl Record */}
        <div className="relative mb-8 md:mb-10">
          <VinylRecord song={activeSong} isPlaying={isPlaying} size={Math.min(300, window.innerWidth * 0.7)} />
        </div>

        {/* Song Identity */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSong.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-6 w-full max-w-sm px-2"
          >
            {activeSong.genre && (
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Radio className="w-2.5 h-2.5" style={{ color: '#7B5EA7' }} />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#7B5EA7' }}>
                  {activeSong.genre}
                </span>
              </div>
            )}

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight truncate"
              style={{ textShadow: '0 0 40px rgba(62,207,207,0.2)' }}>
              {activeSong.title}
            </h2>
            <p className="mt-1 text-xs font-semibold tracking-widest uppercase truncate" style={{ color: '#3ECFCF' }}>
              {activeSong.artist}
            </p>
            {activeSong.album && (
              <p className="mt-0.5 text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {activeSong.album}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Waveform */}
        <div className="mb-4 opacity-60">
          <WaveformBars isPlaying={isPlaying} bars={48} color="url(#waveGrad)" />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B5EA7" />
                <stop offset="100%" stopColor="#3ECFCF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Seeker */}
        <div className="w-full max-w-sm mb-6">
          <SeekerBar
            progress={progress || 0}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4 sm:gap-6 mb-6">
          {/* Shuffle */}
          <motion.button
            onClick={toggleShuffle}
            whileTap={{ scale: 0.85 }}
            className="flex flex-col items-center gap-1 transition-all"
            style={{ color: isShuffling ? '#3ECFCF' : 'rgba(255,255,255,0.35)' }}
          >
            <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
            {isShuffling && <div className="w-1 h-1 rounded-full" style={{ background: '#3ECFCF' }} />}
          </motion.button>

          {/* Skip Back */}
          <motion.button
            onClick={playPrevious}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </motion.button>

          {/* Play / Pause */}
          <motion.button
            onClick={() => currentSong ? togglePlay() : setCurrentSong(activeSong)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7B5EA7, #3ECFCF)',
              boxShadow: `0 0 ${isPlaying ? '40px' : '20px'} rgba(62,207,207,0.4), 0 0 80px rgba(62,207,207,0.15)`,
              width: 64, height: 64
            }}
          >
            {/* Pulsing ring when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(62,207,207,0.5)' }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={isPlaying ? 'pause' : 'play'}
                initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {isPlaying
                  ? <Pause className="w-7 h-7 fill-current" style={{ color: '#fff' }} />
                  : <Play className="w-7 h-7 fill-current ml-0.5" style={{ color: '#fff' }} />
                }
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Skip Forward */}
          <motion.button
            onClick={playNext}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </motion.button>

          {/* Repeat */}
          <motion.button
            onClick={toggleRepeat}
            whileTap={{ scale: 0.85 }}
            className="flex flex-col items-center gap-1 transition-all"
            style={{ color: isRepeating ? '#7B5EA7' : 'rgba(255,255,255,0.35)' }}
          >
            <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
            {isRepeating && <div className="w-1 h-1 rounded-full" style={{ background: '#7B5EA7' }} />}
          </motion.button>
        </div>

        {/* Bottom action row */}
        <div className="flex items-center gap-6 sm:gap-8">
          <VolumeControl
            volume={volume ?? 1}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onVolumeChange={setVolume}
          />

          <motion.button
            onClick={() => toggleLike(activeSong)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
            style={{ color: isLiked ? '#F72585' : 'rgba(255,255,255,0.4)' }}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            style={{ color: 'rgba(255,255,255,0.4)' }}
            className="hover:text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>
      </main>

      {/* ── Sidebar / Playlist Drawer ── */}
      <AnimatePresence>
        {(showPlaylist || true) && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: showPlaylist || window.innerWidth >= 768 ? 0 : '100%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 250, damping: 30 }}
            className="fixed md:relative top-0 right-0 h-full z-40 flex flex-col"
            style={{
              width: 320,
              minWidth: 280,
              background: 'rgba(8,10,20,0.92)',
              backdropFilter: 'blur(40px)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              transform: showPlaylist || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 'translateX(0)' : 'translateX(100%)'
            }}
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {['queue', 'liked'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all"
                    style={{ color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.35)' }}
                  >
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 rounded-md"
                        style={{ background: 'rgba(62,207,207,0.15)', border: '1px solid rgba(62,207,207,0.25)' }} />
                    )}
                    <span className="relative z-10">{tab === 'queue' ? 'Queue' : 'Liked'}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPlaylist(false)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Count badge */}
            <div className="px-5 py-2.5 flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {displayedList.length} {activeTab === 'liked' ? 'liked songs' : 'tracks'}
              </span>
              {activeTab === 'queue' && (
                <button className="text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-100 opacity-40" style={{ color: '#3ECFCF' }}>
                  Clear
                </button>
              )}
            </div>

            {/* Track list */}
            <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-0.5"
              style={{ scrollbarWidth: 'none' }}>
              <AnimatePresence>
                {displayedList.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-3"
                  >
                    <Music2 className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.1)' }} />
                    <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {activeTab === 'liked' ? 'No liked songs yet' : 'Queue is empty'}
                    </p>
                  </motion.div>
                ) : displayedList.map((song, i) => (
                  <PlaylistItem
                    key={song.id}
                    song={song}
                    index={i}
                    isCurrent={currentSong?.id === song.id}
                    isPlaying={isPlaying}
                    onClick={() => setCurrentSong(song)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Now playing mini footer in sidebar */}
            {activeSong && (
              <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                <img src={activeSong.cover} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold truncate text-white">{activeSong.title}</p>
                  <p className="text-[9px] truncate" style={{ color: '#3ECFCF' }}>{activeSong.artist}</p>
                </div>
                <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#7B5EA7' }} />
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowPlaylist(false)}
          />
        )}
      </AnimatePresence>

      {/* CSS overrides */}
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}