# 🍪 CookieTerminal

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![Network: Cookie Chain SVM](https://img.shields.io/badge/Network-Cookie%20Chain%20SVM-purple.svg)](https://cookiescan.io)
[![RPC: rpc.cookiescan.io](https://img.shields.io/badge/RPC-rpc.cookiescan.io-emerald.svg)](https://rpc.cookiescan.io)
[![Bounty: Superteam Earn](https://img.shields.io/badge/Superteam%20Earn-%241%2C000%20USDC-blue.svg)](https://superteam.fun/earn/listing/create-an-app-on-cookie-chain-app)

> **The Premier Autonomous DeFi, DEX Aggregator & On-Chain Intelligence Suite for Cookie Chain (SVM).**

Live Application: **[https://1234adi1234.github.io/cookie-terminal/](https://1234adi1234.github.io/cookie-terminal/)**

---

## 🌟 Overview

**CookieTerminal** is a high-performance, open-source web application engineered specifically for the **Cookie Chain** SVM ecosystem. Built to demonstrate meaningful on-chain interactions with sub-second finality, CookieTerminal brings together multi-wallet connectivity, smart swap routing, token directory indexing, instant native payments, cross-chain bridging, and autonomous AI agent tooling.

---

## ⚡ Core Features

### 1. 🦊 Multi-Wallet Support (Nightly Required & Verified)
- **Nightly Wallet Integration**: Native auto-detection and seamless connection to Nightly, the premier SVM wallet for Cookie Chain.
- **Phantom & Solflare Compatibility**: Standard Solana/SVM provider fallback.
- **Sandbox Demo Mode**: Instant one-click simulated test session with pre-funded demo account for judges and auditors.

### 2. 🔄 Cookiebox & Candy Shop DEX Aggregator
- **Real-Time Routing**: Queries live liquidity routes from the Cookiebox Aggregator API (`agg.cookiebox.app`) and Candy Shop (`swap.cookiescan.io`).
- **Optimal Price Execution**: Dynamic calculation of net output, 0.1% aggregator fee breakdown, price impact, and slippage protection (0.1% to 2.5%).
- **Venue Detection**: Routes through Cookiebox DAMM v2, Cookieswap CPAMM, and BAMM liquidity pools.

### 3. 💸 Instant Native COOK Payment Desk
- **Zero-Fee Speed**: Send native COOK with sub-second execution (<400ms) on Cookie Chain SVM.
- **CookOven Domain Support**: Input standard base58 public keys or decentralized `.cook` domains.
- **Direct Explorer Verification**: Instant broadcast to `rpc.cookiescan.io` with deep-links to `cookiescan.io/tx/{sig}`.

### 4. 📊 Cookie DAS Token & Pool Intelligence
- **6,500+ Tokens Indexed**: Live feed from the Cookiescan Digital Asset Standard (DAS) API (`api.cookiescan.io/api/tokens`).
- **Real-Time Search**: Instant filtering by symbol, name, or base58 mint address.
- **160+ Liquidity Pools**: Direct inspection of DEX pools, reserve balances, and TVL.

### 5. 🌉 Hyperlane Cross-Chain Bridge Navigator
- **1:1 Bridge Calculator**: Converts between Solana Mainnet (Token-2022 SPL COOK, 6 decimals) and Cookie Chain (Native COOK, 9 decimals).
- **Verified Contract Registry**: Pre-configured with mainnet Hyperlane warp route program IDs and collateral mailboxes.
- **Interactive Guide**: Step-by-step instructions to bridge funds in under 2 minutes.

### 6. 🤖 Autonomous Agent MCP Console
- **`cookie-mcp` Integration**: Live browser terminal demonstrating Model Context Protocol tools (`get_chain_health`, `get_epoch_info`, `quote_swap`, `fetch_tokens`).
- **Real-Time JSON Inspector**: Audits live payloads returned directly from Cookie Chain RPC and DAS endpoints.

---

## ⛓️ Network Constants & Verified Contracts

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Chain Name** | Cookie Chain | Solana-compatible SVM |
| **Solana Core** | `v4.1.2` | Sub-second finality |
| **Native Currency** | COOK | 9 decimals on Cookie Chain |
| **RPC Endpoint** | `https://rpc.cookiescan.io` | Mainnet RPC node |
| **DAS API** | `https://api.cookiescan.io` | Metaplex DAS JSON-RPC |
| **DEX Aggregator** | `https://agg.cookiebox.app` | Cookiebox Swap API |
| **Explorer** | `https://cookiescan.io` | Official block explorer |
| **Cookie Warp Program** | `Aa9wq46NB7qkg1amnBuMRsV1DunmkPHuoRLWZgWiBKdn` | Hyperlane Warp (Cookie) |
| **Solana Warp Program** | `B1C91jLcqXYYz57bBWR8dSEjBrJDhWSeNokZ5SDEopu3` | Hyperlane Warp (Solana) |
| **Solana SPL Mint** | `36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1` | Token-2022 (6 decimals) |
| **CookOven Domains** | `H43Qtq4AMQ86y7yc3YtCKZJ2QMhhnCcHyZKeFeoQn7PA` | `.cook` Name Service |

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 (Ultra-fast build in <3s)
- **Styling**: TailwindCSS v4 with cyber-glassmorphism theme
- **Web3 Engine**: `@solana/web3.js` connected to Cookie Chain SVM
- **Icons**: `lucide-react`
- **Deployment**: GitHub Pages (Static ESM distribution)

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js ≥ 20.x
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/1234adi1234/cookie-terminal.git
cd cookie-terminal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🤝 Community & Links

- **Cookie Chain Website**: [https://www.cookiechain.wtf/](https://www.cookiechain.wtf/)
- **Documentation**: [https://docs.cookiechain.wtf/](https://docs.cookiechain.wtf/)
- **Cookiebox Aggregator**: [https://cookiebox.app/](https://cookiebox.app/)
- **Telegram**: [https://t.me/TheCookieNetChain](https://t.me/TheCookieNetChain)
- **X (Twitter)**: [@TheCookieChain](https://x.com/TheCookieChain)

---

## 📄 License

MIT © [Aditya Xess](https://github.com/1234adi1234)
