import {
  MarketSymbol,
  Candle,
  HeatmapItem,
  NewsItem,
  EconomicEvent,
  OrderBookData,
  OrderBookEntry,
  VolumeProfileBar,
  StrategyPerformance,
} from '../types/market';

export const INITIAL_MARKET_SYMBOLS: MarketSymbol[] = [
  // Indices
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    type: 'index',
    price: 5983.25,
    change: 28.45,
    changePercent: 0.48,
    open: 5960.10,
    high: 5991.40,
    low: 5952.80,
    volume: '2.45B',
    volumeNumeric: 2450000000,
    rating: 'Buy',
    sparkline: [5940, 5950, 5955, 5948, 5965, 5972, 5983],
    currency: 'USD',
    country: 'US',
    description: 'Benchmark stock market index tracking 500 of the largest public companies listed on US stock exchanges.',
    high52w: 6025.50,
    low52w: 4682.10,
  },
  {
    symbol: 'NDX',
    name: 'Nasdaq 100',
    type: 'index',
    price: 21124.60,
    change: 152.30,
    changePercent: 0.73,
    open: 20990.00,
    high: 21160.20,
    low: 20970.50,
    volume: '1.82B',
    volumeNumeric: 1820000000,
    rating: 'Strong Buy',
    sparkline: [20950, 20980, 21010, 21040, 21090, 21110, 21124],
    currency: 'USD',
    country: 'US',
    description: 'Index of 100 largest non-financial companies listed on the Nasdaq stock exchange, weighted heavily in technology.',
    high52w: 21250.00,
    low52w: 16100.00,
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones Industrial Average',
    type: 'index',
    price: 43910.80,
    change: -45.20,
    changePercent: -0.10,
    open: 43960.00,
    high: 44020.10,
    low: 43850.00,
    volume: '380M',
    volumeNumeric: 380000000,
    rating: 'Neutral',
    sparkline: [43980, 43990, 43950, 43920, 43900, 43915, 43910],
    currency: 'USD',
    country: 'US',
    description: 'Price-weighted measurement stock market index of 30 prominent companies listed on stock exchanges in the US.',
    high52w: 44486.72,
    low52w: 37122.95,
  },
  {
    symbol: 'RUT',
    name: 'Russell 2000',
    type: 'index',
    price: 2382.40,
    change: 18.60,
    changePercent: 0.79,
    open: 2365.10,
    high: 2388.90,
    low: 2360.20,
    volume: '890M',
    volumeNumeric: 890000000,
    rating: 'Buy',
    sparkline: [2350, 2362, 2360, 2371, 2378, 2380, 2382],
    currency: 'USD',
    country: 'US',
    high52w: 2445.00,
    low52w: 1910.00,
  },
  {
    symbol: 'DAX',
    name: 'DAX 40 Germany',
    type: 'index',
    price: 19445.10,
    change: 82.40,
    changePercent: 0.43,
    open: 19380.00,
    high: 19480.00,
    low: 19360.00,
    volume: '95M',
    volumeNumeric: 95000000,
    rating: 'Buy',
    sparkline: [19350, 19370, 19390, 19410, 19430, 19445],
    currency: 'EUR',
    country: 'DE',
    high52w: 19674.68,
    low52w: 15600.00,
  },
  {
    symbol: 'FTSE',
    name: 'FTSE 100 UK',
    type: 'index',
    price: 8274.50,
    change: -12.30,
    changePercent: -0.15,
    open: 8290.00,
    high: 8305.00,
    low: 8260.00,
    volume: '620M',
    volumeNumeric: 620000000,
    rating: 'Neutral',
    sparkline: [8295, 8290, 8285, 8280, 8270, 8274],
    currency: 'GBP',
    country: 'UK',
    high52w: 8474.41,
    low52w: 7400.00,
  },
  {
    symbol: 'N225',
    name: 'Nikkei 225 Japan',
    type: 'index',
    price: 38720.00,
    change: 410.00,
    changePercent: 1.07,
    open: 38400.00,
    high: 38850.00,
    low: 38320.00,
    volume: '1.1B',
    volumeNumeric: 1100000000,
    rating: 'Strong Buy',
    sparkline: [38300, 38450, 38550, 38620, 38700, 38720],
    currency: 'JPY',
    country: 'JP',
    high52w: 42426.77,
    low52w: 30500.00,
  },

  // US Stocks
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'stock',
    price: 148.25,
    change: 4.15,
    changePercent: 2.88,
    open: 144.50,
    high: 149.20,
    low: 144.10,
    volume: '68.4M',
    volumeNumeric: 68400000,
    marketCap: '3.62T',
    peRatio: 58.4,
    rating: 'Strong Buy',
    sparkline: [142, 143.5, 145, 144.8, 147.2, 148.25],
    sector: 'Technology',
    currency: 'USD',
    country: 'US',
    description: 'Pioneer of GPU-accelerated computing and hardware leader driving global artificial intelligence, data centers, and autonomy.',
    high52w: 153.15,
    low52w: 45.11,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 232.40,
    change: 1.65,
    changePercent: 0.71,
    open: 230.90,
    high: 233.10,
    low: 230.50,
    volume: '42.1M',
    volumeNumeric: 42100000,
    marketCap: '3.52T',
    peRatio: 36.2,
    rating: 'Buy',
    sparkline: [229, 230.2, 231, 230.8, 231.8, 232.4],
    sector: 'Technology',
    currency: 'USD',
    country: 'US',
    description: 'Global consumer electronics giant designing iPhone, Mac, iPad, wearables, and enterprise subscription services.',
    high52w: 237.49,
    low52w: 164.08,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    price: 428.80,
    change: 3.40,
    changePercent: 0.80,
    open: 425.20,
    high: 430.10,
    low: 424.90,
    volume: '22.8M',
    volumeNumeric: 22800000,
    marketCap: '3.19T',
    peRatio: 35.1,
    rating: 'Buy',
    sparkline: [424, 425.5, 426.8, 426.2, 428, 428.8],
    sector: 'Technology',
    currency: 'USD',
    country: 'US',
    description: 'Cloud computing titan offering Azure, Windows, Microsoft 365 productivity suite, and OpenAI strategic computing partnership.',
    high52w: 468.35,
    low52w: 366.50,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    type: 'stock',
    price: 208.50,
    change: 2.90,
    changePercent: 1.41,
    open: 205.80,
    high: 209.40,
    low: 205.20,
    volume: '34.5M',
    volumeNumeric: 34500000,
    marketCap: '2.18T',
    peRatio: 44.2,
    rating: 'Strong Buy',
    sparkline: [203, 204.5, 206, 205.8, 207.5, 208.5],
    sector: 'Consumer Cyclical',
    currency: 'USD',
    country: 'US',
    description: 'Dominant global e-commerce platform, AWS cloud infrastructure leader, digital streaming, and ad tech powerhouse.',
    high52w: 215.90,
    low52w: 139.46,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    price: 182.10,
    change: 1.80,
    changePercent: 1.00,
    open: 180.50,
    high: 183.00,
    low: 180.10,
    volume: '26.3M',
    volumeNumeric: 26300000,
    marketCap: '2.25T',
    peRatio: 23.8,
    rating: 'Buy',
    sparkline: [179, 180, 181.2, 180.8, 181.6, 182.1],
    sector: 'Communication Services',
    currency: 'USD',
    country: 'US',
    description: 'Holding company for Google search, YouTube, Android, Chrome, Google Cloud Platform, and Waymo autonomous mobility.',
    high52w: 191.75,
    low52w: 129.40,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    type: 'stock',
    price: 588.60,
    change: 7.40,
    changePercent: 1.27,
    open: 582.00,
    high: 591.20,
    low: 580.40,
    volume: '14.9M',
    volumeNumeric: 14900000,
    marketCap: '1.49T',
    peRatio: 28.5,
    rating: 'Strong Buy',
    sparkline: [578, 581, 583.5, 582.9, 587, 588.6],
    sector: 'Communication Services',
    currency: 'USD',
    country: 'US',
    description: 'Social networking and digital advertising powerhouse operating Facebook, Instagram, WhatsApp, Messenger, and Llama open models.',
    high52w: 602.95,
    low52w: 313.66,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'stock',
    price: 338.90,
    change: 14.20,
    changePercent: 4.37,
    open: 326.00,
    high: 342.50,
    low: 324.80,
    volume: '88.2M',
    volumeNumeric: 88200000,
    marketCap: '1.08T',
    peRatio: 104.2,
    rating: 'Buy',
    sparkline: [318, 324, 329, 327, 335, 338.9],
    sector: 'Consumer Cyclical',
    currency: 'USD',
    country: 'US',
    description: 'Electric vehicle manufacturer, clean energy generation & storage provider, Full Self-Driving AI systems, and humanoid robotics developer.',
    high52w: 360.00,
    low52w: 138.80,
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    type: 'stock',
    price: 172.40,
    change: 3.10,
    changePercent: 1.83,
    open: 169.50,
    high: 173.80,
    low: 169.10,
    volume: '18.4M',
    volumeNumeric: 18400000,
    marketCap: '802B',
    peRatio: 38.6,
    rating: 'Strong Buy',
    sparkline: [167, 169, 170.2, 171, 171.8, 172.4],
    sector: 'Technology',
    currency: 'USD',
    country: 'US',
    high52w: 185.16,
    low52w: 89.20,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    type: 'stock',
    price: 242.15,
    change: -1.35,
    changePercent: -0.55,
    open: 243.80,
    high: 244.50,
    low: 241.60,
    volume: '9.4M',
    volumeNumeric: 9400000,
    marketCap: '685B',
    peRatio: 12.8,
    rating: 'Neutral',
    sparkline: [244, 243.5, 243, 242.8, 242.3, 242.15],
    sector: 'Financials',
    currency: 'USD',
    country: 'US',
    high52w: 248.90,
    low52w: 147.20,
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    type: 'stock',
    price: 812.50,
    change: 12.80,
    changePercent: 1.60,
    open: 801.00,
    high: 816.20,
    low: 799.50,
    volume: '3.8M',
    volumeNumeric: 3800000,
    marketCap: '772B',
    peRatio: 64.1,
    rating: 'Strong Buy',
    sparkline: [795, 800, 804, 806, 810, 812.5],
    sector: 'Healthcare',
    currency: 'USD',
    country: 'US',
    high52w: 972.53,
    low52w: 550.00,
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    type: 'stock',
    price: 141.60,
    change: 4.80,
    changePercent: 3.51,
    open: 137.20,
    high: 142.90,
    low: 136.80,
    volume: '48.9M',
    volumeNumeric: 48900000,
    marketCap: '229B',
    peRatio: 98.4,
    rating: 'Buy',
    sparkline: [134, 136.5, 138, 139.2, 140.5, 141.6],
    sector: 'Technology',
    currency: 'USD',
    country: 'US',
    high52w: 227.30,
    low52w: 116.04,
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    type: 'stock',
    price: 64.85,
    change: 3.65,
    changePercent: 5.96,
    open: 61.50,
    high: 65.40,
    low: 61.20,
    volume: '74.2M',
    volumeNumeric: 74200000,
    marketCap: '144B',
    peRatio: 112.5,
    rating: 'Strong Buy',
    sparkline: [59, 61.2, 62.5, 63, 64.1, 64.85],
    sector: 'Technology',
    currency: 'USD',
    country: 'US',
    high52w: 66.06,
    low52w: 15.66,
  },

  // Crypto
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    type: 'crypto',
    price: 94820.00,
    change: 2890.00,
    changePercent: 3.14,
    open: 91930.00,
    high: 95400.00,
    low: 91650.00,
    volume: '$48.5B',
    volumeNumeric: 48500000000,
    marketCap: '1.87T',
    rating: 'Strong Buy',
    sparkline: [91200, 92100, 92800, 93400, 94200, 94820],
    currency: 'USD',
    description: 'Decentralized peer-to-peer digital currency and store of value secured by proof-of-work cryptographic hashing.',
    high52w: 99800.00,
    low52w: 38500.00,
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
    type: 'crypto',
    price: 3450.80,
    change: 82.40,
    changePercent: 2.45,
    open: 3368.40,
    high: 3490.00,
    low: 3350.00,
    volume: '$24.1B',
    volumeNumeric: 24100000000,
    marketCap: '415B',
    rating: 'Buy',
    sparkline: [3320, 3360, 3390, 3410, 3435, 3450.8],
    currency: 'USD',
    description: 'Smart contract blockchain powering decentralized finance (DeFi), NFTs, tokenized real-world assets, and layer-2 rollups.',
    high52w: 4093.00,
    low52w: 2150.00,
  },
  {
    symbol: 'SOLUSD',
    name: 'Solana',
    type: 'crypto',
    price: 218.40,
    change: 14.20,
    changePercent: 6.95,
    open: 204.20,
    high: 221.50,
    low: 202.80,
    volume: '$8.9B',
    volumeNumeric: 8900000000,
    marketCap: '103B',
    rating: 'Strong Buy',
    sparkline: [200, 204, 209, 212, 216, 218.4],
    currency: 'USD',
    high52w: 260.00,
    low52w: 52.00,
  },
  {
    symbol: 'XRPUSD',
    name: 'XRP',
    type: 'crypto',
    price: 1.48,
    change: 0.12,
    changePercent: 8.82,
    open: 1.36,
    high: 1.54,
    low: 1.34,
    volume: '$4.2B',
    volumeNumeric: 4200000000,
    marketCap: '84B',
    rating: 'Strong Buy',
    sparkline: [1.32, 1.36, 1.40, 1.44, 1.46, 1.48],
    currency: 'USD',
    high52w: 1.62,
    low52w: 0.47,
  },

  // Forex
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    type: 'forex',
    price: 1.0542,
    change: -0.0019,
    changePercent: -0.18,
    open: 1.0561,
    high: 1.0578,
    low: 1.0528,
    volume: '240K pips',
    volumeNumeric: 240000,
    rating: 'Sell',
    sparkline: [1.058, 1.057, 1.056, 1.055, 1.0545, 1.0542],
    currency: 'USD',
    high52w: 1.1215,
    low52w: 1.0448,
  },
  {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    type: 'forex',
    price: 154.38,
    change: 0.72,
    changePercent: 0.47,
    open: 153.66,
    high: 154.65,
    low: 153.40,
    volume: '310K pips',
    volumeNumeric: 310000,
    rating: 'Strong Buy',
    sparkline: [153.2, 153.5, 153.8, 154.1, 154.25, 154.38],
    currency: 'JPY',
    high52w: 161.95,
    low52w: 139.58,
  },

  // Futures & Commodities
  {
    symbol: 'CL',
    name: 'Crude Oil WTI Futures',
    type: 'commodity',
    price: 71.85,
    change: 0.95,
    changePercent: 1.34,
    open: 70.90,
    high: 72.30,
    low: 70.60,
    volume: '340K',
    volumeNumeric: 340000,
    rating: 'Buy',
    sparkline: [70.2, 70.6, 71.1, 71.4, 71.6, 71.85],
    currency: 'USD',
    high52w: 87.67,
    low52w: 65.27,
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold Spot',
    type: 'commodity',
    price: 2684.50,
    change: 14.20,
    changePercent: 0.53,
    open: 2670.30,
    high: 2692.00,
    low: 2668.00,
    volume: '1.2M oz',
    volumeNumeric: 1200000,
    rating: 'Strong Buy',
    sparkline: [2660, 2668, 2674, 2678, 2681, 2684.5],
    currency: 'USD',
    high52w: 2790.15,
    low52w: 1984.00,
  },

  // Sovereign Bonds
  {
    symbol: 'US10Y',
    name: 'US 10-Year Treasury Yield',
    type: 'bond',
    price: 4.428,
    change: -0.024,
    changePercent: -0.54,
    open: 4.452,
    high: 4.465,
    low: 4.415,
    volume: 'Active',
    volumeNumeric: 100000,
    rating: 'Neutral',
    sparkline: [4.47, 4.46, 4.45, 4.44, 4.432, 4.428],
    currency: '%',
    country: 'US',
    high52w: 4.74,
    low52w: 3.60,
  },
];

