import React from 'react';
import { Search, Bookmark, Sun, Moon, Briefcase, TrendingUp } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  cashBalance: number;
  openPositionsCount: number;
  onOpenPaperTrade: () => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  cashBalance,
  openPositionsCount,
  onOpenPaperTrade,
  activeNavTab,
  setActiveNavTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#131722] dark:text-[#d1d4dc] transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand + Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          {/* TradingView Iconic Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveNavTab('overview')}>
            <svg className="w-8 h-8 text-[#2962ff] group-hover:scale-105 transition-transform" viewBox="0 0 36 28" fill="currentColor">
              {/* TradingView distinct 3 geometric shapes */}
              <rect x="0" y="4" width="8" height="20" rx="1.5" />
              <polygon points="12,24 20,4 20,24" />
              <rect x="24" y="10" width="8" height="14" rx="1.5" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-[#131722] dark:text-white font-['Plus_Jakarta_Sans']">
              TradingView
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-[#787b86] border-l border-[#e0e3eb] dark:border-[#2a2e39] pl-2.5 ml-0.5">
              Markets
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#787b86]">
            {['Products', 'Community', 'Markets', 'News', 'Brokers', 'More'].map((link) => {
              const isActive = link === 'Markets';
              return (
                <button
                  key={link}
                  onClick={() => {
                    if (link === 'Markets') setActiveNavTab('overview');
                  }}
                  className={`transition-colors whitespace-nowrap hover:text-[#131722] dark:hover:text-white ${
                    isActive ? 'text-[#131722] dark:text-white font-semibold' : ''
                  }`}
                >
                  {link}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center: Search Bar Trigger (⌘K) */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#f0f3fa] dark:bg-[#1e222d] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] border border-[#e0e3eb] dark:border-[#2a2e39] text-xs transition-all shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#787b86]" />
              <span className="truncate">Search markets, symbols, news (e.g. NVDA, SPX, BTC)</span>
            </div>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-[#131722] text-[#787b86] rounded border border-[#e0e3eb] dark:border-[#2a2e39] font-mono">
              /
            </kbd>
          </button>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] rounded-lg transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Paper Trading Account Badge */}
          <button
            onClick={onOpenPaperTrade}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f0f3fa] dark:bg-[#1e222d] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39] text-xs transition-colors"
            title="Open Paper Trading Terminal"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#2962ff]" />
            <div className="text-left hidden md:block">
              <span className="text-[10px] text-[#787b86] block leading-none">Paper Account</span>
              <span className="font-mono font-medium text-[#131722] dark:text-white text-xs">
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            {openPositionsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-[#2962ff] text-white rounded font-mono font-bold">
                {openPositionsCount}
              </span>
            )}
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={onToggleWatchlist}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#131722] dark:text-[#d1d4dc] hover:text-[#2962ff] dark:hover:text-white bg-[#f0f3fa] dark:bg-[#1e222d] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg transition-colors"
            title="Watchlist"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-[11px] font-mono text-[#787b86] font-semibold">({watchlistCount})</span>
            )}
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] rounded-lg transition-colors"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sign In / Launch Chart button */}
          <button
            onClick={onOpenPaperTrade}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg transition-colors shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trade</span>
          </button>
        </div>
      </div>
    </header>
  );
};
