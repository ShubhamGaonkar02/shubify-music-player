import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Radio, Play, Heart, RotateCcw, Sparkles, AlertCircle, Music, Volume2, Check } from 'lucide-react';
import axios from 'axios';
import { usePlayerStore } from '../store/playerStore';
import { searchSpotify } from '../api/spotify';

const SongIdentifierModal = ({ isOpen, onClose }) => {
  const { theme, playTrackList, toggleLikeTrack, isLiked } = usePlayerStore();

  const [mode, setMode] = useState('listen'); // 'listen' (Shazam audio) or 'hum' (voice/speech)
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'analyzing' | 'found' | 'not_found' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [matchedTrack, setMatchedTrack] = useState(null);
  const [speechTranscript, setSpeechTranscript] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setMatchedTrack(null);
      setErrorMessage('');
      setCountdown(5);
      setSpeechTranscript('');
    } else {
      stopAllAudio();
    }
  }, [isOpen]);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const pcmChunksRef = useRef([]);

  const stopAllAudio = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {}
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // 1. Audio Recognition (Direct 44.1kHz PCM for Shazam + WebM for AudD fallback)
  const startAudioListening = async () => {
    setStatus('listening');
    setErrorMessage('');
    setMatchedTrack(null);
    setCountdown(5);
    audioChunksRef.current = [];
    pcmChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          echoCancellation: true,
        },
      });
      streamRef.current = stream;

      // Direct Web Audio API PCM capture (bypasses browser WebM container encoding/decoding errors)
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContextClass({ sampleRate: 44100 });
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          const channel = e.inputBuffer.getChannelData(0);
          pcmChunksRef.current.push(new Float32Array(channel));
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);
      } catch (audioCtxErr) {
        console.warn('AudioContext direct PCM capture notice:', audioCtxErr);
      }

      // MediaRecorder as backup audio blob
      try {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorder.start(250);
      } catch (recErr) {
        console.warn('MediaRecorder notice:', recErr);
      }

      let timeLeft = 5;
      timerRef.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timerRef.current);
          finishAudioCapture();
        }
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      setStatus('error');
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser settings to identify songs.'
          : 'Could not access your microphone. Please check your audio input device.'
      );
    }
  };

  const finishAudioCapture = async () => {
    setStatus('analyzing');

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {}
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // Convert raw PCM float samples to 16-bit signed PCM (Little-Endian) Base64
    let base64Audio = '';
    const pcmChunks = pcmChunksRef.current;
    if (pcmChunks.length > 0) {
      const totalSamples = pcmChunks.reduce((acc, c) => acc + c.length, 0);
      const maxSamples = Math.min(totalSamples, 44100 * 4.5);
      const merged = new Float32Array(maxSamples);
      let offset = 0;
      for (const chunk of pcmChunks) {
        if (offset >= maxSamples) break;
        const toCopy = Math.min(chunk.length, maxSamples - offset);
        merged.set(chunk.subarray(0, toCopy), offset);
        offset += toCopy;
      }

      const pcmBuffer = new ArrayBuffer(merged.length * 2);
      const view = new DataView(pcmBuffer);
      for (let i = 0; i < merged.length; i++) {
        const s = Math.max(-1, Math.min(1, merged[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }

      const bytes = new Uint8Array(pcmBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      }
      base64Audio = btoa(binary);
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || 'audio/webm' });
    await analyzeAudioData(base64Audio, audioBlob);
  };

  const handleMatchedTrack = async (title, subtitle, coverUrl) => {
    const searchRes = await searchSpotify(`${title} ${subtitle}`);
    const foundItem = searchRes?.tracks?.items?.[0];

    if (foundItem) {
      setMatchedTrack(foundItem);
    } else {
      setMatchedTrack({
        id: `identified-${Date.now()}`,
        name: title,
        artists: [{ name: subtitle }],
        album: {
          name: 'Identified Track',
          images: [{ url: coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600' }],
        },
        duration_ms: 180000,
      });
    }
    setStatus('found');
  };

  // Music Recognition: Uses Vercel Serverless proxy (bypassing CORS) with Shazam & AudD fallback
  const analyzeAudioData = async (base64Audio, blob) => {
    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;

    // 1. Try Vercel Serverless Proxy (/api/shazam-detect) - Bypasses browser CORS restrictions!
    if (base64Audio) {
      try {
        const response = await axios.post('/api/shazam-detect', base64Audio, {
          headers: { 'Content-Type': 'text/plain' },
          timeout: 12000,
        });

        if (response.data?.matches?.length > 0 && response.data.track) {
          const { title, subtitle, images, share } = response.data.track;
          await handleMatchedTrack(title, subtitle, images?.coverart || share?.image);
          return;
        }
      } catch (proxyErr) {
        console.warn('Vercel Shazam proxy notice:', proxyErr?.response?.data || proxyErr?.message);
      }

      // 2. Direct RapidAPI call fallback (if key is in frontend)
      if (rapidApiKey) {
        try {
          const response = await axios.post(
            'https://shazam.p.rapidapi.com/songs/v2/detect',
            base64Audio,
            {
              headers: {
                'content-type': 'text/plain',
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
              },
              timeout: 12000,
            }
          );

          if (response.data?.matches?.length > 0 && response.data.track) {
            const { title, subtitle, images, share } = response.data.track;
            await handleMatchedTrack(title, subtitle, images?.coverart || share?.image);
            return;
          }
        } catch (shazamErr) {
          console.warn('Direct Shazam call notice:', shazamErr?.message);
        }
      }
    }

    // 3. Fallback to AudD API
    try {
      const formData = new FormData();
      formData.append('file', blob);
      const apiToken = import.meta.env.VITE_AUDD_API_KEY || 'test';
      formData.append('api_token', apiToken);
      formData.append('return', 'apple_music,spotify');

      const response = await axios.post('https://api.audd.io/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15000,
      });

      const data = response.data;
      if (data && data.status === 'success' && data.result) {
        const { title, artist, album } = data.result;
        await handleMatchedTrack(title, artist, data.result.apple_music?.artwork?.url?.replace('{w}x{h}', '600x600'));
      } else {
        setStatus('not_found');
      }
    } catch (err) {
      console.warn('Audio recognition fallback error:', err);
      setStatus('not_found');
    }
  };

  // 2. Hum or Speak Mode (Web Speech Recognition)
  const startHummingRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('error');
      setErrorMessage('Voice recognition is not supported in this browser. Please use Chrome or Safari, or switch to the Audio Listening mode.');
      return;
    }

    setStatus('listening');
    setSpeechTranscript('');
    setErrorMessage('');
    setMatchedTrack(null);

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setSpeechTranscript(transcript);
    };

    recognition.onerror = (e) => {
      console.warn('Speech error:', e);
      if (e.error !== 'no-speech') {
        setStatus('error');
        setErrorMessage('Could not hear anything clearly. Please try speaking closer to your microphone.');
      }
    };

    recognition.onend = async () => {
      setStatus('analyzing');
      const query = speechTranscript.trim();
      if (!query) {
        setStatus('not_found');
        return;
      }

      try {
        const searchRes = await searchSpotify(query);
        const foundItem = searchRes?.tracks?.items?.[0];
        if (foundItem) {
          setMatchedTrack(foundItem);
          setStatus('found');
        } else {
          setStatus('not_found');
        }
      } catch (err) {
        setStatus('not_found');
      }
    };

    recognition.start();
  };

  const handlePlayMatchedTrack = () => {
    if (matchedTrack) {
      playTrackList([matchedTrack], 0);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto no-scrollbar">
      <div
        className={`w-full max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative shadow-2xl border transition-all duration-300 max-h-[92vh] overflow-y-auto overflow-x-hidden no-scrollbar ${
          isLight
            ? 'bg-white border-emerald-200 text-slate-900 shadow-[0_20px_50px_rgba(29,185,84,0.15)]'
            : 'bg-[#121214] border-white/10 text-white shadow-2xl'
        }`}
      >
        {/* Ambient background glow inside modal */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1ed760]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors z-20 ${
            isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800' : 'hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-[#1ed760]/15 text-[#1ed760]">
              <Radio size={20} className="animate-pulse" />
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-[#1ed760]">
              Shubify Audio Radar
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Song Identifier</h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            Identify songs playing around you or hum to find music
          </p>

          {/* Mode Switcher Tabs */}
          <div className={`mt-4 flex p-1 rounded-2xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'}`}>
            <button
              onClick={() => {
                setMode('listen');
                setStatus('idle');
                stopAllAudio();
              }}
              className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${
                mode === 'listen'
                  ? 'bg-[#1ed760] text-black shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎧 Shazam
            </button>
            <button
              onClick={() => {
                setMode('hum');
                setStatus('idle');
                stopAllAudio();
              }}
              className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${
                mode === 'hum'
                  ? 'bg-[#1ed760] text-black shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎤 Hum Song
            </button>
          </div>
        </div>

        {/* Center Interactive Content Area */}
        <div className="flex flex-col items-center justify-center my-6 min-h-[220px] relative z-10">
          {/* STATE: IDLE */}
          {status === 'idle' && (
            <div className="flex flex-col items-center text-center">
              <button
                onClick={mode === 'listen' ? startAudioListening : startHummingRecognition}
                className="group relative w-32 h-32 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xl"
              >
                {/* Concentric subtle idle pulse rings */}
                <div className="absolute inset-0 rounded-full bg-[#1ed760]/20 animate-ping opacity-60" />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#1ed760] to-emerald-400 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />

                {/* Main Pulsing Core Button */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#1ed760] to-emerald-400 text-black flex flex-col items-center justify-center shadow-xl">
                  {mode === 'listen' ? (
                    <Radio size={42} className="text-black group-hover:scale-110 transition-transform" />
                  ) : (
                    <Mic size={42} className="text-black group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-[11px] font-black uppercase tracking-wider mt-1 text-black">
                    Tap to Listen
                  </span>
                </div>
              </button>
              <p className={`text-xs mt-5 font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {mode === 'listen'
                  ? 'Play music out loud or on another speaker, then tap the button'
                  : 'Tap and sing or say the title / lyrics of the song'}
              </p>
            </div>
          )}

          {/* STATE: LISTENING (Pulsating Radar Waves) */}
          {status === 'listening' && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* 3 Concentric radar ripple rings */}
                <div className="absolute inset-0 rounded-full border-2 border-[#1ed760] animate-ping opacity-75" />
                <div className="absolute -inset-4 rounded-full border-2 border-[#1ed760]/60 animate-pulse duration-1000" />
                <div className="absolute -inset-8 rounded-full border border-[#1ed760]/30 animate-pulse duration-700" />

                <div className="w-24 h-24 rounded-full bg-[#1ed760] text-black flex flex-col items-center justify-center shadow-2xl relative z-10 animate-bounce-subtle">
                  {mode === 'listen' ? (
                    <>
                      <Volume2 size={32} className="animate-pulse" />
                      <span className="text-xs font-black mt-1">{countdown}s</span>
                    </>
                  ) : (
                    <>
                      <Mic size={32} className="animate-pulse" />
                      <span className="text-[10px] font-black mt-1">Listening...</span>
                    </>
                  )}
                </div>
              </div>

              {/* Animated Equalizer Bars */}
              <div className="flex items-center gap-1.5 mt-6 h-6">
                <span className="w-1.5 h-6 bg-[#1ed760] rounded-full wave-beat-1" />
                <span className="w-1.5 h-6 bg-[#1ed760] rounded-full wave-beat-2" />
                <span className="w-1.5 h-6 bg-[#1ed760] rounded-full wave-beat-3" />
                <span className="w-1.5 h-6 bg-[#1ed760] rounded-full wave-beat-4" />
                <span className="w-1.5 h-6 bg-[#1ed760] rounded-full wave-beat-5" />
              </div>

              <p className="text-sm font-bold mt-3 text-[#1ed760]">
                {mode === 'listen' ? 'Listening for music nearby...' : 'Listening to your voice...'}
              </p>
              {speechTranscript && (
                <p className="text-xs text-gray-400 mt-1 italic max-w-xs truncate">"{speechTranscript}"</p>
              )}
            </div>
          )}

          {/* STATE: ANALYZING */}
          {status === 'analyzing' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#1ed760]/30 border-t-[#1ed760] animate-spin mb-4" />
              <h3 className="text-lg font-black tracking-tight">Identifying Track...</h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Comparing audio fingerprint against millions of songs
              </p>
            </div>
          )}

          {/* STATE: FOUND */}
          {status === 'found' && matchedTrack && (
            <div className="w-full flex flex-col items-center animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1ed760] bg-[#1ed760]/10 px-3 py-1 rounded-full mb-3">
                <Sparkles size={14} />
                <span>Song Identified!</span>
              </div>

              {/* Track Card */}
              <div
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 shadow-lg ${
                  isLight ? 'bg-slate-50 border-emerald-200' : 'bg-white/5 border-white/10'
                }`}
              >
                <img
                  src={
                    matchedTrack.album?.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600&h=600'
                  }
                  alt={matchedTrack.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-base sm:text-lg font-black truncate">{matchedTrack.name}</h4>
                  <p className={`text-xs sm:text-sm font-semibold truncate ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    {matchedTrack.artists?.map((a) => a.name).join(', ')}
                  </p>
                  <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                    {matchedTrack.album?.name}
                  </p>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLikeTrack(matchedTrack)}
                  className={`p-2.5 rounded-full transition-colors ${
                    isLiked(matchedTrack.id)
                      ? 'text-[#1ed760]'
                      : isLight
                      ? 'text-slate-400 hover:text-red-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={isLiked(matchedTrack.id) ? 'Unlike' : 'Like'}
                >
                  <Heart size={20} fill={isLiked(matchedTrack.id) ? '#1ed760' : 'none'} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-4">
                <button
                  onClick={handlePlayMatchedTrack}
                  className="flex-1 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-sm py-3 px-5 rounded-full flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Play size={18} fill="black" />
                  <span>Play on Shubify</span>
                </button>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setMatchedTrack(null);
                  }}
                  className={`px-4 py-3 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isLight ? 'border-slate-300 hover:bg-slate-100' : 'border-white/10 hover:bg-white/10'
                  }`}
                  title="Identify Another"
                >
                  <RotateCcw size={16} />
                  <span className="hidden sm:inline">Again</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE: NOT FOUND */}
          {status === 'not_found' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                <Music size={28} />
              </div>
              <h3 className="text-base font-black">Couldn't catch that song</h3>
              <p className={`text-xs mt-1 max-w-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                Try holding your device closer to the speaker or use the <strong>"Hum or Speak"</strong> tab to sing the lyrics!
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow transition-transform hover:scale-105"
              >
                <RotateCcw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* STATE: ERROR */}
          {status === 'error' && (
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-3">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-base font-black text-red-400">Microphone Issue</h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{errorMessage}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs px-6 py-2.5 rounded-full shadow transition-transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer info badge */}
        <div className={`pt-3 border-t flex items-center justify-center gap-2 text-[10px] font-semibold ${isLight ? 'border-slate-100 text-slate-400' : 'border-white/5 text-gray-500'}`}>
          <Sparkles size={12} className="text-[#1ed760]" />
          <span>Powered by Shazam Radar & Shubify Stream Engine</span>
        </div>
      </div>
    </div>
  );
};

export default SongIdentifierModal;
