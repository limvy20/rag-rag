export type AssetType = 'stock' | 'crypto' | 'index' | 'forex' | 'commodity' | 'bond';

export interface MarketSymbol {
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  volumeNumeric: number;
  marketCap?: string;
  peRatio?: number;
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  sparkline: number[];
  sector?: string;
  currency?: string;
  country?: string;
  description?: string;
  high52w?: number;
  low52w?: number;
}

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface VolumeProfileBar {
  priceLevel: number;
  buyVolume: number;
  sellVolume: number;
  totalVolume: number;
  isPOC?: boolean; // Point of Control
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; // in billions
  changePercent: number;
  change1w?: number;
  change1m?: number;
  price: number;
  volume: string;
  peRatio?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Stocks' | 'Crypto' | 'Forex' | 'Economy' | 'Commodities';
  relatedSymbols: string[];
  url?: string;
  imageUrl?: string;
  summary: string;
}

export interface EconomicEvent {
  id: string;
  country: string;
  flag: string;
  time: string;
  event: string;
  impact: 'low' | 'medium' | 'high';
  actual: string;
  forecast: string;
  previous: string;
}

export interface TradePosition {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'crossing_up' | 'crossing_down' | 'greater_than' | 'less_than';
  createdPrice: number;
  createdAt: number;
  triggered: boolean;
  note?: string;
}

export type DrawingTool = 'cursor' | 'trendline' | 'horizontal' | 'fibonacci' | 'position' | 'measure';

export interface ChartDrawing {
  id: string;
  tool: DrawingTool;
  symbol: string;
  points: { x: number; y: number; price?: number; index?: number }[];
  color?: string;
}

export interface StrategyPerformance {
  strategyName: string;
  netProfitPercent: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  totalTrades: number;
  sharpeRatio: number;
}
