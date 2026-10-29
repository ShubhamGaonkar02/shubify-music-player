import { create } from 'zustand';
import { usePlayerStore } from './playerStore';

// Helper to get saved user session from localStorage
const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('shubify_auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getSavedUser(),
  loading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('shubify_auth_user', JSON.stringify(user));
      if (!localStorage.getItem('spotify_token')) {
        localStorage.setItem('spotify_token', 'shubify_auth_token_' + Date.now());
        localStorage.setItem('spotify_token_expires', String(Date.now() + 86400 * 1000));
      }
      usePlayerStore.getState().loadUserData(user.uid || user.id || user.email);
    } else {
      localStorage.removeItem('shubify_auth_user');
      usePlayerStore.getState().loadUserData('guest');
    }
    set({ user, error: null });
  },

  setError: (error) => set({ error }),

  // Sync Clerk authenticated user with application state
  syncClerkUser: (clerkUser) => {
    if (!clerkUser) {
      get().setUser(null);
      return;
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress || '';
    const displayName =
      clerkUser.fullName ||
      clerkUser.firstName ||
      (email ? email.split('@')[0] : 'Music Lover');

    const userData = {
      uid: clerkUser.id,
      id: clerkUser.id,
      displayName,
      email,
      photoURL:
        clerkUser.imageUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
      provider: 'clerk',
      createdAt: clerkUser.createdAt
        ? new Date(clerkUser.createdAt).toISOString()
        : new Date().toISOString(),
    };

    get().setUser(userData);
  },

  logout: () => {
    get().setUser(null);
  },
}));
