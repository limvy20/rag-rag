import React from 'react';
import { Globe, BarChart2, DollarSign, Bitcoin, ArrowLeftRight, Flame, Landmark } from 'lucide-react';

interface MarketHeroProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  assetCountByCategory: Record<string, number>;
}

export const MarketHero: React.FC<MarketHeroProps> = ({
  activeCategory,
  setActiveCategory,
  assetCountByCategory,
}) => {
  const categories = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'index', label: 'Indices', icon: BarChart2 },
    { id: 'stock', label: 'Stocks', icon: DollarSign },
    { id: 'crypto', label: 'Crypto', icon: Bitcoin },
    { id: 'forex', label: 'Forex', icon: ArrowLeftRight },
    { id: 'commodity', label: 'Futures', icon: Flame },
    { id: 'bond', label: 'Bonds', icon: Landmark },
  ];

  return (
    <div className="pt-6 pb-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#131722] transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6">
        {/* Title & Market Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#787b86] mb-1 font-medium">
              <span>Markets</span>
              <span>/</span>
              <span className="text-[#131722] dark:text-[#d1d4dc] capitalize">{activeCategory}</span>
              <span>·</span>
              <span className="text-[#089981] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
                Live Trading Session
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#131722] dark:text-white tracking-tight">
              Markets overview
            </h1>
            <p className="text-sm text-[#787b86] mt-1 max-w-2xl">
              Track major global benchmarks, identify market leaders, analyze sector heatmaps, and discover emerging opportunities.
            </p>
          </div>

          {/* Quick Market Session Pill */}
          <div className="flex items-center gap-3 text-xs text-[#787b86] bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] px-3.5 py-2 rounded-lg shrink-0 shadow-sm">
            <div>
              <span className="text-[#131722] dark:text-white font-medium block">NYSE & NASDAQ</span>
              <span className="text-[11px] text-[#089981]">Regular Trading Hours</span>
            </div>
            <div className="h-6 w-px bg-[#e0e3eb] dark:bg-[#2a2e39]" />
            <div>
              <span className="text-[#131722] dark:text-white font-medium block">Crypto & FX</span>
              <span className="text-[11px] text-[#2962ff]">24/7 Global Liquidity</span>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs (TradingView style underline tabs) */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-[#e0e3eb] dark:border-[#2a2e39] -mb-4 pb-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = cat.id === 'overview' ? undefined : assetCountByCategory[cat.id];

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#2962ff] text-[#131722] dark:text-white font-semibold'
                    : 'border-transparent text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] hover:border-[#e0e3eb] dark:hover:border-[#363a45]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2962ff]' : 'text-[#787b86]'}`} />
                <span>{cat.label}</span>
                {count !== undefined && (
                  <span className="text-[11px] font-mono text-[#787b86] ml-0.5">({count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
