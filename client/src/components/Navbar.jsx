import React from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Plus, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, openCreatePlaylistModal, openIdentifierModal } = usePlayerStore();
  const { user } = useAuthStore();
  const { isSignedIn } = useUser();

  return (
    <nav
      className={`h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 backdrop-blur-md transition-colors ${
        theme === 'light'
          ? 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm'
          : 'bg-[#121212]/90 text-white'
      }`}
    >
      {/* Mobile Brand Logo / Left Nav History */}
      <div className="flex items-center gap-3">
        {/* Mobile Shubify Logo (Hidden on desktop since desktop has Sidebar) */}
        <div
          onClick={() => navigate('/')}
          className="flex md:hidden items-center gap-2 cursor-pointer"
        >
          <img src="/logo.png" alt="Shubify" className="w-8 h-8 object-contain drop-shadow" />
          <span className="font-black text-lg tracking-tight animate-wave-text">Shubify</span>
        </div>

        {/* Navigation History Controls */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className={`rounded-full p-1.5 transition-colors ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
            title="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigate(1)}
            className={`rounded-full p-1.5 transition-colors ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
            title="Go forward"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Create Playlist Button */}
        {(isSignedIn || user) && (
          <button
            onClick={openCreatePlaylistModal}
            className="flex md:hidden items-center gap-1 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs px-3 py-1.5 rounded-full shadow hover:scale-105 transition-all"
            title="Create New Playlist"
          >
            <Plus size={15} />
            <span>Create</span>
          </button>
        )}

        {/* Song Identifier (Shazam) Radar Button */}
        <button
          onClick={openIdentifierModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all shadow-sm group ${
            theme === 'light'
              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300'
              : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
          }`}
          title="Identify Song (Shazam / Radar)"
        >
          <Radio size={16} className="text-[#1ed760] group-hover:scale-110 transition-transform animate-pulse" />
          <span className="hidden sm:inline">Identify</span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full flex items-center gap-1.5 text-xs font-black transition-all shadow-sm ${
            theme === 'light'
              ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300'
              : 'bg-[#282828] text-yellow-400 hover:bg-[#383838] border border-white/10'
          }`}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon size={16} className="fill-current text-slate-900" />
          ) : (
            <Sun size={16} className="fill-current text-yellow-400" />
          )}
          <span className="hidden md:inline">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Clerk User Button & Profile */}
        {isSignedIn || user ? (
          <div className="flex items-center pl-1">
            <UserButton
              afterSignOutUrl="/login"
              showName={true}
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 rounded-full border border-white/20 shadow-sm',
                  userButtonBox: 'flex items-center gap-2',
                  userButtonOuterIdentifier: `${
                    theme === 'light' ? 'text-slate-900' : 'text-white'
                  } text-xs font-extrabold max-w-[120px] truncate hidden sm:inline`,
                },
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/signup')}
              className={`font-bold text-xs sm:text-sm transition-colors ${
                theme === 'light'
                  ? 'text-slate-700 hover:text-[#1ed760]'
                  : 'text-gray-400 hover:text-[#1ed760]'
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#1ed760] text-black font-extrabold text-xs sm:text-sm px-4 py-1.5 sm:px-6 sm:py-2 rounded-full hover:scale-105 transition-transform shadow-md"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
