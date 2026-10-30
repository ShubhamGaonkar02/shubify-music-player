import React from 'react';
import { Home, Search, Library, Heart, Radio } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';

const MobileBottomNav = () => {
  const location = useLocation();
  const { theme, openIdentifierModal } = usePlayerStore();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Identify', isAction: true, action: openIdentifierModal, icon: Radio },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Liked', path: '/liked', icon: Heart },
  ];

  const bgStyle =
    theme === 'light'
      ? 'bg-white/95 text-slate-900 border-t border-slate-200 shadow-xl'
      : 'bg-[#121212]/95 text-white border-t border-white/10';

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 h-16 pb-[env(safe-area-inset-bottom,0px)] z-50 backdrop-blur-xl flex items-center justify-around px-1 transition-colors ${bgStyle}`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <button
              key={item.name}
              onClick={item.action}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all group active:scale-95"
              title="Identify Song (Shazam Radar)"
            >
              <div className="relative flex items-center justify-center">
                <Icon size={21} className="text-[#1ed760] animate-pulse group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1ed760] ring-2 ring-black" />
              </div>
              <span className="text-[10px] tracking-tight font-extrabold text-[#1ed760]">
                {item.name}
              </span>
            </button>
          );
        }

        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
              isActive
                ? 'text-spotify-base font-black scale-105'
                : theme === 'light'
                ? 'text-slate-500 font-semibold hover:text-slate-900'
                : 'text-gray-400 font-semibold hover:text-white'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-spotify-base fill-spotify-base/20' : ''} />
            <span className="text-[10px] tracking-tight truncate">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
