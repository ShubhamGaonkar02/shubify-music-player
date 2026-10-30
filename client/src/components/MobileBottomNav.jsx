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
    { name: 'Your Library', path: '/library', icon: Library },
    { name: 'Liked', path: '/liked', icon: Heart },
  ];

  const bgStyle =
    theme === 'light'
      ? 'bg-white/95 text-slate-900 border-t border-slate-200 shadow-lg'
      : 'bg-[#121212]/95 text-white border-t border-[#282828]';

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 h-16 z-50 backdrop-blur-lg flex items-center justify-around px-2 transition-colors ${bgStyle}`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <button
              key={item.name}
              onClick={item.action}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all group"
              title="Identify Song (Shazam Radar)"
            >
              <div
                className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all shadow-sm ${
                  theme === 'light'
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 group-hover:bg-emerald-200'
                    : 'bg-white/10 text-white border border-white/15 group-hover:bg-white/20'
                }`}
              >
                <Icon size={16} className="text-[#1ed760] animate-pulse" />
                <span className="text-[11px] font-black">{item.name}</span>
              </div>
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
