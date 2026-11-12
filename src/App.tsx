import React, { useState, useEffect, useMemo } from 'react';
import { useLiveMarket } from './hooks/useLiveMarket';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { MarketHero } from './components/MarketHero';
import { InteractiveChart } from './components/InteractiveChart';
import { TechnicalGauge } from './components/TechnicalGauge';
import { SymbolProfileCard } from './components/SymbolProfileCard';
import { MarketHeatmap } from './components/MarketHeatmap';
import { MarketMoversTable } from './components/MarketMoversTable';
import { GlobalIndices } from './components/GlobalIndices';
import { EconomicCalendar } from './components/EconomicCalendar';
import { MarketNews } from './components/MarketNews';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { PaperTradeModal } from './components/PaperTradeModal';
import { Footer } from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isTradeOpen, setIsTradeOpen] = useState<boolean>(false);

  const {
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
  } = useLiveMarket();

  // Dark mode HTML sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#131722] text-[#d1d4dc] antialiased selection:bg-[#2962ff] selection:text-white';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-[#f0f3fa] text-[#131722] antialiased selection:bg-[#2962ff] selection:text-white';
    }
  }, [darkMode]);

  // Asset counts for category badges
  const assetCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      index: 0,
      stock: 0,
      crypto: 0,
      forex: 0,
      commodity: 0,
      bond: 0,
    };
    symbols.forEach((s) => {
      if (counts[s.type] !== undefined) counts[s.type]++;
    });
    return counts;
  }, [symbols]);

  // Scroll to chart when a symbol is selected
  const handleSelectSymbol = (symbolId: string) => {
    setSelectedSymbolId(symbolId);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans']">
      {/* 1. Global Navigation Bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        watchlistCount={watchlist.length}
        cashBalance={cashBalance}
        openPositionsCount={positions.length}
        onOpenPaperTrade={() => setIsTradeOpen(true)}
        activeNavTab={activeCategory}
        setActiveNavTab={setActiveCategory}
      />

      {/* 2. Top Live Ticker Tape Marquee */}
      <TickerTape
        symbols={symbols}
        onSelectSymbol={handleSelectSymbol}
        selectedSymbolId={selectedSymbolId}
      />

      {/* 3. Hero Header & Asset Category Navigation Tabs */}
      <MarketHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        assetCountByCategory={assetCountByCategory}
      />

      {/* 4. Main Markets Viewport */}
      <main className="flex-1 max-w-[1720px] mx-auto px-4 lg:px-6 py-6 space-y-6 w-full">
        {/* World Indices Benchmark Strip */}
        <section id="indices">
          <GlobalIndices
            symbols={symbols}
            onSelectSymbol={handleSelectSymbol}
            selectedSymbolId={selectedSymbolId}
          />
        </section>

        {/* Primary Interactive Chart & Deep-Dive Analysis Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chart Column (8 cols on desktop) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <InteractiveChart
              symbol={selectedSymbol}
              candles={candles}
              timeframe={activeTimeframe}
              setTimeframe={setActiveTimeframe}
              chartType={chartType}
              setChartType={setChartType}
              showIndicators={showIndicators}
              setShowIndicators={setShowIndicators}
              isWatchlisted={watchlist.includes(selectedSymbol.symbol)}
              onToggleWatchlist={() => toggleWatchlist(selectedSymbol.symbol)}
              onOpenTrade={() => setIsTradeOpen(true)}
            />

            {/* S&P 500 Market Heatmap (Treemap) */}
            <section id="heatmap">
              <MarketHeatmap onSelectSymbol={handleSelectSymbol} />
            </section>
          </div>

          {/* Right Sidebar Column: Gauge, Valuation Stats & Calendar (4 cols on desktop) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Technical Momentum Gauge */}
            <TechnicalGauge
              rating={selectedSymbol.rating}
              symbol={selectedSymbol.symbol}
            />

            {/* Fundamental Valuation & Metrics */}
            <SymbolProfileCard symbol={selectedSymbol} />

            {/* Macroeconomic Calendar Widget */}
            <div id="calendar">
              <EconomicCalendar />
            </div>
          </div>
        </div>

        {/* Market Movers & Screener Table (Gainers, Losers, Most Active) */}
        <section id="movers">
          <MarketMoversTable
            symbols={symbols}
            selectedSymbolId={selectedSymbolId}
            onSelectSymbol={handleSelectSymbol}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            activeCategory={activeCategory}
          />
        </section>

        {/* Financial News & Editorial Stream */}
        <section id="news">
          <MarketNews onSelectSymbol={handleSelectSymbol} />
        </section>
      </main>

      {/* 5. Symbol Search Modal (⌘K / /) */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={handleSelectSymbol}
      />

      {/* 6. Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        symbols={symbols}
        onSelectSymbol={handleSelectSymbol}
        onRemoveFromWatchlist={toggleWatchlist}
        selectedSymbolId={selectedSymbolId}
        onOpenSearch={() => {
          setIsWatchlistOpen(false);
          setIsSearchOpen(true);
        }}
      />

      {/* 7. Paper Trading Execution Modal */}
      <PaperTradeModal
        isOpen={isTradeOpen}
        onClose={() => setIsTradeOpen(false)}
        symbol={selectedSymbol}
        cashBalance={cashBalance}
        positions={positions}
        onExecuteTrade={executeTrade}
        onClosePosition={closePosition}
      />

      {/* 8. TradingView Footer */}
      <Footer />
    </div>
  );
}
