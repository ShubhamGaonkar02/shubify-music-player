import { create } from 'zustand';

// Helper to get current authenticated user ID
const getCurrentUserId = () => {
  try {
    const saved = localStorage.getItem('shubify_auth_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user.uid || user.email || 'guest';
    }
  } catch (e) {}
  return 'guest';
};

// Helper to load user-isolated liked songs
const getSavedLikedSongs = (userId = getCurrentUserId()) => {
  try {
    const saved = localStorage.getItem(`liked_songs_${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

// Helper to load user-isolated custom playlists
const getSavedPlaylists = (userId = getCurrentUserId()) => {
  try {
    const saved = localStorage.getItem(`custom_playlists_${userId}`);
    if (saved) return JSON.parse(saved);

    // Initial default playlist for Shubham's account or initial guest view
    if (userId.includes('shubham') || userId === 'guest') {
      return [
        {
          id: 'playlist-shubham-1',
          name: 'shubham',
          description: 'My custom music collection',
          tracks: [],
          createdAt: new Date().toISOString(),
        },
      ];
    }

    // Completely fresh empty array for any new account!
    return [];
  } catch (e) {
    return [];
  }
};

export const usePlayerStore = create((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  volume: 1,
  progress: 0,
  isShuffle: false,
  isRepeat: false,

  // Create Playlist Modal State
  isCreatePlaylistOpen: false,
  openCreatePlaylistModal: () => set({ isCreatePlaylistOpen: true }),
  closeCreatePlaylistModal: () => set({ isCreatePlaylistOpen: false }),

  // Song Identifier (Shazam) Modal State
  isIdentifierOpen: false,
  openIdentifierModal: () => set({ isIdentifierOpen: true }),
  closeIdentifierModal: () => set({ isIdentifierOpen: false }),

  // Theme State (dark vs light)
  theme: localStorage.getItem('shubify_theme') || 'dark',
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('shubify_theme', nextTheme);
    set({ theme: nextTheme });
  },

  // User-isolated Liked Songs State
  likedSongs: getSavedLikedSongs(),

  // User-isolated Custom Playlists State
  customPlaylists: getSavedPlaylists(),

  // Function to reload user data whenever account logs in or changes
  loadUserData: (userId = getCurrentUserId()) => {
    const liked = getSavedLikedSongs(userId);
    const playlists = getSavedPlaylists(userId);
    set({ likedSongs: liked, customPlaylists: playlists });
  },

  setCurrentTrack: (track) => {
    const { queue } = get();
    const trackIndex = queue.findIndex((t) => t.id === track.id);
    set({
      currentTrack: track,
      isPlaying: true,
      currentIndex: trackIndex !== -1 ? trackIndex : get().currentIndex,
    });
  },

  playTrackList: (tracks, index = 0) => {
    if (!tracks || tracks.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, tracks.length - 1));
    set({
      queue: tracks,
      currentIndex: safeIndex,
      currentTrack: tracks[safeIndex],
      isPlaying: true,
    });
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setQueue: (queue) => set({ queue }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),

  // User-Isolated Liked Songs Logic
  toggleLikeTrack: (track) => {
    if (!track || !track.id) return;
    const { likedSongs } = get();
    const userId = getCurrentUserId();
    const exists = likedSongs.some((t) => t.id === track.id);

    let updated;
    if (exists) {
      updated = likedSongs.filter((t) => t.id !== track.id);
    } else {
      updated = [track, ...likedSongs];
    }

    localStorage.setItem(`liked_songs_${userId}`, JSON.stringify(updated));
    set({ likedSongs: updated });
  },

  isLiked: (trackId) => {
    if (!trackId) return false;
    return get().likedSongs.some((t) => t.id === trackId);
  },

  // User-Isolated Custom Playlists Logic
  createPlaylist: (name, description = '') => {
    const { customPlaylists } = get();
    const userId = getCurrentUserId();
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: name || `My Playlist #${customPlaylists.length + 1}`,
      description: description || 'Custom user created playlist',
      tracks: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newPlaylist, ...customPlaylists];
    localStorage.setItem(`custom_playlists_${userId}`, JSON.stringify(updated));
    set({ customPlaylists: updated });
    return newPlaylist;
  },

  addTrackToPlaylist: (playlistId, track) => {
    if (!playlistId || !track) return;
    const { customPlaylists } = get();
    const userId = getCurrentUserId();
    const updated = customPlaylists.map((pl) => {
      if (pl.id === playlistId) {
        const trackExists = pl.tracks.some((t) => t.id === track.id);
        if (!trackExists) {
          return { ...pl, tracks: [...pl.tracks, track] };
        }
      }
      return pl;
    });

    localStorage.setItem(`custom_playlists_${userId}`, JSON.stringify(updated));
    set({ customPlaylists: updated });
  },

  removeTrackFromPlaylist: (playlistId, trackId) => {
    const { customPlaylists } = get();
    const userId = getCurrentUserId();
    const updated = customPlaylists.map((pl) => {
      if (pl.id === playlistId) {
        return { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) };
      }
      return pl;
    });

    localStorage.setItem(`custom_playlists_${userId}`, JSON.stringify(updated));
    set({ customPlaylists: updated });
  },

  deletePlaylist: (playlistId) => {
    const { customPlaylists } = get();
    const userId = getCurrentUserId();
    const updated = customPlaylists.filter((pl) => pl.id !== playlistId);
    localStorage.setItem(`custom_playlists_${userId}`, JSON.stringify(updated));
    set({ customPlaylists: updated });
  },

  playNext: () => {
    const { queue, currentIndex, isShuffle, isRepeat } = get();
    if (!queue || queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      set({
        currentIndex: randomIndex,
        currentTrack: queue[randomIndex],
        isPlaying: true,
      });
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      set({
        currentIndex: nextIndex,
        currentTrack: queue[nextIndex],
        isPlaying: true,
      });
    } else if (isRepeat) {
      set({
        currentIndex: 0,
        currentTrack: queue[0],
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { queue, currentIndex, isShuffle } = get();
    if (!queue || queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      set({
        currentIndex: randomIndex,
        currentTrack: queue[randomIndex],
        isPlaying: true,
      });
      return;
    }

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      set({
        currentIndex: prevIndex,
        currentTrack: queue[prevIndex],
        isPlaying: true,
      });
    } else {
      const lastIndex = queue.length - 1;
      set({
        currentIndex: lastIndex,
        currentTrack: queue[lastIndex],
        isPlaying: true,
      });
    }
  },
}));
