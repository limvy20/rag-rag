import React, { useState } from 'react';
import { HeatmapItem } from '../types/market';
import { HEATMAP_DATA } from '../data/mockMarketData';
import { LayoutGrid, ZoomIn } from 'lucide-react';

interface MarketHeatmapProps {
  onSelectSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ onSelectSymbol }) => {
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');
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

  const getColorClass = (change: number) => {
    if (change >= 3.0) return 'bg-[#089981] text-white hover:brightness-110';
    if (change >= 1.5) return 'bg-[#0b8672] text-white hover:brightness-110';
    if (change > 0) return 'bg-[#126b5c] text-white/90 hover:brightness-110';
    if (change === 0) return 'bg-[#2a2e39] text-[#787b86] hover:brightness-110';
    if (change > -1.5) return 'bg-[#85252e] text-white/90 hover:brightness-110';
    if (change > -3.0) return 'bg-[#b82936] text-white hover:brightness-110';
    return 'bg-[#f23645] text-white hover:brightness-110';
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 lg:p-5 shadow-sm transition-colors">
      {/* Header & Sector Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-[#131722] dark:text-white tracking-tight">
              S&P 500 Market Heatmap
            </h2>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            Sized by market capitalization, colored by daily performance
          </p>
        </div>

        {/* Sector filter segmented control */}
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

      {/* Heatmap Grid Container */}
      <div className="space-y-4">
        {Object.entries(sectorGroups).map(([sectorName, items]) => {
          // Total market cap in this sector
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
                  const isPositive = item.changePercent >= 0;
                  // Prominent mega-caps span 2 cols on tablet/desktop
                  const isMega = item.marketCap > 1000;

                  return (
                    <div
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`relative p-3 rounded-md transition-all cursor-pointer flex flex-col justify-between min-h-[75px] shadow-sm ${
                        isMega ? 'sm:col-span-2' : ''
                      } ${getColorClass(item.changePercent)}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono font-bold text-sm tracking-tight">{item.symbol}</span>
                        <span className="text-[10px] font-mono opacity-80">${item.marketCap >= 1000 ? (item.marketCap/1000).toFixed(1)+'T' : item.marketCap+'B'}</span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between font-mono">
                        <span className="text-xs font-semibold">${item.price.toFixed(2)}</span>
                        <span className="text-xs font-extrabold">
                          {isPositive ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
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
      <div className="mt-4 pt-3 border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-xs text-[#787b86]">
        <div className="flex items-center gap-2">
          <span>Performance Spectrum:</span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-[#f23645] text-white">-3%</span>
            <span className="px-1.5 py-0.5 rounded bg-[#b82936] text-white">-1.5%</span>
            <span className="px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86]">0%</span>
            <span className="px-1.5 py-0.5 rounded bg-[#0b8672] text-white">+1.5%</span>
            <span className="px-1.5 py-0.5 rounded bg-[#089981] text-white">+3%</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#787b86]">
          <ZoomIn className="w-3.5 h-3.5 text-[#2962ff]" />
          <span>Click any block to open chart & deep dive</span>
        </div>
      </div>
    </div>
  );
};
