import React from 'react';
import { MarketSymbol } from '../types/market';
import { Info, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface SymbolProfileCardProps {
  symbol: MarketSymbol;
}

export const SymbolProfileCard: React.FC<SymbolProfileCardProps> = ({ symbol }) => {
  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 shadow-sm flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-xs font-bold text-[#131722] dark:text-white tracking-tight uppercase">Key Statistics</h3>
          </div>
          <span className="text-[10px] text-[#787b86] font-mono">{symbol.currency || 'USD'}</span>
        </div>

        {symbol.description && (
          <p className="text-xs text-[#787b86] line-clamp-3 leading-relaxed mb-3">
            {symbol.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
            <span className="text-[10px] text-[#787b86] block font-sans">Market Cap</span>
            <span className="text-[#131722] dark:text-white font-bold">{symbol.marketCap ? '$' + symbol.marketCap : '—'}</span>
          </div>

          <div className="p-2 rounded bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
            <span className="text-[10px] text-[#787b86] block font-sans">P/E Ratio</span>
            <span className="text-[#131722] dark:text-white font-bold">{symbol.peRatio ? symbol.peRatio.toFixed(1) : '—'}</span>
          </div>

          <div className="p-2 rounded bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
            <span className="text-[10px] text-[#787b86] block font-sans">24h Volume</span>
            <span className="text-[#131722] dark:text-white font-bold">{symbol.volume}</span>
          </div>

          <div className="p-2 rounded bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
            <span className="text-[10px] text-[#787b86] block font-sans">Sector / Group</span>
            <span className="text-[#131722] dark:text-white font-bold truncate block">{symbol.sector || symbol.type.toUpperCase()}</span>
          </div>

          <div className="p-2 rounded bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
            <span className="text-[10px] text-[#787b86] block font-sans">Day High</span>
            <span className="text-[#131722] dark:text-white font-bold">${symbol.high.toFixed(symbol.price < 5 ? 4 : 2)}</span>
          </div>

          <div className="p-2 rounded bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
            <span className="text-[10px] text-[#787b86] block font-sans">Day Low</span>
            <span className="text-[#131722] dark:text-white font-bold">${symbol.low.toFixed(symbol.price < 5 ? 4 : 2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
