import React from 'react';
import { MarketSymbol } from '../types/market';
import { X, Trash2, Bookmark, Plus } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  selectedSymbolId: string;
  onOpenSearch: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  symbols,
  onSelectSymbol,
  onRemoveFromWatchlist,
  selectedSymbolId,
  onOpenSearch,
}) => {
  if (!isOpen) return null;

  const watchlistSymbols = symbols.filter((s) => watchlist.includes(s.symbol));

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white dark:bg-[#1e222d] border-l border-[#e0e3eb] dark:border-[#2a2e39] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 transition-colors">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-sm font-bold text-[#131722] dark:text-white tracking-tight">Watchlist</h2>
          <span className="text-xs font-mono text-[#787b86]">({watchlist.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-1.5 rounded hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-white transition-colors"
            title="Add Symbol"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-white transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50 p-2">
        {watchlistSymbols.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#787b86] px-4">
            <Bookmark className="w-8 h-8 text-[#787b86]/50 mx-auto mb-3" />
            <p className="font-medium text-white mb-1">Your watchlist is empty</p>
            <p className="text-[11px] mb-4">Click the bookmark icon on any ticker or screener row to track it here.</p>
            <button
              onClick={onOpenSearch}
              className="px-3 py-1.5 rounded-lg bg-[#2962ff] text-white font-semibold text-xs"
            >
              Browse Instruments
            </button>
          </div>
        ) : (
          watchlistSymbols.map((item) => {
            const isPositive = item.change >= 0;
            const isSelected = item.symbol === selectedSymbolId;

            // Mini sparkline
            const minVal = Math.min(...item.sparkline);
            const maxVal = Math.max(...item.sparkline);
            const range = maxVal - minVal || 1;
            const points = item.sparkline
              .map((val, idx) => {
                const x = (idx / (item.sparkline.length - 1)) * 40;
                const y = 14 - ((val - minVal) / range) * 12;
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className={`p-3 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] cursor-pointer flex items-center justify-between transition-colors group ${
                  isSelected ? 'bg-[#f0f3fa] dark:bg-[#2a2e39]/60 border-l-2 border-[#2962ff]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#131722] dark:text-white text-xs">{item.symbol}</span>
                    <span className="text-[10px] uppercase font-semibold text-[#787b86] px-1 rounded bg-[#f0f3fa] dark:bg-[#131722]">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#787b86] block truncate max-w-[130px]">{item.name}</span>
                </div>

                {/* Sparkline */}
                <svg className="w-10 h-3.5 overflow-visible" viewBox="0 0 40 14">
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#089981' : '#f23645'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>

                {/* Price and remove button */}
                <div className="flex items-center gap-2">
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-[#131722] dark:text-white">
                      {item.price >= 1000
                        ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : item.price.toFixed(item.price < 5 ? 4 : 2)}
                    </div>
                    <div
                      className={`text-[10px] font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(item.symbol);
                    }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[#131722] text-[#787b86] hover:text-[#f23645] transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
