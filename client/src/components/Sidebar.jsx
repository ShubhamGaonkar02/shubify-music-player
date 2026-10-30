import React from 'react';
import { Home, Search, Library, Plus, Heart, Music, ArrowRight, Radio } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customPlaylists, likedSongs, theme, openCreatePlaylistModal, openIdentifierModal } = usePlayerStore();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
  ];

  const panelBg =
    theme === 'light'
      ? 'bg-white border border-slate-200 shadow-sm'
      : 'bg-[#121212] border border-transparent';
  const textColor = theme === 'light' ? 'text-slate-900 font-extrabold' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-slate-500 font-semibold' : 'text-gray-400';
  const itemHover = theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-[#1a1a1a]';
  const activeBg = theme === 'light' ? 'bg-slate-100 border border-slate-200' : 'bg-[#282828]';

  return (
    <div
      className={`hidden md:flex w-80 h-full flex-col select-none p-2 gap-2 transition-colors ${
        theme === 'light' ? 'bg-slate-100' : 'bg-black'
      }`}
    >
      {/* Top Navigation Panel with Custom Shubify Logo & Song Wave Beats */}
      <div className={`${panelBg} rounded-xl p-4 flex flex-col gap-5 transition-all`}>
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="Shubify"
            className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight animate-wave-text drop-shadow-sm">
                Shubify
              </span>
              {/* Dynamic Song Wave Beats Visualizer */}
              <div className="flex items-center gap-0.5 h-4 mb-1">
                <span className="w-1 h-3.5 bg-spotify-base rounded-full wave-beat-1" />
                <span className="w-1 h-4 bg-emerald-400 rounded-full wave-beat-2" />
                <span className="w-1 h-5 bg-green-300 rounded-full wave-beat-3" />
                <span className="w-1 h-3 bg-emerald-500 rounded-full wave-beat-4" />
                <span className="w-1 h-4 bg-spotify-base rounded-full wave-beat-5" />
              </div>
            </div>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-spotify-base opacity-90 -mt-1 flex items-center gap-1">
              <span>⚡</span>
              <span>– Ad-Free Music Player</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 text-sm font-bold transition-colors duration-200 ${
                  isActive
                    ? 'text-spotify-base font-black'
                    : `${subTextColor} hover:text-slate-900`
                }`}
              >
                <Icon size={22} className={isActive ? 'text-spotify-base' : ''} />
                {link.name}
              </Link>
            );
          })}

          {/* Shazam Identify Action */}
          <button
            onClick={openIdentifierModal}
            className={`flex items-center gap-4 text-sm font-bold transition-colors duration-200 text-left ${subTextColor} hover:text-slate-900 group`}
            title="Identify Song (Shazam Radar)"
          >
            <Radio size={22} className="text-[#1ed760] group-hover:scale-110 transition-transform animate-pulse" />
            <div className="flex items-center gap-2">
              <span>Identify Song</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Radar
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Your Library Panel */}
      <div className={`${panelBg} rounded-xl flex-1 flex flex-col min-h-0 overflow-hidden transition-all`}>
        {/* Library Header */}
        <div className={`p-4 pb-2 flex flex-col gap-3 border-b ${theme === 'light' ? 'border-slate-200' : 'border-[#1f1f1f]'}`}>
          <div className="flex items-center justify-between">
            <Link
              to="/library"
              className={`flex items-center gap-3 font-bold text-sm transition-colors ${subTextColor} hover:text-slate-900`}
            >
              <Library size={22} />
              <span>Your Library</span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={openCreatePlaylistModal}
                className={`p-1.5 rounded-full transition-colors ${subTextColor} ${theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-gray-300'}`}
                title="Create playlist"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => navigate('/library')}
                className={`p-1.5 rounded-full transition-colors ${subTextColor} ${theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-gray-300'}`}
                title="Show full library"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Library List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar flex flex-col gap-1">
          {/* Liked Songs Tile */}
          <div
            onClick={() => navigate('/liked')}
            className={`flex items-center gap-3 p-2.5 rounded-lg ${itemHover} cursor-pointer group transition-colors ${
              location.pathname === '/liked' ? activeBg : ''
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded flex items-center justify-center flex-shrink-0 shadow-md">
              <Heart size={20} className="text-white fill-current" />
            </div>
            <div className="flex flex-col truncate">
              <span
                className={`text-sm font-extrabold truncate ${
                  location.pathname === '/liked' ? 'text-spotify-base' : textColor
                }`}
              >
                Liked Songs
              </span>
              <span className={`text-xs ${subTextColor}`}>Playlist • {likedSongs.length} songs</span>
            </div>
          </div>

          {/* User Created Playlists */}
          {customPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigate(`/playlist/${pl.id}`)}
              className={`flex items-center gap-3 p-2.5 rounded-lg ${itemHover} cursor-pointer group transition-colors ${
                location.pathname === `/playlist/${pl.id}` ? activeBg : ''
              }`}
            >
              <div
                className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${
                  theme === 'light' ? 'bg-slate-100' : 'bg-[#282828]'
                }`}
              >
                <Music size={20} className="text-spotify-base" />
              </div>
              <div className="flex flex-col truncate">
                <span
                  className={`text-sm font-extrabold truncate ${
                    location.pathname === `/playlist/${pl.id}` ? 'text-spotify-base' : textColor
                  }`}
                >
                  {pl.name}
                </span>
                <span className={`text-xs ${subTextColor}`}>Playlist • {pl.tracks.length} songs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
