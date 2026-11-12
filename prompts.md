# User Prompts Collection

This file collates all user prompts submitted during the development of the application in chronological order.

---

### Prompt 1
```text
Build me an app with screens that look like this. You can hotlink images from the URL: https://www.tradingview.com/markets/
```

**Context & Outcome**:
- Initial request to build a financial markets terminal replicating the TradingView experience.
- Implemented real-time interactive charting, market tickers, multi-asset watchlists (Equities, Crypto, Forex, Indices, Commodities), news feed, and layout inspired by TradingView Markets.

---

### Prompt 2
```text
git push https://[REDACTED_PAT]@https://github.com/limvy20/rag-rag.git
```

**Context & Outcome**:
- Configured git remote repository and pushed initial project commits to `main` at `https://github.com/limvy20/rag-rag.git`.

---

### Prompt 3
```text
would you make this like a PRO?
```

**Context & Outcome**:
- Upgraded the application to institutional/professional tier ("TradingView PRO"):
  - Multi-chart layout split screen (Single, 2-split, 4-split view).
  - Advanced technical indicators: VRVP (Volume Profile / Point of Control ray), VWAP, EMA/SMA 20/50, Bollinger Bands, and RSI (14) sub-chart.
  - Interactive drawing tools: Trendline, Horizontal Ray, Fibonacci Retracement, Long/Short Position R:R Box, and Clear Canvas.
  - Candlestick styles: Standard Japanese Candlesticks, Heikin-Ashi, Line, and Area.
  - Level 2 Real-Time Order Book with depth visualizer and spread calculations.
  - S&P 500 Market Heatmap with sector tree-maps and color-coded performance.
  - Economic / Macroeconomic Calendar with volatility impact ratings (High, Med, Low).
  - Pine Script v5 Strategy Backtester editor with predefined strategies (EMA Cross, RSI Divergence, Supertrend) and execution metrics (Win Rate, Profit Factor, Max Drawdown).
  - Real-time Price Alert System with auditory and toast triggers.

---

### Prompt 4
```text
Fix the errors in the app
```
*Metadata:*
```text
[AIS_METADATA_SECTION_START]
fix_it_trigger: manual
error 0: Received NaN for the `%s` attribute. If this is expected, cast the value to a string. width
error 1: Received NaN for the `%s` attribute. If this is expected, cast the value to a string. x
[AIS_METADATA_SECTION_END]
```

**Context & Outcome**:
- Fixed React DOM console warnings caused by `NaN` values on SVG `<rect>` elements (`width` and `x`).
- Guarded zero-volume bins in `generateVolumeProfile()` where `(vp.buyVolume / vp.totalVolume)` produced `0 / 0 = NaN`.
- Hardened Volume Profile, Volume Bars, Candlesticks, Position Tools, and RSI elements with `Number.isFinite()` and `Math.max(0, ...)` bounds checking.
- Successfully verified build and pushed fix to GitHub.

---

### Prompt 5
```text
Collate all the prompts that I have given and store into a file named prompts.md
```

**Context & Outcome**:
- Compiled all historical user instructions, contexts, and outcomes into `prompts.md`.
