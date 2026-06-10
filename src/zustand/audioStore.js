import { create } from 'zustand';

export const useAudioStore = create((set, get) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  progress: 0,
  duration: 0,
  currentTime: 0,
  isMuted: false,
  volume: 1,
  isRepeating: false,
  isShuffling: false,
  likedSongs: JSON.parse(localStorage.getItem('likedSongs') || '[]'),
  
  // Actions
  setPlaylist: (songs) => set({ playlist: songs }),
  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
  playNext: () => {
    const { playlist, currentSong, isShuffling, isRepeating } = get();
    if (!playlist.length) return;
    
    if (isRepeating && currentSong) {
      set({ currentTime: 0, isPlaying: true });
      return;
    }

    let nextIndex;
    if (isShuffling) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    set({ currentSong: playlist[nextIndex], isPlaying: true });
  },
  playPrevious: () => {
    const { playlist, currentSong } = get();
    if (!playlist.length) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    set({ currentSong: playlist[prevIndex], isPlaying: true });
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setProgress: (progress, currentTime, duration) => set({ progress, currentTime, duration }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVolume: (volume) => set({ volume }),
  toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating })),
  toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
  
  toggleLike: (song) => {
    const { likedSongs } = get();
    const isLiked = likedSongs.some(s => s.id === song.id);
    let newLiked;
    if (isLiked) {
      newLiked = likedSongs.filter(s => s.id !== song.id);
    } else {
      newLiked = [...likedSongs, song];
    }
    localStorage.setItem('likedSongs', JSON.stringify(newLiked));
    set({ likedSongs: newLiked });
  }
}));
