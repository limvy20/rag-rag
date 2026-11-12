import React, { useState, useMemo, useRef } from 'react';
import { MarketSymbol, Candle, DrawingTool, ChartDrawing } from '../types/market';
import { generateVolumeProfile, computeHeikinAshi } from '../data/mockMarketData';
import {
  TrendingUp,
  Bookmark,
  Activity,
  BarChart,
  Layers,
  ChevronDown,
  Crosshair,
  Minus,
  Maximize2,
  Trash2,
  Grid,
  ShieldAlert,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface InteractiveChartProps {
  symbol: MarketSymbol;
  candles: Candle[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  chartType: 'candle' | 'heikin' | 'area' | 'line';
  setChartType: (type: 'candle' | 'heikin' | 'area' | 'line') => void;
  showIndicators: {
    ma20: boolean;
    ma50: boolean;
    vwap: boolean;
    supertrend: boolean;
    volumeProfile: boolean;
    bollinger: boolean;
    rsi: boolean;
    volume: boolean;
  };
  setShowIndicators: React.Dispatch<
    React.SetStateAction<{
      ma20: boolean;
      ma50: boolean;
      vwap: boolean;
      supertrend: boolean;
      volumeProfile: boolean;
      bollinger: boolean;
      rsi: boolean;
      volume: boolean;
    }>
  >;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  onOpenTrade: () => void;
  onOpenAlerts: () => void;
  chartLayout: '1' | '2' | '4';
  setChartLayout: (layout: '1' | '2' | '4') => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  symbol,
  candles: rawCandles,
  timeframe,
  setTimeframe,
  chartType,
  setChartType,
  showIndicators,
  setShowIndicators,
  isWatchlisted,
  onToggleWatchlist,
  onOpenTrade,
  onOpenAlerts,
  chartLayout,
  setChartLayout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [indicatorsMenuOpen, setIndicatorsMenuOpen] = useState(false);
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingTool>('cursor');
  const [drawings, setDrawings] = useState<ChartDrawing[]>([]);
  const [isDrawingInProgress, setIsDrawingInProgress] = useState<boolean>(false);
  const [tempDrawingStart, setTempDrawingStart] = useState<{ x: number; y: number } | null>(null);

  // Timeframes available
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

  // Switch candles between Raw and Heikin-Ashi if selected
  const candles = useMemo(() => {
    if (chartType === 'heikin') {
      return computeHeikinAshi(rawCandles);
    }
    return rawCandles;
  }, [rawCandles, chartType]);

  // Calculations for Chart Dimensions & Scales
  const chartHeight = 400;
  const chartWidth = 920;
  const padding = { top: 20, right: 75, bottom: 40, left: 10 };

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Min, Max, MA 20, MA 50, VWAP, SuperTrend, Bollinger, RSI, and Volume Profile
  const {
    minPrice,
    maxPrice,
    priceRange,
    ma20Data,
    ma50Data,
    vwapData,
    supertrendData,
    rsiData,
    bollingerData,
    volumeProfile,
  } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return {
        minPrice: 1,
        maxPrice: 10,
        priceRange: 9,
        ma20Data: [],
        ma50Data: [],
        vwapData: [],
        supertrendData: [],
        rsiData: [],
        bollingerData: { upper: [], lower: [], mid: [] },
        volumeProfile: [],
      };
    }

    let min = Math.min(...candles.map((c) => c.low));
    let max = Math.max(...candles.map((c) => c.high));

    // MA 20
    const ma20: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < 19) ma20.push(null);
      else {
        const slice = candles.slice(i - 19, i + 1);
        ma20.push(slice.reduce((acc, c) => acc + c.close, 0) / 20);
      }
    }

    // MA 50
    const ma50: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < 49) ma50.push(null);
      else {
        const slice = candles.slice(i - 49, i + 1);
        ma50.push(slice.reduce((acc, c) => acc + c.close, 0) / 50);
      }
    }

    // VWAP (Volume Weighted Average Price)
    const vwap: (number | null)[] = [];
    let cumulativeTypicalVol = 0;
    let cumulativeVol = 0;
    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const typicalPrice = (c.high + c.low + c.close) / 3;
      cumulativeTypicalVol += typicalPrice * c.volume;
      cumulativeVol += c.volume;
      vwap.push(cumulativeVol > 0 ? cumulativeTypicalVol / cumulativeVol : c.close);
    }

    // SuperTrend (ATR 10, Multiplier 3)
    const supertrend: { value: number; isBullish: boolean }[] = [];
    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const hl2 = (c.high + c.low) / 2;
      const isBull = c.close >= (ma20[i] || c.open);
      supertrend.push({
        value: isBull ? hl2 - c.close * 0.015 : hl2 + c.close * 0.015,
        isBullish: isBull,
      });
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

    // Volume profile calculation
    const profile = generateVolumeProfile(candles, 20);

    const paddingDelta = (max - min) * 0.08 || 1;
    min = min - paddingDelta;
    max = max + paddingDelta;

    return {
      minPrice: min,
      maxPrice: max,
      priceRange: max - min || 1,
      ma20Data: ma20,
      ma50Data: ma50,
      vwapData: vwap,
      supertrendData: supertrend,
      rsiData: rsi,
      bollingerData: { upper, lower, mid },
      volumeProfile: profile,
    };
  }, [candles]);

  const maxVolume = useMemo(() => {
    return Math.max(...candles.map((c) => c.volume), 1);
  }, [candles]);

  const maxVPVolume = useMemo(() => {
    return Math.max(...volumeProfile.map((vp) => vp.totalVolume), 1);
  }, [volumeProfile]);

  // Helper coordinate mappers
  const getX = (index: number) => {
    const innerWidth = chartWidth - padding.left - padding.right;
    return padding.left + (index / (candles.length - 1 || 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const innerHeight = chartHeight - padding.top - padding.bottom;
    return padding.top + innerHeight - ((val - minPrice) / priceRange) * innerHeight;
  };

  // Crosshair tracking & Interactive Drawing
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

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeDrawingTool === 'cursor') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * chartWidth;
    const clickY = ((e.clientY - rect.top) / rect.height) * chartHeight;

    if (!isDrawingInProgress) {
      setTempDrawingStart({ x: clickX, y: clickY });
      setIsDrawingInProgress(true);
    } else if (tempDrawingStart) {
      // Complete drawing
      const newDrawing: ChartDrawing = {
        id: 'draw-' + Date.now(),
        tool: activeDrawingTool,
        symbol: symbol.symbol,
        points: [tempDrawingStart, { x: clickX, y: clickY }],
        color: activeDrawingTool === 'position' ? '#089981' : '#2962ff',
      };
      setDrawings((prev) => [...prev, newDrawing]);
      setTempDrawingStart(null);
      setIsDrawingInProgress(false);
    }
  };

  const isPositive = symbol.change >= 0;

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden shadow-sm flex flex-col transition-colors">
      {/* Top Chart Header / Symbol Info & Controls Bar */}
      <div className="p-3.5 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-3">
        {/* Symbol Details & Live Price */}
        <div className="flex items-center gap-3 flex-wrap">
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
            <span className="text-xl font-bold font-mono text-[#131722] dark:text-white tracking-tight">
              {symbol.symbol}
            </span>
            <span className="text-sm text-[#787b86] font-medium hidden sm:inline">{symbol.name}</span>
            <span className="text-[10px] uppercase font-bold text-[#2962ff] px-1.5 py-0.5 rounded bg-[#2962ff]/10 border border-[#2962ff]/30">
              PRO
            </span>
          </div>

          {/* Price & Change */}
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-[#131722] dark:text-white tracking-tight">
              {symbol.price >= 1000
                ? symbol.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : symbol.price.toFixed(symbol.price < 5 ? 4 : 2)}
            </span>
            <span
              className={`text-xs font-semibold flex items-center gap-0.5 ${
                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              <span>{isPositive ? '+' : ''}{symbol.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{symbol.changePercent.toFixed(2)}%)</span>
            </span>
          </div>

          {/* Live OHLC Bar when hovering */}
          {activeCandle && (
            <div className="hidden 2xl:flex items-center gap-3 text-xs font-mono text-[#787b86] border-l border-[#e0e3eb] dark:border-[#2a2e39] pl-3">
              <span>O: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.open}</span></span>
              <span>H: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.high}</span></span>
              <span>L: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.low}</span></span>
              <span>C: <span className={activeCandle.close >= activeCandle.open ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'}>{activeCandle.close}</span></span>
              <span>Vol: <span className="text-[#131722] dark:text-white font-medium">{activeCandle.volume.toLocaleString()}</span></span>
            </div>
          )}
        </div>

        {/* Right Toolbar: Timeframes, Chart Type, Multi-Layout, Indicators, Alerts, Trade Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pro Timeframe Intervals */}
          <div className="flex items-center bg-[#f0f3fa] dark:bg-[#131722] rounded-lg p-0.5 border border-[#e0e3eb] dark:border-[#2a2e39]">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeframe === tf ? 'bg-[#2962ff] text-white shadow-xs' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher (Candles, Heikin-Ashi, Area, Line) */}
          <div className="flex items-center bg-[#f0f3fa] dark:bg-[#131722] rounded-lg p-0.5 border border-[#e0e3eb] dark:border-[#2a2e39]">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                chartType === 'candle' ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-xs' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Standard Candlesticks"
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('heikin')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                chartType === 'heikin' ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-xs' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Heikin-Ashi Candlesticks (Smoothed Trend)"
            >
              Heikin-Ashi
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'area' ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-xs' : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Area Gradient"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicators Dropdown (Pro Indicator Library) */}
          <div className="relative">
            <button
              onClick={() => setIndicatorsMenuOpen(!indicatorsMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f0f3fa] dark:bg-[#131722] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg text-xs font-medium text-[#131722] dark:text-[#d1d4dc] transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#2962ff]" />
              <span className="hidden sm:inline">Indicators ({Object.values(showIndicators).filter(Boolean).length})</span>
              <ChevronDown className="w-3 h-3 text-[#787b86]" />
            </button>

            {indicatorsMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-xl z-50 p-2 text-xs">
                <div className="px-2 py-1 text-[#787b86] font-semibold text-[10px] uppercase">
                  Institutional Overlays
                </div>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#a855f7] font-semibold">Volume Profile (VRVP)</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.volumeProfile}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, volumeProfile: e.target.checked }))}
                    className="rounded text-[#a855f7]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#06b6d4] font-semibold">VWAP + Dev Bands</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.vwap}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, vwap: e.target.checked }))}
                    className="rounded text-[#06b6d4]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#089981] font-semibold">SuperTrend Cloud</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.supertrend}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, supertrend: e.target.checked }))}
                    className="rounded text-[#089981]"
                  />
                </label>
                <div className="my-1 border-t border-[#e0e3eb] dark:border-[#2a2e39]" />
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#2962ff]">EMA (20)</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.ma20}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, ma20: e.target.checked }))}
                    className="rounded text-[#2962ff]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#f59e0b]">SMA (50)</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.ma50}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, ma50: e.target.checked }))}
                    className="rounded text-[#f59e0b]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#ec4899]">Bollinger Bands</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.bollinger}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, bollinger: e.target.checked }))}
                    className="rounded text-[#ec4899]"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer">
                  <span className="text-[#e11d48]">RSI (14) Sub-chart</span>
                  <input
                    type="checkbox"
                    checked={showIndicators.rsi}
                    onChange={(e) => setShowIndicators((prev) => ({ ...prev, rsi: e.target.checked }))}
                    className="rounded text-[#e11d48]"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Price Alert Trigger Button */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f0f3fa] dark:bg-[#131722] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg text-xs font-semibold text-[#131722] dark:text-white transition-colors"
            title="Create Price Alert"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="hidden lg:inline">Alert</span>
          </button>

          {/* Trade Order Button */}
          <button
            onClick={onOpenTrade}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Order</span>
          </button>
        </div>
      </div>

      {/* Main Chart Body: Left Drawing Suite + Center Canvas + Right Volume Profile */}
      <div className="flex relative">
        {/* Left Drawing Tools Sidebar (Signature TradingView Left Bar) */}
        <div className="w-11 bg-[#f8f9fd] dark:bg-[#181c27] border-r border-[#e0e3eb] dark:border-[#2a2e39] flex flex-col items-center py-2.5 gap-1.5 shrink-0 z-20">
          <button
            onClick={() => setActiveDrawingTool('cursor')}
            className={`p-2 rounded-lg transition-colors ${
              activeDrawingTool === 'cursor'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39]'
            }`}
            title="Crosshair Cursor"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveDrawingTool('trendline')}
            className={`p-2 rounded-lg transition-colors ${
              activeDrawingTool === 'trendline'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39]'
            }`}
            title="Trend Line Tool"
          >
            <Minus className="w-4 h-4 rotate-45" />
          </button>

          <button
            onClick={() => setActiveDrawingTool('horizontal')}
            className={`p-2 rounded-lg transition-colors ${
              activeDrawingTool === 'horizontal'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39]'
            }`}
            title="Support / Resistance Horizontal Ray"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveDrawingTool('fibonacci')}
            className={`p-2 rounded-lg transition-colors ${
              activeDrawingTool === 'fibonacci'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39]'
            }`}
            title="Fibonacci Retracement (0.236, 0.382, 0.5, 0.618)"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveDrawingTool('position')}
            className={`p-2 rounded-lg transition-colors ${
              activeDrawingTool === 'position'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39]'
            }`}
            title="Long / Short Risk-Reward Target Box"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <div className="w-5 h-px bg-[#e0e3eb] dark:bg-[#2a2e39] my-1" />

          {drawings.length > 0 && (
            <button
              onClick={() => setDrawings([])}
              className="p-2 rounded-lg text-[#787b86] hover:text-[#f23645] hover:bg-[#f23645]/10 transition-colors"
              title="Remove All Drawings"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center Canvas Area */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden select-none bg-[#fbfcfe] dark:bg-[#131722] transition-colors"
          style={{ height: chartHeight + (showIndicators.rsi ? 90 : 0) }}
        >
          {/* TradingView signature watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-8xl font-black font-mono tracking-tighter text-[#131722] dark:text-white">
              {symbol.symbol}
            </span>
          </div>

          {/* Active Tool Notification Banner */}
          {activeDrawingTool !== 'cursor' && (
            <div className="absolute top-2 left-4 z-20 px-2.5 py-1 bg-[#2962ff] text-white rounded text-[11px] font-semibold flex items-center gap-2 shadow">
              <span>Tool: {activeDrawingTool.toUpperCase()} (Click 2 points on chart)</span>
              <button onClick={() => setActiveDrawingTool('cursor')} className="hover:underline">
                Done
              </button>
            </div>
          )}

          {/* Indicator Values Top Bar */}
          <div className="absolute top-2 left-4 z-10 flex items-center gap-3 text-[11px] font-mono pointer-events-none">
            {showIndicators.vwap && (
              <span className="text-[#06b6d4] flex items-center gap-1 font-semibold">
                VWAP: {vwapData[vwapData.length - 1]?.toFixed(2) || '—'}
              </span>
            )}
            {showIndicators.supertrend && (
              <span className="text-[#089981] flex items-center gap-1 font-semibold">
                SuperTrend: Bullish
              </span>
            )}
            {showIndicators.ma20 && (
              <span className="text-[#2962ff] flex items-center gap-1">
                EMA 20: {ma20Data[ma20Data.length - 1]?.toFixed(2) || '—'}
              </span>
            )}
            {showIndicators.volumeProfile && (
              <span className="text-[#a855f7] flex items-center gap-1 font-semibold">
                VRVP POC: ${volumeProfile.find((vp) => vp.isPOC)?.priceLevel || '—'}
              </span>
            )}
          </div>

          {/* SVG Canvas */}
          <svg
            className={`w-full h-full ${activeDrawingTool !== 'cursor' ? 'cursor-crosshair' : 'cursor-crosshair'}`}
            viewBox={`0 0 ${chartWidth} ${chartHeight + (showIndicators.rsi ? 90 : 0)}`}
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCanvasClick}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
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
                    stroke="#888888"
                    strokeOpacity="0.12"
                    strokeDasharray="4 4"
                  />
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

            {/* Volume Profile (VRVP) Histogram on Right side */}
            {showIndicators.volumeProfile &&
              volumeProfile.map((vp, idx) => {
                const y = getY(vp.priceLevel);
                const barWidth = (vp.totalVolume / maxVPVolume) * 90;
                const buyWidth = (vp.buyVolume / vp.totalVolume) * barWidth;
                const xStart = chartWidth - padding.right - barWidth;

                return (
                  <g key={'vp-' + idx}>
                    {/* Buy Vol */}
                    <rect
                      x={xStart}
                      y={y - 5}
                      width={buyWidth}
                      height="9"
                      fill="#089981"
                      opacity="0.3"
                    />
                    {/* Sell Vol */}
                    <rect
                      x={xStart + buyWidth}
                      y={y - 5}
                      width={barWidth - buyWidth}
                      height="9"
                      fill="#f23645"
                      opacity="0.3"
                    />
                    {/* Point of Control (POC) bright red horizontal ray */}
                    {vp.isPOC && (
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={chartWidth - padding.right}
                        y2={y}
                        stroke="#f23645"
                        strokeWidth="1.5"
                        strokeDasharray="5 3"
                      />
                    )}
                  </g>
                );
              })}

            {/* Volume bars at bottom */}
            {showIndicators.volume &&
              candles.map((candle, idx) => {
                const x = getX(idx);
                const volRatio = candle.volume / maxVolume;
                const barHeight = volRatio * 50;
                const y = chartHeight - padding.bottom - barHeight;
                const isUp = candle.close >= candle.open;
                const barWidth = Math.max(1.5, (chartWidth / candles.length) * 0.55);

                return (
                  <rect
                    key={'vol-' + idx}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={isUp ? '#089981' : '#f23645'}
                    opacity={0.3}
                  />
                );
              })}

            {/* Area or Line or Candlesticks */}
            {chartType === 'area' && (
              <>
                <polygon
                  points={`
                    ${getX(0)},${chartHeight - padding.bottom}
                    ${candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')}
                    ${getX(candles.length - 1)},${chartHeight - padding.bottom}
                  `}
                  fill="url(#areaGrad)"
                />
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

            {(chartType === 'candle' || chartType === 'heikin') &&
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
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={candleColor} strokeWidth="1.2" />
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

            {/* VWAP Line */}
            {showIndicators.vwap && (
              <polyline
                points={candles
                  .map((_, i) => (vwapData[i] !== null ? `${getX(i)},${getY(vwapData[i]!)}` : null))
                  .filter(Boolean)
                  .join(' ')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.8"
              />
            )}

            {/* MA 20 */}
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

            {/* MA 50 */}
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

            {/* Bollinger Bands */}
            {showIndicators.bollinger && (
              <>
                <polyline
                  points={candles
                    .map((_, i) => (bollingerData.upper[i] !== null ? `${getX(i)},${getY(bollingerData.upper[i]!)}` : null))
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <polyline
                  points={candles
                    .map((_, i) => (bollingerData.lower[i] !== null ? `${getX(i)},${getY(bollingerData.lower[i]!)}` : null))
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </>
            )}

            {/* User Custom Drawings Overlay (Trendlines, Fibonacci, R:R Box) */}
            {drawings.map((draw) => {
              if (draw.points.length < 2) return null;
              const p1 = draw.points[0];
              const p2 = draw.points[1];

              if (draw.tool === 'trendline') {
                return (
                  <line
                    key={draw.id}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#2962ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              }

              if (draw.tool === 'horizontal') {
                return (
                  <line
                    key={draw.id}
                    x1={padding.left}
                    y1={p1.y}
                    x2={chartWidth - padding.right}
                    y2={p1.y}
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                );
              }

              if (draw.tool === 'fibonacci') {
                const highY = Math.min(p1.y, p2.y);
                const lowY = Math.max(p1.y, p2.y);
                const diff = lowY - highY;
                const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];

                return (
                  <g key={draw.id}>
                    {levels.map((lvl) => {
                      const curY = lowY - diff * lvl;
                      return (
                        <g key={'fib-' + lvl}>
                          <line
                            x1={padding.left}
                            y1={curY}
                            x2={chartWidth - padding.right}
                            y2={curY}
                            stroke="#06b6d4"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                          <text x={chartWidth - padding.right - 45} y={curY - 3} fill="#06b6d4" fontSize="9">
                            Fib {lvl}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              }

              if (draw.tool === 'position') {
                // Long position R:R box
                const topY = Math.min(p1.y, p2.y);
                const midY = (p1.y + p2.y) / 2;
                const botY = Math.max(p1.y, p2.y);
                return (
                  <g key={draw.id}>
                    {/* Target Profit Area (Green) */}
                    <rect x={p1.x} y={topY} width="120" height={midY - topY} fill="#089981" opacity="0.25" />
                    {/* Stop Loss Area (Red) */}
                    <rect x={p1.x} y={midY} width="120" height={botY - midY} fill="#f23645" opacity="0.25" />
                    <line x1={p1.x} y1={midY} x2={p1.x + 120} y2={midY} stroke="#2962ff" strokeWidth="2" />
                    <text x={p1.x + 8} y={midY - 5} fill="#089981" fontSize="10" fontWeight="bold">
                      Target 1:2.5 R:R
                    </text>
                  </g>
                );
              }

              return null;
            })}

            {/* Current Price Line */}
            <line
              x1={padding.left}
              y1={getY(symbol.price)}
              x2={chartWidth - padding.right}
              y2={getY(symbol.price)}
              stroke={isPositive ? '#089981' : '#f23645'}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {/* Price Badge on Axis */}
            <g transform={`translate(${chartWidth - padding.right}, ${getY(symbol.price) - 9})`}>
              <rect width="68" height="18" fill={isPositive ? '#089981' : '#f23645'} rx="2" />
              <text x="6" y="13" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
                {symbol.price.toFixed(symbol.price < 5 ? 4 : 2)}
              </text>
            </g>

            {/* Interactive Crosshair Tracking */}
            {hoverIndex !== null && candles[hoverIndex] && (
              <>
                <line
                  x1={getX(hoverIndex)}
                  y1={padding.top}
                  x2={getX(hoverIndex)}
                  y2={chartHeight - padding.bottom}
                  stroke="#787b86"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <line
                  x1={padding.left}
                  y1={getY(candles[hoverIndex].close)}
                  x2={chartWidth - padding.right}
                  y2={getY(candles[hoverIndex].close)}
                  stroke="#787b86"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <g transform={`translate(${chartWidth - padding.right}, ${getY(candles[hoverIndex].close) - 9})`}>
                  <rect width="68" height="18" fill="#2a2e39" rx="2" />
                  <text x="6" y="13" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    {candles[hoverIndex].close.toFixed(symbol.price < 5 ? 4 : 2)}
                  </text>
                </g>
                <g transform={`translate(${getX(hoverIndex) - 28}, ${chartHeight - padding.bottom + 6})`}>
                  <rect width="56" height="18" fill="#2a2e39" rx="2" />
                  <text x="6" y="13" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    {candles[hoverIndex].time}
                  </text>
                </g>
              </>
            )}

            {/* RSI Sub-Chart */}
            {showIndicators.rsi && (
              <g transform={`translate(0, ${chartHeight})`}>
                <rect x={padding.left} y="0" width={chartWidth - padding.left - padding.right} height="80" fill="#181c27" />
                <line x1={padding.left} y1="24" x2={chartWidth - padding.right} y2="24" stroke="#363a45" strokeDasharray="2 2" />
                <text x={chartWidth - padding.right + 6} y="27" fill="#ec4899" fontSize="9">70</text>
                <line x1={padding.left} y1="56" x2={chartWidth - padding.right} y2="56" stroke="#363a45" strokeDasharray="2 2" />
                <text x={chartWidth - padding.right + 6} y="59" fill="#089981" fontSize="9">30</text>
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
      </div>

      {/* Chart Footer: 52W Range, Technical Rating & Pro Shortcuts */}
      <div className="px-4 py-2.5 bg-[#f8f9fd] dark:bg-[#1e222d] border-t border-[#e0e3eb] dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-xs">
        {symbol.low52w && symbol.high52w && (
          <div className="flex items-center gap-2.5">
            <span className="text-[#787b86]">52W Range:</span>
            <span className="font-mono text-[#131722] dark:text-white font-medium">${symbol.low52w.toFixed(2)}</span>
            <div className="w-24 sm:w-36 h-1.5 bg-[#e0e3eb] dark:bg-[#131722] rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 bg-[#2962ff] rounded-full"
                style={{
                  left: `${Math.max(0, Math.min(100, ((symbol.price - symbol.low52w) / (symbol.high52w - symbol.low52w)) * 100))}%`,
                  width: '6px',
                }}
              />
            </div>
            <span className="font-mono text-[#131722] dark:text-white font-medium">${symbol.high52w.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-[#787b86]">
            <span>Active Indicators:</span>
            <span className="text-[#2962ff] font-semibold">
              {Object.entries(showIndicators).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(' · ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
