import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { Home, CheckSquare, Users, LogOut, Moon, Sun, Coffee } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

// Alien Easter Egg Component
const AlienEasterEgg = () => {
  const [stage, setStage] = useState<'idle' | 'walking-in' | 'dropping' | 'walking-out' | 'bag-only'>('idle');
  const [hovered, setHovered] = useState(false);

  // Reset the animation after it's done
  useEffect(() => {
    if (!hovered && stage === 'bag-only') {
      const timer = setTimeout(() => setStage('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, hovered]);

  const handleClick = () => {
    if (stage === 'idle' || stage === 'bag-only') {
      setStage('walking-in');
    }
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (stage === 'idle' || stage === 'bag-only') {
      setStage('walking-in');
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  // Handle stage transitions
  useEffect(() => {
    if (hovered) return; // Don't auto-advance if user is interacting
    
    let timer: NodeJS.Timeout;

    if (stage === 'walking-in') {
      // Walk in takes about 4s
      timer = setTimeout(() => setStage('dropping'), 4000);
    } else if (stage === 'dropping') {
      // Drop takes 1s
      timer = setTimeout(() => setStage('walking-out'), 1000);
    } else if (stage === 'walking-out') {
      // Walk out takes 4s
      timer = setTimeout(() => setStage('bag-only'), 4000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stage, hovered]);

  if (stage === 'idle') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-4 opacity-30">
          <div 
            className="inline-flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pointer-events-auto cursor-pointer hover:opacity-60 transition"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span>☕️ Click for a secret visitor</span>
          </div>
        </div>
      </div>
    );
  }

  const showAlien = stage === 'walking-in' || stage === 'dropping' || stage === 'walking-out';
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* The path and environment */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[420px] h-[200px] pointer-events-none">
        {/* Background environment */}
        <svg viewBox="0 0 420 200" className="w-full h-full">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="windowLight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="420" height="120" fill="url(#sky)" opacity="0.7" />

          {/* Stars */}
          <g opacity="0.7">
            <circle cx="40" cy="20" r="1.2" fill="#e5e7eb" />
            <circle cx="85" cy="40" r="0.8" fill="#e5e7eb" />
            <circle cx="140" cy="15" r="1" fill="#e5e7eb" />
            <circle cx="220" cy="35" r="1.1" fill="#e5e7eb" />
            <circle cx="300" cy="25" r="0.9" fill="#e5e7eb" />
            <circle cx="350" cy="10" r="1.3" fill="#e5e7eb" />
            <circle cx="380" cy="45" r="0.7" fill="#e5e7eb" />
          </g>

          {/* Distant buildings / skyline */}
          <g transform="translate(0, 60)" opacity="0.8">
            <rect x="10" y="20" width="40" height="40" fill="#020617" />
            <rect x="60" y="10" width="50" height="50" fill="#020617" />
            <rect x="120" y="25" width="60" height="35" fill="#020617" />
            <rect x="200" y="5" width="70" height="55" fill="#020617" />
            <rect x="290" y="15" width="50" height="45" fill="#020617" />
            <rect x="350" y="0" width="40" height="60" fill="#020617" />

            {/* Windows */}
            <rect x="20" y="25" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="35" y="35" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="70" y="15" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="85" y="30" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="135" y="30" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="155" y="35" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="215" y="15" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="235" y="35" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="300" y="25" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
            <rect x="365" y="10" width="5" height="5" fill="url(#windowLight)" opacity="0.8" />
          </g>

          {/* Ground */}
          <rect x="0" y="120" width="420" height="80" fill="url(#ground)" />

          {/* Path */}
          <path
            d="M 30 160 Q 210 120 390 160 L 390 200 L 30 200 Z"
            fill="#020617"
            stroke="#0f172a"
            strokeWidth="1"
          />

          {/* Coffee bag (static, remains after animation) */}
          {(stage === 'dropping' || stage === 'walking-out' || stage === 'bag-only') && (
            <g transform="translate(200, 135)">
              <rect x="-10" y="-18" width="20" height="24" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
              <rect x="-10" y="-22" width="20" height="6" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="1" />
              <circle cx="0" cy="-8" r="4.5" fill="#facc15" />
              <path d="M -2 -10 Q 0 -13 2 -10" fill="none" stroke="#92400e" strokeWidth="0.7" strokeLinecap="round" />
              <path d="M -2 -7 Q 0 -4 2 -7" fill="none" stroke="#92400e" strokeWidth="0.7" strokeLinecap="round" />
              <circle cx="-2" cy="-6" r="0.6" fill="#451a03" />
              <circle cx="2" cy="-6" r="0.6" fill="#451a03" />
              
              {/* Tiny text */}
              <path
                d="M -6 -2 Q 0 0 6 -2"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="0.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Landing beam when coffee drops */}
          {stage === 'dropping' && (
            <g>
              <defs>
                <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 210 50 L 240 120 L 180 120 Z"
                fill="url(#beam)"
                opacity="0.6"
              />
            </g>
          )}

          {/* Alien ship */}
          {showAlien && (
            <g>
              {/* Calculate ship position based on stage */}
              {(() => {
                let x = 420;
                let y = 60;
                
                if (stage === 'walking-in') {
                  x = 420 - 340; 
                } else if (stage === 'dropping') {
                  x = 80;
                } else if (stage === 'walking-out') {
                  x = 80 + 340;
                }

                return (
                  <g transform={`translate(${x}, ${y})`}>
                    {/* Main ship body */}
                    <ellipse cx="0" cy="0" rx="32" ry="12" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
                    <ellipse cx="0" cy="-6" rx="18" ry="10" fill="#22c55e" stroke="#bbf7d0" strokeWidth="1" />

                    {/* Lights */}
                    <circle cx="-18" cy="2" r="2" fill="#22c55e" opacity="0.7" />
                    <circle cx="-6" cy="4" r="2" fill="#22c55e" opacity="0.9" />
                    <circle cx="6" cy="4" r="2" fill="#22c55e" opacity="0.9" />
                    <circle cx="18" cy="2" r="2" fill="#22c55e" opacity="0.7" />

                    {/* Alien pilot */}
                    <g transform="translate(0,-10)">
                      <circle cx="0" cy="0" r="5" fill="#22c55e" />
                      <circle cx="-1.5" cy="-1" r="1" fill="#0f172a" />
                      <circle cx="1.5" cy="-1" r="1" fill="#0f172a" />
                      <path d="M -2 2 Q 0 3 2 2" fill="none" stroke="#0f172a" strokeWidth="0.7" strokeLinecap="round" />
                    </g>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentUser, activeTab, onTabChange, onLogout }) => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  const tabs = [
    { id: 'home', label: currentUser.role === 'parent' ? 'Overview' : 'My Week', icon: Home, show: true },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, show: true },
    { id: 'family', label: 'Family', icon: Users, show: currentUser.role === 'parent' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Glassmorphism top navigation */}
      <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl bg-slate-900/80' : 'bg-gradient-to-b from-slate-950/80 to-slate-900/40'} border-b border-slate-800/60`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and app name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <span className="text-xl font-black text-slate-950 drop-shadow-sm">V</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight text-slate-50 flex items-center gap-1.5">
                    Veckopeng
                    <span className="inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      BETA
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400">
                  {currentUser.role === 'parent' ? 'Manage tasks & rewards for your family' : 'Complete tasks, earn your weekly allowance'}
                </p>
              </div>
            </div>

            {/* Desktop navigation and actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Tab navigation */}
              <nav className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-full bg-slate-900/40 border border-slate-700/60 shadow-inner shadow-slate-950/60">
                {tabs.filter(t => t.show).map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-500/90 text-slate-950 shadow-lg shadow-emerald-500/40'
                          : 'text-slate-300/80 hover:bg-slate-800/80 hover:text-slate-50'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-slate-950' : ''} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Theme toggle */}
              <button
                onClick={handleThemeToggle}
                className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-slate-900/60 border border-slate-700/70 hover:border-slate-500/80 hover:bg-slate-800/80 transition-colors duration-200 shadow-sm shadow-slate-950/40"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Moon className={`absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} size={18} />
                  <Sun className={`absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} size={18} />
                </div>
              </button>

              {/* User info */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800/70">
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-50">{currentUser.name}</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-200 border border-slate-700/70">
                      {currentUser.role === 'parent' ? 'Parent' : 'Child'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {currentUser.role === 'parent' ? 'Family administrator' : 'Task hero'}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-500/90 hover:bg-red-500 text-white shadow-md shadow-red-500/40 transition-colors duration-200"
                  aria-label="Log out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={handleThemeToggle}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700/70"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Moon className={`absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} size={18} />
                  <Sun className={`absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} size={18} />
                </div>
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-500/90 hover:bg-red-500 text-white shadow-md shadow-red-500/40 transition-colors duration-200"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
          {children}
        </div>
      </main>

      {/* Footer with "Buy Me a Coffee" for Parents */}
      <footer className="hidden md:block pb-8 pt-4 text-center relative">
        {currentUser.role === 'parent' && (
          <>
            <a 
              href="https://buymeacoffee.com/andersbergz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 transition-all relative z-20"
            >
              <Coffee size={14} className="text-amber-600 dark:text-amber-500" />
              <span>Support the developer</span>
            </a>
            <AlienEasterEgg />
          </>
        )}
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 flex items-center justify-evenly h-16 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
        {tabs.filter(t => t.show).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-16"
            >
              {/* Background highlight */}
              <div className={`absolute inset-0 transition-all duration-300 ${isActive ? 'scale-105 bg-emerald-500/15' : 'opacity-0'}`} />
              
              {/* Icon circle */}
              <div className={`relative z-10 w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-emerald-500/90 text-slate-950 shadow-lg shadow-emerald-500/40 translate-y-[-3px]'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700/80'
              }`}>
                <Icon size={18} />
              </div>

              {/* Label */}
              <span className={`relative z-10 mt-0.5 text-[10px] font-medium tracking-wide transition-all duration-300 ${
                isActive ? 'text-emerald-300' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      {/* Mobile Footer Spacer */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export { Layout };
