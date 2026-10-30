import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Play, Pause, Heart, Radio } from 'lucide-react';
import { searchSpotify } from '../api/spotify';
import { usePlayerStore } from '../store/playerStore';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    playTrackList,
    toggleLikeTrack,
    isLiked,
    theme,
    openIdentifierModal,
  } = usePlayerStore();

  const presets = [
    'Dhurandhar',
    'Chennai Express',
    'MS Dhoni',
    'Romance',
    'Party',
    'Arijit Singh',
    'Jubin Nautiyal',
    'Badshah',
    'Shreya Ghoshal',
    'Best of 2026 Hits',
    'Best of 2025 Hits',
  ];

  const categoryCards = [
    {
      name: '💖 Romance Hits',
      color: 'from-pink-600 to-rose-700',
      query: 'Bollywood Romantic Songs',
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: '🎉 Party Bangers',
      color: 'from-fuchsia-600 to-purple-800',
      query: 'Bollywood Party Songs',
      img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: '🎬 Dhurandhar Movie',
      color: 'from-amber-600 to-red-700',
      query: 'Dhurandhar',
      img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: '🚂 Chennai Express',
      color: 'from-yellow-500 to-amber-700',
      query: 'Chennai Express',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: '🏏 MS Dhoni Movie',
      color: 'from-blue-600 to-cyan-700',
      query: 'MS Dhoni',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: 'Arijit Singh Hits',
      color: 'from-amber-600 to-red-600',
      query: 'Arijit Singh',
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: 'Jubin Nautiyal',
      color: 'from-blue-600 to-indigo-700',
      query: 'Jubin Nautiyal',
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: 'Badshah Party',
      color: 'from-purple-600 to-pink-600',
      query: 'Badshah',
      img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: 'Shreya Ghoshal',
      color: 'from-[#1db954] to-emerald-800',
      query: 'Shreya Ghoshal',
      img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: 'Best of 2026',
      color: 'from-rose-600 to-orange-600',
      query: 'Bollywood 2026',
      img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: 'Best of 2025',
      color: 'from-indigo-600 to-purple-800',
      query: 'Bollywood 2025',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=400',
    },
    {
      name: 'Coke Studio India',
      color: 'from-red-600 to-pink-800',
      query: 'Coke Studio India',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400',
    },
  ];

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      const data = await searchSpotify(query);
      setResults(data);
      setLoading(false);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handlePlayTrack = (track, trackList = null) => {
    const queue = trackList || results?.tracks?.items || [track];
    const index = queue.findIndex((t) => t.id === track.id);
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      playTrackList(queue, index !== -1 ? index : 0);
    }
  };

  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const songsList = results?.tracks?.items || [];
  const artistsList = results?.artists?.items || [];
  const albumsList = results?.albums?.items || [];
  const topResult = songsList[0];

  // Theme Styles
  const headingColor = theme === 'light' ? 'text-emerald-950 font-extrabold' : 'text-white font-bold';
  const songTitleColor = theme === 'light' ? 'text-emerald-950 font-bold' : 'text-white font-semibold';
  const artistColor = theme === 'light' ? 'text-emerald-800 font-medium' : 'text-gray-400';
  const albumColor = theme === 'light' ? 'text-emerald-800' : 'text-gray-400';
  const indexColor = theme === 'light' ? 'text-emerald-900 font-bold' : 'text-gray-400';
  const rowHover = theme === 'light' ? 'hover:bg-emerald-100/70' : 'hover:bg-white/10';
  const cardBg = theme === 'light' ? 'bg-[#f0fdf4] border border-emerald-200 hover:bg-emerald-100/80 shadow-sm' : 'bg-[#181818] hover:bg-[#282828]';

  return (
    <div className="p-4 sm:p-8 pb-36 min-h-full">
      {/* Search Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-emerald-700">
              <SearchIcon size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`block w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-spotify-base transition-all ${
                theme === 'light'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 placeholder-emerald-700'
                  : 'bg-white text-black placeholder-gray-500'
              }`}
              placeholder="Search songs, movies, artists..."
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-700 hover:text-emerald-950"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Identify Song (Shazam) button next to search bar */}
          <button
            onClick={openIdentifierModal}
            className="flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex-shrink-0 group"
            title="Identify Song (Shazam / Radar)"
          >
            <Radio size={16} className="animate-pulse group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Identify Song</span>
            <span className="sm:hidden">Identify</span>
          </button>
        </div>

        {/* Shazam Song Identifier Banner */}
        {!query && (
          <div
            onClick={openIdentifierModal}
            className={`cursor-pointer flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all hover:scale-[1.01] shadow-sm ${
              theme === 'light'
                ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-emerald-300 hover:border-emerald-400'
                : 'bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-black/40 border-white/10 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Radio size={20} className="animate-pulse" />
              </div>
              <div className="min-w-0">
                <h4 className={`text-xs sm:text-sm font-black truncate ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`}>
                  Heard a song nearby? Identify with Shazam
                </h4>
                <p className={`text-[11px] sm:text-xs truncate ${theme === 'light' ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                  Tap here to listen to music playing around you
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs shadow-md transition-all flex-shrink-0">
              <Radio size={14} />
              <span>Tap to Identify</span>
            </div>
          </div>
        )}

        {/* Quick Presets */}
        {!query && (
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs self-center mr-2 font-bold ${theme === 'light' ? 'text-emerald-800' : 'text-gray-400'}`}>
              Quick Searches:
            </span>
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setQuery(preset)}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-colors shadow-sm ${
                  theme === 'light'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-[#282828] hover:bg-[#383838] text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex items-center gap-3 text-spotify-base font-bold my-8">
          <div className="w-5 h-5 border-2 border-spotify-base border-t-transparent rounded-full animate-spin" />
          <span>Searching tracks, movies, and playlists...</span>
        </div>
      )}

      {/* Filter Tabs */}
      {results && !loading && (
        <div className={`flex gap-3 mb-6 border-b pb-3 ${theme === 'light' ? 'border-emerald-200' : 'border-[#282828]'}`}>
          {['All', 'Songs', 'Artists', 'Albums'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-spotify-base text-black shadow-md'
                  : theme === 'light'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-[#282828] text-gray-300 hover:bg-[#383838]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Main Results Container */}
      {results && !loading && (
        <div className="flex flex-col gap-10">
          {/* TOP RESULT & TOP SONGS GRID (Tab: All) */}
          {(activeTab === 'All' || activeTab === 'Songs') && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Top Result Card */}
              {activeTab === 'All' && topResult && (
                <div className="lg:col-span-2">
                  <h2 className={`text-2xl mb-4 ${headingColor}`}>Top result</h2>
                  <div className={`${cardBg} transition-all p-6 rounded-xl relative group cursor-pointer shadow-md`}>
                    <img
                      src={
                        topResult.album?.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300'
                      }
                      alt={topResult.name}
                      className="w-24 h-24 rounded-lg shadow-md mb-4 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300';
                      }}
                    />
                    <h3 className={`text-3xl font-extrabold mb-1 truncate ${headingColor}`}>{topResult.name}</h3>
                    <div className={`flex items-center gap-2 text-sm font-semibold ${artistColor}`}>
                      <span className="bg-spotify-base text-black text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Song
                      </span>
                      <span>•</span>
                      <span className="truncate">{topResult.artists?.map((a) => a.name).join(', ')}</span>
                    </div>

                    <button
                      onClick={() => handlePlayTrack(topResult, songsList)}
                      className="absolute bottom-6 right-6 w-14 h-14 bg-spotify-base rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 hover:scale-105 hover:bg-spotify-highlight"
                    >
                      {currentTrack?.id === topResult.id && isPlaying ? (
                        <Pause size={24} fill="black" className="text-black" />
                      ) : (
                        <Play size={24} fill="black" className="text-black ml-1" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Songs List */}
              <div className={activeTab === 'All' ? 'lg:col-span-3' : 'col-span-full'}>
                <h2 className={`text-2xl mb-4 ${headingColor}`}>
                  {activeTab === 'All' ? 'Songs' : `All Songs (${songsList.length})`}
                </h2>

                {songsList.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {songsList
                      .slice(0, activeTab === 'All' ? 5 : songsList.length)
                      .map((track, index) => {
                        const isCurrent = currentTrack?.id === track.id;
                        const liked = isLiked(track.id);
                        return (
                          <div
                            key={track.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${rowHover} group cursor-pointer transition-colors ${
                              isCurrent ? (theme === 'light' ? 'bg-emerald-100/90 border border-emerald-300' : 'bg-white/10') : ''
                            }`}
                          >
                            <div
                              className="flex items-center gap-4 min-w-0 flex-1"
                              onClick={() => handlePlayTrack(track, songsList)}
                            >
                              <span className={`text-sm w-4 text-center group-hover:hidden ${indexColor}`}>
                                {index + 1}
                              </span>
                              <button className="hidden group-hover:flex w-4 items-center justify-center text-spotify-base">
                                {isCurrent && isPlaying ? (
                                  <Pause size={16} fill="#1db954" className="text-spotify-base" />
                                ) : (
                                  <Play size={16} fill="#1db954" className="ml-0.5 text-spotify-base" />
                                )}
                              </button>

                              <img
                                src={
                                  track.album?.images?.[2]?.url ||
                                  track.album?.images?.[0]?.url ||
                                  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100'
                                }
                                alt=""
                                className="w-10 h-10 rounded-md object-cover flex-shrink-0 shadow-sm"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100';
                                }}
                              />

                              <div className="flex flex-col min-w-0 flex-1">
                                <p
                                  className={`text-sm truncate ${
                                    isCurrent ? 'text-spotify-base font-extrabold' : songTitleColor
                                  }`}
                                >
                                  {track.name}
                                </p>
                                <p className={`text-xs truncate ${artistColor}`}>
                                  {track.artists?.map((a) => a.name).join(', ')}
                                </p>
                              </div>
                            </div>

                            <div className={`flex items-center gap-4 text-xs ${indexColor}`}>
                              <span className={`hidden md:block truncate max-w-[140px] ${albumColor}`}>
                                {track.album?.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLikeTrack(track);
                                }}
                                className="p-1 transition-colors hover:scale-110"
                                title={liked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
                              >
                                <Heart
                                  size={16}
                                  fill={liked ? '#1db954' : 'none'}
                                  className={liked ? 'text-spotify-base' : 'text-gray-400 hover:text-spotify-base'}
                                />
                              </button>
                              <span>{formatDuration(track.duration_ms)}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className={`text-sm font-semibold ${artistColor}`}>No tracks found matching "{query}"</p>
                )}
              </div>
            </div>
          )}

          {/* ARTISTS SECTION */}
          {(activeTab === 'All' || activeTab === 'Artists') && artistsList.length > 0 && (
            <div>
              <h2 className={`text-2xl mb-4 ${headingColor}`}>Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {artistsList.slice(0, activeTab === 'All' ? 6 : artistsList.length).map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setQuery(artist.name)}
                    className={`${cardBg} p-4 rounded-xl transition-all cursor-pointer group flex flex-col items-center text-center shadow-sm`}
                  >
                    <div className="w-32 h-32 mb-4 relative rounded-full overflow-hidden shadow-md ring-2 ring-spotify-base/30">
                      <img
                        src={
                          artist.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300&h=300'
                        }
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300&h=300';
                        }}
                      />
                    </div>
                    <h3 className={`font-bold truncate w-full mb-1 ${headingColor}`}>{artist.name}</h3>
                    <span className={`text-xs capitalize font-semibold ${artistColor}`}>Artist</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALBUMS SECTION */}
          {(activeTab === 'All' || activeTab === 'Albums') && albumsList.length > 0 && (
            <div>
              <h2 className={`text-2xl mb-4 ${headingColor}`}>Albums & Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {albumsList.slice(0, activeTab === 'All' ? 6 : albumsList.length).map((album) => (
                  <div
                    key={album.id}
                    onClick={() => setQuery(album.name)}
                    className={`${cardBg} p-4 rounded-xl transition-all cursor-pointer group shadow-sm`}
                  >
                    <div className="relative mb-4 pb-[100%] rounded-lg overflow-hidden shadow-md">
                      <img
                        src={
                          album.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300&h=300'
                        }
                        alt={album.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300&h=300';
                        }}
                      />
                    </div>
                    <h3 className={`font-bold truncate mb-1 ${headingColor}`}>{album.name}</h3>
                    <p className={`text-xs truncate ${artistColor}`}>
                      {album.artists?.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOLLYWOOD CATEGORY TILES WITH HIGH RES ARTWORK POSTERS */}
      {!query && (
        <div>
          <h2 className={`text-2xl mb-6 ${headingColor}`}>Movies & Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categoryCards.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setQuery(cat.query)}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl aspect-square p-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-all shadow-lg group`}
              >
                <h3 className="text-white font-extrabold text-base leading-tight drop-shadow-md z-10 relative pr-2">
                  {cat.name}
                </h3>
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-24 h-24 rounded-xl object-cover absolute -bottom-2 -right-2 rotate-[18deg] shadow-2xl group-hover:rotate-[10deg] group-hover:scale-110 transition-all duration-300 ring-2 ring-black/20"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
