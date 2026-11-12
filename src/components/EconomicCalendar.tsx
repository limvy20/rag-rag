import React, { useState } from 'react';
import { EconomicEvent } from '../types/market';
import { MOCK_ECONOMIC_EVENTS } from '../data/mockMarketData';
import { Calendar, Filter } from 'lucide-react';

export const EconomicCalendar: React.FC = () => {
  const [highImpactOnly, setHighImpactOnly] = useState(false);

  const events = highImpactOnly
    ? MOCK_ECONOMIC_EVENTS.filter((e) => e.impact === 'high')
    : MOCK_ECONOMIC_EVENTS;

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 lg:p-5 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-[#131722] dark:text-white tracking-tight">Economic Calendar</h2>
        </div>

        {/* High impact filter toggle */}
        <button
          onClick={() => setHighImpactOnly(!highImpactOnly)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            highImpactOnly
              ? 'bg-[#2962ff] text-white border-[#2962ff]'
              : 'bg-[#f0f3fa] dark:bg-[#131722] text-[#787b86] border-[#e0e3eb] dark:border-[#2a2e39] hover:text-[#131722] dark:hover:text-white'
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>High Impact Only</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#f8f9fd] dark:bg-[#131722] text-[#787b86] border-b border-[#e0e3eb] dark:border-[#2a2e39] font-medium text-[11px] uppercase">
            <tr>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Country</th>
              <th className="py-2.5 px-3">Impact</th>
              <th className="py-2.5 px-3">Event</th>
              <th className="py-2.5 px-3 text-right">Actual</th>
              <th className="py-2.5 px-3 text-right">Forecast</th>
              <th className="py-2.5 px-3 text-right">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39]/40">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]/50 transition-colors">
                <td className="py-2.5 px-3 font-mono text-[#787b86] text-xs">{e.time}</td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{e.flag}</span>
                    <span className="text-[#131722] dark:text-white font-medium">{e.country}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      e.impact === 'high'
                        ? 'bg-[#f23645]/20 text-[#f23645]'
                        : e.impact === 'medium'
                        ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        : 'bg-[#089981]/20 text-[#089981]'
                    }`}
                  >
                    {e.impact}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[#131722] dark:text-white font-medium max-w-xs truncate">{e.event}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#131722] dark:text-white">{e.actual}</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#787b86]">{e.forecast}</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#787b86]">{e.previous}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
