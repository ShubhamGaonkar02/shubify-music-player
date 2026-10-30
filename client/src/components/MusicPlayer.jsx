import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Loader2,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { usePlayerStore } from '../store/playerStore';
import { searchYouTubeVideo } from '../api/youtube';

const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    playNext,
    playPrevious,
    toggleLikeTrack,
    isLiked,
    theme,
  } = usePlayerStore();

  const [activeMediaUrl, setActiveMediaUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const prepareAudioSource = async () => {
      if (!currentTrack) {
        setActiveMediaUrl(null);
        return;
      }

      setIsLoading(true);
      setPlayed(0);

      const fallbackUrl = currentTrack.preview_url || null;

      try {
        const query = `${currentTrack.name} ${currentTrack.artists?.[0]?.name || ''}`;
        const videoId = await searchYouTubeVideo(query);

        if (isMounted) {
          if (videoId) {
            setActiveMediaUrl(`https://www.youtube.com/watch?v=${videoId}`);
          } else if (fallbackUrl) {
            setActiveMediaUrl(fallbackUrl);
          } else {
            setActiveMediaUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
          }
          setIsLoading(false);
          setIsPlaying(true);
        }
      } catch (err) {
        console.error('Playback setup error:', err);
        if (isMounted) {
          setActiveMediaUrl(fallbackUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
          setIsLoading(false);
          setIsPlaying(true);
        }
      }
    };

    prepareAudioSource();

    return () => {
      isMounted = false;
    };
  }, [currentTrack]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const playerBg =
    theme === 'light'
      ? 'bg-white text-gray-900 border-t border-gray-200 shadow-2xl'
      : 'bg-[#121212] text-white border-t border-white/10';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const controlBtnColor = theme === 'light' ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white';

  if (!currentTrack) {
    return (
      <div className={`h-full flex items-center justify-center px-4 ${subTextColor} ${playerBg}`}>
        <div className="text-xs sm:text-sm font-semibold truncate text-center">
          Search and click any song to start playing
        </div>
      </div>
    );
  }

  const albumArt =
    currentTrack.album?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600&h=600';

  return (
    <>
      {/* Hidden Audio Player */}
      {activeMediaUrl && (
        <div className="hidden">
          <ReactPlayer
            ref={playerRef}
            url={activeMediaUrl}
            playing={isPlaying}
            volume={volume}
            onProgress={(progress) => setPlayed(progress.played)}
            onDuration={(dur) => setDuration(dur)}
            onEnded={() => playNext()}
            config={{
              youtube: {
                playerVars: { showinfo: 0, controls: 0, disablekb: 1 },
              },
            }}
          />
        </div>
      )}

      {/* FULL-SCREEN / EXPANDED NOW PLAYING VIEW */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#065f46] via-[#09090b] to-[#040405] text-white flex flex-col justify-between p-4 sm:p-6 md:p-12 animate-fade-in-up backdrop-blur-3xl overflow-y-auto">
          {/* Header Drag Down Control */}
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 flex items-center gap-1 font-bold text-xs"
              title="Collapse Player"
            >
              <ChevronDown size={20} />
              <span className="hidden sm:inline">Minimize</span>
            </button>
            <div className="text-center px-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-spotify-base">
                Now Playing from Shubify
              </span>
              <p className="text-xs sm:text-sm font-bold text-gray-300 truncate max-w-[140px] sm:max-w-xs md:max-w-md">
                {currentTrack.album?.name || 'Bollywood Hits'}
              </p>
            </div>
            <button
              onClick={() => toggleLikeTrack(currentTrack)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110"
            >
              <Heart
                size={20}
                fill={isLiked(currentTrack?.id) ? '#1db954' : 'none'}
                className={isLiked(currentTrack?.id) ? 'text-spotify-base animate-pulse' : 'text-white'}
              />
            </button>
          </div>

          {/* Large Spinning Vinyl Art Center */}
          <div className="flex flex-col items-center justify-center my-3 sm:my-6 max-w-4xl mx-auto w-full">
            <div className="relative mb-4 sm:mb-8">
              <div
                className={`w-44 h-44 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full shadow-2xl overflow-hidden relative ring-4 sm:ring-8 ring-spotify-base/30 transition-transform ${
                  isPlaying ? 'animate-spin-slow ring-spotify-base/60' : 'ring-white/10'
                }`}
              >
                <img src={albumArt} alt={currentTrack.name} className="w-full h-full object-cover rounded-full" />
                {/* Vinyl Center Spindle */}
                <div className="absolute inset-0 m-auto w-8 h-8 sm:w-12 sm:h-12 bg-black rounded-full border-2 sm:border-4 border-white/40 shadow-2xl flex items-center justify-center pointer-events-none">
                  <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-spotify-base rounded-full" />
                </div>
              </div>
            </div>

            {/* Song Title & Equalizer */}
            <div className="text-center max-w-lg px-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-lg sm:text-3xl font-black tracking-tight text-white line-clamp-1">
                  {currentTrack.name}
                </h1>
                {isPlaying && (
                  <div className="flex items-end gap-1 h-5 sm:h-6 flex-shrink-0">
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-1" />
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-2" />
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-3" />
                    <span className="w-1 bg-spotify-base rounded-full equalizer-bar-4" />
                  </div>
                )}
              </div>
              <p className="text-sm sm:text-lg text-spotify-base font-extrabold mt-1 truncate">
                {currentTrack.artists?.map((a) => a.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Timeline & Controls */}
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 sm:gap-6">
            {/* Timeline Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="relative w-full h-2 group flex items-center cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.001"
                  value={played}
                  onChange={handleSeekChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-2 rounded-full overflow-hidden bg-white/20">
                  <div
                    className="h-full bg-spotify-base transition-all duration-75"
                    style={{ width: `${played * 100}%` }}
                  />
                </div>
                <div
                  className="absolute h-4 w-4 bg-white rounded-full opacity-100 shadow-xl pointer-events-none"
                  style={{ left: `calc(${played * 100}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-xs font-black text-gray-400">
                <span>{formatTime(duration * played)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls (Previous, Play/Pause, Next) */}
            <div className="flex items-center justify-center gap-8 sm:gap-10 px-4">
              <button
                onClick={playPrevious}
                className="text-white hover:text-spotify-base transition-all hover:scale-125"
                title="Previous"
              >
                <SkipBack size={28} fill="currentColor" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-spotify-base hover:bg-spotify-highlight text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <Loader2 size={26} className="animate-spin text-black" />
                ) : isPlaying ? (
                  <Pause size={26} fill="black" className="text-black" />
                ) : (
                  <Play size={26} fill="black" className="text-black ml-1" />
                )}
              </button>

              <button
                onClick={playNext}
                className="text-white hover:text-spotify-base transition-all hover:scale-125"
                title="Next"
              >
                <SkipForward size={28} fill="currentColor" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto w-full pt-1">
              <Volume2 size={18} className="text-gray-400" />
              <div className="relative w-full h-1.5 flex items-center cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/20">
                  <div className="h-full bg-spotify-base" style={{ width: `${volume * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MINI PLAYER BAR */}
      <div className={`h-full flex items-center justify-between px-3 md:px-4 relative select-none ${playerBg}`}>
        {/* Top Mini Progress Bar (Visible on mobile & desktop) */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-black/10 overflow-hidden">
          <div
            className="h-full bg-spotify-base transition-all duration-100"
            style={{ width: `${played * 100}%` }}
          />
        </div>

        {/* Desktop Expand Button */}
        <button
          onClick={() => setIsExpanded(true)}
          className="hidden md:flex absolute -top-3 left-1/2 -translate-x-1/2 bg-spotify-base hover:bg-spotify-highlight text-black text-[10px] sm:text-xs font-black px-3 sm:px-4 py-0.5 rounded-full shadow-xl border border-black/20 items-center gap-1 hover:scale-110 transition-all z-20"
          title="Click to View Full Screen Now Playing"
        >
          <ChevronUp size={12} className="animate-bounce" />
          <span>EXPAND</span>
          <ChevronUp size={12} className="animate-bounce" />
        </button>

        {/* Left: Track Info & Artwork */}
        <div
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2.5 sm:gap-4 flex-1 md:w-1/3 min-w-0 pr-2 cursor-pointer group"
          title="Tap to expand Now Playing"
        >
          <div
            onClick={() => setIsExpanded(true)}
            className={`w-11 h-11 sm:w-14 sm:h-14 bg-[#282828] flex-shrink-0 rounded-full shadow-lg overflow-hidden relative group cursor-pointer transition-transform hover:scale-105 ${
              isPlaying ? 'ring-2 ring-spotify-base animate-spin-slow' : 'ring-1 ring-white/20'
            }`}
            title="Click to view full screen Now Playing"
          >
            <img src={albumArt} alt={currentTrack.name} className="w-full h-full object-cover rounded-full" />
            <div className="absolute inset-0 m-auto w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full border border-white/40 shadow-inner pointer-events-none" />
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                <Loader2 className="w-4 h-4 text-spotify-base animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                onClick={() => setIsExpanded(true)}
                className={`text-xs sm:text-sm font-extrabold hover:underline truncate cursor-pointer ${textColor}`}
                title="Click to view full screen Now Playing"
              >
                {currentTrack.name}
              </span>
              {isPlaying && (
                <div className="hidden sm:flex items-end gap-0.5 h-3.5 flex-shrink-0 mb-0.5">
                  <span className="w-0.5 bg-spotify-base rounded-full equalizer-bar-1" />
                  <span className="w-0.5 bg-spotify-base rounded-full equalizer-bar-2" />
                  <span className="w-0.5 bg-spotify-base rounded-full equalizer-bar-3" />
                </div>
              )}
            </div>
            <span className={`text-[11px] sm:text-xs hover:underline truncate cursor-pointer ${subTextColor}`}>
              {currentTrack.artists?.map((a) => a.name).join(', ')}
            </span>
          </div>

          <button
            onClick={() => toggleLikeTrack(currentTrack)}
            className={`transition-transform hover:scale-125 flex-shrink-0 ${
              isLiked(currentTrack?.id) ? 'text-spotify-base' : `${subTextColor} hover:${textColor}`
            }`}
            title={isLiked(currentTrack?.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart
              size={18}
              fill={isLiked(currentTrack?.id) ? '#1db954' : 'none'}
              className={isLiked(currentTrack?.id) ? 'animate-pulse' : ''}
            />
          </button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 md:w-1/3">
          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={playPrevious} className={`${controlBtnColor} transition-all hover:scale-110 hidden sm:block`} title="Previous">
              <SkipBack size={18} fill="currentColor" />
            </button>

            <button
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:scale-110 transition-all shadow-lg bg-spotify-base text-black hover:bg-spotify-highlight"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-black" />
              ) : isPlaying ? (
                <Pause size={16} fill="black" className="text-black" />
              ) : (
                <Play size={16} fill="black" className="text-black ml-0.5" />
              )}
            </button>

            <button onClick={playNext} className={`${controlBtnColor} transition-all hover:scale-110`} title="Next">
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>

          {/* Progress Bar (Desktop / Tablet) */}
          <div className="hidden md:flex items-center gap-2 w-full max-w-[450px] mt-1">
            <span className={`text-[10px] min-w-[32px] text-right font-semibold ${subTextColor}`}>
              {formatTime(duration * played)}
            </span>

            <div className="relative w-full h-1.5 group flex items-center cursor-pointer">
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={played}
                onChange={handleSeekChange}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-300' : 'bg-[#4d4d4d]'}`}>
                <div
                  className="h-full bg-spotify-base transition-all duration-75"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
            </div>

            <span className={`text-[10px] min-w-[32px] font-semibold ${subTextColor}`}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Expand Full Screen Button (Desktop) */}
        <div className="hidden md:flex items-center justify-end gap-4 w-1/3 min-w-[180px]">
          <div className="flex items-center gap-2 w-20 group relative">
            <button className={`${controlBtnColor} transition-colors`} title="Volume">
              <Volume2 size={16} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute right-0 w-14 h-1 opacity-0 cursor-pointer z-10"
            />
            <div className={`w-14 h-1 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-300' : 'bg-[#4d4d4d]'}`}>
              <div
                className="h-full bg-spotify-base"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(true)}
            className={`${controlBtnColor} transition-all hover:scale-110 p-1.5 rounded-full hover:bg-white/10 flex items-center gap-1`}
            title="Expand to Full Screen View"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
