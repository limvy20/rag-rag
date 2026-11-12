import React from 'react';
import { Gauge } from 'lucide-react';

interface TechnicalGaugeProps {
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  symbol: string;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ rating, symbol }) => {
  // Map rating to gauge needle angle (-70 deg to +70 deg)
  const angleMap: Record<string, number> = {
    'Strong Sell': -60,
    Sell: -30,
    Neutral: 0,
    Buy: 35,
    'Strong Buy': 65,
  };

  const needleAngle = angleMap[rating] || 0;

  // Numerical indicator counts
  const breakdown = {
    'Strong Buy': { buy: 16, neutral: 6, sell: 2 },
    Buy: { buy: 13, neutral: 8, sell: 3 },
    Neutral: { buy: 8, neutral: 10, sell: 6 },
    Sell: { buy: 3, neutral: 7, sell: 14 },
    'Strong Sell': { buy: 1, neutral: 5, sell: 18 },
  }[rating] || { buy: 10, neutral: 8, sell: 6 };

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 shadow-sm flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-xs font-bold text-[#131722] dark:text-white tracking-tight uppercase">Technical Summary</h3>
        </div>
        <span className="text-[10px] text-[#787b86] font-mono">1D Interval</span>
      </div>

      {/* Speedometer Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 90">
          {/* Gauge Arc Segments */}
          {/* Strong Sell (Red) */}
          <path
            d="M 20 80 A 60 60 0 0 1 45 35"
            fill="none"
            stroke="#f23645"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Sell (Soft Red) */}
          <path
            d="M 50 30 A 60 60 0 0 1 75 20"
            fill="none"
            stroke="#b82936"
            strokeWidth="10"
          />
          {/* Neutral (Gray) */}
          <path
            d="M 80 20 A 60 60 0 0 1 95 23"
            fill="none"
            stroke="#787b86"
            strokeWidth="10"
          />
          {/* Buy (Soft Green) */}
          <path
            d="M 100 25 A 60 60 0 0 1 120 40"
            fill="none"
            stroke="#0da88f"
            strokeWidth="10"
          />
          {/* Strong Buy (Emerald) */}
          <path
            d="M 125 45 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="#089981"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Needle Pivot & Needle */}
          <g
            transform={`translate(80, 80) rotate(${needleAngle})`}
            className="transition-transform duration-500 ease-out"
          >
            <polygon points="-3,-10 3,-10 0,-56" fill="#ffffff" />
            <circle cx="0" cy="0" r="6" fill="#2962ff" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Current Rating Label */}
        <div className="mt-1 text-center">
          <span
            className={`text-sm font-extrabold uppercase font-mono tracking-wide ${
              rating === 'Strong Buy'
                ? 'text-[#089981]'
                : rating === 'Buy'
                ? 'text-[#0da88f]'
                : rating === 'Sell' || rating === 'Strong Sell'
                ? 'text-[#f23645]'
                : 'text-[#d1d4dc]'
            }`}
          >
            {rating}
          </span>
        </div>
      </div>

      {/* Oscillators vs Moving Averages summary pills */}
      <div className="grid grid-cols-3 gap-1 text-center font-mono text-[11px] pt-3 border-t border-[#e0e3eb] dark:border-[#2a2e39]">
        <div className="p-1.5 rounded bg-[#f0f3fa] dark:bg-[#131722]">
          <span className="block text-[9px] uppercase font-sans text-[#787b86]">Sell</span>
          <span className="font-bold text-[#f23645]">{breakdown.sell}</span>
        </div>
        <div className="p-1.5 rounded bg-[#f0f3fa] dark:bg-[#131722]">
          <span className="block text-[9px] uppercase font-sans text-[#787b86]">Neutral</span>
          <span className="font-bold text-[#787b86]">{breakdown.neutral}</span>
        </div>
        <div className="p-1.5 rounded bg-[#f0f3fa] dark:bg-[#131722]">
          <span className="block text-[9px] uppercase font-sans text-[#787b86]">Buy</span>
          <span className="font-bold text-[#089981]">{breakdown.buy}</span>
        </div>
      </div>
    </div>
  );
};
