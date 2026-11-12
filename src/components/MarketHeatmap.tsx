import React, { useState } from 'react';
import { HeatmapItem } from '../types/market';
import { HEATMAP_DATA } from '../data/mockMarketData';
import { LayoutGrid, ZoomIn, Clock, BarChart3 } from 'lucide-react';

interface MarketHeatmapProps {
  onSelectSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ onSelectSymbol }) => {
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');
  const [performancePeriod, setPerformancePeriod] = useState<'1D' | '1W' | '1M' | 'PE'>('1D');
  const [hoveredItem, setHoveredItem] = useState<HeatmapItem | null>(null);

  const sectors = ['All', 'Technology', 'Communication Services', 'Consumer Cyclical', 'Financials', 'Healthcare', 'Energy & Industrials'];

  const filteredItems = selectedSectorFilter === 'All'
    ? HEATMAP_DATA
    : HEATMAP_DATA.filter((i) => i.sector === selectedSectorFilter);

  // Group items by sector
  const sectorGroups = React.useMemo(() => {
    const groups: Record<string, HeatmapItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.sector]) groups[item.sector] = [];
      groups[item.sector].push(item);
    });
    return groups;
  }, [filteredItems]);

  const getValue = (item: HeatmapItem) => {
    if (performancePeriod === '1W') return item.change1w || item.changePercent * 2;
    if (performancePeriod === '1M') return item.change1m || item.changePercent * 4;
    if (performancePeriod === 'PE') return item.peRatio || 30;
    return item.changePercent;
  };

  const getColorClass = (val: number) => {
    if (performancePeriod === 'PE') {
      // P/E valuation coloring: low PE = green (value), high PE = blue/orange
      if (val < 20) return 'bg-[#089981] text-white hover:brightness-110';
      if (val < 35) return 'bg-[#0da88f] text-white hover:brightness-110';
      if (val < 50) return 'bg-[#2962ff] text-white hover:brightness-110';
      return 'bg-[#f59e0b] text-white hover:brightness-110';
    }

    if (val >= 3.0) return 'bg-[#089981] text-white hover:brightness-110';
    if (val >= 1.5) return 'bg-[#0b8672] text-white hover:brightness-110';
    if (val > 0) return 'bg-[#126b5c] text-white/95 hover:brightness-110';
    if (val === 0) return 'bg-[#2a2e39] text-[#787b86] hover:brightness-110';
    if (val > -1.5) return 'bg-[#85252e] text-white/95 hover:brightness-110';
    if (val > -3.0) return 'bg-[#b82936] text-white hover:brightness-110';
    return 'bg-[#f23645] text-white hover:brightness-110';
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 lg:p-5 shadow-sm transition-colors">
      {/* Header & Sector Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-[#131722] dark:text-white tracking-tight">
              S&P 500 Market Heatmap (Treemap)
            </h2>
            <span className="text-[10px] font-bold text-[#2962ff] px-1.5 py-0.2 rounded bg-[#2962ff]/10">
              PRO
            </span>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            Sized by market capitalization, colored by {performancePeriod === 'PE' ? 'P/E multiple' : `${performancePeriod} return`}
          </p>
        </div>

        {/* Period Selector + Sector Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Selector */}
          <div className="flex items-center bg-[#f0f3fa] dark:bg-[#131722] p-0.5 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] text-xs">
            {(['1D', '1W', '1M', 'PE'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setPerformancePeriod(period)}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  performancePeriod === period
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                {period === 'PE' ? 'P/E Ratio' : period}
              </button>
            ))}
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSectorFilter(sec)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedSectorFilter === sec
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'bg-[#f0f3fa] dark:bg-[#131722] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="space-y-4">
        {Object.entries(sectorGroups).map(([sectorName, items]) => {
          const totalCap = items.reduce((sum, item) => sum + item.marketCap, 0);

          return (
            <div key={sectorName} className="bg-[#f8f9fd] dark:bg-[#131722] rounded-lg p-2.5 border border-[#e0e3eb] dark:border-[#2a2e39]">
              <div className="flex items-center justify-between text-xs text-[#787b86] font-semibold uppercase tracking-wider mb-2 px-1">
                <span>{sectorName}</span>
                <span className="font-mono text-[11px] text-[#787b86]">${(totalCap / 1000).toFixed(2)}T</span>
              </div>

              {/* Tiles in this sector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                {items.map((item) => {
                  const val = getValue(item);
                  const isPositive = val >= 0;
                  const isMega = item.marketCap > 1000;

                  return (
                    <div
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`relative p-3 rounded-md transition-all cursor-pointer flex flex-col justify-between min-h-[75px] shadow-sm ${
                        isMega ? 'sm:col-span-2' : ''
                      } ${getColorClass(val)}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono font-bold text-sm tracking-tight">{item.symbol}</span>
                        <span className="text-[10px] font-mono opacity-80">
                          ${item.marketCap >= 1000 ? (item.marketCap / 1000).toFixed(1) + 'T' : item.marketCap + 'B'}
                        </span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between font-mono">
                        <span className="text-xs font-semibold">${item.price.toFixed(2)}</span>
                        <span className="text-xs font-extrabold">
                          {performancePeriod === 'PE' ? (
                            `${val.toFixed(1)}x`
                          ) : (
                            `${isPositive ? '+' : ''}${val.toFixed(2)}%`
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Legend Bar */}
      <div className="mt-4 pt-3 border-t border-[#e0e3eb] dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-xs text-[#787b86]">
        <div className="flex items-center gap-2">
          <span>{performancePeriod === 'PE' ? 'Valuation Multiple:' : 'Performance Spectrum:'}</span>
          {performancePeriod === 'PE' ? (
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-[#089981] text-white">&lt;20x</span>
              <span className="px-1.5 py-0.5 rounded bg-[#0da88f] text-white">20-35x</span>
              <span className="px-1.5 py-0.5 rounded bg-[#2962ff] text-white">35-50x</span>
              <span className="px-1.5 py-0.5 rounded bg-[#f59e0b] text-white">&gt;50x</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-[#f23645] text-white">-3%</span>
              <span className="px-1.5 py-0.5 rounded bg-[#b82936] text-white">-1.5%</span>
              <span className="px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86]">0%</span>
              <span className="px-1.5 py-0.5 rounded bg-[#0b8672] text-white">+1.5%</span>
              <span className="px-1.5 py-0.5 rounded bg-[#089981] text-white">+3%</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#787b86]">
          <ZoomIn className="w-3.5 h-3.5 text-[#2962ff]" />
          <span>Click any block to load into chart</span>
        </div>
      </div>
    </div>
  );
};
