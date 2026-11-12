import React, { useState } from 'react';
import { PriceAlert, MarketSymbol } from '../types/market';
import { Bell, X, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: MarketSymbol;
  alerts: PriceAlert[];
  onCreateAlert: (symbol: string, targetPrice: number, condition: PriceAlert['condition'], note?: string) => void;
  onDeleteAlert: (id: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  symbol,
  alerts,
  onCreateAlert,
  onDeleteAlert,
}) => {
  const [targetPrice, setTargetPrice] = useState<number>(() => Number((symbol.price * 1.02).toFixed(2)));
  const [condition, setCondition] = useState<PriceAlert['condition']>('crossing_up');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;
    onCreateAlert(symbol.symbol, targetPrice, condition, note);
    setNote('');
  };

  const symbolAlerts = alerts.filter((a) => a.symbol === symbol.symbol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2962ff]" />
            <div>
              <h2 className="text-sm font-bold text-[#131722] dark:text-white">
                Price Alerts ({symbol.symbol})
              </h2>
              <span className="text-[11px] text-[#787b86] font-mono">
                Current Price: ${symbol.price.toFixed(symbol.price < 5 ? 4 : 2)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Alert Form */}
        <form onSubmit={handleCreate} className="p-4 bg-[#f8f9fd] dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] space-y-3">
          <div className="text-xs font-bold text-[#131722] dark:text-white flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#2962ff]" />
            <span>Create New Price Alert</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[#787b86] text-[10px] uppercase font-semibold mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as PriceAlert['condition'])}
                className="w-full bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg px-2.5 py-1.5 text-[#131722] dark:text-white text-xs focus:outline-none"
              >
                <option value="crossing_up">Crossing Up (Bullish Breakout)</option>
                <option value="crossing_down">Crossing Down (Bearish Breakdown)</option>
                <option value="greater_than">Greater Than or Equal</option>
                <option value="less_than">Less Than or Equal</option>
              </select>
            </div>

            <div>
              <label className="block text-[#787b86] text-[10px] uppercase font-semibold mb-1">
                Trigger Price ($)
              </label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg px-2.5 py-1.5 text-[#131722] dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#787b86] text-[10px] uppercase font-semibold mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Key resistance level, take profit target"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg px-2.5 py-1.5 text-[#131722] dark:text-white text-xs placeholder-[#787b86] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Set Alert on {symbol.symbol} @ ${targetPrice}</span>
          </button>
        </form>

        {/* Existing Alerts List */}
        <div className="p-4 max-h-60 overflow-y-auto space-y-2">
          <div className="text-[11px] font-bold uppercase text-[#787b86]">
            Active Alerts ({symbolAlerts.length})
          </div>

          {symbolAlerts.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#787b86]">
              No alerts set for {symbol.symbol}. Set one above to be notified of price moves.
            </div>
          ) : (
            symbolAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3 bg-[#f8f9fd] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#131722] dark:text-white">
                      ${alt.targetPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[#2962ff] px-1.5 py-0.2 rounded bg-[#2962ff]/10">
                      {alt.condition.replace('_', ' ')}
                    </span>
                    {alt.triggered ? (
                      <span className="flex items-center gap-1 text-[10px] text-[#089981] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Triggered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-[#f59e0b] font-bold">
                        <AlertTriangle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  {alt.note && <p className="text-[11px] text-[#787b86] mt-0.5">{alt.note}</p>}
                </div>

                <button
                  onClick={() => onDeleteAlert(alt.id)}
                  className="p-1.5 rounded-lg hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-[#f23645] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
