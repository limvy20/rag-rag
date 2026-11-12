import React, { useState, useMemo } from 'react';
import { MarketSymbol } from '../types/market';
import { Bookmark, ArrowUpDown, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface MarketMoversTableProps {
  symbols: MarketSymbol[];
  selectedSymbolId: string;
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  activeCategory: string;
}

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  symbols,
  selectedSymbolId,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  activeCategory,
}) => {
  const [filterTab, setFilterTab] = useState<'active' | 'gainers' | 'losers' | 'all'>('active');
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'volumeNumeric'>('changePercent');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter symbols based on category tab & table tab
  const displaySymbols = useMemo(() => {
    let list = symbols;
    if (activeCategory !== 'overview') {
      list = list.filter((s) => s.type === activeCategory);
    }

    if (filterTab === 'gainers') {
      list = [...list].sort((a, b) => b.changePercent - a.changePercent);
    } else if (filterTab === 'losers') {
      list = [...list].sort((a, b) => a.changePercent - b.changePercent);
    } else if (filterTab === 'active') {
      list = [...list].sort((a, b) => b.volumeNumeric - a.volumeNumeric);
    } else {
      // Sort by chosen field
      list = [...list].sort((a, b) => {
        const valA = a[sortField] || 0;
        const valB = b[sortField] || 0;
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
    }

    return list;
  }, [symbols, activeCategory, filterTab, sortField, sortAsc]);

  const handleSort = (field: 'price' | 'changePercent' | 'volumeNumeric') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden shadow-sm transition-colors">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#131722] dark:text-white tracking-tight">Market Movers & Screener</h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            Real-time quotes, technical momentum signals, and volume trends
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#f0f3fa] dark:bg-[#131722] p-1 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39]">
          <button
            onClick={() => setFilterTab('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterTab === 'active' ? 'bg-[#2962ff] text-white shadow-sm' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Most Active
          </button>
          <button
            onClick={() => setFilterTab('gainers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterTab === 'gainers' ? 'bg-[#089981] text-white shadow-sm' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setFilterTab('losers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterTab === 'losers' ? 'bg-[#f23645] text-white shadow-sm' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Top Losers
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterTab === 'all' ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-sm' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            All Symbols
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#f8f9fd] dark:bg-[#131722] text-[#787b86] border-b border-[#e0e3eb] dark:border-[#2a2e39] font-medium uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 w-10 text-center">★</th>
              <th className="py-3 px-4">Symbol / Name</th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-4 cursor-pointer hover:text-[#131722] dark:hover:text-white text-right font-mono"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787b86]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 px-4 cursor-pointer hover:text-[#131722] dark:hover:text-white text-right font-mono"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Chg %</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787b86]" />
                </div>
              </th>
              <th className="py-3 px-4 text-right font-mono hidden md:table-cell">Chg $</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell">Technical Rating</th>
              <th
                onClick={() => handleSort('volumeNumeric')}
                className="py-3 px-4 cursor-pointer hover:text-[#131722] dark:hover:text-white text-right font-mono hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787b86]" />
                </div>
              </th>
              <th className="py-3 px-4 text-right font-mono hidden xl:table-cell">Market Cap</th>
              <th className="py-3 px-4 text-center w-28">7D Trend</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39]/50">
            {displaySymbols.map((item) => {
              const isPositive = item.change >= 0;
              const isSelected = item.symbol === selectedSymbolId;
              const isBookmarked = watchlist.includes(item.symbol);

              // Calculate mini sparkline
              const minVal = Math.min(...item.sparkline);
              const maxVal = Math.max(...item.sparkline);
              const range = maxVal - minVal || 1;
              const points = item.sparkline
                .map((val, idx) => {
                  const x = (idx / (item.sparkline.length - 1)) * 60;
                  const y = 18 - ((val - minVal) / range) * 16;
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <tr
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item.symbol)}
                  className={`hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]/60 cursor-pointer transition-colors group ${
                    isSelected ? 'bg-[#f0f3fa] dark:bg-[#2a2e39]/40' : ''
                  }`}
                >
                  {/* Watchlist toggle */}
                  <td
                    className="py-3 px-4 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.symbol);
                    }}
                  >
                    <button
                      className={`p-1 rounded hover:bg-[#e0e3eb] dark:hover:bg-[#131722] transition-colors ${
                        isBookmarked ? 'text-[#f59e0b]' : 'text-[#787b86] group-hover:text-[#131722] dark:group-hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? '#f59e0b' : 'none'} />
                    </button>
                  </td>

                  {/* Symbol & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-center font-mono font-bold text-[11px] text-[#2962ff]">
                        {item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#131722] dark:text-white font-mono text-xs">{item.symbol}</span>
                          <span className="text-[10px] uppercase font-semibold text-[#787b86] px-1 py-0.2 rounded bg-[#f0f3fa] dark:bg-[#131722]">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#787b86] block truncate max-w-[150px]">{item.name}</span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#131722] dark:text-white text-xs">
                    {item.price >= 1000
                      ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.price.toFixed(item.price < 5 ? 4 : 2)}
                  </td>

                  {/* Change % */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-xs">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                        isPositive ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  {/* Change $ */}
                  <td
                    className={`py-3 px-4 text-right font-mono text-xs hidden md:table-cell ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {item.change.toFixed(item.price < 5 ? 4 : 2)}
                  </td>

                  {/* Technical Rating */}
                  <td className="py-3 px-4 text-center hidden lg:table-cell">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        item.rating === 'Strong Buy'
                          ? 'bg-[#089981]/20 text-[#089981]'
                          : item.rating === 'Buy'
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : item.rating === 'Sell' || item.rating === 'Strong Sell'
                          ? 'bg-[#f23645]/20 text-[#f23645]'
                          : 'bg-[#787b86]/20 text-[#d1d4dc]'
                      }`}
                    >
                      {item.rating}
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-3 px-4 text-right font-mono text-[#d1d4dc] text-xs hidden sm:table-cell">
                    {item.volume}
                  </td>

                  {/* Market Cap */}
                  <td className="py-3 px-4 text-right font-mono text-[#787b86] text-xs hidden xl:table-cell">
                    {item.marketCap ? '$' + item.marketCap : '—'}
                  </td>

                  {/* Sparkline */}
                  <td className="py-3 px-4 text-center">
                    <svg className="w-16 h-5 mx-auto overflow-visible" viewBox="0 0 60 20">
                      <polyline
                        fill="none"
                        stroke={isPositive ? '#089981' : '#f23645'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />
                    </svg>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSymbol(item.symbol);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#131722] hover:bg-[#2962ff] text-[#787b86] hover:text-white transition-colors text-[11px] font-semibold"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Chart</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
