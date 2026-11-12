import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#131722] text-[#787b86] text-xs py-8 px-4 lg:px-6 transition-colors">
      <div className="max-w-[1720px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#e0e3eb] dark:border-[#2a2e39]/50">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 text-[#2962ff]" viewBox="0 0 36 28" fill="currentColor">
              <rect x="0" y="4" width="8" height="20" rx="1.5" />
              <polygon points="12,24 20,4 20,24" />
              <rect x="24" y="10" width="8" height="14" rx="1.5" />
            </svg>
            <span className="text-[#131722] dark:text-white font-bold text-sm tracking-tight">TradingView Markets</span>
            <span className="text-[11px] text-[#787b86]">· Look first / Then leap.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#787b86]">
            <a href="#overview" className="hover:text-[#131722] dark:hover:text-white transition-colors">Overview</a>
            <a href="#indices" className="hover:text-[#131722] dark:hover:text-white transition-colors">Indices</a>
            <a href="#stocks" className="hover:text-[#131722] dark:hover:text-white transition-colors">Stocks</a>
            <a href="#crypto" className="hover:text-[#131722] dark:hover:text-white transition-colors">Crypto</a>
            <a href="#forex" className="hover:text-[#131722] dark:hover:text-white transition-colors">Forex</a>
            <a href="#futures" className="hover:text-[#131722] dark:hover:text-white transition-colors">Futures</a>
            <a href="#bonds" className="hover:text-[#131722] dark:hover:text-white transition-colors">Bonds</a>
            <a href="#calendar" className="hover:text-[#131722] dark:hover:text-white transition-colors">Economic Calendar</a>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] leading-relaxed">
          <p>
            Real-time market quotes and financial charts. Market data is provided for informational and simulation purposes.
            Trading financial instruments carries substantial risk of loss.
          </p>
          <p className="shrink-0 font-mono text-[#787b86]">
            © {new Date().getFullYear()} TradingView Markets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
