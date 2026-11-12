import React, { useState, useEffect, useRef } from 'react';
import { MarketSymbol, AssetType } from '../types/market';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !isOpen) {
        // If not typing in input
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = symbols.filter((s) => {
    const matchesQuery =
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      (s.sector && s.sector.toLowerCase().includes(query.toLowerCase()));

    const matchesType = filterType === 'all' || s.type === filterType;
    return matchesQuery && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company or market (e.g. AAPL, NVDA, BTC, S&P 500)..."
            className="w-full bg-transparent text-[#131722] dark:text-white placeholder-[#787b86] text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#787b86] hover:text-[#131722] dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-[#787b86] hover:text-[#131722] dark:hover:text-white font-mono px-2 py-1 rounded bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]"
          >
            ESC
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 bg-[#f8f9fd] dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'stock', 'crypto', 'index', 'forex', 'commodity', 'bond'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                filterType === type
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#e0e3eb] dark:hover:bg-[#1e222d]'
              }`}
            >
              {type === 'all' ? 'All Assets' : type}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#2a2e39]/50 p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#787b86]">
              No instruments found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectSymbol(item.symbol);
                    onClose();
                  }}
                  className="p-3 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-center font-mono font-bold text-xs text-[#2962ff]">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962ff]">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-semibold text-[#787b86] uppercase px-1.5 py-0.2 rounded bg-[#f0f3fa] dark:bg-[#131722]">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-xs text-[#787b86] block truncate max-w-xs">{item.name}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-[#131722] dark:text-white">
                      {item.price >= 1000
                        ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : item.price.toFixed(item.price < 5 ? 4 : 2)}
                    </div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