export const HEATMAP_DATA: HeatmapItem[] = [
  // Technology
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Technology', marketCap: 3620, changePercent: 2.88, change1w: 6.4, change1m: 14.2, price: 148.25, volume: '68M', peRatio: 58.4 },
  { symbol: 'AAPL', name: 'Apple', sector: 'Technology', marketCap: 3520, changePercent: 0.71, change1w: 1.8, change1m: 4.5, price: 232.40, volume: '42M', peRatio: 36.2 },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology', marketCap: 3190, changePercent: 0.80, change1w: 2.1, change1m: 5.1, price: 428.80, volume: '22M', peRatio: 35.1 },
  { symbol: 'AVGO', name: 'Broadcom', sector: 'Technology', marketCap: 802, changePercent: 1.83, change1w: 4.2, change1m: 9.8, price: 172.40, volume: '18M', peRatio: 38.6 },
  { symbol: 'ORCL', name: 'Oracle', sector: 'Technology', marketCap: 520, changePercent: 1.45, change1w: 3.0, change1m: 8.2, price: 189.60, volume: '12M', peRatio: 41.2 },
  { symbol: 'CRM', name: 'Salesforce', sector: 'Technology', marketCap: 310, changePercent: -0.65, change1w: -1.2, change1m: 3.4, price: 326.50, volume: '8M', peRatio: 49.5 },
  { symbol: 'AMD', name: 'AMD', sector: 'Technology', marketCap: 229, changePercent: 3.51, change1w: 7.8, change1m: 11.2, price: 141.60, volume: '48M', peRatio: 98.4 },
  { symbol: 'PLTR', name: 'Palantir', sector: 'Technology', marketCap: 144, changePercent: 5.96, change1w: 14.5, change1m: 38.2, price: 64.85, volume: '74M', peRatio: 112.5 },

  // Communication Services
  { symbol: 'GOOGL', name: 'Alphabet', sector: 'Communication Services', marketCap: 2250, changePercent: 1.00, change1w: 2.5, change1m: 6.8, price: 182.10, volume: '26M', peRatio: 23.8 },
  { symbol: 'META', name: 'Meta', sector: 'Communication Services', marketCap: 1490, changePercent: 1.27, change1w: 3.8, change1m: 9.5, price: 588.60, volume: '14M', peRatio: 28.5 },
  { symbol: 'NFLX', name: 'Netflix', sector: 'Communication Services', marketCap: 385, changePercent: 1.95, change1w: 5.2, change1m: 12.1, price: 894.20, volume: '5M', peRatio: 46.2 },

  // Consumer Cyclical
  { symbol: 'AMZN', name: 'Amazon', sector: 'Consumer Cyclical', marketCap: 2180, changePercent: 1.41, change1w: 3.2, change1m: 8.9, price: 208.50, volume: '34M', peRatio: 44.2 },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Consumer Cyclical', marketCap: 1080, changePercent: 4.37, change1w: 12.8, change1m: 41.5, price: 338.90, volume: '88M', peRatio: 104.2 },
  { symbol: 'HD', name: 'Home Depot', sector: 'Consumer Cyclical', marketCap: 395, changePercent: -0.32, change1w: 0.5, change1m: 2.1, price: 402.10, volume: '6M', peRatio: 26.4 },

  // Financials
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', marketCap: 685, changePercent: -0.55, change1w: 1.1, change1m: 6.2, price: 242.15, volume: '9M', peRatio: 12.8 },
  { symbol: 'V', name: 'Visa', sector: 'Financials', marketCap: 590, changePercent: 0.40, change1w: 1.5, change1m: 4.8, price: 308.20, volume: '5M', peRatio: 31.2 },
  { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financials', marketCap: 195, changePercent: 0.88, change1w: 2.4, change1m: 7.9, price: 585.30, volume: '3M', peRatio: 16.5 },

  // Healthcare
  { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', marketCap: 772, changePercent: 1.60, change1w: 3.4, change1m: -2.1, price: 812.50, volume: '3.8M', peRatio: 64.1 },
  { symbol: 'UNH', name: 'UnitedHealth', sector: 'Healthcare', marketCap: 540, changePercent: -1.45, change1w: -2.8, change1m: 1.5, price: 588.10, volume: '4.2M', peRatio: 25.1 },

  // Energy & Industrials
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy & Industrials', marketCap: 472, changePercent: -0.67, change1w: -0.8, change1m: -1.2, price: 118.90, volume: '15M', peRatio: 14.1 },
  { symbol: 'CAT', name: 'Caterpillar', sector: 'Energy & Industrials', marketCap: 190, changePercent: 1.15, change1w: 2.8, change1m: 8.4, price: 395.60, volume: '4M', peRatio: 18.2 },
  { symbol: 'GE', name: 'GE Aerospace', sector: 'Energy & Industrials', marketCap: 195, changePercent: 2.10, change1w: 4.6, change1m: 11.2, price: 184.30, volume: '6M', peRatio: 32.8 },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Nvidia Blackwell Ultra GPU Architecture Enters Full-Scale Hyperscale Deployment',
    source: 'TradingView News',
    timeAgo: '12m ago',
    category: 'Stocks',
    relatedSymbols: ['NVDA', 'MSFT', 'AVGO'],
    summary: 'Cloud service providers accelerate procurement of next-generation AI accelerators with gross margins remaining robust above 74%.'
  },
  {
    id: 'news-2',
    title: 'Bitcoin Surges Towards $95,000 as Institutional ETF Inflows Hit Multi-Week High',
    source: 'Bloomberg Crypto',
    timeAgo: '28m ago',
    category: 'Crypto',
    relatedSymbols: ['BTCUSD', 'ETHUSD', 'SOLUSD'],
    summary: 'Spot Bitcoin exchange-traded funds recorded over $1.2B in single-day net inflows led by institutional asset managers.'
  },
  {
    id: 'news-3',
    title: 'Federal Reserve Policy Path in Focus as Core CPI Reflects Gradual Disinflation',
    source: 'Reuters',
    timeAgo: '45m ago',
    category: 'Economy',
    relatedSymbols: ['SPX', 'US10Y', 'EURUSD'],
    summary: 'Treasury yields tick lower across the curve as bond traders price in a 25 basis point benchmark rate reduction at next FOMC session.'
  },
  {
    id: 'news-4',
    title: 'Tesla Robotaxi & Full Self-Driving Version 13 Rollout Expands Across Test Fleet',
    source: 'Wall Street Journal',
    timeAgo: '1h ago',
    category: 'Stocks',
    relatedSymbols: ['TSLA'],
    summary: 'Autonomous vehicle software updates show enhanced intervention metrics, powering a 4.4% intraday rally in equity markets.'
  },
  {
    id: 'news-5',
    title: 'Crude Oil Edges Higher as OPEC+ Reaffirms Supply Restraint Quotas',
    source: 'Financial Times',
    timeAgo: '2h ago',
    category: 'Commodities',
    relatedSymbols: ['CL', 'XOM'],
    summary: 'Brent and WTI crude contracts rise over 1% as global inventory draws offset anticipated industrial demand adjustments.'
  },
  {
    id: 'news-6',
    title: 'Gold Consolidates Near Record Highs as Central Banks Boost Foreign Reserves',
    source: 'CNBC Markets',
    timeAgo: '3h ago',
    category: 'Commodities',
    relatedSymbols: ['XAUUSD', 'XAGUSD'],
    summary: 'Sovereign wealth funds and international central banks continue active bullion accumulation against currency volatility.'
  }
];

export const MOCK_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    country: 'United States',
    flag: '🇺🇸',
    time: '08:30 EST',
    event: 'Core CPI (MoM)',
    impact: 'high',
    actual: '0.2%',
    forecast: '0.3%',
    previous: '0.3%',
  },
  {
    id: 'eco-2',
    country: 'United States',
    flag: '🇺🇸',
    time: '08:30 EST',
    event: 'Initial Jobless Claims',
    impact: 'medium',
    actual: '217K',
    forecast: '224K',
    previous: '221K',
  },
  {
    id: 'eco-3',
    country: 'Eurozone',
    flag: '🇪🇺',
    time: '10:00 CET',
    event: 'ECB Monetary Policy Statement',
    impact: 'high',
    actual: '3.25%',
    forecast: '3.25%',
    previous: '3.50%',
  },
  {
    id: 'eco-4',
    country: 'United States',
    flag: '🇺🇸',
    time: '14:00 EST',
    event: 'FOMC Meeting Minutes',
    impact: 'high',
    actual: 'Released',
    forecast: '-',
    previous: '-',
  },
  {
    id: 'eco-5',
    country: 'Japan',
    flag: '🇯🇵',
    time: '23:50 JST',
    event: 'Bank of Japan Core Inflation (YoY)',
    impact: 'medium',
    actual: '2.7%',
    forecast: '2.6%',
    previous: '2.5%',
  },
];

