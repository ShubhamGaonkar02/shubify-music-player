import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import { Play, Pause, Trash2, Plus, Music, Search as SearchIcon, Heart, Clock, Share2, Check } from 'lucide-react';
import { searchSpotify } from '../api/spotify';

const presetMetadata = {
  'chennai express': {
    title: 'Chennai Express (Original Motion Picture Soundtrack)',
    desc: 'Starring Shah Rukh Khan & Deepika Padukone. Music by Vishal-Shekhar. Hits include Lungi Dance, Titli, Kashmir Main Tu Kanyakumari & 1 2 3 4 Get On The Dance Floor.',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'ms dhoni': {
    title: 'M.S. Dhoni: The Untold Story (Movie Album)',
    desc: 'Starring Sushant Singh Rajput. Music by Amaal Mallik & Rochak Kohli. Hits include Kaun Tujhe, Jab Tak, Besabriyaan & Phirr Kabhi.',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600&h=600',
  },
  dhurandhar: {
    title: 'Dhurandhar Movie Album',
    desc: 'Official Bollywood movie soundtrack featuring high energy action beats, romantic anthems, and background scores.',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'arijit singh': {
    title: 'Arijit Singh - Best Hits & Melodies',
    desc: 'The essential collection of King of Romance Arijit Singh including Tum Hi Ho, Kesariya, Channa Mereya, Apna Bana Le & Apna Bana Le.',
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'jubin nautiyal': {
    title: 'Jubin Nautiyal - Soulful Acoustics',
    desc: 'Romantic chartbusters and unplugged acoustic tracks by Jubin Nautiyal.',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600&h=600',
  },
  badshah: {
    title: 'Badshah - Party Anthems & Rap Hits',
    desc: 'Non-stop club bangers, rap tracks, and dance floor anthems by Badshah.',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'shreya ghoshal': {
    title: 'Shreya Ghoshal - Nightingale Hits',
    desc: 'Timeless romantic melodies and classical hits by Shreya Ghoshal.',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'bollywood romantic songs': {
    title: 'Bollywood Romance 💖',
    desc: 'Most loved romantic songs by Arijit Singh, Jubin Nautiyal, Shreya Ghoshal & Atif Aslam.',
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'bollywood party songs': {
    title: 'Bollywood Party Bangers 🎉',
    desc: 'Top club and dance floor anthems for non-stop energy.',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'hindi songs': {
    title: 'Hindi Hits ❤️',
    desc: 'Top Bollywood chartbusters, soulful romantic tracks, and trending Hindi melodies.',
    img: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f6/b8/9c/f6b89cf5-a3ed-2048-cf95-dbec6ac33ead/8902894354158_cover.jpg/600x600bb.jpg',
  },
  'marathi songs': {
    title: 'Marathi Hits 🚩',
    desc: 'Popular Marathi chartbusters, Zingaat, Ajay-Atul classics and modern folk-pop.',
    img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'telugu songs': {
    title: 'Telugu Hits 🔥',
    desc: 'Tollywood blockbusters, sensational dance beats, and chart-topping Telugu anthems.',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'tamil songs': {
    title: 'Tamil Hits ⚡',
    desc: 'Kollywood superhits, Anirudh party bangers, and AR Rahman musical genius.',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600&h=600',
  },
  'english songs': {
    title: 'English & Global Pop 🌍',
    desc: 'Billboard Hot 100, viral international pop hits and global tracks.',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600&h=600',
  },
};

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    customPlaylists,
    removeTrackFromPlaylist,
    addTrackToPlaylist,
    deletePlaylist,
    playTrackList,
    currentTrack,
    isPlaying,
    setIsPlaying,
    toggleLikeTrack,
    isLiked,
    theme,
  } = usePlayerStore();

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState({
    title: '',
    desc: '',
    img: '',
    isCustom: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const customPlaylist = customPlaylists.find((pl) => pl.id === id);

  useEffect(() => {
    if (customPlaylist) {
      setTracks(customPlaylist.tracks || []);
      setMeta({
        title: customPlaylist.name,
        desc: customPlaylist.description || 'User created playlist',
        img: customPlaylist.tracks?.[0]?.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600&h=600',
        isCustom: true,
      });
      setLoading(false);
    } else {
      const decoded = decodeURIComponent(id || '');
      const key = decoded.toLowerCase();
      const preset = presetMetadata[key] || {
        title: `${decoded} Album & Playlist`,
        desc: `Featured track list for ${decoded}`,
        img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600',
      };

      setLoading(true);
      const loadPresetTracks = async () => {
        const data = await searchSpotify(decoded);
        const fetched = data?.tracks?.items || [];
        setTracks(fetched);

        const fetchedCover = fetched[0]?.album?.images?.[0]?.url;
        const cover = fetchedCover || preset.img || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600';

        setMeta({
          title: preset.title,
          desc: preset.desc,
          img: cover,
          isCustom: false,
        });
        setLoading(false);
      };

      loadPresetTracks();
    }
  }, [id, customPlaylist]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      if (currentTrack && tracks.some((t) => t.id === currentTrack.id)) {
        setIsPlaying(!isPlaying);
      } else {
        playTrackList(tracks, 0);
      }
    }
  };

  const handlePlayTrack = (index) => {
    playTrackList(tracks, index);
  };

  const handleSharePlaylist = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${meta.title} on Shubify`,
      text: `Listen to ${meta.title} on Shubify Ad-Free Music Player!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback
    }
  };

  const handleSearchTracks = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    const data = await searchSpotify(searchQuery);
    if (data && data.tracks) {
      setSearchResults(data.tracks.items || []);
    }
    setSearching(false);
  };

  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const totalDurationMs = tracks.reduce((acc, t) => acc + (t.duration_ms || 180000), 0);
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  // Theme Styling
  const headerBg =
    theme === 'light'
      ? 'bg-gradient-to-b from-[#047857] via-[#065f46] to-[#f4fbf7]'
      : 'bg-gradient-to-b from-indigo-800 via-[#1e1b4b] to-[#121212]';
  const tableHeaderColor = theme === 'light' ? 'text-[#022c22] font-black border-[#047857]/30' : 'text-gray-400 border-[#282828]';
  const songTitleColor = theme === 'light' ? 'text-[#022c22] font-black' : 'text-white font-semibold';
  const artistColor = theme === 'light' ? 'text-[#047857] font-bold' : 'text-gray-400';
  const albumColor = theme === 'light' ? 'text-[#047857] font-bold' : 'text-gray-400';
  const indexColor = theme === 'light' ? 'text-[#022c22] font-black' : 'text-gray-400';
  const rowHover = theme === 'light' ? 'hover:bg-emerald-100/70' : 'hover:bg-white/10';
  const activeRow = theme === 'light' ? 'bg-emerald-100/90 border border-[#047857]/40' : 'bg-white/10';

  return (
    <div className="flex-1 overflow-y-auto pb-32 min-h-full relative">
      {/* Toast Notification */}
      {copied && (
        <div className="fixed top-20 right-8 z-50 bg-spotify-base text-black font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check size={18} />
          <span>Playlist link copied to clipboard! 🔗</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className={`${headerBg} p-4 sm:p-8 flex flex-col md:flex-row items-center md:items-end text-center md:text-left gap-4 sm:gap-6 shadow-sm transition-all`}>
        <div className="w-36 h-36 sm:w-52 sm:h-52 bg-[#282828] rounded-xl shadow-2xl overflow-hidden flex-shrink-0 relative group ring-4 ring-black/10">
          {meta.img ? (
            <img
              src={meta.img}
              alt={meta.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = tracks[0]?.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#047857] to-[#022c22]">
              <Music size={80} className="text-white opacity-80" />
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1.5 sm:gap-2 flex-1 min-w-0 items-center md:items-start ${theme === 'light' ? 'text-[#022c22]' : 'text-white'}`}>
          <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full w-max backdrop-blur-md border ${theme === 'light' ? 'bg-[#022c22] text-white border-[#047857]' : 'text-spotify-base bg-black/40 border-white/10'}`}>
            {meta.isCustom ? 'User Playlist' : 'Album & Playlist'}
          </span>
          <h1 className={`text-2xl sm:text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm ${theme === 'light' ? 'text-[#022c22]' : 'text-white'}`}>
            {meta.title}
          </h1>
          <p className={`text-xs sm:text-sm line-clamp-2 mt-0.5 font-bold ${theme === 'light' ? 'text-[#047857]' : 'text-gray-200'}`}>{meta.desc}</p>
          <p className={`text-[11px] sm:text-xs mt-1 sm:mt-2 flex items-center gap-2 font-black ${theme === 'light' ? 'text-[#022c22]' : 'text-gray-300'}`}>
            <span>Shubify</span>
            <span>•</span>
            <span>{tracks.length} songs</span>
            {tracks.length > 0 && (
              <>
                <span>•</span>
                <span>about {totalMinutes} min</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 sm:p-8 pb-3 sm:pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {tracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-spotify-base hover:bg-spotify-highlight rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all"
              title={isPlaying && tracks.some((t) => t.id === currentTrack?.id) ? 'Pause Playlist' : 'Play Playlist'}
            >
              {isPlaying && tracks.some((t) => t.id === currentTrack?.id) ? (
                <Pause size={22} fill="black" className="text-black" />
              ) : (
                <Play size={22} fill="black" className="text-black ml-1" />
              )}
            </button>
          )}

          {/* Vibrant Spotify Green Share Playlist Button */}
          {!meta.isCustom && (
            <button
              onClick={handleSharePlaylist}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black transition-all hover:scale-105 shadow-lg border border-spotify-base bg-spotify-base hover:bg-spotify-highlight text-black"
              title="Share Playlist"
            >
              {copied ? <Check size={15} className="text-black" /> : <Share2 size={15} className="text-black" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          )}
        </div>

        {meta.isCustom && (
          <button
            onClick={() => {
              deletePlaylist(id);
              navigate('/');
            }}
            className="text-gray-400 hover:text-red-500 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex items-center gap-3 text-spotify-base px-4 sm:px-8 my-8 font-bold text-sm">
          <div className="w-5 h-5 border-2 border-spotify-base border-t-transparent rounded-full animate-spin" />
          <span>Loading all songs for {decodeURIComponent(id || '')}...</span>
        </div>
      )}

      {/* Playlist Songs Table */}
      {!loading && (
        <div className="px-2 sm:px-8 mb-12">
          {tracks.length > 0 ? (
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
                {tracks.map((track, index) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const liked = isLiked(track.id);
                  return (
                    <div
                      key={track.id}
                      className={`grid grid-cols-12 items-center p-2 sm:p-3 rounded-xl ${rowHover} group cursor-pointer transition-all ${
                        isCurrent ? activeRow : ''
                      }`}
                    >
                      {/* Index / Play Button */}
                      <div
                        className={`hidden sm:flex col-span-1 text-sm items-center ${indexColor}`}
                        onClick={() => handlePlayTrack(index)}
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
                        onClick={() => handlePlayTrack(index)}
                      >
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
                        <div className="flex flex-col truncate">
                          <span
                            className={`text-sm truncate ${
                              isCurrent ? 'text-[#1db954] font-extrabold' : songTitleColor
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
                        onClick={() => handlePlayTrack(index)}
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
                          className="p-1 transition-colors hover:scale-110"
                          title={liked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
                        >
                          <Heart
                            size={16}
                            fill={liked ? '#1db954' : 'none'}
                            className={liked ? 'text-spotify-base' : 'text-gray-400 hover:text-spotify-base'}
                          />
                        </button>

                        {meta.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTrackFromPlaylist(id, track.id);
                            }}
                            className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove from playlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <span>{formatDuration(track.duration_ms)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-bold">
              <p className="text-lg mb-1">No songs found for this playlist</p>
            </div>
          )}
        </div>
      )}

      {/* Add Songs Search Section (For Custom Playlists) */}
      {meta.isCustom && (
        <div className={`px-8 border-t pt-8 ${theme === 'light' ? 'border-slate-200' : 'border-[#282828]'}`}>
          <h3 className={`text-xl font-extrabold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            Recommended Songs to Add
          </h3>
          <form onSubmit={handleSearchTracks} className="relative max-w-md mb-6">
            <SearchIcon size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs or artists..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-spotify-base shadow-sm ${
                theme === 'light'
                  ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
                  : 'bg-[#282828] text-white placeholder-gray-400'
              }`}
            />
          </form>

          {searching && <p className="text-sm text-spotify-base font-bold">Searching tracks...</p>}

          {searchResults.length > 0 && (
            <div className="flex flex-col gap-2 max-w-2xl">
              {searchResults.map((track) => {
                const inPlaylist = tracks.some((t) => t.id === track.id);
                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg ${
                      theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-[#282828]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          track.album?.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100'
                        }
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100';
                        }}
                      />
                      <div className="truncate">
                        <p className={`text-sm font-extrabold truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                          {track.name}
                        </p>
                        <p className={`text-xs truncate ${theme === 'light' ? 'text-slate-500 font-semibold' : 'text-gray-400'}`}>
                          {track.artists?.map((a) => a.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => addTrackToPlaylist(id, track)}
                      disabled={inPlaylist}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        inPlaylist
                          ? 'bg-gray-300 text-gray-600 cursor-default'
                          : 'bg-spotify-base text-black hover:scale-105 shadow-md'
                      }`}
                    >
                      {inPlaylist ? 'Added' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistView;
