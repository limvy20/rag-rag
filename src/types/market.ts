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

export interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; // in billions
  changePercent: number;
  price: number;
  volume: string;
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
