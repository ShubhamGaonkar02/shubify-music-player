import React from 'react';
import { Heart, Play, Pause, Clock, Music } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useNavigate } from 'react-router-dom';

const LikedSongs = () => {
  const { likedSongs, toggleLikeTrack, playTrackList, currentTrack, isPlaying, setIsPlaying, theme } =
    usePlayerStore();
  const navigate = useNavigate();

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      if (currentTrack && likedSongs.some((t) => t.id === currentTrack.id)) {
        setIsPlaying(!isPlaying);
      } else {
        playTrackList(likedSongs, 0);
      }
    }
  };

  const handlePlayTrack = (track, index) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      playTrackList(likedSongs, index);
    }
  };

  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const totalDurationMs = likedSongs.reduce((acc, t) => acc + (t.duration_ms || 180000), 0);
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  // Theme Colors
  const headerBg =
    theme === 'light'
      ? 'bg-gradient-to-b from-emerald-600 via-green-700 to-[#edf7f2]'
      : 'bg-gradient-to-b from-indigo-700 via-purple-900 to-[#121212]';
  const tableHeaderColor = theme === 'light' ? 'text-emerald-950 font-black border-emerald-300' : 'text-gray-400 border-[#282828]';
  const songTitleColor = theme === 'light' ? 'text-emerald-950 font-bold' : 'text-white font-semibold';
  const artistColor = theme === 'light' ? 'text-emerald-800 font-medium' : 'text-gray-400';
  const albumColor = theme === 'light' ? 'text-emerald-800' : 'text-gray-400';
  const indexColor = theme === 'light' ? 'text-emerald-900 font-bold' : 'text-gray-400';
  const rowHover = theme === 'light' ? 'hover:bg-emerald-100/70' : 'hover:bg-white/10';
  const activeRow = theme === 'light' ? 'bg-emerald-100/90 border border-emerald-300' : 'bg-white/10';

  return (
    <div className="flex-1 overflow-y-auto pb-32 min-h-full">
      {/* Hero Banner */}
      <div className={`${headerBg} p-4 sm:p-8 flex flex-col md:flex-row items-center md:items-end text-center md:text-left gap-4 sm:gap-6 shadow-xl transition-all`}>
        <div className="w-32 h-32 sm:w-52 sm:h-52 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-2xl flex items-center justify-center flex-shrink-0 ring-4 ring-black/20">
          <Heart size={52} className="text-white fill-current sm:w-20 sm:h-20" />
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2 text-white items-center md:items-start">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/40 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full w-max backdrop-blur-md border border-white/10">
            Playlist
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">Liked Songs</h1>
          <p className="text-xs sm:text-sm text-gray-200 mt-1 flex items-center gap-2 font-bold">
            <span>Your Personal Collection</span>
            <span>•</span>
            <span>{likedSongs.length} songs</span>
            {likedSongs.length > 0 && (
              <>
                <span>•</span>
                <span>about {totalMinutes} min</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center gap-6">
        {likedSongs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-spotify-base hover:bg-spotify-highlight rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all"
          >
            {isPlaying && likedSongs.some((t) => t.id === currentTrack?.id) ? (
              <Pause size={22} fill="black" className="text-black" />
            ) : (
              <Play size={22} fill="black" className="text-black ml-1" />
            )}
          </button>
        )}
      </div>

      {/* Track List Table */}
      <div className="px-2 sm:px-8">
        {likedSongs.length > 0 ? (
          <div className="w-full">
            {/* Table Header */}
            <div className={`grid grid-cols-12 text-xs border-b pb-2.5 mb-3 px-2 sm:px-4 uppercase tracking-wider ${tableHeaderColor}`}>
              <span className="hidden sm:block col-span-1">#</span>
              <span className="col-span-9 sm:col-span-6 md:col-span-5">Title</span>
              <span className="hidden md:block md:col-span-4">Album</span>
              <span className="col-span-3 sm:col-span-5 md:col-span-2 text-right flex items-center justify-end pr-2">
                <Clock size={15} />
              </span>
            </div>

            {/* Song Rows */}
            <div className="flex flex-col gap-1">
              {likedSongs.map((track, index) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track, index)}
                    className={`grid grid-cols-12 items-center p-2 sm:p-3 rounded-xl ${rowHover} group transition-all cursor-pointer ${
                      isCurrent ? activeRow : ''
                    }`}
                  >
                    {/* Index / Play Button */}
                    <div
                      className={`hidden sm:flex col-span-1 text-sm items-center ${indexColor}`}
                      onClick={() => handlePlayTrack(track, index)}
                    >
                      <span className="group-hover:hidden">{index + 1}</span>
                      <button className="hidden group-hover:flex items-center text-spotify-base">
                        {isCurrent && isPlaying ? (
                          <Pause size={16} fill="#1db954" className="text-spotify-base" />
                        ) : (
                          <Play size={16} fill="#1db954" className="ml-0.5 text-spotify-base" />
                        )}
                      </button>
                    </div>

                    {/* Title & Artist */}
                    <div
                      className="col-span-9 sm:col-span-6 md:col-span-5 flex items-center gap-2.5 sm:gap-3.5 min-w-0"
                      onClick={() => handlePlayTrack(track, index)}
                    >
                      <img
                        src={
                          track.album?.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100'
                        }
                        alt=""
                        className="w-10 h-10 rounded-md object-cover flex-shrink-0 shadow-sm"
                      />
                      <div className="flex flex-col truncate">
                        <span
                          className={`text-sm truncate ${
                            isCurrent ? 'text-spotify-base font-extrabold' : songTitleColor
                          }`}
                        >
                          {track.name}
                        </span>
                        <span className={`text-xs truncate ${artistColor}`}>
                          {track.artists?.map((a) => a.name).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Album */}
                    <div
                      className={`hidden md:block md:col-span-4 text-xs truncate pr-4 ${albumColor}`}
                      onClick={() => handlePlayTrack(track, index)}
                    >
                      {track.album?.name || 'Single'}
                    </div>

                    {/* Like Toggle & Duration */}
                    <div className={`col-span-5 md:col-span-2 flex items-center justify-end gap-4 text-xs ${indexColor}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeTrack(track);
                        }}
                        className="text-spotify-base hover:scale-110 transition-transform"
                        title="Remove from Liked Songs"
                      >
                        <Heart size={18} fill="#1db954" className="text-spotify-base" />
                      </button>
                      <span>{formatDuration(track.duration_ms)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center mb-6">
              <Music size={40} className="text-spotify-base" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`}>
              Songs you like will appear here
            </h3>
            <p className={`text-sm max-w-md mb-6 ${theme === 'light' ? 'text-emerald-800' : 'text-gray-400'}`}>
              Save songs by tapping the heart icon on any song row or in the music player.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="bg-spotify-base text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-md"
            >
              Find Songs to Like
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