/**
 * Generate synthetic realistic OHLC candlestick series for a symbol
 */
export function generateCandleSeries(basePrice: number, count: number = 70, timeframe: string = '1D'): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  
  let intervalMs = 60 * 1000 * 5; // default 5m
  if (timeframe === '1m') intervalMs = 60 * 1000;
  if (timeframe === '5m') intervalMs = 60 * 1000 * 5;
  if (timeframe === '15m') intervalMs = 60 * 1000 * 15;
  if (timeframe === '1h') intervalMs = 60 * 1000 * 60;
  if (timeframe === '4h') intervalMs = 60 * 1000 * 60 * 4;
  if (timeframe === '1D') intervalMs = 60 * 1000 * 60 * 24;
  if (timeframe === '1W') intervalMs = 60 * 1000 * 60 * 24 * 7;

  let currentClose = basePrice * (1 - (count * 0.0018));
  const volatility = basePrice * 0.005;

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * intervalMs;
    const dateObj = new Date(timestamp);
    let timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (timeframe === '1D' || timeframe === '1W' || timeframe === '1Y') {
      timeStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    const open = currentClose;
    const delta = (Math.random() - 0.485) * volatility * 2.2;
    const close = Math.max(open + delta, basePrice * 0.4);
    const high = Math.max(open, close) + Math.random() * volatility * 0.9;
    const low = Math.min(open, close) - Math.random() * volatility * 0.9;
    const volume = Math.floor(Math.random() * 65000 + 12000);

    candles.push({
      time: timeStr,
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentClose = close;
  }

  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return candles;
}

/**
 * Heikin-Ashi calculation helper
 */
export function computeHeikinAshi(candles: Candle[]): Candle[] {
  if (!candles || candles.length === 0) return [];
  const haCandles: Candle[] = [];

  for (let i = 0; i < candles.length; i++) {
    const cur = candles[i];
    const haClose = (cur.open + cur.high + cur.low + cur.close) / 4;
    let haOpen = cur.open;
    if (i > 0) {
      haOpen = (haCandles[i - 1].open + haCandles[i - 1].close) / 2;
    }
    const haHigh = Math.max(cur.high, haOpen, haClose);
    const haLow = Math.min(cur.low, haOpen, haClose);

    haCandles.push({
      time: cur.time,
      timestamp: cur.timestamp,
      open: Number(haOpen.toFixed(2)),
      high: Number(haHigh.toFixed(2)),
      low: Number(haLow.toFixed(2)),
      close: Number(haClose.toFixed(2)),
      volume: cur.volume,
    });
  }
  return haCandles;
}

/**
 * Generate Volume Profile (VRVP) across price levels
 */
export function generateVolumeProfile(candles: Candle[], bins: number = 20): VolumeProfileBar[] {
  if (!candles || candles.length === 0) return [];

  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const diff = maxPrice - minPrice;
  const step = (diff > 0 ? diff : 1) / bins;

  const profile: VolumeProfileBar[] = [];
  for (let i = 0; i < bins; i++) {
    const level = minPrice + i * step + step / 2;
    profile.push({
      priceLevel: Number(level.toFixed(2)),
      buyVolume: 0,
      sellVolume: 0,
      totalVolume: 0,
    });
  }

  candles.forEach((c) => {
    const binIdx = Math.min(bins - 1, Math.max(0, Math.floor((c.close - minPrice) / (step || 1))));
    const isUp = c.close >= c.open;
    if (isUp) {
      profile[binIdx].buyVolume += c.volume * 0.65;
      profile[binIdx].sellVolume += c.volume * 0.35;
    } else {
      profile[binIdx].buyVolume += c.volume * 0.35;
      profile[binIdx].sellVolume += c.volume * 0.65;
    }
    profile[binIdx].totalVolume += c.volume;
  });

  // Filter only bins that have positive trading volume to prevent 0/0 NaNs
  const validProfile = profile.filter((p) => p.totalVolume > 0);
  if (validProfile.length === 0) return [];

  // Find Point of Control (POC - highest volume node)
  let maxVol = 0;
  let pocIdx = 0;
  validProfile.forEach((p, idx) => {
    if (p.totalVolume > maxVol) {
      maxVol = p.totalVolume;
      pocIdx = idx;
    }
  });
  if (validProfile[pocIdx]) {
    validProfile[pocIdx].isPOC = true;
  }

  return validProfile;
}

/**
 * Generate realistic Level 2 Order Book (Depth of Market)
 */
export function generateOrderBook(midPrice: number): OrderBookData {
  const tickSize = midPrice > 1000 ? 1 : midPrice > 100 ? 0.1 : 0.01;
  const spread = tickSize;
  const spreadPercent = (spread / midPrice) * 100;

  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];

  let cumBid = 0;
  let cumAsk = 0;

  for (let i = 1; i <= 10; i++) {
    const bidPrice = Number((midPrice - i * tickSize).toFixed(midPrice < 5 ? 4 : 2));
    const bidSize = Math.floor(Math.random() * 450 + 50);
    cumBid += bidSize;

    const askPrice = Number((midPrice + i * tickSize).toFixed(midPrice < 5 ? 4 : 2));
    const askSize = Math.floor(Math.random() * 450 + 50);
    cumAsk += askSize;

    bids.push({
      price: bidPrice,
      size: bidSize,
      total: cumBid,
      depthPercent: 0,
    });

    asks.push({
      price: askPrice,
      size: askSize,
      total: cumAsk,
      depthPercent: 0,
    });
  }

  const maxTotal = Math.max(cumBid, cumAsk, 1);
  bids.forEach((b) => (b.depthPercent = (b.total / maxTotal) * 100));
  asks.forEach((a) => (a.depthPercent = (a.total / maxTotal) * 100));

  return {
    bids,
    asks,
    spread,
    spreadPercent,
  };
}

/**
 * Mock Strategy Backtester results
 */
export const MOCK_STRATEGIES: Record<string, StrategyPerformance> = {
  'EMA Golden Cross (9/21)': {
    strategyName: 'EMA Golden Cross (9/21)',
    netProfitPercent: 34.8,
    winRate: 64.2,
    profitFactor: 2.18,
    maxDrawdown: 8.4,
    totalTrades: 142,
    sharpeRatio: 1.84,
  },
  'RSI Divergence + Bollinger': {
    strategyName: 'RSI Divergence + Bollinger',
    netProfitPercent: 41.5,
    winRate: 71.0,
    profitFactor: 2.65,
    maxDrawdown: 6.2,
    totalTrades: 98,
    sharpeRatio: 2.21,
  },
  'SuperTrend Trend Following': {
    strategyName: 'SuperTrend Trend Following',
    netProfitPercent: 28.2,
    winRate: 58.5,
    profitFactor: 1.92,
    maxDrawdown: 11.1,
    totalTrades: 176,
    sharpeRatio: 1.62,
  },
};
