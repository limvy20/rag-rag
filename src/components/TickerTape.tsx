import React from 'react';
import { MarketSymbol } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  selectedSymbolId: string;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ symbols, onSelectSymbol, selectedSymbolId }) => {
  // Take prominent symbols for the tape
  const tapeSymbols = symbols.filter((s) =>
    ['SPX', 'NDX', 'DJI', 'NVDA', 'AAPL', 'BTCUSD', 'ETHUSD', 'XAUUSD', 'CL', 'EURUSD', 'US10Y'].includes(s.symbol)
  );

  return (
    <div className="bg-white dark:bg-[#1e222d] border-b border-[#e0e3eb] dark:border-[#2a2e39] py-1.5 overflow-hidden select-none transition-colors">
      <div className="flex items-center overflow-x-auto scrollbar-none gap-2 px-4 whitespace-nowrap text-xs">
        {tapeSymbols.map((item) => {
          const isPositive = item.change >= 0;
          const isSelected = item.symbol === selectedSymbolId;

          // Simple SVG sparkline path
          const minVal = Math.min(...item.sparkline);
          const maxVal = Math.max(...item.sparkline);
          const range = maxVal - minVal || 1;
          const points = item.sparkline
            .map((val, idx) => {
              const x = (idx / (item.sparkline.length - 1)) * 36;
              const y = 14 - ((val - minVal) / range) * 12;
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`flex items-center gap-2.5 px-3 py-1 rounded transition-all shrink-0 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] ${
                isSelected ? 'bg-[#f0f3fa] dark:bg-[#2a2e39] ring-1 ring-[#2962ff]' : ''
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#131722] dark:text-white font-mono text-[11px]">{item.symbol}</span>
                <span className="text-[10px] text-[#787b86] hidden lg:inline max-w-[80px] truncate">{item.name}</span>
              </div>

              {/* Mini Sparkline */}
              <svg className="w-9 h-3.5 overflow-visible" viewBox="0 0 36 14">
                <polyline
                  fill="none"
                  stroke={isPositive ? '#089981' : '#f23645'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>

              {/* Price & Change */}
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-[#d1d4dc] font-medium">
                  {item.price >= 1000
                    ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : item.price.toFixed(item.price < 5 ? 4 : 2)}
                </span>
                <span
                  className={`flex items-center text-[10px] font-semibold ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
