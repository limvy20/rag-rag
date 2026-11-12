import React, { useState, useEffect } from 'react';
import { OrderBookData } from '../types/market';
import { generateOrderBook } from '../data/mockMarketData';
import { Layers, ArrowDownUp, Zap } from 'lucide-react';

interface OrderBookDOMProps {
  currentPrice: number;
  symbol: string;
  onQuickTrade: (price: number, side: 'BUY' | 'SELL') => void;
}

export const OrderBookDOM: React.FC<OrderBookDOMProps> = ({ currentPrice, symbol, onQuickTrade }) => {
  const [orderBook, setOrderBook] = useState<OrderBookData>(() => generateOrderBook(currentPrice));

  // Live order book ticks
  useEffect(() => {
    setOrderBook(generateOrderBook(currentPrice));
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook(currentPrice));
    }, 1200);
    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 shadow-sm flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-xs font-bold text-[#131722] dark:text-white tracking-tight uppercase">
            Order Book / L2 DOM
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#787b86] font-mono">
          <Zap className="w-3 h-3 text-[#f59e0b]" />
          <span>Live BBO</span>
        </div>
      </div>

      {/* Header labels */}
      <div className="grid grid-cols-3 text-[10px] uppercase font-semibold text-[#787b86] pb-1.5 border-b border-[#e0e3eb] dark:border-[#2a2e39] px-1 font-mono">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells) - Reversed so lowest ask sits right above spread */}
      <div className="space-y-0.5 my-1">
        {orderBook.asks.slice(0, 5).reverse().map((ask, idx) => (
          <div
            key={'ask-' + idx}
            onClick={() => onQuickTrade(ask.price, 'BUY')}
            className="relative grid grid-cols-3 text-xs font-mono py-0.5 px-1 rounded cursor-pointer hover:bg-[#f23645]/15 transition-colors group"
          >
            {/* Depth bar fill from right */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#f23645]/10 group-hover:bg-[#f23645]/20 rounded pointer-events-none transition-all"
              style={{ width: `${ask.depthPercent}%` }}
            />
            <span className="text-[#f23645] font-semibold z-10">{ask.price.toFixed(currentPrice < 5 ? 4 : 2)}</span>
            <span className="text-right text-[#787b86] z-10">{ask.size}</span>
            <span className="text-right text-[#131722] dark:text-[#d1d4dc] z-10">{ask.total}</span>
          </div>
        ))}
      </div>

      {/* Spread Bar */}
      <div className="my-1 py-1 px-2 rounded bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1 text-[#787b86] text-[10px]">
          <ArrowDownUp className="w-3 h-3 text-[#2962ff]" />
          <span>Spread:</span>
          <span className="text-[#131722] dark:text-white font-bold">{orderBook.spread.toFixed(2)}</span>
        </div>
        <div className="text-[11px] font-bold text-[#2962ff]">
          ${currentPrice.toFixed(currentPrice < 5 ? 4 : 2)}
        </div>
      </div>

      {/* Bids (Buys) */}
      <div className="space-y-0.5 my-1">
        {orderBook.bids.slice(0, 5).map((bid, idx) => (
          <div
            key={'bid-' + idx}
            onClick={() => onQuickTrade(bid.price, 'SELL')}
            className="relative grid grid-cols-3 text-xs font-mono py-0.5 px-1 rounded cursor-pointer hover:bg-[#089981]/15 transition-colors group"
          >
            {/* Depth bar fill from right */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#089981]/10 group-hover:bg-[#089981]/20 rounded pointer-events-none transition-all"
              style={{ width: `${bid.depthPercent}%` }}
            />
            <span className="text-[#089981] font-semibold z-10">{bid.price.toFixed(currentPrice < 5 ? 4 : 2)}</span>
            <span className="text-right text-[#787b86] z-10">{bid.size}</span>
            <span className="text-right text-[#131722] dark:text-[#d1d4dc] z-10">{bid.total}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-[#e0e3eb] dark:border-[#2a2e39] text-[10px] text-[#787b86] flex justify-between items-center">
        <span>Click level to auto-fill ticket</span>
        <span className="font-mono text-[#089981] font-medium">Bids 54% / Asks 46%</span>
      </div>
    </div>
  );
};
