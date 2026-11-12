import { useState, useEffect, useCallback } from 'react';
import { MarketSymbol, Candle, TradePosition } from '../types/market';
import { INITIAL_MARKET_SYMBOLS, generateCandleSeries } from '../data/mockMarketData';

export function useLiveMarket() {
  const [symbols, setSymbols] = useState<MarketSymbol[]>(() => {
    return INITIAL_MARKET_SYMBOLS;
  });

  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('SPX');
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candle' | 'area' | 'line'>('candle');
  const [showIndicators, setShowIndicators] = useState<{
    ma20: boolean;
    ma50: boolean;
    bollinger: boolean;
    rsi: boolean;
    volume: boolean;
  }>({
    ma20: true,
    ma50: true,
    bollinger: false,
    rsi: false,
    volume: true,
  });

  // Watchlist persistence
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['SPX', 'NDX', 'NVDA', 'AAPL', 'BTCUSD', 'XAUUSD'];
    } catch {
      return ['SPX', 'NDX', 'NVDA', 'AAPL', 'BTCUSD', 'XAUUSD'];
    }
  });

  // Paper Trading state
  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tv_paper_balance');
      return saved ? JSON.parse(saved) : 100000;
    } catch {
      return 100000;
    }
  });

  const [positions, setPositions] = useState<TradePosition[]>(() => {
    try {
      const saved = localStorage.getItem('tv_paper_positions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Candle data for current active symbol
  const selectedSymbol = symbols.find((s) => s.symbol === selectedSymbolId) || symbols[0];
  const [candles, setCandles] = useState<Candle[]>(() => {
    return generateCandleSeries(selectedSymbol.price, 50, '1D');
  });

  // Regenerate candles when symbol or timeframe changes
  useEffect(() => {
    if (selectedSymbol) {
      setCandles(generateCandleSeries(selectedSymbol.price, 50, activeTimeframe));
    }
  }, [selectedSymbolId, activeTimeframe]);

  // Save watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error(e);
    }
  }, [watchlist]);

  // Save paper trading to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_paper_balance', JSON.stringify(cashBalance));
      localStorage.setItem('tv_paper_positions', JSON.stringify(positions));
    } catch (e) {
      console.error(e);
    }
  }, [cashBalance, positions]);

  // Simulate real-time ticking market feed (TradingView live pulse)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 2-3 random symbols to tick
      setSymbols((prevSymbols) => {
        return prevSymbols.map((item) => {
          // 40% chance to update in this interval
          if (Math.random() > 0.45) return item;

          const isCrypto = item.type === 'crypto';
          const volatilityPct = isCrypto ? 0.0012 : 0.0006;
          const deltaPct = (Math.random() - 0.49) * volatilityPct;
          const newPrice = Number(Math.max(item.price * (1 + deltaPct), 0.0001).toFixed(item.price < 10 ? 4 : 2));
          const priceDiff = newPrice - item.open;
          const newChange = Number(priceDiff.toFixed(item.price < 10 ? 4 : 2));
          const newChangePct = Number(((priceDiff / item.open) * 100).toFixed(2));
          const newHigh = Math.max(item.high, newPrice);
          const newLow = Math.min(item.low, newPrice);

          // Update sparkline
          const newSparkline = [...item.sparkline.slice(1), newPrice];

          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
            high: newHigh,
            low: newLow,
            sparkline: newSparkline,
          };
        });
      });
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  // Update latest candle in real time with active symbol price
  useEffect(() => {
    if (!selectedSymbol) return;
    setCandles((prevCandles) => {
      if (!prevCandles || prevCandles.length === 0) return prevCandles;
      const lastIndex = prevCandles.length - 1;
      const last = prevCandles[lastIndex];
      const updatedLast: Candle = {
        ...last,
        close: selectedSymbol.price,
        high: Math.max(last.high, selectedSymbol.price),
        low: Math.min(last.low, selectedSymbol.price),
        volume: last.volume + Math.floor(Math.random() * 20 + 5),
      };
      const copy = [...prevCandles];
      copy[lastIndex] = updatedLast;
      return copy;
    });
  }, [selectedSymbol?.price]);

  // Update position P&Ls based on current symbol prices
  useEffect(() => {
    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        const live = symbols.find((s) => s.symbol === pos.symbol);
        if (!live) return pos;
        const currentPrice = live.price;
        const pnl =
          pos.type === 'BUY'
            ? (currentPrice - pos.entryPrice) * pos.shares
            : (pos.entryPrice - currentPrice) * pos.shares;
        const pnlPercent = ((currentPrice - pos.entryPrice) / pos.entryPrice) * (pos.type === 'BUY' ? 100 : -100);
        return {
          ...pos,
          currentPrice,
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(pnlPercent.toFixed(2)),
        };
      })
    );
  }, [symbols]);

  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => {
      if (prev.includes(symbol)) {
        return prev.filter((s) => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  }, []);

  const executeTrade = useCallback(
    (symbol: string, type: 'BUY' | 'SELL', shares: number) => {
      const live = symbols.find((s) => s.symbol === symbol);
      if (!live || shares <= 0) return { success: false, message: 'Invalid asset or share count' };

      const totalCost = live.price * shares;

      if (type === 'BUY') {
        if (cashBalance < totalCost) {
          return { success: false, message: 'Insufficient paper balance ($' + cashBalance.toLocaleString() + ')' };
        }
        setCashBalance((prev) => prev - totalCost);
        const newPos: TradePosition = {
          id: 'pos-' + Date.now(),
          symbol: live.symbol,
          name: live.name,
          type: 'BUY',
          shares,
          entryPrice: live.price,
          currentPrice: live.price,
          pnl: 0,
          pnlPercent: 0,
          timestamp: Date.now(),
        };
        setPositions((prev) => [newPos, ...prev]);
        return { success: true, message: `Bought ${shares} shares of ${live.symbol} @ $${live.price}` };
      } else {
        // Sell / short
        setCashBalance((prev) => prev + totalCost);
        const newPos: TradePosition = {
          id: 'pos-' + Date.now(),
          symbol: live.symbol,
          name: live.name,
          type: 'SELL',
          shares,
          entryPrice: live.price,
          currentPrice: live.price,
          pnl: 0,
          pnlPercent: 0,
          timestamp: Date.now(),
        };
        setPositions((prev) => [newPos, ...prev]);
        return { success: true, message: `Shorted / Sold ${shares} shares of ${live.symbol} @ $${live.price}` };
      }
    },
    [cashBalance, symbols]
  );

  const closePosition = useCallback((positionId: string) => {
    setPositions((prev) => {
      const pos = prev.find((p) => p.id === positionId);
      if (pos) {
        setCashBalance((curr) => curr + (pos.entryPrice * pos.shares + pos.pnl));
      }
      return prev.filter((p) => p.id !== positionId);
    });
  }, []);

  return {
    symbols,
    selectedSymbol,
    selectedSymbolId,
    setSelectedSymbolId,
    activeTimeframe,
    setActiveTimeframe,
    chartType,
    setChartType,
    showIndicators,
    setShowIndicators,
    candles,
    watchlist,
    toggleWatchlist,
    cashBalance,
    positions,
    executeTrade,
    closePosition,
  };
}
