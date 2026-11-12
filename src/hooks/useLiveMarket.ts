import { useState, useEffect, useCallback } from 'react';
import { MarketSymbol, Candle, TradePosition, PriceAlert } from '../types/market';
import { INITIAL_MARKET_SYMBOLS, generateCandleSeries } from '../data/mockMarketData';

export function useLiveMarket() {
  const [symbols, setSymbols] = useState<MarketSymbol[]>(() => {
    return INITIAL_MARKET_SYMBOLS;
  });

  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('SPX');
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candle' | 'heikin' | 'area' | 'line'>('candle');
  const [chartLayout, setChartLayout] = useState<'1' | '2' | '4'>('1');

  // Multi-chart layout secondary symbols
  const [secondarySymbolId, setSecondarySymbolId] = useState<string>('NDX');
  const [tertiarySymbolId, setTertiarySymbolId] = useState<string>('BTCUSD');
  const [quaternarySymbolId, setQuaternarySymbolId] = useState<string>('NVDA');

  // Indicators state
  const [showIndicators, setShowIndicators] = useState<{
    ma20: boolean;
    ma50: boolean;
    vwap: boolean;
    supertrend: boolean;
    volumeProfile: boolean;
    bollinger: boolean;
    rsi: boolean;
    volume: boolean;
  }>({
    ma20: true,
    ma50: true,
    vwap: true,
    supertrend: false,
    volumeProfile: true,
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

  // Price Alerts persistence
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('tv_alerts');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'alt-1',
              symbol: 'NVDA',
              targetPrice: 152.0,
              condition: 'crossing_up',
              createdPrice: 148.25,
              createdAt: Date.now(),
              triggered: false,
              note: 'Breakout above $152 resistance',
            },
            {
              id: 'alt-2',
              symbol: 'SPX',
              targetPrice: 6000.0,
              condition: 'crossing_up',
              createdPrice: 5983.25,
              createdAt: Date.now(),
              triggered: false,
              note: 'Psychological 6,000 milestone',
            },
          ];
    } catch {
      return [];
    }
  });

  // Toast / alert banner message
  const [alertNotification, setAlertNotification] = useState<string | null>(null);

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
    return generateCandleSeries(selectedSymbol.price, 65, activeTimeframe);
  });

  // Regenerate candles when symbol or timeframe changes
  useEffect(() => {
    if (selectedSymbol) {
      setCandles(generateCandleSeries(selectedSymbol.price, 65, activeTimeframe));
    }
  }, [selectedSymbolId, activeTimeframe]);

  // Save watchlist & alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
      localStorage.setItem('tv_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [watchlist, alerts]);

  // Save paper trading to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_paper_balance', JSON.stringify(cashBalance));
      localStorage.setItem('tv_paper_positions', JSON.stringify(positions));
    } catch (e) {
      console.error(e);
    }
  }, [cashBalance, positions]);

  // Simulate real-time ticking market feed & check alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbols((prevSymbols) => {
        return prevSymbols.map((item) => {
          if (Math.random() > 0.45) return item;

          const isCrypto = item.type === 'crypto';
          const volatilityPct = isCrypto ? 0.0012 : 0.0006;
          const deltaPct = (Math.random() - 0.485) * volatilityPct;
          const newPrice = Number(Math.max(item.price * (1 + deltaPct), 0.0001).toFixed(item.price < 10 ? 4 : 2));
          const priceDiff = newPrice - item.open;
          const newChange = Number(priceDiff.toFixed(item.price < 10 ? 4 : 2));
          const newChangePct = Number(((priceDiff / item.open) * 100).toFixed(2));
          const newHigh = Math.max(item.high, newPrice);
          const newLow = Math.min(item.low, newPrice);

          const newSparkline = [...item.sparkline.slice(1), newPrice];

          // Check alerts for this symbol
          alerts.forEach((alt) => {
            if (alt.symbol === item.symbol && !alt.triggered) {
              const triggered =
                (alt.condition === 'crossing_up' && newPrice >= alt.targetPrice && item.price < alt.targetPrice) ||
                (alt.condition === 'crossing_down' && newPrice <= alt.targetPrice && item.price > alt.targetPrice) ||
                (alt.condition === 'greater_than' && newPrice >= alt.targetPrice) ||
                (alt.condition === 'less_than' && newPrice <= alt.targetPrice);

              if (triggered) {
                setAlerts((prev) => prev.map((a) => (a.id === alt.id ? { ...a, triggered: true } : a)));
                setAlertNotification(`🚨 PRO ALERT TRIGGERED: ${item.symbol} crossed target price $${alt.targetPrice}!`);
                setTimeout(() => setAlertNotification(null), 5000);
              }
            }
          });

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
    }, 1300);

    return () => clearInterval(interval);
  }, [alerts]);

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
        volume: last.volume + Math.floor(Math.random() * 25 + 5),
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

  const createAlert = useCallback(
    (symbol: string, targetPrice: number, condition: PriceAlert['condition'], note?: string) => {
      const live = symbols.find((s) => s.symbol === symbol);
      const newAlert: PriceAlert = {
        id: 'alt-' + Date.now(),
        symbol,
        targetPrice,
        condition,
        createdPrice: live ? live.price : targetPrice,
        createdAt: Date.now(),
        triggered: false,
        note,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    },
    [symbols]
  );

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
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
    secondarySymbolId,
    setSecondarySymbolId,
    tertiarySymbolId,
    setTertiarySymbolId,
    quaternarySymbolId,
    setQuaternarySymbolId,
    activeTimeframe,
    setActiveTimeframe,
    chartType,
    setChartType,
    chartLayout,
    setChartLayout,
    showIndicators,
    setShowIndicators,
    candles,
    watchlist,
    toggleWatchlist,
    alerts,
    createAlert,
    deleteAlert,
    alertNotification,
    cashBalance,
    positions,
    executeTrade,
    closePosition,
  };
}
