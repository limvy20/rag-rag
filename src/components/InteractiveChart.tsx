import React, { useState, useMemo, useRef } from 'react';
import { MarketSymbol, Candle } from '../types/market';
import {
  Maximize2,
  TrendingUp,
  Bookmark,
  Activity,
  BarChart,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface InteractiveChartProps {
  symbol: MarketSymbol;
  candles: Candle[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  chartType: 'candle' | 'area' | 'line';
  setChartType: (type: 'candle' | 'area' | 'line') => void;
  showIndicators: {
    ma20: boolean;
    ma50: boolean;
    bollinger: boolean;
    rsi: boolean;
    volume: boolean;
  };
  setShowIndicators: React.Dispatch<
    React.SetStateAction<{
      ma20: boolean;
      ma50: boolean;
      bollinger: boolean;
      rsi: boolean;
      volume: boolean;
    }>
  >;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  onOpenTrade: () => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  symbol,
  candles,
  timeframe,
  setTimeframe,
  chartType,
  setChartType,
  showIndicators,
  setShowIndicators,
  isWatchlisted,
  onToggleWatchlist,
  onOpenTrade,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [indicatorsMenuOpen, setIndicatorsMenuOpen] = useState(false);

  // Timeframes available
  const timeframes = ['1D', '5D', '1M', '3M', '6M', '1Y', 'ALL'];

  // Calculations for Chart Dimensions & Scales
  const chartHeight = 380;
  const chartWidth = 900;
  const padding = { top: 20, right: 65, bottom: 40, left: 10 };

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Min and Max prices for scaling
  const { minPrice, maxPrice, priceRange, ma20Data, ma50Data, rsiData, bollingerData } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return {
        minPrice: 1,
        maxPrice: 10,
        priceRange: 9,
        ma20Data: [],
        ma50Data: [],
        rsiData: [],
        bollingerData: { upper: [], lower: [], mid: [] },
      };
    }

    let min = Math.min(...candles.map((c) => c.low));
    let max = Math.max(...candles.map((c) => c.high));

    // MA 20
    const ma20: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < 19) {
        ma20.push(null);
      } else {
        const slice = candles.slice(i - 19, i + 1);
        const avg = slice.reduce((acc, c) => acc + c.close, 0) / 20;
        ma20.push(avg);
      }
    }

    // MA 50
    const ma50: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < 49) {
        ma50.push(null);
      } else {
        const slice = candles.slice(i - 49, i + 1);
        const avg = slice.reduce((acc, c) => acc + c.close, 0) / 50;
        ma50.push(avg);
      }
    }

    // Bollinger Bands (20 periods, 2 std dev)
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];
    const mid: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < 19) {
        upper.push(null);
        lower.push(null);
        mid.push(null);
      } else {
        const slice = candles.slice(i - 19, i + 1);
        const avg = slice.reduce((acc, c) => acc + c.close, 0) / 20;
        const variance = slice.reduce((acc, c) => acc + Math.pow(c.close - avg, 2), 0) / 20;
        const std = Math.sqrt(variance);
        mid.push(avg);
        upper.push(avg + 2 * std);
        lower.push(avg - 2 * std);
      }
    }

    // RSI (14 period)
    const rsi: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < 14) {
        rsi.push(50);
      } else {
        let gains = 0;
        let losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const diff = candles[j].close - candles[j - 1].close;
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14;
        if (avgLoss === 0) rsi.push(100);
        else {
          const rs = avgGain / avgLoss;
          rsi.push(100 - 100 / (1 + rs));
        }
      }
    }

    const paddingDelta = (max - min) * 0.08 || 1;
    min = min - paddingDelta;
    max = max + paddingDelta;

    return {
      minPrice: min,
      maxPrice: max,
      priceRange: max - min || 1,
      ma20Data: ma20,
      ma50Data: ma50,
      rsiData: rsi,
      bollingerData: { upper, lower, mid },
    };
  }, [candles]);

  const maxVolume = useMemo(() => {
    return Math.max(...candles.map((c) => c.volume), 1);
  }, [candles]);

  // Handle crosshair tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const innerWidth = rect.width - (padding.left + padding.right);
    const relativeX = x - padding.left;

    if (relativeX >= 0 && relativeX <= innerWidth && candles.length > 0) {
      const index = Math.round((relativeX / innerWidth) * (candles.length - 1));
      setHoverIndex(Math.max(0, Math.min(candles.length - 1, index)));
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Helper coordinate mappers
  const getX = (index: number) => {
    const innerWidth = chartWidth - padding.left - padding.right;
    return padding.left + (index / (candles.length - 1 || 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const innerHeight = chartHeight - padding.top - padding.bottom;
    return padding.top + innerHeight - ((val - minPrice) / priceRange) * innerHeight;
  };

  const isPositive = symbol.change >= 0;

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden shadow-sm flex flex-col transition-colors">
      {/* Top Chart Header / Symbol Info & Controls Bar */}
      <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-4">
        {/* Symbol Details & Live Price */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatchlist}
              className={`p-1.5 rounded hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors ${
                isWatchlisted ? 'text-[#f59e0b]' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-4 h-4" fill={isWatchlisted ? '#f59e0b' : 'none'} />
            </button>
            <span className="text-xl font-bold font-mono text-[#131722] dark:text-white tracking-tight">{symbol.symbol}</span>
            <span className="text-sm text-[#787b86] font-medium hidden sm:inline">{symbol.name}</span>
            <span className="text-[10px] uppercase font-semibold text-[#787b86] px-1.5 py-0.5 rounded bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]">
              {symbol.type}
            </span>
          </div>

          {/* Price & Change */}
          <div className="flex items-baseline gap-2.5 font-mono">
            <span className="text-2xl font-bold text-[#131722] dark:text-white tracking-tight">
              {symbol.price >= 1000
                ? symbol.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : symbol.price.toFixed(symbol.price < 5 ? 4 : 2)}
            </span>
            <span
              className={`text-sm font-semibold flex items-center gap-0.5 ${
                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              <span>{isPositive ? '+' : ''}{symbol.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{symbol.changePercent.toFixed(2)}%)</span>
            </span>
          </div>

          {/* Live OHLC Bar when hovering */}
          {activeCandle && (
            <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-[#787b86] border-l border-[#e0e3eb] dark:border-[#2a2e39] pl-4">
              <span>
                O: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.open}</span>
              </span>
              <span>
                H: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.high}</span>
              </span>
              <span>
                L: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.low}</span>
              </span>
              <span>
                C:{' '}
                <span
                  className={
                    activeCandle.close >= activeCandle.open ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'
                  }
                >
                  {activeCandle.close}
                </span>
              </span>
              <span>
                Vol: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.volume.toLocaleString()}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Toolbar: Timeframes, Chart Type, Indicators, Trade Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe Buttons */}
          <div className="flex items-center bg-[#f0f3fa] dark:bg-[#131722] rounded-lg p-0.5 border border-[#e0e3eb] dark:border-[#2a2e39]">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeframe === tf ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center bg-[#f0f3fa] dark:bg-[#131722] rounded-lg p-0.5 border border-[#e0e3eb] dark:border-[#2a2e39]">
            <button
              onClick={() => setChartType('candle')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                chartType === 'candle' ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-xs' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <BarChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                chartType === 'area' ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-xs' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Area Chart"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicators Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIndicatorsMenuOpen(!indicatorsMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f0f3fa] dark:bg-[#131722] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg text-xs font-medium text-[#131722] dark:text-[#d1d4dc] transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#2962ff]" />
              <span className="hidden sm:inline">Indicators</span>
              <ChevronDown className="w-3 h-3 text-[#787b86]" />
            </button>

            {indicatorsMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-xl z-50 p-2 text-xs">
                <div className="px-2 py-1 text-[#787b86] font-semibold text-[10px] uppercase">
                  Technical Overlays
                </div>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#2962ff] font-medium">MA (20)</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.ma20}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, ma20: e.target.checked }))}
                    className="rounded bg-[#f0f3fa] dark:bg-[#131722] border-[#e0e3eb] dark:border-[#2a2e39] text-[#2962ff]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#f59e0b] font-medium">MA (50)</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.ma50}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, ma50: e.target.checked }))}
                    className="rounded bg-[#f0f3fa] dark:bg-[#131722] border-[#e0e3eb] dark:border-[#2a2e39] text-[#f59e0b]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#a855f7] font-medium">Bollinger Bands</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.bollinger}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, bollinger: e.target.checked }))}
                    className="rounded bg-[#f0f3fa] dark:bg-[#131722] border-[#e0e3eb] dark:border-[#2a2e39] text-[#a855f7]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#089981] font-medium">Volume Bars</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.volume}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, volume: e.target.checked }))}
                    className="rounded bg-[#f0f3fa] dark:bg-[#131722] border-[#e0e3eb] dark:border-[#2a2e39] text-[#089981]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#ec4899] font-medium">RSI (14)</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.rsi}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, rsi: e.target.checked }))}
                    className="rounded bg-[#f0f3fa] dark:bg-[#131722] border-[#e0e3eb] dark:border-[#2a2e39] text-[#ec4899]"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Trade Button (TradingView direct order entry button) */}
          <button
            onClick={onOpenTrade}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trade {symbol.symbol}</span>
          </button>
        </div>
      </div>

      {/* Main SVG Chart Canvas Area */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none bg-[#fbfcfe] dark:bg-[#131722] transition-colors"
        style={{ height: chartHeight + (showIndicators.rsi ? 90 : 0) }}
      >
        {/* TradingView signature watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <span className="text-8xl font-black font-mono tracking-tighter text-white">
            {symbol.symbol}
          </span>
        </div>

        {/* Legend for active indicators */}
        <div className="absolute top-2 left-4 z-10 flex items-center gap-3 text-[11px] font-mono pointer-events-none">
          {showIndicators.ma20 && (
            <span className="text-[#2962ff] flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#2962ff]" />
              MA 20: {ma20Data[ma20Data.length - 1]?.toFixed(2) || '—'}
            </span>
          )}
          {showIndicators.ma50 && (
            <span className="text-[#f59e0b] flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#f59e0b]" />
              MA 50: {ma50Data[ma50Data.length - 1]?.toFixed(2) || '—'}
            </span>
          )}
          {showIndicators.bollinger && (
            <span className="text-[#a855f7] flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#a855f7]" />
              BB (20,2)
            </span>
          )}
        </div>

        {/* SVG Drawing */}
        <svg
          className="w-full h-full cursor-crosshair"
          viewBox={`0 0 ${chartWidth} ${chartHeight + (showIndicators.rsi ? 90 : 0)}`}
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Area gradient for area chart */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.35" />
              <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
            const y = padding.top + (chartHeight - padding.top - padding.bottom) * ratio;
            const price = maxPrice - ratio * priceRange;
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#20242e"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Price label on right axis */}
                <text
                  x={chartWidth - padding.right + 6}
                  y={y + 3}
                  fill="#787b86"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {price.toFixed(symbol.price < 5 ? 3 : 2)}
                </text>
              </g>
            );
          })}

          {/* Bollinger Bands Shading */}
          {showIndicators.bollinger && (
            <path
              d={
                candles
                  .map((_, i) => {
                    const up = bollingerData.upper[i];
                    if (up === null) return null;
                    return `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(up)}`;
                  })
                  .filter(Boolean)
                  .join(' ') +
                ' ' +
                candles
                  .slice()
                  .reverse()
                  .map((_, revIdx) => {
                    const i = candles.length - 1 - revIdx;
                    const low = bollingerData.lower[i];
                    if (low === null) return null;
                    return `L ${getX(i)} ${getY(low)}`;
                  })
                  .filter(Boolean)
                  .join(' ') +
                ' Z'
              }
              fill="url(#bbGradient)"
            />
          )}

          {/* Volume bars at bottom */}
          {showIndicators.volume &&
            candles.map((candle, idx) => {
              const x = getX(idx);
              const volRatio = candle.volume / maxVolume;
              const barHeight = volRatio * 55;
              const y = chartHeight - padding.bottom - barHeight;
              const isUp = candle.close >= candle.open;
              const barWidth = Math.max(1, (chartWidth / candles.length) * 0.55);

              return (
                <rect
                  key={'vol-' + idx}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isUp ? '#089981' : '#f23645'}
                  opacity={0.35}
                />
              );
            })}

          {/* Chart representation: Area / Line / Candlesticks */}
          {chartType === 'area' && (
            <>
              {/* Area polygon */}
              <polygon
                points={`
                  ${getX(0)},${chartHeight - padding.bottom}
                  ${candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')}
                  ${getX(candles.length - 1)},${chartHeight - padding.bottom}
                `}
                fill="url(#areaGradient)"
              />
              {/* Area top line */}
              <polyline
                points={candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')}
                fill="none"
                stroke={isPositive ? '#089981' : '#f23645'}
                strokeWidth="2"
              />
            </>
          )}

          {chartType === 'line' && (
            <polyline
              points={candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')}
              fill="none"
              stroke="#2962ff"
              strokeWidth="2"
            />
          )}

          {chartType === 'candle' &&
            candles.map((candle, idx) => {
              const x = getX(idx);
              const yOpen = getY(candle.open);
              const yClose = getY(candle.close);
              const yHigh = getY(candle.high);
              const yLow = getY(candle.low);
              const isBullish = candle.close >= candle.open;
              const candleColor = isBullish ? '#089981' : '#f23645';

              const candleTop = Math.min(yOpen, yClose);
              const candleBodyHeight = Math.max(2, Math.abs(yClose - yOpen));
              const candleWidth = Math.max(3, (chartWidth / candles.length) * 0.65);

              return (
                <g key={'candle-' + idx}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={candleTop}
                    width={candleWidth}
                    height={candleBodyHeight}
                    fill={candleColor}
                    rx={0.5}
                  />
                </g>
              );
            })}

          {/* Moving Average 20 */}
          {showIndicators.ma20 && (
            <polyline
              points={candles
                .map((_, i) => (ma20Data[i] !== null ? `${getX(i)},${getY(ma20Data[i]!)}` : null))
                .filter(Boolean)
                .join(' ')}
              fill="none"
              stroke="#2962ff"
              strokeWidth="1.5"
            />
          )}

          {/* Moving Average 50 */}
          {showIndicators.ma50 && (
            <polyline
              points={candles
                .map((_, i) => (ma50Data[i] !== null ? `${getX(i)},${getY(ma50Data[i]!)}` : null))
                .filter(Boolean)
                .join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
          )}

          {/* Current Live Price Line (Horizontal dotted line) */}
          <line
            x1={padding.left}
            y1={getY(symbol.price)}
            x2={chartWidth - padding.right}
            y2={getY(symbol.price)}
            stroke={isPositive ? '#089981' : '#f23645'}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          {/* Current price badge on axis */}
          <g transform={`translate(${chartWidth - padding.right}, ${getY(symbol.price) - 9})`}>
            <rect width="60" height="18" fill={isPositive ? '#089981' : '#f23645'} rx="2" />
            <text x="6" y="13" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
              {symbol.price.toFixed(symbol.price < 5 ? 4 : 2)}
            </text>
          </g>

          {/* Interactive Crosshair & Tooltip when hovering */}
          {hoverIndex !== null && candles[hoverIndex] && (
            <>
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={chartHeight - padding.bottom}
                stroke="#787b86"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={padding.left}
                y1={getY(candles[hoverIndex].close)}
                x2={chartWidth - padding.right}
                y2={getY(candles[hoverIndex].close)}
                stroke="#787b86"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Price Pill at Crosshair */}
              <g
                transform={`translate(${chartWidth - padding.right}, ${getY(candles[hoverIndex].close) - 9})`}
              >
                <rect width="60" height="18" fill="#2a2e39" rx="2" />
                <text
                  x="6"
                  y="13"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {candles[hoverIndex].close.toFixed(symbol.price < 5 ? 4 : 2)}
                </text>
              </g>
              {/* Time Pill at Bottom */}
              <g transform={`translate(${getX(hoverIndex) - 28}, ${chartHeight - padding.bottom + 6})`}>
                <rect width="56" height="18" fill="#2a2e39" rx="2" />
                <text
                  x="6"
                  y="13"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {candles[hoverIndex].time}
                </text>
              </g>
            </>
          )}

          {/* RSI Sub-Chart if active */}
          {showIndicators.rsi && (
            <g transform={`translate(0, ${chartHeight})`}>
              <rect
                x={padding.left}
                y="0"
                width={chartWidth - padding.left - padding.right}
                height="80"
                fill="#181c27"
              />
              <line
                x1={padding.left}
                y1="24"
                x2={chartWidth - padding.right}
                y2="24"
                stroke="#363a45"
                strokeDasharray="2 2"
              />
              <text x={chartWidth - padding.right + 6} y="27" fill="#ec4899" fontSize="9">
                70
              </text>
              <line
                x1={padding.left}
                y1="56"
                x2={chartWidth - padding.right}
                y2="56"
                stroke="#363a45"
                strokeDasharray="2 2"
              />
              <text x={chartWidth - padding.right + 6} y="59" fill="#089981" fontSize="9">
                30
              </text>
              <polyline
                points={candles
                  .map((_, i) => {
                    const r = rsiData[i] || 50;
                    const rsiY = 80 - (r / 100) * 80;
                    return `${getX(i)},${rsiY}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#ec4899"
                strokeWidth="1.5"
              />
              <text x={padding.left + 8} y="15" fill="#787b86" fontSize="10" fontFamily="JetBrains Mono">
                RSI (14): {(rsiData[hoverIndex !== null ? hoverIndex : rsiData.length - 1] || 50).toFixed(1)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer: 52-Week Range & Technical Summary Bar */}
      <div className="px-4 py-3 bg-[#1e222d] border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* 52-Week Range Indicator */}
        {symbol.low52w && symbol.high52w && (
          <div className="flex items-center gap-3">
            <span className="text-[#787b86]">52W Range:</span>
            <span className="font-mono text-white">${symbol.low52w.toFixed(2)}</span>
            <div className="w-24 sm:w-36 h-1.5 bg-[#131722] rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 bg-[#2962ff] rounded-full"
                style={{
                  left: `${Math.max(0, Math.min(100, ((symbol.price - symbol.low52w) / (symbol.high52w - symbol.low52w)) * 100))}%`,
                  width: '6px',
                }}
              />
            </div>
            <span className="font-mono text-white">${symbol.high52w.toFixed(2)}</span>
          </div>
        )}

        {/* Technical Rating Tag */}
        <div className="flex items-center gap-2">
          <span className="text-[#787b86]">Technical Rating:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
              symbol.rating === 'Strong Buy'
                ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/30'
                : symbol.rating === 'Buy'
                ? 'bg-[#089981]/15 text-[#089981]'
                : symbol.rating === 'Sell' || symbol.rating === 'Strong Sell'
                ? 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/30'
                : 'bg-[#787b86]/20 text-[#d1d4dc]'
            }`}
          >
            {symbol.rating}
          </span>
        </div>
      </div>
    </div>
  );
};
