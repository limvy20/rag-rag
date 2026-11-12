import React from 'react';
import { MarketSymbol } from '../types/market';
import { Globe2 } from 'lucide-react';

interface GlobalIndicesProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  selectedSymbolId: string;
}

export const GlobalIndices: React.FC<GlobalIndicesProps> = ({
  symbols,
  onSelectSymbol,
  selectedSymbolId,
}) => {
  // Indices grouped
  const americas = symbols.filter((s) => ['SPX', 'NDX', 'DJI', 'RUT'].includes(s.symbol));
  const europe = symbols.filter((s) => ['DAX', 'FTSE'].includes(s.symbol));
  const asia = symbols.filter((s) => ['N225'].includes(s.symbol));

  const renderCard = (item: MarketSymbol) => {
    const isPositive = item.change >= 0;
    const isSelected = item.symbol === selectedSymbolId;

    const minVal = Math.min(...item.sparkline);
    const maxVal = Math.max(...item.sparkline);
    const range = maxVal - minVal || 1;
    const points = item.sparkline
      .map((val, idx) => {
        const x = (idx / (item.sparkline.length - 1)) * 50;
        const y = 16 - ((val - minVal) / range) * 14;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div
        key={item.symbol}
        onClick={() => onSelectSymbol(item.symbol)}
        className={`p-3 rounded-xl bg-[#f8f9fd] dark:bg-[#131722] border transition-all cursor-pointer hover:border-[#2962ff]/60 hover:bg-[#f0f3fa] dark:hover:bg-[#181c27] ${
          isSelected ? 'border-[#2962ff] ring-1 ring-[#2962ff]' : 'border-[#e0e3eb] dark:border-[#2a2e39]'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-[#131722] dark:text-white text-xs">{item.symbol}</span>
            <span className="text-[10px] text-[#787b86] font-medium truncate max-w-[90px]">{item.country}</span>
          </div>
          {/* Mini Sparkline */}
          <svg className="w-12 h-4 overflow-visible" viewBox="0 0 50 16">
            <polyline
              fill="none"
              stroke={isPositive ? '#089981' : '#f23645'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>

        <div className="text-[11px] text-[#787b86] truncate mb-2">{item.name}</div>

        <div className="flex items-baseline justify-between font-mono">
          <span className="text-sm font-bold text-[#131722] dark:text-white">
            {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span
            className={`text-xs font-bold ${
              isPositive ? 'text-[#089981]' : 'text-[#f23645]'
            }`}
          >
            {isPositive ? '+' : ''}
            {item.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 lg:p-5 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-[#131722] dark:text-white tracking-tight">World Benchmark Indices</h2>
        </div>
        <span className="text-xs text-[#787b86]">Americas · Europe · Asia</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {symbols.filter((s) => s.type === 'index').map(renderCard)}
      </div>
    </div>
  );
};
