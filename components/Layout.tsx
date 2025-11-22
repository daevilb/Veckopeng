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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (stage === 'idle') {
      timer = setTimeout(() => {
        setVisible(true);
        setStage('walking-in');
      }, 4000);
    } else if (stage === 'walking-in') {
      timer = setTimeout(() => {
        setStage('dropping');
      }, 4000);
    } else if (stage === 'dropping') {
      timer = setTimeout(() => {
        setStage('walking-out');
      }, 1000);
    } else if (stage === 'walking-out') {
      timer = setTimeout(() => {
        setStage('bag-only');
        setVisible(false);
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [stage]);

  if (!visible && stage !== 'bag-only') return null;

  return (
    <div className="pointer-events-none fixed bottom-14 left-1/2 -translate-x-1/2 z-50 w-[200px] h-[60px] overflow-visible">
      {/* Alien */}
      <div 
        className={`absolute text-3xl transition-all duration-[4000ms] ease-linear ${
          stage === 'walking-in' ? 'left-[250px] opacity-100' :
          stage === 'dropping' ? 'left-1/2 translate-x-[-30px] opacity-100' :
          stage === 'walking-out' ? 'left-[-50px] opacity-0' :
          stage === 'bag-only' ? 'left-[-50px] opacity-0' :
          'left-[250px] opacity-0'
        }`}
      >
        👽
      </div>

      {/* Coffee cup dropping */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ${
          stage === 'dropping' ? 'top-6 opacity-100' : 'top-[-10px] opacity-0'
        }`}
      >
        ☕
      </div>

      {/* Static coffee cup on the ground */}
      {stage === 'bag-only' && (
        <div className="absolute left-1/2 -translate-x-1/2 top-6">
          ☕
        </div>
      )}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentUser, activeTab, onTabChange, onLogout }) => {
  const { isDarkMode, toggleTheme } = useTheme();
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Top Bar */}
      <header className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-xl bg-slate-900/80' : 'bg-gradient-to-b from-slate-950/80 to-slate-900/40'
      } border-b border-slate-800/60`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & App Name */}
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
                  {currentUser.role === 'parent'
                    ? 'Manage tasks & rewards for your family'
                    : 'Complete tasks, earn your weekly allowance'}
                </p>
              </div>
            </div>

            {/* Desktop nav + actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Tabs */}
              <nav className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-full bg-slate-900/40 border border-slate-700/60 shadow-inner shadow-slate-950/60">
                {tabs.filter(t => t.show).map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
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
                onClick={toggleTheme}
                className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-slate-900/60 border border-slate-700/70 hover:border-slate-500/80 hover:bg-slate-800/80 transition-colors duration-200 shadow-sm shadow-slate-950/40"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Moon
                    className={`absolute inset-0 transition-all duration-300 ${
                      isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                    }`}
                    size={18}
                  />
                  <Sun
                    className={`absolute inset-0 transition-all duration-300 ${
                      isDarkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                    }`}
                    size={18}
                  />
                </div>
              </button>

              {/* User info + logout */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800/70">
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-50">
                      {currentUser.name}
                    </span>
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
                onClick={toggleTheme}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700/70"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Moon
                    className={`absolute inset-0 transition-all duration-300 ${
                      isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                    }`}
                    size={18}
                  />
                  <Sun
                    className={`absolute inset-0 transition-all duration-300 ${
                      isDarkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                    }`}
                    size={18}
                  />
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

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
          {children}
        </div>
      </main>

      {/* Footer with BuyMeACoffee link for parents */}
      <footer className="hidden md:block pb-8 pt-4 text-center relative">
        {currentUser.role === 'parent' && (
          <>
            <a
              href="https://buymeacoffee.com/andersbergz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 transition-all relative z-20 hover:opacity-80"
            >
              <Coffee size={14} className="text-amber-600 dark:text-amber-500" />
              <span>Support the developer</span>
            </a>
            <AlienEasterEgg />
          </>
        )}
      </footer>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 flex items-center justify-evenly h-16 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
        {tabs.filter(t => t.show).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-16"
            >
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isActive ? 'scale-105 bg-emerald-500/15' : 'opacity-0'
                }`}
              />
              <div
                className={`relative z-10 w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-500/90 text-slate-950 shadow-lg shadow-emerald-500/40 translate-y-[-3px]'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-700/80'
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`relative z-10 mt-0.5 text-[10px] font-medium tracking-wide transition-all duration-300 ${
                  isActive ? 'text-emerald-300' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export { Layout };
