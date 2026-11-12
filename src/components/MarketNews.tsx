import React, { useState } from 'react';
import { MOCK_NEWS } from '../data/mockMarketData';
import { Newspaper, ExternalLink } from 'lucide-react';

interface MarketNewsProps {
  onSelectSymbol: (symbol: string) => void;
}

export const MarketNews: React.FC<MarketNewsProps> = ({ onSelectSymbol }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Stocks', 'Crypto', 'Economy', 'Commodities'];

  const filteredNews = selectedCategory === 'All'
    ? MOCK_NEWS
    : MOCK_NEWS.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 lg:p-5 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-[#131722] dark:text-white tracking-tight">Market News & Editorial Insights</h2>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#f0f3fa] dark:bg-[#131722] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="p-4 rounded-xl bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] hover:border-[#2962ff]/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#787b86] mb-2 font-medium">
                <span className="text-[#2962ff] font-semibold">{news.source}</span>
                <span>{news.timeAgo}</span>
              </div>

              <h3 className="text-sm font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors line-clamp-2 leading-snug mb-2">
                {news.title}
              </h3>

              <p className="text-xs text-[#787b86] line-clamp-2 leading-relaxed">
                {news.summary}
              </p>
            </div>

            {/* Related Symbols Chips */}
            <div className="mt-4 pt-3 border-t border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                {news.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => onSelectSymbol(sym)}
                    className="font-mono text-[10px] font-bold text-[#787b86] hover:text-white px-1.5 py-0.5 rounded bg-[#f0f3fa] dark:bg-[#1e222d] hover:bg-[#2962ff] dark:hover:bg-[#2962ff] transition-colors"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#787b86] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
