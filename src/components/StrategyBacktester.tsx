import React, { useState } from 'react';
import { MOCK_STRATEGIES } from '../data/mockMarketData';
import { Code2, Play, Award, ArrowUpRight, TrendingUp, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface StrategyBacktesterProps {
  symbol: string;
}

export const StrategyBacktester: React.FC<StrategyBacktesterProps> = ({ symbol }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('EMA Golden Cross (9/21)');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isBacktesting, setIsBacktesting] = useState<boolean>(false);

  const strategy = MOCK_STRATEGIES[selectedStrategy] || MOCK_STRATEGIES['EMA Golden Cross (9/21)'];

  const handleRunTest = () => {
    setIsBacktesting(true);
    setTimeout(() => setIsBacktesting(false), 600);
  };

  // Mock equity curve data points (growth over 100 periods)
  const equityPoints = [100, 102, 101, 106, 104, 109, 112, 110, 116, 122, 119, 125, 129, 126, 134.8];
  const minEquity = Math.min(...equityPoints);
  const maxEquity = Math.max(...equityPoints);
  const range = maxEquity - minEquity || 1;
  const polyPoints = equityPoints
    .map((val, idx) => {
      const x = (idx / (equityPoints.length - 1)) * 260;
      const y = 50 - ((val - minEquity) / range) * 44;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden shadow-sm transition-colors">
      {/* Collapsible Bar Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 bg-[#f8f9fd] dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <Code2 className="w-4 h-4 text-[#2962ff]" />
          <span className="text-xs font-bold text-[#131722] dark:text-white uppercase tracking-wider font-mono">
            Pine Script Strategy Tester
          </span>
          <span className="text-[10px] text-[#787b86] hidden sm:inline">
            Backtested on {symbol} (1D Interval)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#089981]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{strategy.netProfitPercent}% Net Profit</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#787b86]" /> : <ChevronDown className="w-4 h-4 text-[#787b86]" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Strategy selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#787b86]">Active Strategy:</span>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg px-2.5 py-1.5 text-[#131722] dark:text-white font-medium focus:outline-none"
              >
                {Object.keys(MOCK_STRATEGIES).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Run backtest button */}
            <button
              onClick={handleRunTest}
              disabled={isBacktesting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isBacktesting ? 'animate-spin' : ''}`} />
              <span>{isBacktesting ? 'Compiling Pine Script...' : 'Re-run Backtest'}</span>
            </button>
          </div>

          {/* Performance Grid & Equity Curve */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Metrics */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
                <span className="text-[10px] uppercase font-sans text-[#787b86] block">Net Profit</span>
                <span className="text-base font-bold text-[#089981]">+{strategy.netProfitPercent}%</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
                <span className="text-[10px] uppercase font-sans text-[#787b86] block">Win Rate</span>
                <span className="text-base font-bold text-[#131722] dark:text-white">{strategy.winRate}%</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
                <span className="text-[10px] uppercase font-sans text-[#787b86] block">Profit Factor</span>
                <span className="text-base font-bold text-[#2962ff]">{strategy.profitFactor}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50">
                <span className="text-[10px] uppercase font-sans text-[#787b86] block">Max Drawdown</span>
                <span className="text-base font-bold text-[#f23645]">-{strategy.maxDrawdown}%</span>
              </div>
            </div>

            {/* Mini Cumulative Equity Curve */}
            <div className="lg:col-span-4 p-2.5 rounded-lg bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]/50 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#787b86] mb-1">
                <span>Cumulative Equity Curve</span>
                <span className="text-[#089981] font-bold">Sharpe: {strategy.sharpeRatio}</span>
              </div>
              <svg className="w-full h-14 overflow-visible" viewBox="0 0 260 55">
                <polyline
                  fill="none"
                  stroke="#089981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polyPoints}
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
