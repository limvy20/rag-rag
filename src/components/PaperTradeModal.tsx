import React, { useState } from 'react';
import { MarketSymbol, TradePosition } from '../types/market';
import { X, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface PaperTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: MarketSymbol;
  cashBalance: number;
  positions: TradePosition[];
  onExecuteTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number) => { success: boolean; message: string };
  onClosePosition: (positionId: string) => void;
}

export const PaperTradeModal: React.FC<PaperTradeModalProps> = ({
  isOpen,
  onClose,
  symbol,
  cashBalance,
  positions,
  onExecuteTrade,
  onClosePosition,
}) => {
  const [activeTab, setActiveTab] = useState<'order' | 'positions'>('order');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [shares, setShares] = useState<number>(10);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const totalCost = symbol.price * shares;

  const handleTrade = () => {
    const result = onExecuteTrade(symbol.symbol, orderSide, shares);
    setMessage({ text: result.message, success: result.success });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center font-bold font-mono">
              {symbol.symbol.slice(0, 3)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#131722] dark:text-white font-mono flex items-center gap-2">
                TradingView Paper Execution
                <span className="text-[10px] text-[#787b86] font-normal uppercase px-1.5 py-0.5 rounded bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]">
                  Demo
                </span>
              </h2>
              <p className="text-xs text-[#787b86]">
                Balance: <span className="font-mono text-[#131722] dark:text-white">${cashBalance.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs: Place Order vs Open Positions */}
        <div className="flex border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#131722] text-xs">
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'order'
                ? 'border-[#2962ff] text-[#131722] dark:text-white'
                : 'border-transparent text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Order Ticket ({symbol.symbol})
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'positions'
                ? 'border-[#2962ff] text-[#131722] dark:text-white'
                : 'border-transparent text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Active Positions ({positions.length})
          </button>
        </div>

        {/* Tab 1: Order Ticket */}
        {activeTab === 'order' && (
          <div className="p-5 space-y-4">
            {/* Buy / Sell Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#f0f3fa] dark:bg-[#131722] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39]">
              <button
                onClick={() => setOrderSide('BUY')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  orderSide === 'BUY'
                    ? 'bg-[#089981] text-white shadow'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                BUY / LONG
              </button>
              <button
                onClick={() => setOrderSide('SELL')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  orderSide === 'SELL'
                    ? 'bg-[#f23645] text-white shadow'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                SELL / SHORT
              </button>
            </div>

            {/* Current Price Box */}
            <div className="p-3 bg-[#f8f9fd] dark:bg-[#131722] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#787b86] block">Market Price ({symbol.symbol})</span>
                <span className="text-xl font-bold font-mono text-[#131722] dark:text-white">${symbol.price.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#787b86] block">Execution</span>
                <span className="text-xs font-semibold text-[#089981]">Instant Fill (Market)</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#787b86] mb-1.5">
                <span>Units / Shares</span>
                <span className="font-mono">Est. Value: ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg px-3 py-2 text-[#131722] dark:text-white font-mono text-sm focus:outline-none focus:border-[#2962ff]"
                />
                {[10, 50, 100, 500].map((quickQty) => (
                  <button
                    key={quickQty}
                    onClick={() => setShares(quickQty)}
                    className="px-2.5 py-2 text-xs font-mono font-semibold bg-[#f0f3fa] dark:bg-[#131722] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg text-[#131722] dark:text-[#d1d4dc] transition-colors"
                  >
                    {quickQty}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  message.success ? 'bg-[#089981]/15 text-[#089981] border border-[#089981]/30' : 'bg-[#f23645]/15 text-[#f23645] border border-[#f23645]/30'
                }`}
              >
                {message.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Submit Order Button */}
            <button
              onClick={handleTrade}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                orderSide === 'BUY' ? 'bg-[#089981] hover:bg-[#078570]' : 'bg-[#f23645] hover:bg-[#d62837]'
              }`}
            >
              <span>Place {orderSide} Order</span>
              <span className="font-mono text-xs opacity-90">({shares} @ ${symbol.price.toFixed(2)})</span>
            </button>
          </div>
        )}

        {/* Tab 2: Active Positions */}
        {activeTab === 'positions' && (
          <div className="p-4 max-h-80 overflow-y-auto space-y-2">
            {positions.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#787b86]">
                No active open positions. Place an order to start paper trading.
              </div>
            ) : (
              positions.map((pos) => {
                const isProfitable = pos.pnl >= 0;
                return (
                  <div
                    key={pos.id}
                    className="p-3 bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#131722] dark:text-white text-sm">{pos.symbol}</span>
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            pos.type === 'BUY' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'
                          }`}
                        >
                          {pos.type}
                        </span>
                        <span className="text-[#787b86] font-mono">{pos.shares} shares</span>
                      </div>
                      <div className="text-[11px] text-[#787b86] font-mono mt-0.5">
                        Entry: ${pos.entryPrice.toFixed(2)} · Current: ${pos.currentPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <div className={`font-bold text-sm ${isProfitable ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isProfitable ? '+' : ''}${pos.pnl.toFixed(2)}
                        </div>
                        <div className={`text-[10px] font-semibold ${isProfitable ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isProfitable ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={() => onClosePosition(pos.id)}
                        className="p-1.5 rounded-lg bg-[#e0e3eb] dark:bg-[#2a2e39] hover:bg-[#f23645] hover:text-white text-[#787b86] transition-colors"
                        title="Close Position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
