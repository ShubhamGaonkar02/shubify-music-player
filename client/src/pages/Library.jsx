import React from 'react';
import { Heart, Music, Plus } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const { likedSongs, customPlaylists, openCreatePlaylistModal, theme } = usePlayerStore();
  const navigate = useNavigate();

  const titleColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const cardBg = theme === 'light' ? 'bg-slate-100 border border-slate-200 hover:bg-slate-200' : 'bg-[#181818] hover:bg-[#282828]';
  const iconBg = theme === 'light' ? 'bg-white border border-slate-200' : 'bg-[#282828]';
  const subTextColor = theme === 'light' ? 'text-slate-500 font-semibold' : 'text-gray-400';

  return (
    <div className="p-4 sm:p-8 pb-32">
      {/* Header with Create Playlist Button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl sm:text-3xl font-black ${titleColor}`}>Your Library</h1>
        <button
          onClick={openCreatePlaylistModal}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-spotify-base hover:bg-spotify-highlight text-black font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition-all"
        >
          <Plus size={18} />
          <span>Create Playlist</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {/* Create Playlist Tile */}
        <div
          onClick={openCreatePlaylistModal}
          className={`border-2 border-dashed border-spotify-base/60 p-4 sm:p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform shadow-md flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px] text-center group ${
            theme === 'light' ? 'bg-emerald-50/70 hover:bg-emerald-100/80' : 'bg-spotify-base/10 hover:bg-spotify-base/20'
          }`}
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-spotify-base text-black rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-lg">
            <Plus size={24} strokeWidth={3} className="sm:w-7 sm:h-7" />
          </div>
          <h3 className={`font-black text-xs sm:text-base ${titleColor}`}>Create Playlist</h3>
          <p className="text-[10px] sm:text-xs text-spotify-base font-bold mt-0.5 sm:mt-1">Build your own mix</p>
        </div>

        {/* Liked Songs Tile */}
        <div
          onClick={() => navigate('/liked')}
          className="bg-gradient-to-br from-indigo-700 to-purple-800 p-4 sm:p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform shadow-xl flex flex-col justify-end min-h-[160px] sm:min-h-[220px] relative group"
        >
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 text-white">
            <Heart size={26} fill="white" className="sm:w-9 sm:h-9" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-1 sm:mb-2">Liked Songs</h2>
            <p className="text-xs sm:text-sm font-semibold text-gray-200">
              {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>

        {/* Custom User Playlists */}
        {customPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className={`${cardBg} p-5 rounded-xl cursor-pointer transition-all shadow-md group flex flex-col justify-between min-h-[220px]`}
          >
            <div className={`w-full aspect-square ${iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden shadow-sm`}>
              <Music size={44} className="text-spotify-base" />
            </div>
            <div>
              <h3 className={`font-black text-base truncate mb-1 ${titleColor}`}>{playlist.name}</h3>
              <p className={`text-xs ${subTextColor}`}>
                Playlist • {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
