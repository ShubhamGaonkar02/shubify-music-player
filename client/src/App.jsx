import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import MobileBottomNav from './components/MobileBottomNav';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import SignUpPage from './pages/SignUpPage';
import LikedSongs from './pages/LikedSongs';
import PlaylistView from './pages/PlaylistView';
import Library from './pages/Library';
import { setAccessToken } from './api/spotify';
import { usePlayerStore } from './store/playerStore';
import { useAuthStore } from './store/authStore';

// Main music player layout when user is authenticated
function MainAppLayout() {
  const { theme, isCreatePlaylistOpen, closeCreatePlaylistModal } = usePlayerStore();

  return (
    <div
      className={`flex h-screen overflow-hidden font-sans transition-colors ${
        theme === 'light' ? 'bg-[#eaf6ee]' : 'bg-black'
      }`}
    >
      {/* Left Sidebar (Desktop Only) */}
      <Sidebar />

      {/* Center Main Panel (Full Width on Mobile) */}
      <div
        className={`flex-1 overflow-y-auto rounded-none md:rounded-xl my-0 md:my-2 mr-0 md:mr-2 relative custom-scrollbar transition-all ${
          theme === 'light'
            ? 'bg-white text-slate-900 shadow-sm border border-emerald-200/80'
            : 'bg-[#121212] text-white'
        }`}
      >
        <Navbar />
        <div className="pb-36">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/liked" element={<LikedSongs />} />
            <Route path="/playlist/:id" element={<PlaylistView />} />
            <Route path="/library" element={<Library />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* Bottom Music Player Bar */}
      <div
        className={`fixed bottom-16 md:bottom-0 left-0 right-0 h-[65px] md:h-[90px] border-t z-40 transition-colors ${
          theme === 'light'
            ? 'bg-white border-slate-200 text-slate-900 shadow-md'
            : 'bg-black border-[#282828] text-white'
        }`}
      >
        <MusicPlayer />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Create Playlist Modal (Works on Mobile & Desktop) */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={closeCreatePlaylistModal}
      />
    </div>
  );
}

// Authenticated App wrapper connected to Clerk
function AuthenticatedApp() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { syncClerkUser } = useAuthStore();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        syncClerkUser(clerkUser);
      } else {
        syncClerkUser(null);
      }
    }

    const storedToken = localStorage.getItem('spotify_token') || 'shubify_demo_token';
    setAccessToken(storedToken);
  }, [isLoaded, isSignedIn, clerkUser, syncClerkUser]);

  // Loading Screen while Clerk session is being retrieved
  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#09090b] text-white font-sans select-none">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#1ed760]/30 border-t-[#1ed760] animate-spin" />
          <img
            src="/logo.png"
            alt="Shubify"
            className="w-8 h-8 object-contain absolute inset-0 m-auto"
          />
        </div>
        <p className="text-sm font-bold text-gray-300">Loading Shubify...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Clerk Sign In & Sign Up Routes */}
        <Route
          path="/login/*"
          element={isSignedIn ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup/*"
          element={isSignedIn ? <Navigate to="/" replace /> : <SignUpPage />}
        />

        {/* Protected App Routes */}
        <Route
          path="/*"
          element={isSignedIn ? <MainAppLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

function App({ missingClerkKey }) {
  if (missingClerkKey) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login missingClerkKey={true} />} />
        </Routes>
      </Router>
    );
  }

  return <AuthenticatedApp />;
}

export default App;
