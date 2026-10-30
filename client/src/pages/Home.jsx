import React, { useEffect, useState } from 'react';
import { searchSpotify } from '../api/spotify';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Globe, Linkedin, Github, Mail, Radio } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const { playTrackList, theme, openIdentifierModal } = usePlayerStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [moviePosters, setMoviePosters] = useState({
    Dhurandhar: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600&h=600',
    'Chennai Express': 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bf/16/be/bf16be02-ca31-50e5-7eb7-15dcd0f0ebef/886444101968.jpg/600x600bb.jpg',
    'MS Dhoni': 'https://is1-ssl.mzstatic.com/image/thumb/Music71/v4/44/d5/df/44d5df68-dfc6-e910-b962-d249d97d76ab/886446077363.jpg/600x600bb.jpg',
    'Kabir Singh': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600&h=600',
    Rockstar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600&h=600',
    Brahmastra: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600',
    'Arijit Singh': 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a4/09/b3/a409b33a-bc45-e652-32a1-e490538a7b1b/886448834926.jpg/600x600bb.jpg',
    'Jubin Nautiyal': 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f5/21/d5/f521d582-7f72-9fb4-ae62-c0cb1fbd2c22/886449557626.jpg/600x600bb.jpg',
    Badshah: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/80/7e/17/807e174e-5e92-3a59-e3fb-7945041a77e5/886448744591.jpg/600x600bb.jpg',
    'Shreya Ghoshal': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600&h=600',
    Romance: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600&h=600',
    Party: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600&h=600',
    Sad: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600&h=600',
    Sufi: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600&h=600',
    Hindi: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f6/b8/9c/f6b89cf5-a3ed-2048-cf95-dbec6ac33ead/8902894354158_cover.jpg/600x600bb.jpg',
    Marathi: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600&h=600',
    Telugu: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600&h=600',
    Tamil: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600&h=600',
    English: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600&h=600',
  });

  useEffect(() => {
    const fetchArtwork = async () => {
      const queries = [
        { key: 'Chennai Express', term: 'Chennai Express' },
        { key: 'MS Dhoni', term: 'MS Dhoni The Untold Story' },
        { key: 'Dhurandhar', term: 'Dhurandhar' },
        { key: 'Kabir Singh', term: 'Kabir Singh' },
        { key: 'Rockstar', term: 'Rockstar' },
        { key: 'Brahmastra', term: 'Brahmastra' },
        { key: 'Arijit Singh', term: 'Arijit Singh' },
        { key: 'Jubin Nautiyal', term: 'Jubin Nautiyal' },
        { key: 'Badshah', term: 'Badshah' },
        { key: 'Hindi', term: 'Yeh Jawaani Hai Deewani' },
        { key: 'Marathi', term: 'Sairat' },
        { key: 'Telugu', term: 'Pushpa' },
        { key: 'Tamil', term: 'Leo' },
        { key: 'English', term: 'Dua Lipa' },
      ];

      const newPosters = { ...moviePosters };
      for (const q of queries) {
        try {
          const res = await axios.get(`https://itunes.apple.com/search`, {
            params: { term: q.term, country: 'IN', entity: 'song', limit: 1 },
          });
          const img = res.data?.results?.[0]?.artworkUrl100?.replace('100x100bb', '600x600bb');
          if (img) {
            newPosters[q.key] = img;
          }
        } catch (err) {
          // fallback
        }
      }
      setMoviePosters(newPosters);
    };

    fetchArtwork();
  }, []);

  const getGreeting = () => {
    const userName = user?.displayName ? `, ${user.displayName}` : '';
    return `Welcome back${userName}`;
  };

  const quickMixes = [
    { title: 'Chennai Express', query: 'Chennai Express', imgKey: 'Chennai Express' },
    { title: 'MS Dhoni Untold Story', query: 'MS Dhoni', imgKey: 'MS Dhoni' },
    { title: 'Dhurandhar Movie', query: 'Dhurandhar', imgKey: 'Dhurandhar' },
    { title: 'Arijit Singh Romantic', query: 'Arijit Singh', imgKey: 'Arijit Singh' },
    { title: 'Bollywood Party 🎉', query: 'Bollywood Party Songs', imgKey: 'Party' },
    { title: 'Best of 2026 Hits', query: 'Bollywood 2026', imgKey: 'Jubin Nautiyal' },
  ];

  const movieAlbums = [
    { name: 'Chennai Express', desc: 'Lungi Dance, Titli, Kashmir Main Tu Kanyakumari', query: 'Chennai Express', imgKey: 'Chennai Express' },
    { name: 'M.S. Dhoni: The Untold Story', desc: 'Kaun Tujhe, Besabriyaan, Jab Tak, Phirr Kabhi', query: 'MS Dhoni', imgKey: 'MS Dhoni' },
    { name: 'Dhurandhar Movie Album', desc: 'Official tracks, action themes and romantic anthems', query: 'Dhurandhar', imgKey: 'Dhurandhar' },
    { name: 'Kabir Singh Soundtrack', desc: 'Bekhayali, Tujhe Kitna Chahne Lage, Kaise Hua', query: 'Kabir Singh', imgKey: 'Kabir Singh' },
    { name: 'Rockstar Album', desc: 'Sadda Haq, Tum Ho, Kun Faya Kun, Nadaan Parindey', query: 'Rockstar', imgKey: 'Rockstar' },
    { name: 'Brahmastra Soundtrack', desc: 'Kesariya, Rasiya, Dance Ka Bhoot, Deva Deva', query: 'Brahmastra', imgKey: 'Brahmastra' },
  ];

  const topSingers = [
    { name: 'Arijit Singh', query: 'Arijit Singh', imgKey: 'Arijit Singh', role: 'King of Romantic Hits' },
    { name: 'Jubin Nautiyal', query: 'Jubin Nautiyal', imgKey: 'Jubin Nautiyal', role: 'Melodic Voice' },
    { name: 'Badshah', query: 'Badshah', imgKey: 'Badshah', role: 'Hip-Hop & Party Icon' },
    { name: 'Shreya Ghoshal', query: 'Shreya Ghoshal', imgKey: 'Shreya Ghoshal', role: 'Nightingale of Bollywood' },
  ];

  const songCategories = [
    { name: 'Bollywood Romance 💖', desc: 'Soulful romantic tracks by Arijit Singh & Jubin Nautiyal', query: 'Bollywood Romantic Songs', imgKey: 'Romance' },
    { name: 'Party Bangers 🎉', desc: 'High energy dance hits by Badshah & Honey Singh', query: 'Bollywood Party Songs', imgKey: 'Party' },
    { name: 'Sad & Soulful 🌧️', desc: 'Emotional heart-touching acoustic melodies', query: 'Bollywood Sad Songs', imgKey: 'Sad' },
    { name: 'Sufi & Qawwali 🕉️', desc: 'Spiritual vibes by Nusrat Fateh Ali Khan & AR Rahman', query: 'Bollywood Sufi Qawwali', imgKey: 'Sufi' },
  ];

  const languageCategories = [
    {
      name: 'Hindi Hits ❤️',
      desc: 'Top Bollywood chartbusters & trending Hindi melodies',
      query: 'Hindi Songs',
      imgKey: 'Hindi',
    },
    {
      name: 'Marathi Hits 🚩',
      desc: 'Popular Marathi chartbusters, Zingaat & Ajay-Atul classics',
      query: 'Marathi Songs',
      imgKey: 'Marathi',
    },
    {
      name: 'Telugu Hits 🔥',
      desc: 'Tollywood blockbusters & energetic dance anthems',
      query: 'Telugu Songs',
      imgKey: 'Telugu',
    },
    {
      name: 'Tamil Hits ⚡',
      desc: 'Kollywood superhits by Anirudh Ravichander & AR Rahman',
      query: 'Tamil Songs',
      imgKey: 'Tamil',
    },
    {
      name: 'English Pop 🌍',
      desc: 'Billboard Hot 100, viral TikTok hits & international pop',
      query: 'English Songs',
      imgKey: 'English',
    },
  ];

  const handleOpenPlaylist = (query) => {
    navigate(`/playlist/${encodeURIComponent(query)}`);
  };

  const handleQuickPlay = async (e, query) => {
    e.stopPropagation();
    const data = await searchSpotify(query);
    if (data && data.tracks && data.tracks.items.length > 0) {
      playTrackList(data.tracks.items, 0);
    }
  };

  const cardBg =
    theme === 'light'
      ? 'bg-[#f4fbf7] border border-emerald-200/80 hover:bg-emerald-100/70 hover:border-emerald-300 shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(29,185,84,0.35)] hover:-translate-y-1.5 transition-all duration-300'
      : 'bg-[#181818] hover:bg-[#282828] hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_12px_24px_-4px_rgba(29,185,84,0.35)] hover:border hover:border-spotify-base/40';

  const quickMixBg =
    theme === 'light'
      ? 'bg-gradient-to-r from-[#f0fdf4] to-[#e6f4ea] border border-emerald-200/80 hover:bg-emerald-100/80 shadow-sm hover:-translate-y-1 transition-all duration-300'
      : 'bg-white/5 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300';

  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-emerald-800 font-medium' : 'text-gray-400';

  return (
    <div className="p-4 sm:p-8 pb-36 flex flex-col justify-between min-h-full animate-fade-in-up">
      <div>
        {/* Header Greeting with Logged-in User Name */}
        <h2 className={`text-2xl sm:text-3xl font-black mb-4 sm:mb-6 tracking-tight ${textColor}`}>
          {getGreeting()}
        </h2>

        {/* Quick Mix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {quickMixes.map((mix, i) => (
            <div
              key={i}
              onClick={() => handleOpenPlaylist(mix.query)}
              className={`${quickMixBg} h-14 sm:h-16 rounded-xl flex items-center gap-2 sm:gap-4 cursor-pointer overflow-hidden group relative pr-2 sm:pr-3`}
            >
              <img
                src={moviePosters[mix.imgKey]}
                alt={mix.title}
                className="h-14 w-14 sm:h-16 sm:w-16 object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span className={`font-black truncate text-xs sm:text-sm flex-1 ${textColor}`}>{mix.title}</span>
              <button
                onClick={(e) => handleQuickPlay(e, mix.query)}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-spotify-base hover:bg-spotify-highlight text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl flex-shrink-0 hover:scale-110 hidden sm:flex"
                title="Quick Play"
              >
                <Play size={18} fill="black" className="text-black ml-0.5" />
              </button>
            </div>
          ))}
        </div>

        {/* SECTION 1: SEPARATE MOVIE ALBUMS */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 ${textColor}`}>
              <span>🎬</span> Popular Movie Albums & Soundtracks
            </h2>
            <button
              onClick={() => navigate('/search')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                theme === 'light' ? 'text-emerald-800 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {movieAlbums.map((item, i) => (
              <div
                key={i}
                onClick={() => handleOpenPlaylist(item.query)}
                className={`${cardBg} p-3 sm:p-4 rounded-xl cursor-pointer group`}
              >
                <div className="relative mb-3 sm:mb-4 pb-[100%] rounded-lg overflow-hidden shadow-md bg-gray-200">
                  <img
                    src={moviePosters[item.imgKey]}
                    alt={item.name}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => handleQuickPlay(e, item.query)}
                    className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-spotify-base hover:bg-spotify-highlight rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-xl hover:scale-110 z-10"
                    title="Play Album"
                  >
                    <Play size={20} fill="black" className="text-black ml-0.5" />
                  </button>
                </div>
                <h3 className={`font-bold mb-1 truncate text-xs sm:text-sm ${textColor}`}>{item.name}</h3>
                <p className={`text-[11px] sm:text-xs line-clamp-2 ${subTextColor}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: SEPARATE SINGERS & ARTISTS */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 ${textColor}`}>
              <span>🎤</span> Top Singers & Artist Mixes
            </h2>
            <button
              onClick={() => navigate('/search')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                theme === 'light' ? 'text-emerald-800 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {topSingers.map((artist) => (
              <div
                key={artist.name}
                onClick={() => handleOpenPlaylist(artist.query)}
                className={`${cardBg} p-3.5 sm:p-5 rounded-xl cursor-pointer group flex flex-col items-center text-center`}
              >
                <div className="w-24 h-24 sm:w-36 sm:h-36 mb-3 sm:mb-4 relative rounded-full overflow-hidden shadow-xl ring-2 ring-spotify-base/30 group-hover:ring-spotify-base transition-all">
                  <img
                    src={moviePosters[artist.imgKey]}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => handleQuickPlay(e, artist.query)}
                    className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-spotify-base rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110"
                    title="Play Artist Mix"
                  >
                    <Play size={16} fill="black" className="text-black ml-0.5" />
                  </button>
                </div>
                <h3 className={`font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 ${textColor}`}>{artist.name}</h3>
                <span className="text-spotify-base text-[11px] sm:text-xs font-bold">{artist.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: SEPARATE LANGUAGES & REGIONAL HITS */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 ${textColor}`}>
              <span>🌐</span> Music by Language & Regional Hits
            </h2>
            <button
              onClick={() => navigate('/search')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                theme === 'light' ? 'text-emerald-800 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {languageCategories.map((item, i) => (
              <div
                key={i}
                onClick={() => handleOpenPlaylist(item.query)}
                className={`${cardBg} p-3 sm:p-4 rounded-xl cursor-pointer group`}
              >
                <div className="relative mb-3 sm:mb-4 pb-[100%] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                  <img
                    src={moviePosters[item.imgKey]}
                    alt={item.name}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => handleQuickPlay(e, item.query)}
                    className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-spotify-base hover:bg-spotify-highlight rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-xl hover:scale-110 z-10"
                    title={`Play ${item.name}`}
                  >
                    <Play size={20} fill="black" className="text-black ml-0.5" />
                  </button>
                </div>
                <h3 className={`font-bold mb-1 truncate text-xs sm:text-sm ${textColor}`}>{item.name}</h3>
                <p className={`text-[11px] sm:text-xs line-clamp-2 ${subTextColor}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: SEPARATE SONG CATEGORIES & MOODS */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 ${textColor}`}>
              <span>💖</span> Song Categories & Genres
            </h2>
            <button
              onClick={() => navigate('/search')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                theme === 'light' ? 'text-emerald-800 hover:text-slate-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {songCategories.map((item, i) => (
              <div
                key={i}
                onClick={() => handleOpenPlaylist(item.query)}
                className={`${cardBg} p-3 sm:p-4 rounded-xl cursor-pointer group`}
              >
                <div className="relative mb-3 sm:mb-4 pb-[100%] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                  <img
                    src={moviePosters[item.imgKey]}
                    alt={item.name}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => handleQuickPlay(e, item.query)}
                    className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-spotify-base hover:bg-spotify-highlight rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-xl hover:scale-110 z-10"
                    title="Play Category"
                  >
                    <Play size={20} fill="black" className="text-black ml-0.5" />
                  </button>
                </div>
                <h3 className={`font-bold mb-1 truncate text-xs sm:text-sm ${textColor}`}>{item.name}</h3>
                <p className={`text-[11px] sm:text-xs line-clamp-2 ${subTextColor}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: SHAZAM / SONG IDENTIFIER DOWN ON MAIN SCREEN */}
        <div className="mb-10 sm:mb-12">
          <div
            onClick={openIdentifierModal}
            className={`p-5 sm:p-7 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 border ${
              theme === 'light'
                ? 'bg-gradient-to-r from-emerald-100/90 via-teal-50 to-emerald-100/90 border-emerald-300 hover:border-emerald-400'
                : 'bg-gradient-to-r from-emerald-950/40 via-[#181818] to-emerald-950/40 border-white/10 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center gap-4 sm:gap-6 text-center md:text-left flex-col md:flex-row">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl animate-pulse">
                  <Radio size={30} className="text-black" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-[#1ed760]/40 animate-ping" />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-[#1ed760]/20 text-[#1ed760] border border-[#1ed760]/30">
                    Shubify Radar
                  </span>
                </div>
                <h3 className={`text-lg sm:text-2xl font-black ${textColor}`}>
                  Heard a song nearby? Identify it instantly
                </h3>
                <p className={`text-xs sm:text-sm mt-0.5 max-w-xl ${subTextColor}`}>
                  Turn on your microphone to identify songs playing on TV, reels, or radio—or hum the melody to find and play it immediately.
                </p>
              </div>
            </div>

            {/* Identify Button matching user's image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openIdentifierModal();
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all shadow-md hover:scale-105 flex-shrink-0 ${
                theme === 'light'
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-[#1ed760] hover:bg-[#1fdf64] text-black'
              }`}
              title="Identify Song (Shazam / Radar)"
            >
              <Radio size={18} className="text-[#1ed760] animate-pulse" />
              <span>Identify</span>
            </button>
          </div>
        </div>
      </div>

      {/* Website Footer Credit - Centered at Bottom with Clickable Links */}
      <footer className={`mt-12 sm:mt-16 pt-6 sm:pt-8 pb-8 border-t flex flex-col items-center justify-center text-center gap-4 sm:gap-5 ${theme === 'light' ? 'border-emerald-200' : 'border-[#282828]'}`}>
        {/* Big Creator Name Badge Centered */}
        <div className={`flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl shadow-xl border transition-all hover:scale-105 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 border-emerald-300 text-slate-900'
            : 'bg-gradient-to-r from-[#181818] via-[#222222] to-[#181818] border-white/10 text-white'
        }`}>
          <span className="text-xs sm:text-base font-extrabold text-gray-300">Made with</span>
          <Heart size={22} fill="#1db954" className="text-spotify-base animate-pulse flex-shrink-0" />
          <span className="text-xs sm:text-base font-extrabold text-gray-300">by</span>
          <span className="text-lg sm:text-3xl font-black tracking-wide text-spotify-base drop-shadow-md">
            Shubham Gaonkar
          </span>
        </div>

        {/* Clickable Social & Portfolio Link Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl px-4">
          <a
            href="https://shubham-gaonkar-portfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-extrabold transition-all duration-300 shadow-md hover:scale-105 ${
              theme === 'light'
                ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200 border border-emerald-300'
                : 'bg-[#242424] text-white hover:bg-[#323232] border border-white/10 hover:border-spotify-base'
            }`}
          >
            <Globe size={14} className="text-spotify-base" />
            <span>Portfolio</span>
          </a>

          <a
            href="https://www.linkedin.com/in/shubhamgaonkar2005/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-extrabold transition-all duration-300 shadow-md hover:scale-105 ${
              theme === 'light'
                ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200 border border-emerald-300'
                : 'bg-[#242424] text-white hover:bg-[#323232] border border-emerald-300'
            }`}
          >
            <Linkedin size={14} className="text-[#0a66c2]" />
            <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com/ShubhamGaonkar02"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-extrabold transition-all duration-300 shadow-md hover:scale-105 ${
              theme === 'light'
                ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200 border border-emerald-300'
                : 'bg-[#242424] text-white hover:bg-[#323232] border border-white/10 hover:border-spotify-base'
            }`}
          >
            <Github size={14} className="text-white" />
            <span>GitHub</span>
          </a>

          <a
            href="mailto:shubhamgaonkar2005@gmail.com"
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-extrabold transition-all duration-300 shadow-md hover:scale-105 ${
              theme === 'light'
                ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200 border border-emerald-300'
                : 'bg-[#242424] text-white hover:bg-[#323232] border border-white/10 hover:border-spotify-base'
            }`}
          >
            <Mail size={14} className="text-rose-400" />
            <span className="truncate max-w-[180px] sm:max-w-none">shubhamgaonkar2005@gmail.com</span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-bold mt-1">
          <span className="text-spotify-base font-black">Shubify – Ad-Free Music Player</span>
          <span className="hidden sm:inline">•</span>
          <span className={subTextColor}>© 2026 All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
